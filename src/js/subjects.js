const subjectForm = document.querySelector("form");
const subjectTable = document.getElementById("subject-table");
const formTitle = document.getElementById("form-title");

let subjects = getData("subjects");
let editIndex = null;

// ---------- RENDER ----------
function renderSubjects() {
  subjectTable.innerHTML = "";

  subjects.forEach((sub, index) => {
    subjectTable.innerHTML += `
      <tr class="border-b">
        <td class="p-3">${sub.name}</td>
        <td class="p-3">${sub.priority}</td>
        <td class="p-3 space-x-3">
          <button
            onclick="editSubject(${index})"
            class="text-indigo-600 hover:underline cursor-pointer">
            Edit
          </button>
          <button
            onclick="deleteSubject(${index})"
            class="text-red-500 hover:underline cursor-pointer">
            Delete
          </button>
        </td>
      </tr>
    `;
  });
}

// ---------- ADD / UPDATE ----------
subjectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = subjectForm[0].value.trim();
  const priority = subjectForm[1].value;

  if (!name || !priority) return;

  // ❌ Duplicate check
  const duplicate = subjects.some(
    (s, i) =>
      s.name.toLowerCase() === name.toLowerCase() &&
      i !== editIndex
  );

  if (duplicate) {
    alert("Subject already exists.");
    return;
  }

  if (editIndex === null) {
    // ADD
    subjects.push({ name, priority });
  } else {
    // UPDATE
    subjects[editIndex] = { name, priority };
    editIndex = null;
    formTitle.innerText = "Add Subject";
  }

  saveData("subjects", subjects);
  subjectForm.reset();
  renderSubjects();
});

// ---------- EDIT ----------
function editSubject(index) {
  subjectForm[0].value = subjects[index].name;
  subjectForm[1].value = subjects[index].priority;

  editIndex = index;
  formTitle.innerText = "Edit Subject";
}

// ---------- DELETE ----------
function deleteSubject(index) {
  if (!confirm("Delete this subject?")) return;

  subjects.splice(index, 1);
  saveData("subjects", subjects);
  renderSubjects();
}

// ---------- INIT ----------
renderSubjects();
