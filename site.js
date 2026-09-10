const modalTriggers = document.querySelectorAll("[data-modal-target]");

function openModal(id) {
  const dialog = document.getElementById(id);
  if (!dialog || typeof dialog.showModal !== "function") {
    return;
  }

  dialog.showModal();
}

function closeModal(dialog) {
  if (dialog?.open) {
    dialog.close();
  }
}

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(trigger.dataset.modalTarget));
});

document.querySelectorAll(".modal-close").forEach((button) => {
  button.addEventListener("click", () => closeModal(button.closest("dialog")));
});

document.querySelectorAll(".detail-modal").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeModal(dialog);
    }
  });
});

const passwordInput = document.getElementById("password-input");
const passwordToggle = document.getElementById("password-toggle");
const passwordFill = document.getElementById("password-strength-fill");
const passwordResult = document.getElementById("password-result");
const passwordChecks = document.getElementById("password-checks");

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds > 31_536_000 * 1e12) return "longer than trillions of years";
  if (seconds < 1) return "less than one second";
  const units = [
    [31_536_000, "year"], [86_400, "day"], [3_600, "hour"], [60, "minute"], [1, "second"],
  ];
  const [size, label] = units.find(([size]) => seconds >= size);
  const amount = Math.floor(seconds / size);
  return `${amount.toLocaleString()} ${label}${amount === 1 ? "" : "s"}`;
}

function analyzePassword(value) {
  const tests = [
    ["At least 12 characters", value.length >= 12],
    ["At least 16 characters", value.length >= 16],
    ["Upper and lowercase", /[a-z]/.test(value) && /[A-Z]/.test(value)],
    ["Contains a number", /\d/.test(value)],
    ["Contains a symbol", /[^A-Za-z0-9]/.test(value)],
    ["No obvious sequence", !/(password|qwerty|admin|letmein|1234|abcd)/i.test(value)],
    ["No long repetition", !/(.)\1{2,}/.test(value)],
  ];

  let pool = 0;
  if (/[a-z]/.test(value)) pool += 26;
  if (/[A-Z]/.test(value)) pool += 26;
  if (/\d/.test(value)) pool += 10;
  if (/[^A-Za-z0-9]/.test(value)) pool += 33;
  let entropy = value && pool ? value.length * Math.log2(pool) : 0;
  if (!tests[5][1]) entropy *= 0.45;
  if (!tests[6][1]) entropy *= 0.65;

  let score = entropy >= 100 ? 5 : entropy >= 75 ? 4 : entropy >= 55 ? 3 : entropy >= 35 ? 2 : 1;
  if (value.length < 12) score = Math.min(score, 2);
  const labels = ["", "Very weak", "Weak", "Fair", "Strong", "Very strong"];
  const colors = ["", "#ff7b72", "#f97316", "#e4b65a", "#63d391", "#14b8a6"];
  const guessesPerSecond = 10_000_000_000;
  const seconds = entropy ? (2 ** Math.min(entropy, 1024)) / guessesPerSecond : 0;
  return { tests, entropy, score, label: labels[score], color: colors[score], seconds };
}

function renderPasswordAnalysis() {
  if (!passwordInput || !passwordFill || !passwordResult || !passwordChecks) return;
  const value = passwordInput.value;
  passwordChecks.replaceChildren();
  if (!value) {
    passwordFill.style.width = "0";
    passwordResult.textContent = "Enter a sample to begin.";
    return;
  }

  const analysis = analyzePassword(value);
  passwordFill.style.width = `${analysis.score * 20}%`;
  passwordFill.style.background = analysis.color;
  passwordResult.textContent = `${analysis.label} · approximately ${Math.round(analysis.entropy)} bits of estimated entropy · estimated offline search: ${formatDuration(analysis.seconds)}.`;
  analysis.tests.forEach(([label, passed]) => {
    const item = document.createElement("li");
    item.className = passed ? "pass" : "";
    item.textContent = `${passed ? "✓" : "○"} ${label}`;
    passwordChecks.append(item);
  });
}

