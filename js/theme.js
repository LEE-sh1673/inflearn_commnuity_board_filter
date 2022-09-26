const switch_btn = document.querySelector(".switch input");
const body = document.body;
const theme_icons = document.querySelectorAll(".theme-icon");

document.addEventListener("DOMContentLoaded", () => {
  init_theme();

  switch_btn.addEventListener("change", () => {
    change_theme();
  });
});

function init_theme() {
  const theme = localStorage.getItem("theme");
  let themeIdx = 0;

  if (theme) {
    body.classList.add(theme);
    let isDarkTheme = theme === "dark-theme" ? true : false;

    if (isDarkTheme) {
      switch_btn.click();
      themeIdx = 1;
    }
  }
  theme_icons[themeIdx].classList.add("current");
}

function change_theme() {
  if (body.classList.contains("dark-theme")) {
    body.classList.replace("dark-theme", "light-theme");
    localStorage.setItem("theme", "light-theme");
  } else {
    body.classList.replace("light-theme", "dark-theme");
    localStorage.setItem("theme", "dark-theme");
  }
  toggle_icon_styles();
}

function toggle_icon_styles() {
  theme_icons.forEach((icon) => icon.classList.toggle("current"));
}
