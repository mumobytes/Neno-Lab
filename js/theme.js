document.addEventListener("DOMContentLoaded", () => {

  const darkToggle = document.getElementById("dark-toggle");
  const themeIcon = document.getElementById("theme-icon");

  darkToggle.addEventListener("change", () => {
    document.body.classList.toggle("light", !darkToggle.checked);
    localStorage.setItem("nenolab-theme", darkToggle.checked ? "dark" : "light");
  });

  themeIcon.addEventListener("click", () => {
    darkToggle.checked = !darkToggle.checked;
    darkToggle.dispatchEvent(new Event("change"));
  });

  const saved = localStorage.getItem("nenolab-theme");
  if (saved === "light") {
    document.body.classList.add("light");
    darkToggle.checked = false;
  }

});