passwordInput?.addEventListener("input", renderPasswordAnalysis);
passwordToggle?.addEventListener("click", () => {
  const reveal = passwordInput.type === "password";
  passwordInput.type = reveal ? "text" : "password";
  passwordToggle.textContent = reveal ? "Hide" : "Show";
  passwordToggle.setAttribute("aria-pressed", String(reveal));
});

function parseIpv4(value) {
  const parts = value.split(".");
  if (parts.length !== 4 || parts.some((part) => !/^\d{1,3}$/.test(part))) return null;
  const octets = parts.map(Number);
  if (octets.some((part) => part < 0 || part > 255)) return null;
  return octets.reduce((total, part) => (total << 8n) | BigInt(part), 0n);
}

function formatIpv4(value) {
  return [24n, 16n, 8n, 0n].map((shift) => Number((value >> shift) & 255n)).join(".");
}

function addResult(container, label, value) {
  const item = document.createElement("div");
  item.className = "result-item";
  const key = document.createElement("span");
  const result = document.createElement("strong");
  key.textContent = label;
  result.textContent = value;
  item.append(key, result);
  container.append(item);
}

const subnetTool = document.getElementById("subnet-tool");
const cidrInput = document.getElementById("cidr-input");
const subnetResult = document.getElementById("subnet-result");

function calculateSubnet(event) {
  event?.preventDefault();
  if (!cidrInput || !subnetResult) return;
  subnetResult.replaceChildren();
  const match = cidrInput.value.trim().match(/^([^/]+)\/(\d{1,2})$/);
  const address = match ? parseIpv4(match[1]) : null;
  const prefix = match ? Number(match[2]) : -1;
  if (address === null || prefix < 0 || prefix > 32) {
    subnetResult.className = "tool-result error";
    subnetResult.textContent = "Enter a valid IPv4 address in CIDR notation, such as 192.168.68.72/24.";
    return;
  }

  subnetResult.className = "result-grid";
  const full = (1n << 32n) - 1n;
  const hostBits = 32 - prefix;
  const hostMask = hostBits === 0 ? 0n : (1n << BigInt(hostBits)) - 1n;
  const mask = full ^ hostMask;
  const network = address & mask;
  const broadcast = network | hostMask;
  const total = 1n << BigInt(hostBits);
  let first = network;
  let last = broadcast;
  let usable = total;
  if (prefix <= 30) {
    first += 1n;
    last -= 1n;
    usable -= 2n;
  }

  addResult(subnetResult, "Network", `${formatIpv4(network)}/${prefix}`);
  addResult(subnetResult, "Subnet mask", formatIpv4(mask));
  addResult(subnetResult, "Broadcast", formatIpv4(broadcast));
  addResult(subnetResult, prefix === 32 ? "Host" : "Usable range", prefix === 32 ? formatIpv4(first) : `${formatIpv4(first)} – ${formatIpv4(last)}`);
  addResult(subnetResult, "Total addresses", total.toLocaleString());
  addResult(subnetResult, prefix === 31 ? "Point-to-point addresses" : "Usable hosts", usable.toLocaleString());
}

subnetTool?.addEventListener("submit", calculateSubnet);
if (subnetTool) calculateSubnet();

