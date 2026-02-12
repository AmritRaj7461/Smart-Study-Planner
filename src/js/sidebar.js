document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutations, obs) => {
    const sidebar = document.getElementById("sidebar-el");
    const toggleBtn = document.getElementById("toggleSidebar");

    if (!toggleBtn) return;

    // 1. Persist State
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    if (isCollapsed) document.body.classList.add("sidebar-collapsed");

    toggleBtn.onclick = () => {
      document.body.classList.toggle("sidebar-collapsed");
      localStorage.setItem(
        "sidebar-collapsed",
        document.body.classList.contains("sidebar-collapsed"),
      );
    };

    // 2. Active Link Logic
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach((item) => {
      const linkHref = item.getAttribute("href");
      const sanitizedHref = linkHref.replace("../", "").replace("./", "");

      if (
        currentPath.endsWith(sanitizedHref) ||
        (sanitizedHref === "index.html" &&
          (currentPath.endsWith("/") || currentPath.endsWith("index.html")))
      ) {
        item.classList.add("active");
      }
    });

    obs.disconnect();
  });

  observer.observe(document.body, { childList: true, subtree: true });
});
