/* ================================
   DOM READY → ANIMASI SCROLL & ORB
==================================*/
window.addEventListener("DOMContentLoaded", () => {

  /* ================================
     HOME SECTION SLIDE ANIMATION
     
     FUNGSI: Mengatur animasi di HOME section (#home)
     - Karakter UCUP.png turun dari atas
     - Kotak "CODE NAME" muncul dari bawah
     - KEDUANYA MUNCUL BERSAMAAN (SIMULTANEOUS)
     
     CARA KERJA:
     1. Pertama kali load/refresh → animasi penuh (keduanya bersamaan)
     2. Kembali ke home dari section lain → langsung tampil (tanpa animasi ulang)
  ==================================*/
  
  const homeSection = document.querySelector(".home-section");
  const homeHash = "#home";
  
  // Key untuk menyimpan status animasi sudah pernah dijalankan
  const ANIMATION_KEY = "ucup_home_animation_played";
  
  // Fungsi untuk trigger animasi home
  function triggerHomeAnimation(forceReset = false) {
    if (!homeSection) return;
    
    // Jika forceReset true (first load), lakukan reset penuh + animasi
    if (forceReset) {
      homeSection.classList.remove("show-animation", "slide-active");
      
      // Delay kecil supaya reset terlihat
      setTimeout(() => {
        // KEDUA ANIMASI DIJALANKAN BERSAMAAN
        // Karakter turun dari atas + Info muncul dari bawah
        homeSection.classList.add("show-animation", "slide-active");
        
      }, 50);
    } else {
      // Jika returning (bukan first load), langsung tampilkan state final tanpa animasi ulang
      // Ini mencegah text hilang sementara
      homeSection.classList.add("show-animation", "slide-active");
    }
    
    // Simpan status bahwa animasi sudah pernah dijalankan
    sessionStorage.setItem(ANIMATION_KEY, "true");
  }
  
  // Cek apakah ini kunjungan pertama kali (atau refresh halaman)
  const hasPlayedAnimation = sessionStorage.getItem(ANIMATION_KEY);
  
  if (!hasPlayedAnimation) {
    // Pertama kali load atau setelah refresh - trigger animasi dengan reset
    triggerHomeAnimation(true);
  } else {
    // Sudah pernah trigger - langsung tampilkan dalam state final
    homeSection.classList.add("show-animation", "slide-active");
  }
  
  // Monitor perubahan URL hash untuk deteksi navigasi
  let currentHash = window.location.hash || homeHash;
  
  // Fungsi untuk cek apakah user kembali ke home
  function checkHomeReturn() {
    const newHash = window.location.hash || homeHash;
    
    // Jika hash berubah dari non-home ke home
    if (currentHash !== homeHash && newHash === homeHash) {
      // Langsung tampilkan state final (tanpa reset yang bikin text hilang)
      triggerHomeAnimation(false);
    }
    
    currentHash = newHash;
  }
  
  // Listen perubahan hash (saat klik menu navbar)
  window.addEventListener("hashchange", checkHomeReturn);
  
  /* ================================
     SCROLL DETECTION
     
     FUNGSI: Mendeteksi ketika user scroll manual ke section home
     Jika terdeteksi scroll ke home, update hash URL
  ==================================*/
  let lastScrollY = window.scrollY;
  let scrollTimeout;
  
  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    
    // Clear timeout sebelumnya
    clearTimeout(scrollTimeout);
    
    // Set timeout baru untuk deteksi scroll selesai
    scrollTimeout = setTimeout(() => {
      // Cek apakah home section terlihat di viewport
      if (homeSection) {
        const rect = homeSection.getBoundingClientRect();
        const isHomeVisible = rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2;
        
        // Jika home visible dan user scroll ke atas (dari section lain)
        if (isHomeVisible && currentScrollY < lastScrollY) {
          const newHash = window.location.hash || homeHash;
          
          // Jika sebelumnya bukan di home
          if (currentHash !== homeHash) {
            window.location.hash = homeHash;
            checkHomeReturn();
          }
        }
      }
    }, 100); // Tunggu 100ms setelah scroll berhenti
    
    lastScrollY = currentScrollY;
  });


  /* ================================
     FADE + BLUR SCROLL ANIMATION
     
     FUNGSI: Animasi fade-in saat element masuk ke viewport
     Digunakan untuk section home, about, dan contact
  ==================================*/
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
     ORB CLICK → MODAL GLASSMORPHISM
     
     FUNGSI: Mengatur interaksi ORB (bulatan biru) di ABOUT section
     - Klik ORB → muncul modal glassmorphism dengan 3 card
     - Klik X atau ESC atau klik di luar modal → tutup modal
     - Saat modal terbuka, background akan blur
  ==================================*/
  const orb = document.getElementById("aboutOrb");
  const orbLogo = document.getElementById("orbLogo");
  const modal = document.getElementById("aboutModal");
  const modalClose = document.getElementById("modalClose");
  const aboutSection = document.getElementById("about");
  const modalInner = modal ? modal.querySelector(".about-modal-inner") : null;

  // Fungsi untuk toggle modal (buka/tutup)
  const toggleModal = (show) => {
    if (!modal) return;
    const willShow = typeof show === "boolean" ? show : !modal.classList.contains("show");

    if (willShow) {
      // BUKA MODAL
      modal.classList.add("show");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden"; // prevent background scroll
      aboutSection.classList.add("showing-about-modal"); // tambah blur effect
      orb.setAttribute("aria-pressed", "true");
      if (modalInner) modalInner.focus && modalInner.focus();
    } else {
      // TUTUP MODAL
      modal.classList.remove("show");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = ""; // restore scroll
      aboutSection.classList.remove("showing-about-modal"); // hapus blur effect
      orb.setAttribute("aria-pressed", "false");
      orb.focus();
    }
  };

  // Event: Klik ORB → buka modal
  if (orb) {
    orb.addEventListener("click", () => toggleModal(true));
    orb.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleModal(true);
      }
    });
  }

  // Event: Klik tombol X → tutup modal
  if (modalClose) {
    modalClose.addEventListener("click", () => toggleModal(false));
  }

  // Event: Tekan ESC → tutup modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("show")) {
      toggleModal(false);
    }
  });

  // Event: Klik di luar modal → tutup modal
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (!modalInner) return;
      if (!modalInner.contains(e.target)) {
        toggleModal(false);
      }
    });
  }

  /* ================================
     AUTO ROTATE LOGO DI ORB
     
     FUNGSI: Logo di dalam ORB akan berganti otomatis setiap 3 detik
     Urutan: RB.png → ML.png → GH.png → RB.png (loop)
     
     CARA UBAH TIMING:
     Ganti angka 3000 (dalam milidetik) di setInterval
     3000 = 3 detik, 5000 = 5 detik, dst.
  ==================================*/
  const orbLogos = ["Images/RB.png", "Images/ML.png", "Images/GH.png"];
  let orbIndex = 0;
  
  if (orbLogo) {
    setInterval(() => {
      orbIndex = (orbIndex + 1) % orbLogos.length;
      orbLogo.src = orbLogos[orbIndex];
    }, 3000); // <<=== TIMING AUTO ROTATE (dalam ms, 3000 = 3 detik)
  }

  /* ================================
     POPUP CLOSE HANDLERS (EXTRA)
     
     FUNGSI: Mengatur popup tambahan (jika ada)
     Untuk menutup popup saat klik X atau klik di luar popup
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
     
     FUNGSI: Mengatur efek zoom card saat card diklik/dibuka
     - Saat card dibuka (details open) → card membesar, card lain mengecil & blur
     - Saat card ditutup → kembali normal (3 card sejajar)
     
     DIGUNAKAN UNTUK: 3 card di modal (Roblox, Mobile Legend, GitHub)
  ==================================*/
  const modalGrid = document.querySelector(".modal-grid");
  const gameItems = document.querySelectorAll(".game-item");

  // Function untuk handle toggle details (buka/tutup card)
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

}); // <<=== AKHIR DOMContentLoaded


/* ================================
   DATA POPUP ABOUT (ROBLOX / ML / GITHUB)
   
   FUNGSI: Data untuk popup tambahan (jika digunakan)
   Berisi informasi title, text, logo, dan link untuk setiap game
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

// Fungsi untuk membuka popup (jika dipanggil dari HTML)
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