const scenarios = [
  {
    title: "Users report that internal applications will not load",
    summary: "Several applications fail by hostname, but users remain connected to the LAN.",
    signals: [["Gateway", "Reachable at normal latency"], ["Public IP", "8.8.8.8 responds"], ["DNS lookup", "Times out against the configured resolver"], ["Application IP", "Responds directly over HTTPS"]],
    choices: ["Failed access switch", "DNS resolver outage", "Application certificate failure", "Internet circuit outage"],
    answer: 1,
    explanation: "The network path and application endpoint both work by IP. Name resolution is the failed shared dependency, making the DNS resolver outage the best-supported cause.",
  },
  {
    title: "A media application returns HTTP 502",
    summary: "The reverse proxy is online, but one application fails while neighboring services remain healthy.",
    signals: [["Reverse proxy", "Healthy and serving other hosts"], ["DNS/TLS", "Hostname resolves and certificate is valid"], ["Backend port", "Connection refused"], ["Container", "Restart loop with database connection errors"]],
    choices: ["Public DNS failure", "Reverse proxy host outage", "Backend dependency failure", "Expired TLS certificate"],
    answer: 2,
    explanation: "The request reaches the healthy proxy and TLS terminates correctly. The refused backend port and restart loop isolate the failure to the application or its database dependency.",
  },
  {
    title: "Automation jobs suddenly fail on one Linux host",
    summary: "SSH connects successfully, but package updates and temporary-file creation fail.",
    signals: [["SSH", "Reachable and authenticates"], ["Root filesystem", "100% used"], ["Memory", "42% utilized"], ["Package manager", "Cannot write temporary files"]],
    choices: ["SSH key mismatch", "Memory exhaustion", "Root filesystem full", "Ansible controller outage"],
    answer: 2,
    explanation: "Authentication and connectivity are healthy. A full root filesystem directly explains both temporary-file and package-manager failures.",
  },
];

let scenarioIndex = 0;
let scenarioScore = 0;
const scenarioNumber = document.getElementById("scenario-number");
const scenarioScoreLabel = document.getElementById("scenario-score");
const scenarioTitle = document.getElementById("scenario-title");
const scenarioSummary = document.getElementById("scenario-summary");
const scenarioSignals = document.getElementById("scenario-signals");
const scenarioChoices = document.getElementById("scenario-choices");
const scenarioResult = document.getElementById("scenario-result");
const nextScenario = document.getElementById("next-scenario");

function renderScenario() {
  if (!scenarioTitle || !scenarioSignals || !scenarioChoices || !scenarioResult || !nextScenario) return;
  const scenario = scenarios[scenarioIndex];
  scenarioNumber.textContent = `Scenario ${scenarioIndex + 1} of ${scenarios.length}`;
  scenarioScoreLabel.textContent = `Score: ${scenarioScore}`;
  scenarioTitle.textContent = scenario.title;
  scenarioSummary.textContent = scenario.summary;
  scenarioSignals.replaceChildren();
  const legend = document.createElement("legend");
  legend.textContent = "What is the most likely root cause?";
  scenarioChoices.replaceChildren(legend);
  scenario.choices.forEach((choice, choiceIndex) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";
    button.textContent = choice;
    button.addEventListener("click", () => answerScenario(choiceIndex));
    scenarioChoices.append(button);
  });
  scenario.signals.forEach(([label, value]) => {
    const item = document.createElement("div");
    item.className = "signal-item";
    const key = document.createElement("strong");
    const detail = document.createElement("span");
    key.textContent = label;
    detail.textContent = value;
    item.append(key, detail);
    scenarioSignals.append(item);
  });
  scenarioResult.className = "tool-result hidden";
  scenarioResult.textContent = "";
  nextScenario.classList.add("hidden");
}

function answerScenario(choiceIndex) {
  const scenario = scenarios[scenarioIndex];
  const correct = choiceIndex === scenario.answer;
  if (correct) scenarioScore += 1;
  scenarioChoices.querySelectorAll("button").forEach((button) => { button.disabled = true; });
  scenarioResult.className = `tool-result ${correct ? "success" : "error"}`;
  scenarioResult.textContent = `${correct ? "Correct." : `Not quite. The best answer is ${scenario.choices[scenario.answer]}.`} ${scenario.explanation}`;
  scenarioScoreLabel.textContent = `Score: ${scenarioScore}`;
  nextScenario.textContent = scenarioIndex === scenarios.length - 1 ? "Restart simulation" : "Next scenario";
  nextScenario.classList.remove("hidden");
}

nextScenario?.addEventListener("click", () => {
  if (scenarioIndex === scenarios.length - 1) {
    scenarioIndex = 0;
    scenarioScore = 0;
  } else {
    scenarioIndex += 1;
  }
  renderScenario();
});

renderScenario();
