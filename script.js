window.addEventListener("load", () => {
  const elements = document.querySelectorAll(".fade-element");

  elements.forEach((el, i) => {
    el.style.animationDelay = (i * 0.15) + "s";
  });
});

// Blur out & fade out ketika section keluar dari layar
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      entry.target.classList.add("hidden");
    } else {
      entry.target.classList.remove("hidden");
    }
  });
}, { threshold: 0.3 });

sections.forEach(sec => {
  sec.classList.add("blur-out");
  observer.observe(sec);
});

