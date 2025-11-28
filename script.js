/* ================================
   ANIMATED NAVBAR FUNCTIONALITY
==================================*/

// Get all navbar buttons
const navButtons = document.querySelectorAll('.button-group > div, .button-group > .about-menu-wrapper');

navButtons.forEach(button => {
  button.addEventListener('click', function(e) {
    // Jika button yang diklik adalah Speed Control, jangan ubah active state
    if (this.id === 'speedControlBtn') {
      toggleSpeedModal(true);
      return;
    }
    
    // Handle About menu dengan dropdown
    if (this.classList.contains('about-menu-wrapper')) {
      const dropdown = this.querySelector('.dropdown-menu');
      if (dropdown) {
        dropdown.style.removeProperty('opacity');
        dropdown.style.removeProperty('visibility');
        dropdown.style.removeProperty('pointer-events');
      }
      
      isScrollingProgrammatically = true;
      
      navButtons.forEach(btn => {
        if (!btn.id || btn.id !== 'speedControlBtn') {
          btn.classList.remove('active');
        }
      });
      
      this.classList.add('active');
      
      const section = document.getElementById('about');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isScrollingProgrammatically = false;
        }, 800);
      }
      
      return;
    }
    
    isScrollingProgrammatically = true;
    
    navButtons.forEach(btn => {
      if (!btn.id || btn.id !== 'speedControlBtn') {
        btn.classList.remove('active');
      }
    });
    
    this.classList.add('active');
    
    const target = this.getAttribute('data-target');
    if (target) {
      const section = document.getElementById(target);
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
          isScrollingProgrammatically = false;
        }, 800);
      }
    }
  });
});

/* ================================
   ✅ FIXED: UNIFIED SCROLL HANDLER
   Menggabungkan semua scroll detection jadi satu
==================================*/

let isScrollingProgrammatically = false;
let scrollTimeout;
const sections = document.querySelectorAll('section[id]');

function getCurrentSection() {
  const scrollPos = window.pageYOffset + 150;
  
  if (window.pageYOffset < 100) {
    return 'home';
  }
  
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  
  if (window.pageYOffset + windowHeight >= documentHeight - 50) {
    return 'contact';
  }
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  return currentSection;
}

// ✅ SATU EVENT LISTENER UNTUK SEMUA SCROLL DETECTION
window.addEventListener('scroll', () => {
  if (isScrollingProgrammatically) return;
  
  clearTimeout(scrollTimeout);
  
  scrollTimeout = setTimeout(() => {
    const current = getCurrentSection();
    
    // Update navbar active state
    navButtons.forEach(button => {
      if (!button.id || button.id !== 'speedControlBtn') {
        button.classList.remove('active');
      }
      if (button.classList && button.classList.contains('about-menu-wrapper')) {
        button.classList.remove('active');
      }
      if (button.getAttribute('data-target') === current) {
        button.classList.add('active');
      }
    });
    
    // Update URL hash jika perlu
    const newHash = current ? `#${current}` : '#home';
    if (window.location.hash !== newHash) {
      history.replaceState(null, null, newHash);
    }
  }, 100);
});

/* ================================
   DOM READY → ANIMASI SCROLL & ORB
==================================*/
window.addEventListener("DOMContentLoaded", () => {

  /* ================================
     HOME SECTION SLIDE ANIMATION
  ==================================*/
  
  const homeSection = document.querySelector(".home-section");
  let hasPlayedAnimation = false;
  
  function triggerHomeAnimation(forceReset = false) {
    if (!homeSection) return;
    
    if (forceReset) {
      homeSection.classList.remove("show-animation", "slide-active");
      
      setTimeout(() => {
        homeSection.classList.add("show-animation", "slide-active");
      }, 50);
    } else {
      homeSection.classList.add("show-animation", "slide-active");
    }
    
    hasPlayedAnimation = true;
  }
  
  if (!hasPlayedAnimation) {
    triggerHomeAnimation(true);
  } else {
    homeSection.classList.add("show-animation", "slide-active");
  }

  /* ================================
     FADE + BLUR SCROLL ANIMATION
  ==================================*/
  const fadeElements = document.querySelectorAll(".fade-element");

  fadeElements.forEach((el, i) => {
    el.style.animationDelay = i * 0.15 + "s";
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
     ✅ FIXED: MODAL MANAGEMENT
     Mencegah multiple modals terbuka bersamaan
  ==================================*/
  
  const orb = document.getElementById("aboutOrb");
  const orbLogo = document.getElementById("orbLogo");
  const aboutModal = document.getElementById("aboutModal");
  const modalClose = document.getElementById("modalClose");
  const aboutSection = document.getElementById("about");
  const modalInner = aboutModal ? aboutModal.querySelector(".about-modal-inner") : null;
  const speedModal = document.getElementById("speedModal");

  // ✅ FUNGSI UNTUK TUTUP SEMUA MODAL
  function closeAllModals() {
    // Tutup About Modal
    if (aboutModal) {
      aboutModal.classList.remove("show");
      aboutModal.setAttribute("aria-hidden", "true");
    }
    if (aboutSection) {
      aboutSection.classList.remove("showing-about-modal");
    }
    if (orb) {
      orb.setAttribute("aria-pressed", "false");
    }
    
    // Tutup Speed Modal
    if (speedModal) {
      speedModal.classList.remove("show");
      speedModal.setAttribute("aria-hidden", "true");
    }
    const speedBtn = document.getElementById('speedControlBtn');
    if (speedBtn) {
      speedBtn.classList.remove('active-temp');
    }
    
    // Reset body state
    document.body.style.overflow = "";
    document.body.classList.remove("blur-background");
  }

  // ✅ TOGGLE ABOUT MODAL (DENGAN CHECK MODAL LAIN)
  const toggleAboutModal = (show) => {
    if (!aboutModal) return;
    const willShow = typeof show === "boolean" ? show : !aboutModal.classList.contains("show");

    if (willShow) {
      closeAllModals(); // Tutup modal lain dulu
      
      aboutModal.classList.add("show");
      aboutModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      document.body.classList.add("blur-background");
      aboutSection.classList.add("showing-about-modal");
      orb.setAttribute("aria-pressed", "true");
      if (modalInner) modalInner.focus && modalInner.focus();
    } else {
      closeAllModals();
    }
  };

  // Event: Klik ORB
  if (orb) {
    orb.addEventListener("click", () => toggleAboutModal(true));
    orb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleAboutModal(true);
      }
    });
  }

  // Event: Klik tombol X
  if (modalClose) {
    modalClose.addEventListener("click", () => toggleAboutModal(false));
  }

  // Event: Tekan ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (aboutModal && aboutModal.classList.contains("show")) {
        toggleAboutModal(false);
      }
      if (speedModal && speedModal.classList.contains("show")) {
        toggleSpeedModal(false);
      }
    }
  });

  // Event: Klik di luar modal
  if (aboutModal) {
    aboutModal.addEventListener("click", (e) => {
      if (!modalInner) return;
      if (!modalInner.contains(e.target)) {
        toggleAboutModal(false);
      }
    });
  }

  /* ================================
     AUTO ROTATE LOGO DI ORB
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
     CARD FOCUS MODE
  ==================================*/
  const modalGrid = document.querySelector(".modal-grid");
  const gameItems = document.querySelectorAll(".game-item");

  function handleDetailsToggle() {
    const openCard = document.querySelector(".game-item[open]");
    
    if (openCard) {
      modalGrid.classList.add("has-active-card");
      gameItems.forEach(item => item.classList.remove("active-card"));
      openCard.classList.add("active-card");
    } else {
      modalGrid.classList.remove("has-active-card");
      gameItems.forEach(item => item.classList.remove("active-card"));
    }
  }

  if (modalGrid && gameItems.length > 0) {
    gameItems.forEach((item) => {
      item.addEventListener("toggle", handleDetailsToggle);
    });
  }

}); // End DOMContentLoaded

