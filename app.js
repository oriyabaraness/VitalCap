const riskModels = {
  4: {
    mad: "4 שעות",
    reputational: 18,
    legal: 70,
    regulatory: 22,
    internal: 88
  },
  24: {
    mad: "24 שעות",
    reputational: 28,
    legal: 76,
    regulatory: 36,
    internal: 92
  },
  48: {
    mad: "48 שעות",
    reputational: 34,
    legal: 82,
    regulatory: 42,
    internal: 100
  }
};

const segments = document.querySelectorAll("[data-time]");
const bars = document.querySelectorAll("[data-risk]");
const madOutput = document.querySelector("#mad-output");
const apiStatus = document.querySelector("#api-status");
const simulatorControls = {
  process: document.querySelector("#sim-process"),
  region: document.querySelector("#sim-region"),
  threat: document.querySelector("#sim-threat"),
  workforce: document.querySelector("#sim-workforce"),
  supplier: document.querySelector("#sim-supplier")
};
const threatAnimation = {
  cards: document.querySelectorAll("[data-threat-step]"),
  markers: document.querySelectorAll("[data-threat-marker]"),
  routes: document.querySelectorAll("[data-threat-route]"),
  title: document.querySelector("#threat-live-title"),
  detail: document.querySelector("#threat-live-detail")
};
const simulatorInputs = Object.values(simulatorControls);
const simulatorOutput = {
  workforce: document.querySelector("#sim-workforce-output"),
  supplier: document.querySelector("#sim-supplier-output"),
  applicationTitle: document.querySelector("#sim-applications-title"),
  applicationOptions: document.querySelector("#sim-application-options"),
  score: document.querySelector("#sim-score"),
  band: document.querySelector("#sim-band"),
  meter: document.querySelector("#sim-meter"),
  rto: document.querySelector("#sim-rto"),
  rpo: document.querySelector("#sim-rpo"),
  mad: document.querySelector("#sim-mad"),
  dependency: document.querySelector("#sim-dependency"),
  context: document.querySelector("#sim-context-text"),
  action: document.querySelector("#sim-action"),
  dominoStage: document.querySelector("#sim-domino-stage"),
  dominoReplay: document.querySelector("#sim-domino-replay"),
  dominoFirst: document.querySelector("#sim-domino-first"),
  dominoDepth: document.querySelector("#sim-domino-depth"),
  dominoWindow: document.querySelector("#sim-domino-window")
};
let latestDominoState;
let threatStepIndex = 0;
const threatSteps = [
  {
    title: "סורק את אזור שיבויה",
    detail: "מודל השפה מסמן שיח סייסמי, התראות תחבורה ועדכוני תשתית מקומיים."
  },
  {
    title: "נמצאה חשיפת ספק",
    detail: "מטה CyberAgent ואתרי ספקים מרכזיים מותאמים לאזור המושפע."
  },
  {
    title: "שרשרת התלויות חוברה",
    detail: "העברות תשלומי מכירות מקושרות לחשבונות לקוחות, דיווח, נזילות ובדיקה משפטית."
  },
  {
    title: "אזהרת רציפות הופעלה",
    detail: "ספי RTO, RPO ו-MAD מועלים לטיפול לפני שהשיבוש מגיע לשלוחה."
  }
];

