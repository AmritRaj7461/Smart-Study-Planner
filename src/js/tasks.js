const taskForm = document.querySelector("form");
const taskTable = document.querySelector("tbody");
const subjectSelect = document.getElementById("task-subject");

let tasks = getData("tasks");
let subjects = getData("subjects");

// ---------- DATE HELPERS (LOCAL SAFE) ----------
function getLocalDate(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

// ---------- DEADLINE STATUS ----------
function getDeadlineStatus(deadline) {
  const today = getLocalDate();
  const taskDate = getLocalDate(deadline);
  const tomorrow = today + 24 * 60 * 60 * 1000;

  if (taskDate < today) return "overdue";
  if (taskDate === today) return "today";
  if (taskDate === tomorrow) return "tomorrow";
  return "upcoming";
}

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

// ---------- RENDER TASKS ----------
function renderTasks() {
  taskTable.innerHTML = "";

  tasks.forEach((task, index) => {
    const deadlineState =
      task.status === "Completed" ? null : getDeadlineStatus(task.deadline);

    let badge = "";
    let rowClass = "";

    if (deadlineState === "overdue") {
      badge = "Overdue";
      rowClass = "border-l-4 border-red-500";
    } else if (deadlineState === "today") {
      badge = "Due Today";
      rowClass = "border-l-4 border-orange-400";
    } else if (deadlineState === "tomorrow") {
      badge = "Due Tomorrow";
      rowClass = "border-l-4 border-yellow-400";
    }

    taskTable.innerHTML += `
      <tr class="border-b ${rowClass}">
        <td class="p-3">${task.title}</td>
        <td class="p-3">${task.subject}</td>
        <td class="p-3">${task.type}</td>
        <td class="p-3">
          ${task.deadline}
          ${
            badge
              ? `<span class="ml-2 text-xs px-2 py-1 rounded bg-gray-200 dark:bg-gray-700">
                  ${badge}
                </span>`
              : ""
          }
        </td>
        <td class="p-3">${task.status}</td>
        <td class="p-3">
          ${
            task.status === "Pending" && deadlineState !== "overdue"
              ? `<button onclick="markComplete(${index})"
                   class="text-green-600 hover:underline cursor-pointer">
                   Complete
                 </button>`
              : ""
          }
          <button onclick="deleteTask(${index})"
            class="text-red-500 ml-3 hover:underline cursor-pointer">
            Delete
          </button>
        </td>
      </tr>
    `;
  });

  saveData("tasks", tasks);
}

// ---------- ADD TASK ----------
taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = taskForm[0].value.trim();
  const subject = subjectSelect.value;
  const type = taskForm[2].value;
  const deadline = taskForm[3].value;

  if (!title || !subject || !type || !deadline) return;

  tasks.push({
    title,
    subject,
    type,
    deadline,
    status: "Pending"
  });

  saveData("tasks", tasks);
  taskForm.reset();
  renderTasks();
});

// ---------- ACTIONS ----------
function deleteTask(index) {
  tasks.splice(index, 1);
  saveData("tasks", tasks);
  renderTasks();
}

function markComplete(index) {
  if (getDeadlineStatus(tasks[index].deadline) === "overdue") return;
  tasks[index].status = "Completed";
  saveData("tasks", tasks);
  renderTasks();
}

// ---------- INIT ----------
loadSubjects();
renderTasks();