/* ================================
   ✅ FIXED: SPEED CONTROL MODAL
   Dengan modal management yang lebih baik
==================================*/

const speedControlBtn = document.getElementById('speedControlBtn');
const speedModal = document.getElementById('speedModal');
const speedModalClose = document.getElementById('speedModalClose');
const starSpeedSlider = document.getElementById('starSpeedSlider');
const speedDisplay = document.getElementById('speedDisplay');
const starField = document.querySelector('.star-field');

// ✅ FUNGSI UNTUK TUTUP ABOUT MODAL (JIKA ADA)
function closeAboutModalIfOpen() {
  const aboutModal = document.getElementById("aboutModal");
  const aboutSection = document.getElementById("about");
  const orb = document.getElementById("aboutOrb");
  
  if (aboutModal && aboutModal.classList.contains("show")) {
    aboutModal.classList.remove("show");
    aboutModal.setAttribute("aria-hidden", "true");
    if (aboutSection) aboutSection.classList.remove("showing-about-modal");
    if (orb) orb.setAttribute("aria-pressed", "false");
  }
}

function toggleSpeedModal(show) {
  if (!speedModal) return;
  
  const speedBtn = document.getElementById('speedControlBtn');
  
  if (show) {
    closeAboutModalIfOpen(); // Tutup about modal dulu
    
    speedModal.classList.add('show');
    speedModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = "hidden";
    
    // ✅ GUNAKAN CLASS KHUSUS UNTUK SPEED MODAL
    document.body.classList.add("speed-modal-open");
    // ❌ JANGAN pakai blur-background
    // document.body.classList.remove("blur-background"); 
    
    if (speedBtn) {
      speedBtn.classList.add('active-temp');
    }
  } else {
    speedModal.classList.remove('show');
    speedModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = "";
    
    // ✅ HAPUS CLASS KHUSUS SPEED MODAL
    document.body.classList.remove("speed-modal-open");
    
    if (speedBtn) {
      speedBtn.classList.remove('active-temp');
    }
  }
}

// Event: Klik menu "Speed Control"
if (speedControlBtn) {
  speedControlBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSpeedModal(true);
  });
}

// Event: Klik tombol close (X)
if (speedModalClose) {
  speedModalClose.addEventListener('click', () => {
    toggleSpeedModal(false);
  });
}

// Event: Klik di luar modal
if (speedModal) {
  speedModal.addEventListener('click', (e) => {
    if (e.target === speedModal) {
      toggleSpeedModal(false);
    }
  });
}

/* ================================
   SLIDER CONTROL
==================================*/

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function updateStarSpeed() {
  if (!starSpeedSlider || !speedDisplay || !starField) return;
  
  const value = starSpeedSlider.value;
  const seconds = (value / 1000).toFixed(1);
  
  speedDisplay.textContent = `${seconds}s`;
  starField.style.setProperty('--star-speed', `${value}ms`);
  localStorage.setItem('starSpeed', value);
}

if (starSpeedSlider) {
  starSpeedSlider.addEventListener('input', debounce(updateStarSpeed, 50));
}

// Load saved speed
window.addEventListener('DOMContentLoaded', () => {
  if (!starSpeedSlider || !starField) return;
  
  const savedSpeed = localStorage.getItem('starSpeed');
  
  if (savedSpeed) {
    starSpeedSlider.value = savedSpeed;
    updateStarSpeed();
  } else {
    updateStarSpeed();
  }
});

/* ================================
   POPUP DATA (OPTIONAL)
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