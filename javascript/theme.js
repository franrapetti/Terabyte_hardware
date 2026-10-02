const themeStorageKey = "terrabyte-theme";
const themeRoot = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

let currentTheme = "dark";

try {
  currentTheme = localStorage.getItem(themeStorageKey) === "light" ? "light" : "dark";
} catch {
  currentTheme = "dark";
}

themeRoot.dataset.theme = currentTheme;

if (themeToggle) {
  const updateThemeButton = () => {
    const isLightTheme = themeRoot.dataset.theme === "light";
    const label = isLightTheme ? "Cambiar a modo oscuro" : "Cambiar a modo claro";

    themeToggle.setAttribute("aria-label", label);
    themeToggle.setAttribute("title", label);
    themeToggle.setAttribute("aria-pressed", String(isLightTheme));
  };

  updateThemeButton();

  themeToggle.addEventListener("click", () => {
    currentTheme = themeRoot.dataset.theme === "light" ? "dark" : "light";
    themeRoot.dataset.theme = currentTheme;

    try {
      localStorage.setItem(themeStorageKey, currentTheme);
    } catch {
    }

    updateThemeButton();
  });
}
