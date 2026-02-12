const taskForm = document.querySelector("form");
const taskGrid = document.getElementById("task-grid");
const completedGrid = document.getElementById("completed-grid");
const subjectSelect = document.getElementById("task-subject");
const taskCountEl = document.getElementById("task-count");

let tasks = getData("tasks");
let subjects = getData("subjects");

function getLocalDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function getDeadlineStatus(deadline) {
  const today = new Date(getLocalDateString()).getTime();
  const taskDate = new Date(deadline).getTime();
  const diff = (taskDate - today) / (1000 * 60 * 60 * 24);

  if (diff < 0)
    return { label: "Overdue", color: "text-rose-500 bg-rose-500/10" };
  if (diff === 0)
    return { label: "Today", color: "text-orange-500 bg-orange-500/10" };
  return {
    label: `In ${diff} Days`,
    color: "text-indigo-500 bg-indigo-500/10",
  };
}

function loadSubjects() {
  subjectSelect.innerHTML = `<option value="">Subject</option>`;
  subjects.forEach((sub) => {
    subjectSelect.innerHTML += `<option value="${sub.name}">${sub.name}</option>`;
  });
}

function renderTasks() {
  taskGrid.innerHTML = "";
  completedGrid.innerHTML = "";

  const activeTasks = tasks.filter((t) => t.status === "Pending");
  taskCountEl.innerText = activeTasks.length;

  tasks.forEach((task, index) => {
    const status = getDeadlineStatus(task.deadline);
    const isCompleted = task.status === "Completed";

    const cardHTML = `
      <div class="glass-card p-5 rounded-2xl flex flex-col justify-between reveal ${isCompleted ? "archive-card" : ""}" style="animation-delay: ${index * 0.05}s">
        <div>
          <div class="flex justify-between items-start mb-3">
            <span class="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${isCompleted ? "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400" : status.color}">
              ${isCompleted ? "Done" : status.label}
            </span>
            <span class="text-[9px] font-black uppercase text-slate-400 tracking-widest">${task.type}</span>
          </div>
          <h3 class="text-lg font-black leading-tight mb-1">${task.title}</h3>
          <p class="text-[11px] font-bold text-indigo-500 uppercase tracking-widest mb-4">${task.subject}</p>
        </div>
        
        <div class="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-white/5">
          <div class="text-[10px] font-bold text-slate-400">
            DUE: <span class="font-mono text-slate-600 dark:text-slate-300">${task.deadline}</span>
          </div>
          <div class="flex gap-2">
            ${
              !isCompleted
                ? `
              <button onclick="markComplete(${index})" class="btn-complete p-2 rounded-lg transition-all active:scale-90" title="Complete">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              </button>`
                : ""
            }
            <button onclick="deleteTask(${index})" class="btn-delete p-2 rounded-lg transition-all active:scale-90" title="Delete">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    `;

    if (isCompleted) completedGrid.innerHTML += cardHTML;
    else taskGrid.innerHTML += cardHTML;
  });
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = taskForm[0].value.trim();
  const subject = subjectSelect.value;
  const type = taskForm[2].value;
  const deadline = taskForm[3].value;

  if (!title || !subject || !deadline) return;

  tasks.push({ title, subject, type, deadline, status: "Pending" });
  saveData("tasks", tasks);
  taskForm.reset();
  renderTasks();
});

function deleteTask(index) {
  if (confirm("Delete this task?")) {
    tasks.splice(index, 1);
    saveData("tasks", tasks);
    renderTasks();
  }
}

function markComplete(index) {
  tasks[index].status = "Completed";
  saveData("tasks", tasks);
  renderTasks();
}

loadSubjects();
renderTasks();
