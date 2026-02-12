/**
 * Advanced Schedule Engine
 * Enhanced Visibility & Per-Subject Coloring
 */

const scheduleForm = document.querySelector("form");
const scheduleList = document.getElementById("schedule-list");
const subjectSelect = document.getElementById("subject-select");
const daySelect = document.getElementById("day-select");
const gridHeader = document.getElementById("grid-header");
const gridBody = document.getElementById("dynamic-grid-body");
const errorBox = document.getElementById("time-error");

let schedule = getData("schedule");
let subjects = getData("subjects");

// ---------- HELPERS ----------

function getTodayDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function getDateFromDayName(dayName) {
  const daysOrder = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const targetIdx = daysOrder.indexOf(dayName);
  const today = new Date();
  const currentIdx = today.getDay();
  const diff = targetIdx - currentIdx;
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + diff);
  return `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, "0")}-${String(targetDate.getDate()).padStart(2, "0")}`;
}

function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  });
}

function getSubjectColor(subjectName) {
  const colors = [
    "#6366f1",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#8b5cf6",
    "#ef4444",
    "#06b6d4",
  ];
  let hash = 0;
  for (let i = 0; i < subjectName.length; i++) {
    hash = subjectName.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ---------- RENDER ENGINE ----------

function renderEverything() {
  renderDailyList();
  renderWeeklyMatrix();
}

function renderDailyList() {
  scheduleList.innerHTML = "";
  const today = getTodayDate();
  const todaysSessions = schedule.filter((s) => s.date === today);
  document.getElementById("focus-day-title").innerText =
    `Focus: ${new Date().toLocaleDateString("en-IN", { weekday: "long" })}`;

  if (todaysSessions.length === 0) {
    scheduleList.innerHTML = `<div class="col-span-full py-10 glass-card rounded-2xl text-center opacity-30 italic text-xs font-bold uppercase">No sessions for today</div>`;
    return;
  }

  todaysSessions.forEach((s, i) => {
    scheduleList.innerHTML += `
            <li class="glass-card p-5 rounded-2xl flex justify-between items-center reveal group shadow-lg" style="animation-delay: ${i * 0.1}s">
                <div><h3 class="font-black text-lg">${s.subject}</h3><p class="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">${s.start} - ${s.end}</p></div>
                <button onclick="removeSession('${s.date}', '${s.start}', '${s.end}')" class="p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-50 hover:text-white transition-all">🗑️</button>
            </li>`;
  });
}

function renderWeeklyMatrix() {
  const weekDates = getWeekDates();
  const daysLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  gridHeader.innerHTML = `<div class="time-header p-4">Time</div>`;
  daysLabels.forEach((label, i) => {
    const isToday = weekDates[i] === getTodayDate();
    gridHeader.innerHTML += `<div class="p-4 flex flex-col items-center justify-center border-r border-gray-200 dark:border-gray-700 ${isToday ? "bg-indigo-50 dark:bg-indigo-900/30" : ""}"><span class="day-label">${label}</span></div>`;
  });

  const activeHours = [
    ...new Set(schedule.map((s) => parseInt(s.start.split(":")[0]))),
  ].sort((a, b) => a - b);
  gridBody.innerHTML = "";

  if (activeHours.length === 0) {
    gridBody.innerHTML = `<div class="p-16 text-center text-slate-400 italic font-medium">Add sessions to generate your weekly matrix.</div>`;
    return;
  }

  activeHours.forEach((hour) => {
    const timeLabel =
      hour >= 12 ? (hour === 12 ? "12 PM" : `${hour - 12} PM`) : `${hour} AM`;
    let rowContent = `<div class="time-cell">${timeLabel}</div>`;

    weekDates.forEach((dateString) => {
      const session = schedule.find(
        (s) =>
          s.date === dateString && parseInt(s.start.split(":")[0]) === hour,
      );
      if (session) {
        const borderCol = getSubjectColor(session.subject);
        rowContent += `
                    <div class="grid-slot active-slot">
                        <div class="subject-timetable-card" style="border-left: 5px solid ${borderCol}">
                            <p class="subject-name">${session.subject}</p>
                            <p class="subject-time">${session.start} - ${session.end}</p>
                        </div>
                    </div>`;
      } else {
        rowContent += `<div class="grid-slot"></div>`;
      }
    });
    gridBody.innerHTML += `<div class="dynamic-row">${rowContent}</div>`;
  });
}

// ---------- FORM HANDLERS ----------

scheduleForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const dayName = daySelect.value;
  const date = getDateFromDayName(dayName);
  const subject = subjectSelect.value;
  const start = scheduleForm.elements[2].value;
  const end = scheduleForm.elements[3].value;

  if (!subject || !start || !end) return;
  if (end <= start) {
    errorBox.classList.remove("hidden");
    return;
  }

  schedule.push({ subject, start, end, date });
  saveData("schedule", schedule);
  scheduleForm.reset();
  renderEverything();
});

function removeSession(date, start, end) {
  schedule = schedule.filter(
    (s) => !(s.date === date && s.start === start && s.end === end),
  );
  saveData("schedule", schedule);
  renderEverything();
}

function loadSubjects() {
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;
  subjects.forEach((sub) => {
    subjectSelect.innerHTML += `<option value="${sub.name}">${sub.name}</option>`;
  });
}

loadSubjects();
renderEverything();
