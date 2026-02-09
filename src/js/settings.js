// Preferences
const notificationCheckbox = document.getElementById("notifications");

if (localStorage.getItem("notifications") === "true") {
  notificationCheckbox.checked = true;
}

notificationCheckbox.addEventListener("change", () => {
  localStorage.setItem("notifications", notificationCheckbox.checked);
});

// Export Data
document.getElementById("exportData").addEventListener("click", () => {
  const data = {
    subjects: JSON.parse(localStorage.getItem("subjects")) || [],
    tasks: JSON.parse(localStorage.getItem("tasks")) || [],
    schedule: JSON.parse(localStorage.getItem("schedule")) || [],
    preferences: {
      theme: localStorage.getItem("theme") || "light",
      notifications: localStorage.getItem("notifications") || "false",
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "smart-study-planner-data.json";
  a.click();
  URL.revokeObjectURL(url);
});

// Reset Data
document.getElementById("resetData").addEventListener("click", () => {
  if (confirm("Are you sure you want to reset all data?")) {
    localStorage.clear();
    location.reload();
  }
});
