const tasks = getData("tasks");

// DOM
const totalEl = document.getElementById("total-tasks");
const completedEl = document.getElementById("completed-tasks");
const pendingEl = document.getElementById("pending-tasks");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const insightsList = document.getElementById("insights");

// Stats
const total = tasks.length;
const completed = tasks.filter(t => t.status === "Completed").length;
const pending = tasks.filter(t => t.status === "Pending").length;

totalEl.innerText = total;
completedEl.innerText = completed;
pendingEl.innerText = pending;

// Progress %
const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
progressBar.style.width = percentage + "%";
progressText.innerText = `${percentage}% of tasks completed`;

// Insights
insightsList.innerHTML = "";

if (total === 0) {
  insightsList.innerHTML += `
    <li>📭 No tasks added yet. Start by creating tasks.</li>
  `;
}

if (completed > pending) {
  insightsList.innerHTML += `
    <li>✅ Great job! You’ve completed most of your tasks.</li>
  `;
}

if (pending > 0) {
  insightsList.innerHTML += `
    <li>⚠ You have ${pending} pending task(s). Try to complete them soon.</li>
  `;
}

const exams = tasks.filter(t => t.type === "Exam" && t.status === "Pending");
if (exams.length > 0) {
  insightsList.innerHTML += `
    <li>📚 You have ${exams.length} upcoming exam(s). Plan revision time.</li>
  `;
}

if (insightsList.innerHTML === "") {
  insightsList.innerHTML = `<li>🎯 Keep going! You’re on track.</li>`;
}
