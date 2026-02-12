(function() {
  const primaryColorScheme = ""; // "light" | "dark"

  // Get theme data from local storage
  const currentTheme = localStorage.getItem("theme");

  function getPreferTheme() {
    // return theme value in local storage if it is set
    if (currentTheme) return currentTheme;

    // return primary color scheme if it is set
    if (primaryColorScheme) return primaryColorScheme;

    // return user device's prefer color scheme
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }

  let themeValue = getPreferTheme();

  function setPreference() {
    localStorage.setItem("theme", themeValue);
    reflectPreference();
  }

  function reflectPreference() {
    // Update the attribute on the root element
    document.documentElement.setAttribute("data-theme", themeValue);

    // Update the aria-label for accessibility
    const themeBtn = document.querySelector("#theme-btn");
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", themeValue === "light" ? "Switch to dark theme" : "Switch to light theme");
    }
    
    // Update the button icon for better UX
    const sunIcon = document.querySelector("#sun-icon");
    const moonIcon = document.querySelector("#moon-icon");
    
    if (sunIcon && moonIcon) {
      if (themeValue === "light") {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
      } else {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
      }
    }
  }

  // Ensure the preference is reflected on initial load and after page navigations
  function initializeTheme() {
    // Get current theme from localStorage (which should preserve user's choice across page navigations)
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      themeValue = storedTheme;
    } else {
      themeValue = getPreferTheme();
    }
    reflectPreference();
    initEventListeners();
  }

  function initEventListeners() {
    // Remove existing event listeners to avoid duplicates
    const themeBtn = document.querySelector("#theme-btn");
    if (themeBtn) {
      // Store the click handler to remove it before adding a new one
      const existingClickHandler = themeBtn._clickHandler;
      if (existingClickHandler) {
        themeBtn.removeEventListener('click', existingClickHandler);
      }
      
      const clickHandler = () => {
        themeValue = themeValue === "light" ? "dark" : "light";
        setPreference();
      };
      
      themeBtn.addEventListener("click", clickHandler);
      themeBtn._clickHandler = clickHandler; // Store the handler for later removal
    }
    
    const mobileThemeBtn = document.querySelector("#theme-btn-mobile");
    if (mobileThemeBtn) {
      // Store the click handler to remove it before adding a new one
      const existingClickHandler = mobileThemeBtn._clickHandler;
      if (existingClickHandler) {
        mobileThemeBtn.removeEventListener('click', existingClickHandler);
      }
      
      const clickHandler = () => {
        themeValue = themeValue === "light" ? "dark" : "light";
        setPreference();
      };
      
      mobileThemeBtn.addEventListener("click", clickHandler);
      mobileThemeBtn._clickHandler = clickHandler; // Store the handler for later removal
    }
  }

  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTheme);
  } else {
    initializeTheme();
  }

  // Listen for Astro's page load events to reinitialize the theme after client-side navigation
  document.addEventListener('astro:after-swap', initializeTheme);

  // sync with system changes
  window.matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", ({matches: isDark}) => {
      // Only update if user hasn't explicitly set a theme preference
      if (!localStorage.getItem("theme")) {
        themeValue = isDark ? "dark" : "light";
        setPreference();
      }
    });
})();
