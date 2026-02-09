const scheduleForm = document.querySelector("form");
const scheduleList = document.getElementById("schedule-list");

let schedule = getData("schedule");

// Helper: today
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

function renderSchedule() {
  scheduleList.innerHTML = "";

  const today = getTodayDate();
  const todaysSessions = schedule.filter(s => s.date === today);

  if (todaysSessions.length === 0) {
    scheduleList.innerHTML = `
      <li class="text-gray-500 dark:text-gray-400">
        No study sessions planned for today
      </li>
    `;
    return;
  }

  todaysSessions.forEach((item) => {
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
          class="text-red-500 hover:underline">
          Remove
        </button>
      </li>
    `;
  });
}

scheduleForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const subject = scheduleForm[0].value.trim();
  const start = scheduleForm[1].value;
  const end = scheduleForm[2].value;

  if (!subject || !start || !end) return;

  schedule.push({
    subject,
    start,
    end,
    date: getTodayDate()
  });

  saveData("schedule", schedule);
  scheduleForm.reset();
  renderSchedule();
});

function removeSession(date, start, end) {
  schedule = schedule.filter(
    s => !(s.date === date && s.start === start && s.end === end)
  );
  saveData("schedule", schedule);
  renderSchedule();
}

renderSchedule();
