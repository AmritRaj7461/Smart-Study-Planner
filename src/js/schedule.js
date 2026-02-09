const scheduleForm = document.querySelector("form");
const scheduleList = document.getElementById("schedule-list");
const subjectSelect = document.getElementById("subject-select");
const dateInput = document.getElementById("schedule-date");
const weeklyContainer = document.getElementById("weekly-schedule");
const errorBox = document.getElementById("time-error");

let schedule = getData("schedule");
let subjects = getData("subjects");

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

// set default date safely
dateInput.value = getTodayDate();

// ---------- LOAD SUBJECTS ----------
function loadSubjects() {
  subjectSelect.innerHTML = `<option value="">Select Subject</option>`;

  if (subjects.length === 0) {
    subjectSelect.innerHTML += `<option disabled>No subjects added</option>`;
    return;
  }

  subjects.forEach(sub => {
    subjectSelect.innerHTML += `
      <option value="${sub.name}">
        ${sub.name} (${sub.priority})
      </option>
    `;
  });
}

// ---------- RENDER DAILY SCHEDULE ----------
function renderSchedule() {
  scheduleList.innerHTML = "";

  const selectedDate = dateInput.value || getTodayDate();
  const todaysSessions = schedule.filter(s => s.date === selectedDate);

  if (todaysSessions.length === 0) {
    scheduleList.innerHTML = `
      <li class="text-gray-500 dark:text-gray-400">
        No study sessions planned for this day
      </li>
    `;
    return;
  }

  todaysSessions.forEach(item => {
    scheduleList.innerHTML += `
      <li class="flex justify-between items-center bg-gray-50 dark:bg-gray-700 p-4 rounded-xl">
        <div>
          <p class="font-medium">${item.subject}</p>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            ${item.start} – ${item.end}
          </p>
        </div>
        <button
          onclick="removeSession('${item.date}', '${item.start}', '${item.end}')"
          class="text-red-500 hover:underline cursor-pointer">
          Remove
        </button>
      </li>
    `;
  });
}

// ---------- FORM SUBMIT ----------
scheduleForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const date = dateInput.value;
  const subject = subjectSelect.value;
  const start = scheduleForm[2].value;
  const end = scheduleForm[3].value;

  errorBox.classList.add("hidden");

  if (!date || !subject || !start || !end) {
    errorBox.textContent = "Please fill all fields.";
    errorBox.classList.remove("hidden");
    return;
  }

  if (end <= start) {
    errorBox.textContent = "End time must be later than start time.";
    errorBox.classList.remove("hidden");
    return;
  }

  const hasConflict = schedule.some(
    s => s.date === date && start < s.end && end > s.start
  );

  if (hasConflict) {
    errorBox.textContent = "This time slot conflicts with another session.";
    errorBox.classList.remove("hidden");
    return;
  }

  schedule.push({ subject, start, end, date });

  saveData("schedule", schedule);
  scheduleForm.reset();
  dateInput.value = getTodayDate();

  renderSchedule();
  renderWeeklySchedule();
});

// ---------- REMOVE SESSION ----------
function removeSession(date, start, end) {
  schedule = schedule.filter(
    s => !(s.date === date && s.start === start && s.end === end)
  );

  saveData("schedule", schedule);
  renderSchedule();
  renderWeeklySchedule();
}

// ---------- WEEK HELPERS ----------
function getWeekDates() {
  const today = new Date();
  const day = today.getDay();
  const diff = today.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(today.setDate(diff));

  const week = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d.toISOString().split("T")[0]);
  }
  return week;
}

function getDayLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short"
  });
}

// ---------- RENDER WEEK ----------
function renderWeeklySchedule() {
  weeklyContainer.innerHTML = "";

  const weekDates = getWeekDates();
  const today = getTodayDate();

  weekDates.forEach(date => {
    const sessions = schedule.filter(s => s.date === date);

    weeklyContainer.innerHTML += `
      <div class="border rounded-xl p-3 ${
        date === today
          ? "bg-indigo-50 dark:bg-indigo-900 border-indigo-400"
          : "bg-gray-50 dark:bg-gray-700"
      }">
        <h3 class="font-semibold mb-2 text-center">
          ${getDayLabel(date)}
        </h3>

        ${
          sessions.length === 0
            ? `<p class="text-sm text-gray-500 dark:text-gray-400 text-center">
                 No sessions
               </p>`
            : sessions
                .map(
                  s => `
                    <div class="text-sm mb-2">
                      <p class="font-medium">${s.subject}</p>
                      <p class="text-gray-500 dark:text-gray-400">
                        ${s.start} – ${s.end}
                      </p>
                    </div>
                  `
                )
                .join("")
        }
      </div>
    `;
  });
}

// ---------- INIT ----------
loadSubjects();
renderSchedule();
renderWeeklySchedule();
