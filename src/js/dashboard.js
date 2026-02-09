// ===============================
// DATE HELPERS (LOCAL SAFE)
// ===============================
function toLocalDateString(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(baseDate, days) {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + days);
  return toLocalDateString(d);
}

const TODAY = toLocalDateString();
const TOMORROW = addDays(new Date(), 1);

// ===============================
// WEEK HELPERS (FOR PROGRESS)
// ===============================
function getWeekRange() {
  const today = new Date();
  const day = today.getDay() || 7; // Sunday = 7
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return {
    start: toLocalDateString(monday),
    end: toLocalDateString(sunday)
  };
}

// ===============================
// FETCH DATA
// ===============================
const subjects = getData("subjects");
const tasks = getData("tasks");
const schedule = getData("schedule");

// ===============================
// DEADLINE ALERT LOGIC
// ===============================
function getDeadlineAlerts(tasks) {
  return tasks
    .filter(t => t.status !== "Completed")
    .map(task => {
      let level = null;

      if (task.deadline < TODAY) level = "overdue";
      else if (task.deadline === TODAY) level = "today";
      else if (task.deadline === TOMORROW) level = "tomorrow";

      if (!level) return null;

      return {
        title: task.title,
        subject: task.subject,
        deadline: task.deadline,
        level
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
}

const alerts = getDeadlineAlerts(tasks);

// ===============================
// DOM REFERENCES
// ===============================
const totalSubjectsEl = document.getElementById("total-subjects");
const todayTasksEl = document.getElementById("today-tasks");
const completedEl = document.getElementById("completed-tasks");
const pendingEl = document.getElementById("pending-tasks");

const todayScheduleList = document.getElementById("today-schedule");
const upcomingDeadlinesList = document.getElementById("upcoming-deadlines");
const alertBox = document.getElementById("dashboard-alerts");

const weeklyProgressText = document.getElementById("weekly-progress-text");
const weeklyProgressBar = document.getElementById("weekly-progress-bar");

// ===============================
// DASHBOARD STATS
// ===============================
const todaysTasks = tasks.filter(
  t => t.deadline === TODAY && t.status === "Pending"
);

const completedTasks = tasks.filter(t => t.status === "Completed");
const pendingTasks = tasks.filter(t => t.status === "Pending");

totalSubjectsEl.innerText = subjects.length;
todayTasksEl.innerText = todaysTasks.length;
completedEl.innerText = completedTasks.length;
pendingEl.innerText = pendingTasks.length;

// ===============================
// TODAY'S STUDY SCHEDULE
// ===============================
todayScheduleList.innerHTML = "";

const todaysSessions = schedule.filter(s => s.date === TODAY);

if (todaysSessions.length === 0) {
  todayScheduleList.innerHTML = `
    <li class="text-gray-500 dark:text-gray-400">
      No study sessions planned for today
    </li>
  `;
} else {
  todaysSessions.forEach(s => {
    todayScheduleList.innerHTML += `
      <li class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded">
        <span class="font-medium">${s.subject}</span>
        <span class="text-xs text-gray-500 dark:text-gray-400">
          ${s.start} – ${s.end}
        </span>
      </li>
    `;
  });
}

// ===============================
// UPCOMING DEADLINES (NON-URGENT)
// ===============================
upcomingDeadlinesList.innerHTML = "";

const upcoming = pendingTasks
  .filter(t => t.deadline > TODAY)
  .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  .slice(0, 3);

if (upcoming.length === 0) {
  upcomingDeadlinesList.innerHTML = `
    <li class="text-sm text-gray-500 dark:text-gray-400">
      🎉 No upcoming deadlines
    </li>
  `;
} else {
  upcoming.forEach(t => {
    upcomingDeadlinesList.innerHTML += `
      <li class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded">
        <span class="font-medium">${t.title}</span>
        <span class="text-xs text-red-400">${t.deadline}</span>
      </li>
    `;
  });
}

// ===============================
// URGENT ALERTS
// ===============================
alertBox.innerHTML = "";

if (alerts.length === 0) {
  alertBox.innerHTML = `
    <div class="bg-gray-800 p-4 rounded-xl text-gray-400">
      🎉 No urgent deadlines
    </div>
  `;
} else {
  alertBox.innerHTML = alerts.slice(0, 3).map(a => `
    <div class="flex justify-between items-center p-4 rounded-xl bg-gray-800">
      <div>
        <p class="font-medium">${a.title}</p>
        <p class="text-xs text-gray-400">${a.subject}</p>
      </div>
      <span class="text-xs px-2 py-1 rounded ${
        a.level === "overdue"
          ? "bg-red-600 text-white"
          : a.level === "today"
          ? "bg-orange-500 text-white"
          : "bg-yellow-400 text-black"
      }">
        ${
          a.level === "overdue"
            ? "Overdue"
            : a.level === "today"
            ? "Due Today"
            : "Due Tomorrow"
        }
      </span>
    </div>
  `).join("");
}

// ===============================
// WEEKLY PROGRESS (REAL LOGIC)
// ===============================
const week = getWeekRange();

const weeklyTasks = tasks.filter(
  t => t.deadline >= week.start && t.deadline <= week.end
);

const weeklyCompleted = weeklyTasks.filter(
  t => t.status === "Completed"
);

const weeklyTotal = weeklyTasks.length;
const weeklyDone = weeklyCompleted.length;

const progressPercent = weeklyTotal === 0
  ? 0
  : Math.round((weeklyDone / weeklyTotal) * 100);

if (weeklyProgressText && weeklyProgressBar) {
  weeklyProgressText.innerText = `${weeklyDone} / ${weeklyTotal} tasks`;
  weeklyProgressBar.style.width = `${progressPercent}%`;
}
