/**
 * Pro Analytics Engine - Nexus v1.3
 */
let charts = {}; // Store instances globally

document.addEventListener("DOMContentLoaded", () => {
  renderProAnalytics();

  // THE FIX: Listen for window resize to fix overlapping charts
  window.addEventListener("resize", () => {
    Object.values(charts).forEach((chart) => {
      if (chart) chart.resize();
    });
  });
});

function renderProAnalytics() {
  const tasks = getData("tasks") || [];
  const total = tasks.length;
  const completed = tasks.filter(
    (t) => t.status === "Completed" || t.status === "Done",
  ).length;
  const pending = total - completed;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  // Stats
  document.getElementById("total-tasks").innerText = total;
  document.getElementById("completed-tasks").innerText = completed;
  document.getElementById("pending-tasks").innerText = pending;

  // Progress
  setTimeout(() => {
    const bar = document.getElementById("progress-bar");
    const label = document.getElementById("progress-percent-label");
    const text = document.getElementById("progress-text");
    if (bar) bar.style.width = percent + "%";
    if (label) label.innerText = percent + "%";
    if (text)
      text.innerText = `${completed} OF ${total} SECURE NODES CONFIRMED`;
  }, 300);

  const isDark = document.documentElement.classList.contains("dark");
  const baseColor = isDark ? "#94a3b8" : "#64748b";

  Chart.defaults.font.family = "'Inter', sans-serif";
  Chart.defaults.font.weight = "900";
  Chart.defaults.color = baseColor;

  // 1. STATUS CHART
  charts.status = new Chart(document.getElementById("statusChart"), {
    type: "doughnut",
    data: {
      labels: ["Finished", "In-Progress"],
      datasets: [
        {
          data: [completed, pending],
          backgroundColor: ["#10b981", "#6366f1"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // MANDATORY FOR SIDEBAR RESIZE
      cutout: "75%",
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, font: { size: 10 } },
        },
      },
    },
  });

  // 2. CATEGORY CHART
  const types = {};
  tasks.forEach((t) => (types[t.type] = (types[t.type] || 0) + 1));

  charts.type = new Chart(document.getElementById("typeChart"), {
    type: "polarArea",
    data: {
      labels: Object.keys(types),
      datasets: [
        {
          data: Object.values(types),
          backgroundColor: [
            "rgba(99, 102, 241, 0.7)",
            "rgba(249, 115, 22, 0.7)",
            "rgba(217, 70, 239, 0.7)",
          ],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          grid: { color: "rgba(148, 163, 184, 0.1)" },
          ticks: { display: false },
        },
      },
      plugins: {
        legend: {
          position: "bottom",
          labels: { boxWidth: 10, font: { size: 10 } },
        },
      },
    },
  });

  // 3. SUBJECT INTENSITY
  const subjects = {};
  tasks.forEach((t) => (subjects[t.subject] = (subjects[t.subject] || 0) + 1));

  charts.subject = new Chart(document.getElementById("subjectChart"), {
    type: "bar",
    data: {
      labels: Object.keys(subjects),
      datasets: [
        {
          label: "Intensity",
          data: Object.values(subjects),
          backgroundColor: "#6366f1",
          borderRadius: 8,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, grid: { color: "rgba(148, 163, 184, 0.1)" } },
        x: { grid: { display: false } },
      },
      plugins: { legend: { display: false } },
    },
  });

  // Recommendations
  const feed = document.getElementById("insights");
  feed.innerHTML = "";
  const tips = [];
  if (percent < 50)
    tips.push({ icon: "⚡", text: "Momentum low. Focus on secure nodes." });
  const subNames = Object.keys(subjects);
  if (subNames.length > 0)
    tips.push({
      icon: "🎯",
      text: `High intensity detected in ${subNames[0]}.`,
    });

  feed.innerHTML = tips
    .map(
      (t) => `
    <li class="flex items-center gap-4 p-4 glass-card rounded-2xl border-indigo-500/10">
        <span class="text-xl">${t.icon}</span>
        <p class="text-[10px] font-black uppercase tracking-widest">${t.text}</p>
    </li>`,
    )
    .join("");
}
