const riskModels = {
  4: {
    mad: "4 Hours",
    reputational: 18,
    legal: 70,
    regulatory: 22,
    internal: 88
  },
  24: {
    mad: "24 Hours",
    reputational: 28,
    legal: 76,
    regulatory: 36,
    internal: 92
  },
  48: {
    mad: "48 Hours",
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
    title: "Scanning Shibuya region",
    detail: "Language model flags seismic chatter, transport alerts, and local infrastructure updates."
  },
  {
    title: "Supplier exposure found",
    detail: "CyberAgent headquarters and primary supplier locations are matched to the affected region."
  },
  {
    title: "Dependency chain connected",
    detail: "Sales payment transfers are linked to client accounts, reporting, liquidity, and legal review."
  },
  {
    title: "Continuity warning issued",
    detail: "RTO, RPO, and MAD thresholds are escalated before the disruption reaches the franchise."
  }
];

const simulatorModels = {
  processes: {
    sales: {
      name: "Sales settlement",
      dependency: "Payments, liquidity, client accounts, Salesforce, reporting, and legal review.",
      baseRisk: 34,
      rto: 4,
      rpo: 2,
      mad: 4,
      dominoPath: ["Liquidity", "Client Accounts", "Sales", "Reporting", "Legal"],
      apps: [
        {
          key: "salesforce",
          name: "Salesforce Einstein",
          category: "CRM automation",
          rto: 4,
          rpo: 2,
          mad: 4,
          risk: 14,
          dependency: "Predictive lead scoring, forecasting, and customer insight automation."
        },
        {
          key: "cyberagent",
          name: "CyberAgent Sales Cloud",
          category: "Sales reporting",
          rto: 4,
          rpo: 2,
          mad: 4,
          risk: 18,
          dependency: "Payment transfer reporting, sales settlements, and client account visibility."
        },
        {
          key: "hubspot-sales",
          name: "HubSpot Sales Hub",
          category: "Pipeline continuity",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 10,
          dependency: "Deal pipeline, automated outreach, and customer communication history."
        }
      ]
    },
    payments: {
      name: "Vendor payments",
      dependency: "Treasury approvals, bank portals, ERP data, and supplier operations.",
      baseRisk: 31,
      rto: 6,
      rpo: 4,
      mad: 8,
      dominoPath: ["Supplier Master", "Treasury", "Bank Portal", "Payments", "Ledger", "Reporting"],
      apps: [
        {
          key: "blackline",
          name: "BlackLine Transaction Matching",
          category: "Reconciliation",
          rto: 2,
          rpo: 5,
          mad: 2,
          risk: 19,
          dependency: "Transaction matching, reconciliations, journal entries, and finance controls."
        },
        {
          key: "kyriba",
          name: "Kyriba Treasury",
          category: "Treasury operations",
          rto: 6,
          rpo: 4,
          mad: 8,
          risk: 16,
          dependency: "Bank connectivity, liquidity visibility, payment files, and treasury approval paths."
        },
        {
          key: "sap-finance",
          name: "SAP S/4HANA Finance",
          category: "ERP finance",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 13,
          dependency: "Vendor master data, accounts payable, purchase orders, and ledger posting."
        }
      ]
    },
    reporting: {
      name: "Client reporting",
      dependency: "Data warehouse, sales feeds, compliance checks, and communications review.",
      baseRisk: 26,
      rto: 12,
      rpo: 6,
      mad: 24,
      dominoPath: ["Sales Feeds", "Data Warehouse", "Analytics", "Client Reporting", "Compliance", "Communications"],
      apps: [
        {
          key: "tableau",
          name: "Tableau Cloud",
          category: "BI dashboards",
          rto: 12,
          rpo: 6,
          mad: 24,
          risk: 12,
          dependency: "Executive dashboards, sales reporting, and recurring client views."
        },
        {
          key: "powerbi",
          name: "Power BI Service",
          category: "Analytics",
          rto: 10,
          rpo: 6,
          mad: 18,
          risk: 11,
          dependency: "Dataset refreshes, report publishing, and operational KPI monitoring."
        },
        {
          key: "snowflake",
          name: "Snowflake Data Cloud",
          category: "Data platform",
          rto: 8,
          rpo: 4,
          mad: 12,
          risk: 17,
          dependency: "Sales feeds, historical reporting data, and downstream analytics jobs."
        }
      ]
    },
    payroll: {
      name: "Payroll processing",
      dependency: "HR records, payroll provider, finance approval, and employee communications.",
      baseRisk: 29,
      rto: 24,
      rpo: 8,
      mad: 24,
      dominoPath: ["HR Records", "Payroll Provider", "Finance Approval", "Payroll", "Employee Comms", "Legal"],
      apps: [
        {
          key: "workday",
          name: "Workday HCM",
          category: "HR operations",
          rto: 72,
          rpo: 4,
          mad: 4,
          risk: 15,
          dependency: "Employee data, payroll workflows, recruitment records, and HR approvals."
        },
        {
          key: "adp",
          name: "ADP Workforce Now",
          category: "Payroll provider",
          rto: 24,
          rpo: 8,
          mad: 24,
          risk: 14,
          dependency: "Payroll runs, tax files, direct deposit files, and employee pay statements."
        },
        {
          key: "deel",
          name: "Deel Payroll",
          category: "Global payroll",
          rto: 24,
          rpo: 6,
          mad: 24,
          risk: 12,
          dependency: "International contractor payroll, compliance docs, and worker communications."
        }
      ]
    }
  },
  regions: {
    telaviv: { name: "Tel Aviv", risk: 9, note: "regional security and transport sensitivity" },
    shibuya: { name: "Shibuya", risk: 16, note: "seismic and data center exposure" },
    toronto: { name: "Toronto", risk: 7, note: "weather and vendor concentration exposure" },
    london: { name: "London", risk: 10, note: "regulatory and market infrastructure sensitivity" }
  },
  threats: {
    appOutage: {
      name: "Critical app outage",
      risk: 22,
      action: "Activate backup workflows, freeze non-critical changes, and prioritize application restoration."
    },
    earthquake: {
      name: "Regional seismic event",
      risk: 28,
      action: "Confirm staff safety, shift processing to an alternate region, and monitor supplier facilities."
    },
    supplier: {
      name: "Supplier disruption",
      risk: 20,
      action: "Move to pre-approved suppliers and trigger procurement and client communication paths."
    },
    flood: {
      name: "Data center flood risk",
      risk: 25,
      action: "Validate replication, route workloads away from exposed infrastructure, and increase backup frequency."
    },
    workforce: {
      name: "Workforce disruption",
      risk: 18,
      action: "Move critical tasks to trained backups and simplify approvals for the active recovery window."
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
    apiStatus.textContent = `${body.service.name} online`;
  } catch {
    apiStatus.textContent = "API unavailable";
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
  simulatorOutput.rto.textContent = `${rto} ${pluralizeHour(rto)}`;
  simulatorOutput.rpo.textContent = `${rpo} ${pluralizeHour(rpo)}`;
  simulatorOutput.mad.textContent = `${mad} ${pluralizeHour(mad)}`;
  simulatorOutput.dependency.textContent = `${process.name}: ${application.name}`;
  simulatorOutput.context.textContent = `${region.name} adds ${region.note}; ${application.dependency}`;
  simulatorOutput.action.textContent = `${threat.action} Prioritize ${application.name} recovery inside ${rto} ${pluralizeHour(rto)} with data loss under ${rpo} ${pluralizeHour(rpo)}.`;
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

  simulatorOutput.applicationTitle.textContent = `${process.name} applications`;
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
        <em>RTO ${application.rto}h</em>
        <em>RPO ${application.rpo}h</em>
        <em>MAD ${application.mad}h</em>
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
    return "Critical continuity risk";
  }

  if (score >= 64) {
    return "High continuity risk";
  }

  if (score >= 42) {
    return "Elevated continuity risk";
  }

  return "Controlled continuity risk";
}

function updateDominoCascade({ process, application, threat, score, rto, rpo }) {
  const path = [
    {
      label: application.name,
      type: application.category
    },
    ...process.dominoPath.map((label, index) => ({
      label,
      type: index < 2 ? "Internal" : "External"
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
    depth: `${fallenCount} of ${path.length} dependencies impacted`,
    recoveryWindow: `${rto}h RTO / ${rpo}h RPO`,
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
    return "Impacted";
  }

  if (status === "risk") {
    return "At risk";
  }

  return "Stable";
}

function pluralizeHour(value) {
  return value === 1 ? "hour" : "hours";
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
