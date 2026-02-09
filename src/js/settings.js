// ---------- STORAGE COUNTS ----------
document.getElementById("subject-count").innerText =
  getData("subjects").length;

document.getElementById("task-count").innerText =
  getData("tasks").length;

document.getElementById("schedule-count").innerText =
  getData("schedule").length;

// ---------- RESET DATA ----------
document.getElementById("resetData").addEventListener("click", () => {
  const confirmReset = confirm(
    "This will permanently delete all your data.\n\nDo you want to continue?"
  );

  if (!confirmReset) return;

  localStorage.clear();
  location.reload();
});
