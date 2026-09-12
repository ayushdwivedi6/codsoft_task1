const menuButton = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

menuButton.addEventListener("click", () => {
  const isOpen = navMenu.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});