const simulatorModels = {
  processes: {
    sales: {
      name: "סגירת מכירות",
      dependency: "תשלומים, נזילות, חשבונות לקוחות, Salesforce, דיווח ובדיקה משפטית.",
      baseRisk: 34,
      rto: 4,
      rpo: 2,
      mad: 4,
      dominoPath: ["נזילות", "חשבונות לקוחות", "מכירות", "דיווח", "משפטי"],
      apps: [
        {
          key: "salesforce",
          name: "Salesforce Einstein",
          category: "אוטומציית CRM",
          rto: 4,
          rpo: 2,
          mad: 4,
          risk: 14,
          dependency: "דירוג לידים חזוי, תחזיות ואוטומציית תובנות לקוח."
        },
        {
          key: "cyberagent",
          name: "CyberAgent Sales Cloud",
          category: "דיווח מכירות",
          rto: 4,
          rpo: 2,
          mad: 4,
          risk: 18,
          dependency: "דיווח העברות תשלום, סגירת מכירות ונראות חשבונות לקוחות."
        },
        {
          key: "hubspot-sales",
          name: "HubSpot Sales Hub",
          category: "רציפות צבר מכירות",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 10,
          dependency: "צבר עסקאות, פנייה אוטומטית והיסטוריית תקשורת עם לקוחות."
        }
      ]
    },
    payments: {
      name: "תשלומים לספקים",
      dependency: "אישורי גזברות, פורטלי בנק, נתוני ERP ותפעול ספקים.",
      baseRisk: 31,
      rto: 6,
      rpo: 4,
      mad: 8,
      dominoPath: ["מאגר ספקים", "גזברות", "פורטל בנק", "תשלומים", "ספר ראשי", "דיווח"],
      apps: [
        {
          key: "blackline",
          name: "BlackLine Transaction Matching",
          category: "התאמות",
          rto: 2,
          rpo: 5,
          mad: 2,
          risk: 19,
          dependency: "התאמת עסקאות, התאמות חשבונאיות, פקודות יומן ובקרות פיננסיות."
        },
        {
          key: "kyriba",
          name: "Kyriba Treasury",
          category: "תפעול גזברות",
          rto: 6,
          rpo: 4,
          mad: 8,
          risk: 16,
          dependency: "קישוריות בנקאית, נראות נזילות, קבצי תשלום ונתיבי אישור גזברות."
        },
        {
          key: "sap-finance",
          name: "SAP S/4HANA Finance",
          category: "ERP פיננסי",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 13,
          dependency: "נתוני אב של ספקים, חשבונות לתשלום, הזמנות רכש ורישום לספר הראשי."
        }
      ]
    },
    reporting: {
      name: "דיווח ללקוחות",
      dependency: "מחסן נתונים, הזנות מכירות, בדיקות ציות ובדיקת תקשורת.",
      baseRisk: 26,
      rto: 12,
      rpo: 6,
      mad: 24,
      dominoPath: ["הזנות מכירות", "מחסן נתונים", "אנליטיקה", "דיווח ללקוחות", "ציות", "תקשורת"],
      apps: [
        {
          key: "tableau",
          name: "Tableau Cloud",
          category: "דשבורדי BI",
          rto: 12,
          rpo: 6,
          mad: 24,
          risk: 12,
          dependency: "דשבורדים ניהוליים, דיווח מכירות ותצוגות לקוח חוזרות."
        },
        {
          key: "powerbi",
          name: "Power BI Service",
          category: "אנליטיקה",
          rto: 10,
          rpo: 6,
          mad: 18,
          risk: 11,
          dependency: "רענון מערכי נתונים, פרסום דוחות וניטור KPI תפעולי."
        },
        {
          key: "snowflake",
          name: "Snowflake Data Cloud",
          category: "פלטפורמת נתונים",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 17,
          dependency: "הזנות מכירות, נתוני דיווח היסטוריים ומשימות אנליטיקה בהמשך השרשרת."
        }
      ]
    },
    payroll: {
      name: "עיבוד שכר",
      dependency: "רשומות HR, ספק שכר, אישור פיננסי ותקשורת עובדים.",
      baseRisk: 29,
      rto: 24,
      rpo: 8,
      mad: 24,
      dominoPath: ["רשומות HR", "ספק שכר", "אישור פיננסי", "שכר", "תקשורת עובדים", "משפטי"],
      apps: [
        {
          key: "workday",
          name: "Workday HCM",
          category: "תפעול HR",
          rto: 72,
          rpo: 4,
          mad: 4,
          risk: 15,
          dependency: "נתוני עובדים, תהליכי שכר, רשומות גיוס ואישורי HR."
        },
        {
          key: "adp",
          name: "ADP Workforce Now",
          category: "ספק שכר",
          rto: 24,
          rpo: 8,
          mad: 24,
          risk: 14,
          dependency: "הרצות שכר, קבצי מס, קבצי הפקדה ישירה ותלושי שכר לעובדים."
        },
        {
          key: "deel",
          name: "Deel Payroll",
          category: "שכר גלובלי",
          rto: 24,
          rpo: 6,
          mad: 24,
          risk: 12,
          dependency: "שכר קבלנים בינלאומי, מסמכי ציות ותקשורת עם עובדים."
        }
      ]
    }
  },
  regions: {
    telaviv: { name: "תל אביב", risk: 9, note: "רגישות ביטחונית ותחבורתית אזורית" },
    shibuya: { name: "שיבויה", risk: 16, note: "חשיפה סייסמית וחשיפת מרכזי נתונים" },
    toronto: { name: "טורונטו", risk: 7, note: "חשיפת מזג אוויר וריכוז ספקים" },
    london: { name: "לונדון", risk: 10, note: "רגישות רגולטורית ותשתיות שוק" }
  },
  threats: {
    appOutage: {
      name: "השבתת אפליקציה קריטית",
      risk: 22,
      action: "הפעילו תהליכי גיבוי, הקפיאו שינויים שאינם קריטיים ותעדפו שחזור אפליקציה."
    },
    earthquake: {
      name: "אירוע סייסמי אזורי",
      risk: 28,
      action: "אשרו את בטיחות העובדים, העבירו עיבוד לאזור חלופי ונטרו מתקני ספקים."
    },
    supplier: {
      name: "שיבוש אצל ספק",
      risk: 20,
      action: "עברו לספקים מאושרים מראש והפעילו נתיבי רכש ותקשורת לקוחות."
    },
    flood: {
      name: "סיכון הצפה במרכז נתונים",
      risk: 25,
      action: "אמתו רפליקציה, נתבו עומסים הרחק מתשתית חשופה והגדילו תדירות גיבוי."
    },
    workforce: {
      name: "שיבוש בכוח האדם",
      risk: 18,
      action: "העבירו משימות קריטיות למחליפים מיומנים ופשטו אישורים לחלון ההתאוששות הפעיל."
    }
  }
};

