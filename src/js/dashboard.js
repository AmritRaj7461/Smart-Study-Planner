// ---------- HELPERS ----------
function getTodayDate() {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0")
  );
}

// ---------- FETCH DATA ----------
const subjects = getData("subjects");
const tasks = getData("tasks");
const schedule = getData("schedule");

// ---------- DOM REFERENCES ----------
const totalSubjectsEl = document.getElementById("total-subjects");
const todayTasksEl = document.getElementById("today-tasks");
const completedEl = document.getElementById("completed-tasks");
const pendingEl = document.getElementById("pending-tasks");

const todayScheduleList = document.getElementById("today-schedule");
const upcomingDeadlinesList = document.getElementById("upcoming-deadlines");

// ---------- DASHBOARD CARDS ----------
const today = getTodayDate();

const todaysTasks = tasks.filter(
  t => t.deadline === today && t.status === "Pending"
);

const completedTasks = tasks.filter(t => t.status === "Completed");
const pendingTasks = tasks.filter(t => t.status === "Pending");

totalSubjectsEl.innerText = subjects.length;
todayTasksEl.innerText = todaysTasks.length;
completedEl.innerText = completedTasks.length;
pendingEl.innerText = pendingTasks.length;

// ---------- TODAY'S ACADEMIC SCHEDULE ----------
todayScheduleList.innerHTML = "";

const todaysSessions = schedule.filter(s => s.date === today);

if (todaysSessions.length === 0) {
  todayScheduleList.innerHTML = `
    <li class="text-gray-500">No study sessions planned for today</li>
  `;
} else {
  todaysSessions.forEach(s => {
    todayScheduleList.innerHTML += `
      <li class="flex justify-between text-gray-700">
        <span>${s.subject}</span>
        <span>${s.start} – ${s.end}</span>
      </li>
    `;
  });
}

// ---------- UPCOMING DEADLINES ----------
upcomingDeadlinesList.innerHTML = "";

const upcoming = pendingTasks
  .filter(t => t.deadline >= today)
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 3);

if (upcoming.length === 0) {
  upcomingDeadlinesList.innerHTML = `
    <li class="text-gray-500">No upcoming deadlines 🎉</li>
  `;
} else {
  upcoming.forEach(t => {
    upcomingDeadlinesList.innerHTML += `
      <li class="flex justify-between text-gray-700">
        <span>${t.title}</span>
        <span class="text-red-500">${t.deadline}</span>
      </li>
    `;
  });
}
