/**
 * Nexus Intelligence Hub - Fully Synchronized Controller
 * Feature: Adaptive Time-Period Titles (Scholar/Strategist/Genius)
 * Final Update: 2026-02-13 | 04:20 AM IST
 */

document.addEventListener("DOMContentLoaded", () => {
  initISTClock();
  renderIntelligenceHub();

  // Preserve high-end reveal animation
  document.querySelectorAll(".reveal").forEach((el, i) => {
    el.style.animationDelay = `${(i + 1) * 0.1}s`;
  });
});

/**
 * 1. ADAPTIVE GREETING LOGIC
 * Rotates titles based on IST hour for academic variety
 */
function getGreeting() {
  const hour = new Date().getHours();
  let greet = "";
  let title = "";

  if (hour < 12) {
    greet = "Good Morning";
    title = "Scholar"; // Focus title for morning
  } else if (hour < 17) {
    greet = "Good Afternoon";
    title = "Strategist"; // Management title for afternoon
  } else {
    greet = "Good Evening";
    title = "Genius"; // Mastery title for evening
  }

  return `${greet}, <span class="text-indigo-600 dark:text-indigo-400">${title}</span>`;
}

/**
 * 2. HIGH-PRECISION IST CLOCK
 */
function initISTClock() {
  const clock = document.getElementById("ist-clock");
  const update = () => {
    const now = new Date();
    const istString = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
    if (clock) clock.innerText = istString.toUpperCase() + " IST";
  };
  setInterval(update, 1000);
  update();
}

/**
 * 3. MAIN INTELLIGENCE HUB
 */
function renderIntelligenceHub() {
  const tasks = getData("tasks") || [];
  const subjects = getData("subjects") || [];
  const schedule = getData("schedule") || [];

  // --- A. ADAPTIVE GREETING INJECTION ---
  const greetingEl = document.getElementById("greeting-text");
  if (greetingEl) greetingEl.innerHTML = getGreeting();

  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // --- B. CALCULATIONS ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (t) => t.status === "Completed" || t.status === "Done",
  );
  const overdueTasks = tasks.filter(
    (t) =>
      t.status !== "Completed" && t.status !== "Done" && t.deadline < todayStr,
  );
  const percent =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks.length / totalTasks) * 100);

  // --- C. CORE STAT INJECTION ---
  const elements = {
    subjects: document.getElementById("subject-count-dash"),
    workload: document.getElementById("total-tasks-dash"),
    secured: document.getElementById("completed-count-dash"),
    active: document.getElementById("pending-count-dash"),
    percent: document.getElementById("percent-label"),
  };

  if (elements.subjects) elements.subjects.innerText = subjects.length;
  if (elements.workload) elements.workload.innerText = totalTasks;
  if (elements.secured) elements.secured.innerText = completedTasks.length;
  if (elements.active)
    elements.active.innerText = totalTasks - completedTasks.length;
  if (elements.percent) elements.percent.innerText = `${percent}%`;

  // --- D. VELOCITY RING ANIMATION ---
  const ring = document.getElementById("progress-ring");
  const circumference = 471;
  if (ring) {
    ring.style.strokeDashoffset =
      circumference - (percent / 100) * circumference;
  }

  // --- E. SYSTEM ANALYTICS LOGIC ---
  const insightEl = document.getElementById("momentum-insight");
  if (insightEl) {
    if (overdueTasks.length > 5) {
      insightEl.innerText = `CRITICAL OVERLOAD: ${overdueTasks.length} OVERDUE`;
      insightEl.className = "text-rose-500 animate-pulse font-black";
    } else if (totalTasks === 0) {
      insightEl.innerText = "STANDBY: ADD MODULES";
      insightEl.className = "text-indigo-500 font-black";
    } else if (percent >= 75) {
      insightEl.innerText = "PEAK PERFORMANCE";
      insightEl.className = "text-emerald-500 font-black";
    } else {
      insightEl.innerText = "SYSTEM READY: OPTIMIZING";
      insightEl.className = "text-indigo-500 font-black";
    }
  }

  // --- F. COMPONENT RENDERING ---
  renderAlerts(overdueTasks);
  renderList(schedule, todayStr, "today-schedule", "SESSIONS");
  renderDeadlines(tasks, todayStr, "upcoming-deadlines");
}

/**
 * 4. COMPONENT RENDERERS
 */
function renderAlerts(overdueTasks) {
  const alertBox = document.getElementById("dashboard-alerts");
  if (!alertBox) return;

  if (overdueTasks.length > 0) {
    alertBox.innerHTML = overdueTasks
      .slice(0, 3)
      .map(
        (a) => `
            <div class="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/10 group hover:bg-rose-500/20 transition-all">
                <span class="text-[10px] font-black text-rose-500 uppercase tracking-wide truncate pr-4">${a.title}</span>
                <span class="text-[8px] font-black bg-rose-600 text-white px-2 py-1 rounded-full uppercase tracking-tighter">LATE</span>
            </div>`,
      )
      .join("");
  } else {
    alertBox.innerHTML = `
            <div class="flex flex-col items-center justify-center py-10 opacity-40">
                <div class="w-12 h-12 mb-3 bg-slate-500/10 rounded-full flex items-center justify-center">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="text-slate-500">
                        <path d="M20 6L9 17l-5-5" />
                    </svg>
                </div>
                <p class="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">System Nominal</p>
            </div>`;
  }
}

function renderList(schedule, todayStr, elementId, type) {
  const sessionList = document.getElementById(elementId);
  const todaysSessions = schedule.filter((s) => s.date === todayStr);

  if (sessionList) {
    sessionList.innerHTML = todaysSessions.length
      ? todaysSessions
          .map(
            (s) => `
            <li class="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 flex justify-between items-center group">
                <div class="flex items-center gap-5">
                    <div class="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 font-black text-lg uppercase">${s.subject.charAt(0)}</div>
                    <div>
                        <p class="font-black text-md text-slate-800 dark:text-white uppercase">${s.subject}</p>
                        <p class="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">${s.start} — ${s.end}</p>
                    </div>
                </div>
                <div class="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1] animate-pulse"></div>
            </li>`,
          )
          .join("")
      : `<div class="py-8 text-center opacity-30 text-xs font-black uppercase tracking-widest italic">No active ${type} today</div>`;
  }
}

function renderDeadlines(tasks, todayStr, elementId) {
  const deadlineList = document.getElementById(elementId);
  const approaching = tasks
    .filter(
      (t) =>
        t.status !== "Completed" &&
        t.status !== "Done" &&
        t.deadline >= todayStr,
    )
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 3);

  if (deadlineList) {
    deadlineList.innerHTML = approaching.length
      ? approaching
          .map(
            (t) => `
            <li class="flex justify-between items-center p-5 rounded-2xl bg-gray-50 dark:bg-slate-800/40 border border-black/5 dark:border-white/5">
                <div class="flex flex-col">
                    <span class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">${t.subject}</span>
                    <span class="text-sm font-black text-slate-800 dark:text-white uppercase">${t.title}</span>
                </div>
                <span class="text-[9px] font-black text-fuchsia-500 bg-fuchsia-500/10 px-3 py-1.5 rounded-lg border border-fuchsia-500/20">
                    ${t.deadline === todayStr ? "TODAY" : t.deadline}
                </span>
            </li>`,
          )
          .join("")
      : `<div class="py-8 text-center opacity-30 text-xs font-black uppercase tracking-widest italic">No upcoming deadlines</div>`;
  }
}