for (const segment of segments) {
  segment.addEventListener("click", () => {
    setRiskModel(segment.dataset.time);
  });
}

for (const input of simulatorInputs) {
  input?.addEventListener("input", updateSimulator);
  input?.addEventListener("change", updateSimulator);
}

simulatorControls.process?.addEventListener("change", () => {
  renderApplicationOptions();
  updateSimulator();
});
simulatorOutput.dominoReplay?.addEventListener("click", () => {
  if (latestDominoState) {
    renderDominoCascade(latestDominoState);
  }
});

setRiskModel("4");
renderApplicationOptions();
updateSimulator();
startThreatAnimation();
setApiStatus();

function setRiskModel(time) {
  const model = riskModels[time] || riskModels[4];

  for (const segment of segments) {
    segment.classList.toggle("is-active", segment.dataset.time === time);
  }

  for (const bar of bars) {
    const value = model[bar.dataset.risk] || 0;
    bar.style.width = `${value}%`;
  }

  if (madOutput) {
    madOutput.textContent = model.mad;
  }
}

async function setApiStatus() {
  if (!apiStatus) {
    return;
  }

  try {
    const response = await fetch("/api/status");

    if (!response.ok) {
      throw new Error(`Status request failed: ${response.status}`);
    }

    const body = await response.json();
    apiStatus.textContent = `${body.service.name} פעיל`;
  } catch {
    apiStatus.textContent = "API לא זמין";
  }
}

