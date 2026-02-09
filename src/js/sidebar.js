document.addEventListener("DOMContentLoaded", () => {
    // We use a MutationObserver because the sidebar is loaded dynamically
    const observer = new MutationObserver((mutations, obs) => {
        const sidebar = document.getElementById("sidebar");
        const toggleBtn = document.getElementById("toggleSidebar");

        // Only proceed if the button actually exists in the DOM
        if (!toggleBtn) return;

        // 1. Initialize State
        // Check if previously collapsed in localStorage
        const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
        if (isCollapsed) {
            document.body.classList.add("sidebar-collapsed");
        }

        // 2. Setup Click Handler
        // We overwrite onclick to ensure we don't add multiple listeners
        toggleBtn.onclick = () => {
            // Toggle class on BODY, not the sidebar element
            document.body.classList.toggle("sidebar-collapsed");

            // Save state
            const collapsed = document.body.classList.contains("sidebar-collapsed");
            localStorage.setItem("sidebar-collapsed", collapsed);
        };

        // 3. Handle Active Links
        const currentPath = location.pathname.split("/").pop();
        if (sidebar) {
            sidebar.querySelectorAll(".nav-item").forEach(link => {
                if (link.getAttribute("href")?.includes(currentPath)) {
                    link.classList.add("active");
                }
            });
        }

        // Stop observing once the sidebar is found and hooked up
        obs.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
});