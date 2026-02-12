(function () {
  const root = document.documentElement;
  const savedTheme = localStorage.getItem("theme") || "dark"; // Default to dark

  if (savedTheme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }

  window.toggleTheme = function () {
    root.classList.toggle("dark");
    const mode = root.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", mode);

    // DISPATCH EVENT: Tells analytics.js to redraw charts
    window.dispatchEvent(new Event("themeChanged"));
  };
})();
