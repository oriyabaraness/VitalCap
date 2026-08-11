(() => {
const languageNames = {
  he: { lang: "he", dir: "rtl" },
  en: { lang: "en", dir: "ltr" }
};

const pageMeta = {
  he: {
    title: "VitalCap | תכנון רציפות עסקית מבוסס AI",
    description: "VitalCap היא פלטפורמת תכנון רציפות עסקית מבוססת AI לניתוח איומים חי, מיפוי תלויות והמלצות התאוששות."
  },
  en: {
    title: "VitalCap | AI Business Continuity Planning",
    description:
      "VitalCap is an AI-powered business continuity planning platform for live threat analysis, dependency mapping, and recovery recommendations."
  }
};

const staticTextTranslations = {
  "פלטפורמה": "Platform",
  "תהליך עבודה": "Workflow",
  "סיכון": "Risk",
  "מייסדת": "Founder",
  "סימולטור": "Simulator",
  "צור קשר": "Contact us",
  "תכנון רציפות עסקית מבוסס AI": "AI Business Continuity Planning",
  "תכנון רציפות חי שמחבר תהליכים עסקיים, קריטיות כוח אדם, תלויות באפליקציות ואיומים לפי מיקום.":
    "Live continuity planning that connects business processes, workforce criticality, application dependencies, and location-specific threats.",
  "צפו במודל הסיכון": "View Risk Model",
  "תוכנית התאוששות": "Recovery Plan",
  "מוקד": "Focus",
  "אוטומציית BCP": "BCP automation",
  "אותות": "Signals",
  "עובדים, אפליקציות ואיומים": "People, apps, threats",
  "סטטוס": "Status",
  "בודק API": "Checking API",
  "היכרות": "Introduction",
  "נבנה מתוך ניסיון ברציפות ובניהול סיכונים.": "Built by continuity and risk experience.",
  "אוריה ברנס היא מקצוענית בתחומי אבטחה וניהול סיכונים, עם התמחות ברציפות עסקית ובהתאוששות מאסון. עבודתה כוללת תיאום רציפות, הגנת תשתיות ותכנון חוסן מעשי.":
    "Oriya Baraness is a security and risk management professional specializing in business continuity and disaster recovery. Her work spans continuity coordination, infrastructure protection, and practical resilience planning.",
  "VitalCap הופכת את הדיסציפלינה הזו לתהליך SaaS חי עבור ארגונים שצריכים שתוכניות הרציפות שלהם יישארו עדכניות לפני משבר.":
    "VitalCap turns that discipline into a living SaaS workflow for organizations that need continuity plans to stay current before a crisis.",
  "מייסדת: אוריה ברנס": "Founder: Oriya Baraness",
  "הריצו תרחיש רציפות של אפקט דומינו.": "Run a domino-effect continuity scenario.",
  "תהליך עסקי": "Business process",
  "סגירת מכירות": "Sales settlement",
  "תשלומים לספקים": "Vendor payments",
  "דיווח ללקוחות": "Client reporting",
  "עיבוד שכר": "Payroll processing",
  "אזור": "Region",
  "תל אביב": "Tel Aviv",
  "שיבויה": "Shibuya",
  "טורונטו": "Toronto",
  "לונדון": "London",
  "איום": "Threat",
  "השבתת אפליקציה קריטית": "Critical app outage",
  "אירוע סייסמי אזורי": "Regional seismic event",
  "שיבוש אצל ספק": "Supplier disruption",
  "סיכון הצפה במרכז נתונים": "Data center flood risk",
  "שיבוש בכוח האדם": "Workforce disruption",
  "אפליקציות": "Applications",
  "סל אפליקציות לתהליך": "Process application stack",
  "ציון התרחיש": "Scenario Score",
  "מחשב": "Calculating",
  "תלות": "Dependency",
  "הקשר התרחיש יופיע כאן.": "Scenario context will appear here.",
  "פעולה מומלצת": "Recommended action",
  "הריצו את הסימולטור כדי לחשב נתיב תגובה.": "Run the simulator to calculate a response path.",
  "אפקט דומינו": "Domino effect",
  "שרשרת תלויות": "Dependency cascade",
  "הפעל שוב": "Replay cascade",
  "השפעה ראשונה": "First impact",
  "עומק השרשרת": "Cascade depth",
  "חלון התאוששות": "Recovery window",
  "מקובצי BCP סטטיים למודיעין רציפות חי.": "From static BCP files to living continuity intelligence.",
  "כשלים מרכזיים ב-BCP מסורתי": "Core failures of traditional BCP",
  "מקורות מפוצלים": "Fragmented sources",
  "מתאמי רציפות אוספים ידנית נתוני כוח אדם, תהליכים, אפליקציות וצדדים שלישיים.":
    "Coordinators pull from workforce, process, application, and third-party data manually.",
  "פערי מידע": "Information gaps",
  "מחלקות מתעדכנות בקצבים שונים, מה שיוצר עיכובים ותלויות חסרות.":
    "Departments update at different speeds, leaving delays and missing dependencies.",
  "תמונת סיכון כללית": "Generic risk views",
  "תוכניות רבות מפספסות איומים ייחודיים לארגון ולשלוחה.":
    "Plans often miss threats that are specific to the organization and franchise.",
  "תחזוקה שנתית": "Annual maintenance",
  "מסמכי BCP מתעדכנים אחרי משבר או ביקורת, במקום באופן רציף.":
    "BCP documents are refreshed after crisis or audit cycles instead of continuously.",
  "פתרון VitalCap": "The VitalCap solution",
  "בניית תוכנית אוטומטית": "Automated plan building",
  "מחבר את נתוני הליבה הדרושים ליצירת תוכניות רציפות מוכנות להתאוששות.":
    "Combines the core data needed to produce recovery-ready continuity plans.",
  "חישוב סיכון": "Risk calculation",
  "משתמש ב-MAD, RTO, RPO ובקריטיות אפליקציות כדי לדרג השפעה עסקית.":
    "Uses MAD, RTO, RPO, and application criticality to score business impact.",
  "ניטור איומים": "Threat monitoring",
  "מנתח איומים בזמן אמת על נקודות כשל יחידות באמצעות אותות ממקורות פתוחים.":
    "Analyzes real-time threats to single points of failure with open-source signals.",
  "אסטרטגיית התאוששות": "Recovery strategy",
  "ממליץ על פעולות לפי משאבים, יכולות, תלויות וענף פעילות.":
    "Recommends actions based on resources, capabilities, dependencies, and industry.",
  "הזדמנות שוק": "Market Opportunity",
  "צוותי רציפות נדרשים להגיב מהר יותר.": "Continuity teams are being asked to move faster.",
  "פתרונות לניהול רציפות עסקית צפויים לצמוח ב-1.17 מיליארד דולר בין 2024 ל-2028, בעקבות הביקוש לחוסן חזק יותר וליציבות תפעולית בענפים שונים.":
    "Business continuity management solutions are projected to expand by USD 1.17B between 2024 and 2028, driven by demand for stronger resilience and operational stability across industries.",
  "מיפוי תלויות אפליקציה עם לוגיקת RTO ו-RPO.": "Application dependency mapping with RTO and RPO logic.",
  "פלט לדוגמה": "Sample Output",
  "RTO אפליקטיבי": "Application RTO",
  "4 שעות": "4 Hours",
  "RPO אפליקטיבי": "Application RPO",
  "2 שעות": "2 Hours",
  "עיבוד קריטי": "Critical processing",
  "סגירת עסקאות בשעה 23:00": "23:00 transaction settlements",
  "תלות פנימית": "Internal dependency",
  "MAD לתהליך המכירות: 4 שעות": "Sales process MAD: 4 hours",
  "תלות חיצונית": "External dependency",
  "תשתית ענן לשירותי דיווח והתראות": "Cloud infrastructure for reporting and alerting services",
  "מחשבון סיכון": "Risk Calculator",
  "הקריטיות משתנה ככל שאופקי הזמן מתרחבים.": "Criticality changes as time horizons expand.",
  "24 שעות": "24 Hours",
  "48 שעות": "48 Hours",
  "תדמיתי": "Reputational",
  "משפטי": "Legal",
  "רגולטורי": "Regulatory",
  "פנימי": "Internal",
  "הכלי מדגיש אפליקציות המשמשות קווי עסקים שונים ומשלב תלויות בתוך חישובי MAD, RTO ו-RPO.":
    "The tool highlights applications used across business lines and folds dependencies into MAD, RTO, and RPO calculations.",
  "ניתוח סיכונים ואיומים": "Risk and Threat Analysis",
  "ניטור איומים גיאוגרפי לכל שלוחה.": "Geo-specific threat monitoring for each franchise.",
  "VitalCap יכולה לזהות אירועים אזוריים, חשיפה של ספקים, תלויות באפליקציות וקריטיות ברמת צוות לפני שהם הופכים לכשלי רציפות.":
    "VitalCap can detect regional events, supplier exposure, application dependencies, and team-level criticality before they become continuity failures.",
  "פיד איומים חי": "Live threat feed",
  "סורק את אזור שיבויה": "Scanning Shibuya region",
  "מנטר אותות סייסמיים, ספקים ותלויות אפליקציה.": "Monitoring seismic, supplier, and application dependency signals.",
  "מודל שפה מנטר איומים פעילים ליד שיבויה, יפן.": "Language model monitors active threats near Shibuya, Japan.",
  "נתוני ספקים מזהים חשיפה של מטה CyberAgent.": "Supplier data identifies CyberAgent headquarters exposure.",
  "תלויות העברת תשלומי מכירות מחוברות ל-CyberAgent.":
    "Sales payment transfer dependencies are connected to CyberAgent.",
  "VitalCap מזהירה את הצוות שספי RTO, RPO ו-MAD נמצאים בסיכון.":
    "VitalCap warns the team that RTO, RPO, and MAD thresholds are at risk.",
  "המלצות התאוששות": "Recovery Recommendations",
  "נתיבי פעולה לפי זמן, סיכון לקוחות וחשיפה משפטית.": "Action paths tied to time, client risk, and legal exposure.",
  "שכבת ההמלצות הופכת חישובי סיכון לצעדים תפעוליים: תקשורת, הפעלת גיבויים, ספקים חלופיים ומחזורי בדיקה.":
    "The recommendation layer turns risk calculations into operational steps: communications, backup activation, alternate suppliers, and testing cycles.",
  "תוכנית זמן": "Time Plan",
  "סיכון לקוחות": "Client Risk",
  "פעולה": "Action",
  "גיבוי נתוני מכירות ושליחת תקשורת ללקוחות.": "Back up sales data and send client communications.",
  "מעבר לפלטפורמות מכירה חלופיות והפעלת ספקים לטווח קצר.":
    "Switch to alternative sales platforms and activate short-term suppliers.",
  "יישום צעדי תמיכת לקוחות זמניים עם צוות ייעודי.":
    "Implement interim customer support measures with dedicated staff.",
  "סקירת תוצאות בדיקה והתאמת אסטרטגיות רציפות.": "Review testing results and adjust continuity strategies.",
  "ערך ייחודי": "Unique Value Position",
  "SaaS מבוסס AI לניתוח איומים בזמן אמת, קריטיות עובדים ומיפוי תלויות אפליקציה.":
    "AI-powered SaaS for real-time threat analysis, employee criticality, and application dependency mapping.",
  "VitalCap מסתגלת באופן דינמי לאיומים מתפתחים, כדי שארגונים יוכלו להתאים מראש תוכניות רציפות, לצמצם חשיפה ולחזק חוסן.":
    "VitalCap dynamically adapts to evolving threats so organizations can preemptively adjust continuity plans, reduce exposure, and strengthen resilience.",
  "תל אביב, ישראל": "Tel Aviv, Israel"
};

const attributeTranslations = {
  "ניווט ראשי": "Primary navigation",
  "דף הבית של VitalCap": "VitalCap home",
  "אזורים": "Sections",
  "בחירת שפה": "Language selection",
  "פעולות ראשיות": "Primary actions",
  "פרטי השירות": "Service details",
  "אוריה ברנס, מייסדת VitalCap": "Oriya Baraness, founder of VitalCap",
  "בקרות סימולטור רציפות": "Continuity simulator controls",
  "אפשרויות אפליקציה": "Application options",
  "ערכי רציפות מחושבים": "Calculated continuity values",
  "נתיב דומינו של תלויות": "Dependency domino path",
  "סיכום אפקט הדומינו": "Domino effect summary",
  "זרימת תלויות פנימיות וחיצוניות בין תשלומים, נזילות, חשבונות, לקוחות, מכירות, דיווח ומשפטי":
    "Internal and external dependency flow across payments, liquidity, accounts, clients, sales, reporting, and legal",
  "פלט רציפות לדוגמה": "Sample continuity output",
  "מחשבון סיכון": "Risk calculator",
  "אופק זמן": "Time horizon",
  "גורמי סיכון": "Risk factors",
  "ניטור איומים אזורי חי": "Live regional threat monitor",
  "מפת ניטור איומים עולמית עם סמנים אזוריים": "Global threat monitoring map with regional markers",
  "דוגמת ניתוח איומים": "Threat analysis sample",
  "תוכנית זמן": "Time Plan",
  "סיכון לקוחות": "Client Risk",
  "משפטי": "Legal",
  "פעולה": "Action"
};

const fragmentTranslations = {
  he: {
    workforceLabel: "זמינות כוח אדם ",
    supplierLabel: "אמון בספקים ",
    madLabel: "MAD מומלץ למכירות: "
  },
  en: {
    workforceLabel: "Workforce available ",
    supplierLabel: "Supplier confidence ",
    madLabel: "Recommended MAD for Sales: "
  }
};

const englishSimulatorModels = {
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

const englishThreatSteps = [
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

const supportedLanguages = new Set(Object.keys(languageNames));
const storageKey = "vitalcap-language";
let currentLanguage = getInitialLanguage();

window.VitalCapI18n = {
  getLanguage: () => currentLanguage,
  setLanguage,
  simulatorModels: {
    en: englishSimulatorModels
  },
  threatSteps: {
    en: englishThreatSteps
  }
};

setLanguage(currentLanguage, { notify: false });

for (const button of document.querySelectorAll("[data-language-option]")) {
  button.addEventListener("click", () => setLanguage(button.dataset.languageOption));
}

function setLanguage(language, { notify = true } = {}) {
  if (!supportedLanguages.has(language)) {
    language = "he";
  }

  currentLanguage = language;
  localStorage.setItem(storageKey, language);
  applyDocumentLanguage(language);
  translateStaticText(language);
  translateAttributes(language);
  translateFragments(language);
  updateLanguageButtons(language);

  if (notify) {
    window.dispatchEvent(new CustomEvent("vitalcap:languagechange", { detail: { language } }));
  }
}

function applyDocumentLanguage(language) {
  const meta = languageNames[language];
  const page = pageMeta[language];

  document.documentElement.lang = meta.lang;
  document.documentElement.dir = meta.dir;
  document.title = page.title;

  const description = document.querySelector('meta[name="description"]');

  if (description) {
    description.setAttribute("content", page.description);
  }
}

function translateStaticText(language) {
  for (const element of document.querySelectorAll("body *")) {
    if (element.children.length || ["SCRIPT", "STYLE", "SVG", "PATH"].includes(element.tagName)) {
      continue;
    }

    const key = getTextKey(element);

    if (!key) {
      continue;
    }

    element.textContent = language === "he" ? key : staticTextTranslations[key];
  }
}

function translateAttributes(language) {
  const trackedAttributes = [
    { attr: "aria-label", dataKey: "i18nAriaLabelKey" },
    { attr: "alt", dataKey: "i18nAltKey" },
    { attr: "data-label", dataKey: "i18nDataLabelKey" }
  ];

  for (const { attr, dataKey } of trackedAttributes) {
    for (const element of document.querySelectorAll(`[${attr}]`)) {
      const key = getAttributeKey(element, attr, dataKey);

      if (!key) {
        continue;
      }

      element.setAttribute(attr, language === "he" ? key : attributeTranslations[key]);
    }
  }
}

function translateFragments(language) {
  setPreservedPrefix(document.querySelector('label[for="sim-workforce"] > span'), fragmentTranslations[language].workforceLabel);
  setPreservedPrefix(document.querySelector('label[for="sim-supplier"] > span'), fragmentTranslations[language].supplierLabel);
  setPreservedPrefix(document.querySelector(".risk-summary strong"), fragmentTranslations[language].madLabel);
}

function updateLanguageButtons(language) {
  document.documentElement.dataset.language = language;

  for (const button of document.querySelectorAll("[data-language-option]")) {
    const isActive = button.dataset.languageOption === language;

    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  }
}

function getTextKey(element) {
  if (element.dataset.i18nTextKey) {
    return element.dataset.i18nTextKey;
  }

  const key = normalizeText(element.textContent);

  if (!staticTextTranslations[key]) {
    return "";
  }

  element.dataset.i18nTextKey = key;
  return key;
}

function getAttributeKey(element, attr, dataKey) {
  if (element.dataset[dataKey]) {
    return element.dataset[dataKey];
  }

  const key = normalizeText(element.getAttribute(attr) || "");

  if (!attributeTranslations[key]) {
    return "";
  }

  element.dataset[dataKey] = key;
  return key;
}

function setPreservedPrefix(element, prefix) {
  if (!element) {
    return;
  }

  if (!element.firstChild || element.firstChild.nodeType !== Node.TEXT_NODE) {
    element.prepend(document.createTextNode(""));
  }

  element.firstChild.textContent = prefix;
}

function getInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const requested = params.get("lang");

  if (supportedLanguages.has(requested)) {
    return requested;
  }

  const stored = localStorage.getItem(storageKey);

  if (supportedLanguages.has(stored)) {
    return stored;
  }

  return document.documentElement.lang === "en" ? "en" : "he";
}

function normalizeText(value) {
  return value.trim().replace(/\s+/g, " ");
}
})();
