// GOOGLE APPS SCRIPT URL
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzo8OFIzBzLa129x7x3L0AfD6O1ksuAK7t2-KH2T5HV4qJQx3w-_WL19PTdm_x1h-1h/exec";

// ==============================
// MOBILE MENU
// ==============================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", isOpen);
    menuToggle.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });

  document.querySelectorAll(".nav-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });
}

// ==============================
// ACTIVE NAVBAR
// ==============================
const sections = document.querySelectorAll("main section[id]");
const navLinks = document.querySelectorAll(".nav-menu a");

function updateActiveMenu() {
  let current = "home";

  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 150) {
      current = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === "#" + current);
  });
}

window.addEventListener("scroll", updateActiveMenu);
updateActiveMenu();

// ==============================
// PROJECT FILTER
// ==============================
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const category = card.dataset.category;

      card.classList.toggle("hide", filter !== "all" && category !== filter);
    });
  });
});

// ==============================
// SCROLL REVEAL
// ==============================
const revealElements = document.querySelectorAll(".home-text, .home-image, .section-heading, " + ".about-title, .about-description, .skill-item, " + ".skills-intro, .projects-intro, .project-card, " + ".contact-content");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  revealElements.forEach((element) => {
    element.classList.add("reveal");
    observer.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("show");
  });
}

// ==============================
// BACK TO TOP
// ==============================
const backToTop = document.createElement("button");

backToTop.className = "back-to-top";
backToTop.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
backToTop.setAttribute("aria-label", "Kembali ke atas");

document.body.appendChild(backToTop);

window.addEventListener("scroll", () => {
  backToTop.classList.toggle("show", window.scrollY > 400);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// ==============================
// CONTACT FORM - GOOGLE SPREADSHEET
// ==============================
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const sendMessageBtn = document.getElementById("sendMessageBtn");

if (contactForm && formStatus && sendMessageBtn) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    // Anti-spam
    if (formData.get("website")) return;

    sendMessageBtn.disabled = true;
    sendMessageBtn.innerHTML = "Mengirim pesan...";
    formStatus.textContent = "Sedang mengirim pesan...";

    fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.text())
      .then((result) => {
        if (result.trim() === "Berhasil") {
          formStatus.textContent = "Pesan berhasil dikirim!";
          contactForm.reset();
        } else {
          formStatus.textContent = "Pesan belum berhasil disimpan. Coba lagi.";
        }
      })
      .catch((error) => {
        console.error(error);
        formStatus.textContent = "Gagal mengirim pesan. Periksa koneksi internet.";
      })
      .finally(() => {
        sendMessageBtn.disabled = false;
        sendMessageBtn.innerHTML = 'Kirim Pesan <i class="fa-solid fa-paper-plane"></i>';
      });
  });
}
