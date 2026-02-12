/**
 * Settings Controller - Nexus v1.0.1
 */

document.addEventListener("DOMContentLoaded", () => {
  updateStorageCounts();
  startTimeSync();
});

// ---------- DYNAMIC IST CLOCK ----------
function startTimeSync() {
  const timeEl = document.getElementById("system-time");

  const updateTime = () => {
    const now = new Date();
    const istTime = now.toLocaleTimeString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
    timeEl.innerText = `SYNC: ${istTime}`;
  };

  updateTime();
  setInterval(updateTime, 1000);
}

// ---------- STORAGE COUNTS ----------
function updateStorageCounts() {
  const subjects = getData("subjects") || [];
  const tasks = getData("tasks") || [];
  const schedule = getData("schedule") || [];

  document.getElementById("subject-count").innerText = subjects.length;
  document.getElementById("task-count").innerText = tasks.length;
  document.getElementById("schedule-count").innerText = schedule.length;
}

// ---------- RESET DATA ----------
document.getElementById("resetData").addEventListener("click", () => {
  const confirmReset = confirm(
    "CRITICAL SYSTEM ALERT:\n\nThis will trigger a full database purge. Every task, subject, and schedule entry will be permanently destroyed.\n\nProceed with Purge?",
  );

  if (!confirmReset) return;

  localStorage.clear();
  location.reload();
});

// ---------- DOWNLOAD DATA ----------
document.getElementById("downloadData").addEventListener("click", () => {
  const data = {
    subjects: getData("subjects") || [],
    tasks: getData("tasks") || [],
    schedule: getData("schedule") || [],
    meta: {
      app: "Smart Study Planner",
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    },
  };

  const blob = new Blob([JSON.stringify(data, null, 4)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");

  const d = new Date();
  const dateStr = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;

  a.href = url;
  a.download = `nexus_backup_${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
