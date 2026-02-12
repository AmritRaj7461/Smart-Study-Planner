const subjectForm = document.querySelector("form");
const subjectGrid = document.getElementById("subject-grid");
const formTitle = document.getElementById("form-title");
const subjectCountEl = document.getElementById("subject-count");

let subjects = getData("subjects");
let editIndex = null;

// ---------- RENDER (GRID BASED) ----------
function renderSubjects() {
  subjectGrid.innerHTML = "";
  subjectCountEl.innerText = `${subjects.length} Subject${subjects.length !== 1 ? "s" : ""}`;

  if (subjects.length === 0) {
    subjectGrid.innerHTML = `
            <div class="col-span-full py-20 text-center glass-card rounded-[2rem] opacity-50">
                <p class="italic text-slate-500">No subjects added yet. Start by filling the form above!</p>
            </div>`;
    return;
  }

  subjects.forEach((sub, index) => {
    // Priority Color Logic
    const pColor =
      sub.priority === "High"
        ? "text-rose-400 bg-rose-400/10 border-rose-400/20"
        : sub.priority === "Medium"
          ? "text-amber-400 bg-amber-400/10 border-amber-400/20"
          : "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";

    subjectGrid.innerHTML += `
            <div class="subject-card glass-card p-6 rounded-[2rem] reveal" style="animation-delay: ${index * 0.05}s">
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${pColor}">
                        ${sub.priority}
                    </span>
                    <div class="flex gap-2">
                        <button onclick="editSubject(${index})" class="p-2 hover:bg-white/10 rounded-xl text-indigo-400 transition-colors">
                            ✏️
                        </button>
                        <button onclick="deleteSubject(${index})" class="p-2 hover:bg-rose-500/10 rounded-xl text-rose-400 transition-colors">
                            🗑️
                        </button>
                    </div>
                </div>
                <h3 class="text-xl font-bold text-white mb-2">${sub.name}</h3>
                <div class="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div class="bg-indigo-500 h-full" style="width: 30%"></div>
                </div>
                <p class="text-[10px] text-slate-500 mt-3 font-bold uppercase tracking-tighter">Performance Level: Normal</p>
            </div>
        `;
  });
}

// ---------- ADD / UPDATE ----------
subjectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = subjectForm[0].value.trim();
  const priority = subjectForm[1].value;

  if (!name || !priority) {
    alert("Please provide both subject name and priority.");
    return;
  }

  const duplicate = subjects.some(
    (s, i) => s.name.toLowerCase() === name.toLowerCase() && i !== editIndex,
  );

  if (duplicate) {
    alert("Subject already exists.");
    return;
  }

  if (editIndex === null) {
    subjects.push({ name, priority });
  } else {
    subjects[editIndex] = { name, priority };
    editIndex = null;
    formTitle.innerHTML = `<span class="w-2 h-6 bg-indigo-500 rounded-full"></span> Add New Subject`;
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
  formTitle.innerHTML = `<span class="w-2 h-6 bg-amber-500 rounded-full"></span> Editing: ${subjects[index].name}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- DELETE ----------
function deleteSubject(index) {
  if (
    !confirm(
      "Delete this subject? This will not remove associated tasks automatically.",
    )
  )
    return;

  subjects.splice(index, 1);
  saveData("subjects", subjects);
  renderSubjects();
}

// ---------- INIT ----------
renderSubjects();
