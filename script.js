window.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll(".fade-element");
  elements.forEach((el, i) => (el.style.animationDelay = i * 0.15 + "s"));

  const sections = document.querySelectorAll("section");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("hidden", !entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );
  sections.forEach((sec) => {
    sec.classList.add("blur-out");
    observer.observe(sec);
  });

  const orb = document.getElementById("aboutOrb");
  const logo = document.getElementById("orbLogo");
  const popup = document.getElementById("aboutPopup");
  const closeBtn = document.getElementById("popupClose");

  if (!orb || !logo || !popup || !closeBtn) return;

  const infos = {
    RB: document.getElementById("infoRoblox"),
    ML: document.getElementById("infoML"),
    GH: document.getElementById("infoGitHub"),
  };

  const logos = [
    { src: "Images/RB.png", info: "RB" },
    { src: "Images/ML.png", info: "ML" },
    { src: "Images/GH.png", info: "GH" },
  ];

  let current = 0;

  setInterval(() => {
    current = (current + 1) % logos.length;
    logo.style.opacity = 0;
    setTimeout(() => {
      logo.src = logos[current].src;
      logo.style.opacity = 1;
    }, 400);
  }, 3000);

  orb.addEventListener("click", () => {
    popup.style.display = "flex";
    const infoKey = logos[current].info;
    Object.values(infos).forEach((el) => el.classList.remove("active"));
    infos[infoKey].classList.add("active");
  });

  closeBtn.addEventListener("click", () => {
    popup.style.display = "none";
  });
});

popup.style.display = "none"; // pastikan popup selalu tertutup di awal