function updateSimulator() {
  const { process: processInput, region: regionInput, threat: threatInput, workforce: workforceInput, supplier: supplierInput } =
    simulatorControls;

  if (!processInput || !regionInput || !threatInput || !workforceInput || !supplierInput) {
    return;
  }

  const process = simulatorModels.processes[processInput.value] || simulatorModels.processes.sales;
  const application = getSelectedApplication(process);
  const region = simulatorModels.regions[regionInput.value] || simulatorModels.regions.telaviv;
  const threat = simulatorModels.threats[threatInput.value] || simulatorModels.threats.appOutage;
  const workforce = Number(workforceInput.value);
  const supplier = Number(supplierInput.value);
  const score = clamp(
    Math.round(
      process.baseRisk +
        application.risk +
        region.risk +
        threat.risk +
        (100 - workforce) * 0.42 +
        (100 - supplier) * 0.34
    ),
    0,
    100
  );
  const stressMultiplier = 1 + score / 135;
  const outageMultiplier = threatInput.value === "appOutage" ? 0.86 : 1;
  const rto = Math.max(1, Math.round(application.rto * stressMultiplier * outageMultiplier));
  const rpo = Math.max(1, Math.round(application.rpo * (1 + score / 180)));
  const mad = Math.max(rto, Math.round(application.mad * (score >= 76 ? 0.8 : 1)));

  simulatorOutput.workforce.textContent = `${workforce}%`;
  simulatorOutput.supplier.textContent = `${supplier}%`;
  simulatorOutput.score.textContent = score;
  simulatorOutput.band.textContent = getRiskBand(score);
  simulatorOutput.meter.style.width = `${score}%`;
  simulatorOutput.rto.textContent = formatHours(rto);
  simulatorOutput.rpo.textContent = formatHours(rpo);
  simulatorOutput.mad.textContent = formatHours(mad);
  simulatorOutput.dependency.textContent = `${process.name}: ${application.name}`;
  simulatorOutput.context.textContent = `${region.name} מוסיפה ${region.note}; ${application.dependency}`;
  simulatorOutput.action.textContent = `${threat.action} תעדפו את התאוששות ${application.name} בתוך ${formatHours(rto)}, עם אובדן נתונים מתחת ל-${formatHours(rpo)}.`;
  updateDominoCascade({ process, application, threat, score, rto, rpo });
}

function renderApplicationOptions() {
  const processInput = simulatorControls.process;
  const container = simulatorOutput.applicationOptions;

  if (!processInput || !container) {
    return;
  }

  const process = simulatorModels.processes[processInput.value] || simulatorModels.processes.sales;
  const selectedKey = getSelectedApplication(process).key;

  simulatorOutput.applicationTitle.textContent = `אפליקציות עבור ${process.name}`;
  container.innerHTML = "";

  for (const application of process.apps) {
    const option = document.createElement("button");
    option.type = "button";
    option.className = "application-option";
    option.dataset.application = application.key;
    option.setAttribute("role", "radio");
    option.setAttribute("aria-checked", String(application.key === selectedKey));
    option.innerHTML = `
      <strong>${application.name}</strong>
      <span>${application.category}</span>
      <span class="application-meta">
        <em>RTO ${formatCompactHours(application.rto)}</em>
        <em>RPO ${formatCompactHours(application.rpo)}</em>
        <em>MAD ${formatCompactHours(application.mad)}</em>
      </span>
    `;
    option.classList.toggle("is-selected", application.key === selectedKey);
    option.addEventListener("click", () => {
      container.dataset.selectedApplication = application.key;
      renderApplicationOptions();
      updateSimulator();
    });
    container.append(option);
  }
}

function getSelectedApplication(process) {
  const selectedKey = simulatorOutput.applicationOptions?.dataset.selectedApplication;
  const selectedApplication = process.apps.find((application) => application.key === selectedKey);

  if (selectedApplication) {
    return selectedApplication;
  }

  const defaultApplication = process.apps[0];

  if (simulatorOutput.applicationOptions) {
    simulatorOutput.applicationOptions.dataset.selectedApplication = defaultApplication.key;
  }

  return defaultApplication;
}

