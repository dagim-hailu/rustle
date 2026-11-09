(function () {
  try {
    var raw = localStorage.getItem("rustle-settings");
    var parsed = raw ? JSON.parse(raw) : null;
    var mode = parsed && parsed.state && parsed.state.themeMode;
    if (mode !== "light" && mode !== "dark") mode = "system";
    var dark =
      mode === "dark" ||
      (mode === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
