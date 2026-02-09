const subjectForm = document.querySelector("form");
const subjectTable = document.querySelector("tbody");

let subjects = getData("subjects");

function renderSubjects() {
  subjectTable.innerHTML = "";
  subjects.forEach((sub, index) => {
    subjectTable.innerHTML += `
      <tr class="border-b">
        <td class="p-3">${sub.name}</td>
        <td class="p-3">${sub.priority}</td>
        <td class="p-3">
          <button onclick="deleteSubject(${index})" class="text-red-500">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

subjectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = subjectForm[0].value;
  const priority = subjectForm[1].value;

  if (!name || !priority) return;

  subjects.push({ name, priority });
  saveData("subjects", subjects);

  subjectForm.reset();
  renderSubjects();
});

function deleteSubject(index) {
  subjects.splice(index, 1);
  saveData("subjects", subjects);
  renderSubjects();
}

renderSubjects();
