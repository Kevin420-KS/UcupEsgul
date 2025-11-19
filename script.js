/* ================================
   DOM READY → ANIMASI SCROLL & ORB
==================================*/
window.addEventListener("DOMContentLoaded", () => {

  /* === ANIMASI FADE + BLUR SAAT SCROLL === */
  const fadeElements = document.querySelectorAll(".fade-element");

  fadeElements.forEach((el, i) => {
    el.style.animationDelay = i * 0.15 + "s"; // delay naik bertahap
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("hidden", !entry.isIntersecting);
      });
    },
    { threshold: 0.3 }
  );

  fadeElements.forEach((el) => {
    el.classList.add("blur-out");
    observer.observe(el);
  });


  /* ================================
     ORB → MODAL (CENTER GLASS)
  ==================================*/
  const orb = document.getElementById("aboutOrb");
  const orbLogo = document.getElementById("orbLogo");
  const modal = document.getElementById("aboutModal");
  const modalClose = document.getElementById("modalClose");
  const aboutSection = document.getElementById("about");
  const modalInner = modal ? modal.querySelector(".about-modal-inner") : null;

  // utility: toggle modal and blur
  const toggleModal = (show) => {
    if (!modal) return;
    const willShow = typeof show === "boolean" ? show : !modal.classList.contains("show");

    if (willShow) {
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // prevent background scroll
      // add class to about section to trigger blur effect
      aboutSection.classList.add("showing-about-modal");
      orb.setAttribute("aria-pressed", "true");
      // focus modal for accessibility
      if (modalInner) modalInner.focus && modalInner.focus();
    } else {
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      aboutSection.classList.remove("showing-about-modal");
      orb.setAttribute("aria-pressed", "false");
      orb.focus();
    }
  };

  if (orb) {
    orb.addEventListener("click", () => toggleModal(true));
    orb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleModal(true);
      }
    });
  }

  if (modalClose) {
    modalClose.addEventListener("click", () => toggleModal(false));
  }

  // close modal on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("show")) {
      toggleModal(false);
    }
  });

  // click outside modalInner closes modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (!modalInner) return;
      if (!modalInner.contains(e.target)) {
        toggleModal(false);
      }
    });
  }

  /* ================================
     AUTO ROTATE LOGO DI ORB (AMAN)
  ==================================*/
  const orbLogos = ["Images/RB.png", "Images/ML.png", "Images/GH.png"];
  let orbIndex = 0;
  if (orbLogo) {
    setInterval(() => {
      orbIndex = (orbIndex + 1) % orbLogos.length;
      orbLogo.src = orbLogos[orbIndex];
    }, 3000);
  }

  /* ================================
     POPUP CLOSE HANDLERS (EXTRA)
  ==================================*/
  const popupClose = document.getElementById("popupClose");
  const gamePopup = document.getElementById("gamePopup");

  if (popupClose && gamePopup) {
    popupClose.addEventListener("click", () => {
      gamePopup.style.display = "none";
      gamePopup.setAttribute("aria-hidden", "true");
    });

    gamePopup.addEventListener("click", (e) => {
      if (e.target.id === "gamePopup") {
        gamePopup.style.display = "none";
        gamePopup.setAttribute("aria-hidden", "true");
      }
    });
  }

  /* ================================
     CARD FOCUS MODE - INTERACTIVE DETAILS
     ⚠️ PINDAHKAN KE SINI (DI DALAM DOMContentLoaded)!
  ==================================*/
  const modalGrid = document.querySelector(".modal-grid");
  const gameItems = document.querySelectorAll(".game-item");

  // Function untuk handle toggle details
  function handleDetailsToggle() {
    // Cek apakah ada card yang terbuka
    const openCard = document.querySelector(".game-item[open]");
    
    if (openCard) {
      // Ada card yang terbuka - aktifkan focus mode
      modalGrid.classList.add("has-active-card");
      
      // Remove active-card dari semua card
      gameItems.forEach(item => item.classList.remove("active-card"));
      
      // Tambahkan active-card ke card yang terbuka
      openCard.classList.add("active-card");
      
    } else {
      // Tidak ada card yang terbuka - kembali ke normal
      modalGrid.classList.remove("has-active-card");
      gameItems.forEach(item => item.classList.remove("active-card"));
    }
  }

  // Attach event listener ke semua details element
  if (modalGrid && gameItems.length > 0) {
    gameItems.forEach((item) => {
      item.addEventListener("toggle", handleDetailsToggle);
    });
  }

  // Optional: Auto-close card lain ketika satu card dibuka
  // (Uncomment jika ingin hanya 1 card yang bisa terbuka)
  /*
  if (gameItems.length > 0) {
    gameItems.forEach((item) => {
      item.addEventListener("toggle", (e) => {
        if (e.target.open) {
          // Tutup semua card lain
          gameItems.forEach((otherItem) => {
            if (otherItem !== e.target && otherItem.open) {
              otherItem.open = false;
            }
          });
        }
        handleDetailsToggle();
      });
    });
  }
  */

}); // ← end DOMContentLoaded (TUTUP DI SINI!)


/* ================================
   DATA POPUP ABOUT (ROBLOX / ML / GITHUB)
   - fungsi ini diletakkan di global scope supaya bisa dipanggil dari HTML
==================================*/
const popupData = {
  roblox: {
    title: "Roblox",
    text: "Kumpulan item gratis, event aktif, dan cara mendapatkannya.",
    logo: "Images/RB.png",
    link: "MoreAbout/roblox_information.html"
  },
  ml: {
    title: "Mobile Legend",
    text: "Tips role, mastery lane, serta cara dapat skin gratis/hemat.",
    logo: "Images/ML.png",
    link: "MoreAbout/ml_information.html"
  },
  github: {
    title: "GitHub",
    text: "Kumpulan proyek, eksperimen coding, dan portfolio.",
    logo: "Images/GH.png",
    link: "MoreAbout/github_information.html"
  }
};

function openAboutPopup(type) {
  const data = popupData[type];
  if (!data) return;

  const popupLogo = document.getElementById("popupLogo");
  const popupTitle = document.getElementById("popupTitle");
  const popupText = document.getElementById("popupText");
  const popupLink = document.getElementById("popupLink");
  const gamePopup = document.getElementById("gamePopup");

  if (popupLogo) popupLogo.src = data.logo;
  if (popupTitle) popupTitle.textContent = data.title;
  if (popupText) popupText.textContent = data.text;
  if (popupLink) popupLink.href = data.link;
  if (gamePopup) {
    gamePopup.style.display = "flex";
    gamePopup.setAttribute("aria-hidden", "false");
  }
}