function getRiskBand(score) {
  if (score >= 82) {
    return "סיכון רציפות קריטי";
  }

  if (score >= 64) {
    return "סיכון רציפות גבוה";
  }

  if (score >= 42) {
    return "סיכון רציפות מוגבר";
  }

  return "סיכון רציפות בשליטה";
}

function updateDominoCascade({ process, application, threat, score, rto, rpo }) {
  const path = [
    {
      label: application.name,
      type: application.category
    },
    ...process.dominoPath.map((label, index) => ({
      label,
      type: index < 2 ? "פנימי" : "חיצוני"
    }))
  ];
  const impactRatio = clamp((score - 25) / 75, 0.18, 1);
  const fallenCount = clamp(Math.floor(impactRatio * path.length), 1, path.length);
  const atRiskIndex = fallenCount < path.length ? fallenCount : -1;
  const nodes = path.map((item, index) => {
    let status = "stable";

    if (index < fallenCount) {
      status = "fallen";
    } else if (index === atRiskIndex) {
      status = "risk";
    }

    return {
      ...item,
      status
    };
  });

  latestDominoState = {
    nodes,
    firstImpact: path[0].label,
    depth: `${fallenCount} מתוך ${path.length} תלויות הושפעו`,
    recoveryWindow: `${formatCompactHours(rto)} RTO / ${formatCompactHours(rpo)} RPO`,
    threatName: threat.name
  };

  renderDominoCascade(latestDominoState);
}

function renderDominoCascade(state) {
  const stage = simulatorOutput.dominoStage;

  if (!stage) {
    return;
  }

  stage.style.setProperty("--domino-count", state.nodes.length);
  stage.innerHTML = "";

  for (const [index, node] of state.nodes.entries()) {
    const step = document.createElement("div");
    const tile = document.createElement("div");

    step.className = "domino-step";
    tile.className = `domino-tile is-${node.status}`;
    tile.style.setProperty("--delay", `${index * 90}ms`);
    tile.innerHTML = `
      <strong>${node.label}</strong>
      <span>${getDominoStatusLabel(node.status)} - ${node.type}</span>
    `;
    step.append(tile);
    stage.append(step);
  }

  simulatorOutput.dominoFirst.textContent = state.firstImpact;
  simulatorOutput.dominoDepth.textContent = state.depth;
  simulatorOutput.dominoWindow.textContent = state.recoveryWindow;
}

function getDominoStatusLabel(status) {
  if (status === "fallen") {
    return "הושפע";
  }

  if (status === "risk") {
    return "בסיכון";
  }

  return "יציב";
}

function formatHours(value) {
  return `${value} ${value === 1 ? "שעה" : "שעות"}`;
}

function formatCompactHours(value) {
  return `${value}ש׳`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function startThreatAnimation() {
  if (!threatAnimation.cards.length) {
    return;
  }

  setThreatStep(0);
  setInterval(() => {
    threatStepIndex = (threatStepIndex + 1) % threatSteps.length;
    setThreatStep(threatStepIndex);
  }, 2400);
}

function setThreatStep(index) {
  const stepNumber = String(index + 1);
  const step = threatSteps[index];

  for (const card of threatAnimation.cards) {
    card.classList.toggle("is-active", card.dataset.threatStep === stepNumber);
  }

  for (const marker of threatAnimation.markers) {
    marker.classList.toggle("is-active", marker.dataset.threatMarker === stepNumber);
  }

  for (const route of threatAnimation.routes) {
    route.classList.toggle("is-active", route.dataset.threatRoute === stepNumber);
  }

  if (threatAnimation.title) {
    threatAnimation.title.textContent = step.title;
  }

  if (threatAnimation.detail) {
    threatAnimation.detail.textContent = step.detail;
  }
}
