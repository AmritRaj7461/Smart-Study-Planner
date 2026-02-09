const tasks = getData("tasks");

// ---------- BASIC STATS ----------
const total = tasks.length;
const completed = tasks.filter(t => t.status === "Completed").length;
const pending = tasks.filter(t => t.status === "Pending").length;

// DOM
document.getElementById("total-tasks").innerText = total;
document.getElementById("completed-tasks").innerText = completed;
document.getElementById("pending-tasks").innerText = pending;

// ---------- OVERALL PROGRESS ----------
const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
document.getElementById("progress-bar").style.width = percent + "%";
document.getElementById("progress-text").innerText =
  `${percent}% of tasks completed`;

// ---------- TASK STATUS CHART ----------
new Chart(document.getElementById("statusChart"), {
  type: "doughnut",
  data: {
    labels: ["Completed", "Pending"],
    datasets: [{
      data: [completed, pending],
      backgroundColor: ["#22c55e", "#ef4444"],
      borderWidth: 2
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: { legend: { position: "top" } }
  }
});

// ---------- TASK TYPE CHART ----------
const typeCount = {};
tasks.forEach(t => {
  typeCount[t.type] = (typeCount[t.type] || 0) + 1;
});

new Chart(document.getElementById("typeChart"), {
  type: "pie",
  data: {
    labels: Object.keys(typeCount),
    datasets: [{
      data: Object.values(typeCount),
      backgroundColor: ["#6366f1", "#f97316", "#06b6d4"]
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: "top" } }
  }
});

// ---------- SUBJECT WORKLOAD ----------
const subjectCount = {};
tasks.forEach(t => {
  subjectCount[t.subject] = (subjectCount[t.subject] || 0) + 1;
});

new Chart(document.getElementById("subjectChart"), {
  type: "bar",
  data: {
    labels: Object.keys(subjectCount),
    datasets: [{
      label: "Tasks",
      data: Object.values(subjectCount),
      backgroundColor: "#6366f1",
      borderRadius: 8
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: { stepSize: 1 }
      }
    },
    plugins: { legend: { display: false } }
  }
});

// ---------- SMART INSIGHTS ----------
const insights = document.getElementById("insights");
insights.innerHTML = "";

if (percent < 40)
  insights.innerHTML += `<li>⚠ Productivity is low. Try completing smaller tasks first.</li>`;

const pendingExams = tasks.filter(
  t => t.type === "Exam" && t.status === "Pending"
).length;

if (pendingExams)
  insights.innerHTML += `<li>📚 You have ${pendingExams} pending exam(s). Prioritize revision.</li>`;

const maxSubject = Object.entries(subjectCount)
  .sort((a, b) => b[1] - a[1])[0];

if (maxSubject)
  insights.innerHTML += `<li>📌 <b>${maxSubject[0]}</b> has the highest workload (${maxSubject[1]} tasks).</li>`;

if (!insights.innerHTML)
  insights.innerHTML = `<li>🎯 Great consistency! Keep going.</li>`;
