const taskForm = document.querySelector("form");
const taskTable = document.querySelector("tbody");

let tasks = getData("tasks");

function renderTasks() {
  taskTable.innerHTML = "";
  tasks.forEach((task, index) => {
    taskTable.innerHTML += `
      <tr class="border-b">
        <td class="p-3">${task.title}</td>
        <td class="p-3">${task.subject}</td>
        <td class="p-3">${task.type}</td>
        <td class="p-3">${task.deadline}</td>
        <td class="p-3">${task.status}</td>
        <td class="p-3">
          <button onclick="completeTask(${index})" class="text-green-600">Done</button>
          <button onclick="deleteTask(${index})" class="text-red-500 ml-2">Delete</button>
        </td>
      </tr>
    `;
  });
}

taskForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = taskForm[0].value;
  const subject = taskForm[1].value;
  const type = taskForm[2].value;
  const deadline = taskForm[3].value;

  if (!title || !subject || !type || !deadline) return;

  tasks.push({
    title,
    subject,
    type,
    deadline,
    status: "Pending",
  });

  saveData("tasks", tasks);
  taskForm.reset();
  renderTasks();
});

function completeTask(index) {
  tasks[index].status = "Completed";
  saveData("tasks", tasks);
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveData("tasks", tasks);
  renderTasks();
}

renderTasks();
