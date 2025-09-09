const CONFIG = {
  phone: "+380936978118",
  phoneDisplay: "+38 (093) 697-81-18",
  email: "prostir.dobryjstart@gmail.com",
  addressText: "вул. Городоцька, 319а, Львів",
  formEndpoint: "https://formsubmit.co/ajax/4kaskad@gmail.com",
};

// const hamburger = document.querySelector(".hamburger");
// const mobileMenu = document.getElementById("mobile-menu");
// hamburger?.addEventListener("click", () => {
//   const isHidden = mobileMenu.hasAttribute("hidden");
//   mobileMenu.toggleAttribute("hidden");
//   hamburger.setAttribute("aria-expanded", String(isHidden));
// });

// ===== Hamburger menu =====
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobile-menu");

hamburger?.addEventListener("click", () => {
  mobileMenu.classList.toggle("open");
  hamburger.classList.toggle("open");
  const isOpen = mobileMenu.classList.contains("open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
});
// When clicking outside menu, js should hide burger menu
document.addEventListener("click", (e) => {
  if (
    mobileMenu.classList.contains("open") &&
    !mobileMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  }
});

// ===== Generating new background each time
// function generateRandomBackground() {
//   const colors = ["#FFB347", "#FF7E5F", "#6A82FB", "#2B82C6", "#38BDF8", "#FACC15"];
//   const circles = [];
//   const numCircles = 10;

//   for (let i = 0; i < numCircles; i++) {
//     const cx = Math.floor(Math.random() * 1600);
//     const cy = Math.floor(Math.random() * 1200);
//     const r = Math.floor(Math.random() * 100) + 30; // радіус 30-130
//     const fill = colors[Math.floor(Math.random() * colors.length)];
//     const opacity = (Math.random() * 0.2 + 0.1).toFixed(2); // 0.1-0.3
//     circles.push(`<circle cx='${cx}' cy='${cy}' r='${r}' fill='${fill}' opacity='${opacity}'/>`);
//   }

//   const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='1600' height='1200'>${circles.join("")}</svg>`;
//   document.body.style.background = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") no-repeat center center fixed`;
//   document.body.style.backgroundSize = "cover";
// }

function generateRandomBackground() {
  const colors = ["#FFB347", "#FF7E5F", "#6A82FB", "#2B82C6", "#38BDF8", "#FACC15"];
  const circles = [];
  const numCircles = 30; // balls quantity
  const maxAttempts = 50; // max attemps to avoid overlay
  const width = 1600;
  const height = 1200;
  function isTooClose(x, y, r) {
    for (const c of circles) {
      const dx = c.cx - x;
      const dy = c.cy - y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance < c.r + r + 10) { // +10 for additional space
        return true;
      }
    }
    return false;
  }
  for (let i = 0; i < numCircles; i++) {
    let attempts = 0;
    let cx, cy, r;
    do {
      cx = Math.floor(Math.random() * width);
      cy = Math.floor(Math.random() * height);
      r = Math.floor(Math.random() * 80) + 30; // radius 30-110
      attempts++;
    } while (isTooClose(cx, cy, r) && attempts < maxAttempts);
    circles.push({ cx, cy, r, fill: colors[Math.floor(Math.random() * colors.length)], opacity: (Math.random() * 0.2 + 0.1).toFixed(2) });
  }
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>` +
              circles.map(c => `<circle cx='${c.cx}' cy='${c.cy}' r='${c.r}' fill='${c.fill}' opacity='${c.opacity}'/>`).join("") +
              `</svg>`;
  document.body.style.background = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") no-repeat center center fixed`;
  document.body.style.backgroundSize = "cover";
}
window.addEventListener("load", generateRandomBackground);

// ====== Phone injection (в усі місця) ======
const phoneEls = [
  document.getElementById("phoneLink"),
  document.getElementById("phoneLink2"),
  document.querySelector(".floating-call"),
];
phoneEls.forEach((el) => {
  if (!el) return;
  el.href = `tel:${CONFIG.phone}`;
  el.textContent = CONFIG.phoneDisplay;
});

// Email & адреса
const emailEl = document.getElementById("email");
if (emailEl) {
  emailEl.href = `mailto:${CONFIG.email}`;
  emailEl.textContent = CONFIG.email;
}
const addrEl = document.getElementById("address");
if (addrEl) {
  addrEl.textContent = CONFIG.addressText;
}

// Рік у футері
document.getElementById("year").textContent = new Date().getFullYear();

// formsubmit.co handler
const form = document.getElementById("leadForm");
const ok = document.getElementById("formSuccess");
const err = document.getElementById("formError");

function validatePhone(v) {
  return /^\+?\d[\d\s()\-]{9,}$/.test(v.trim());
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  ok.style.display = "none";
  err.style.display = "none";

  const data = Object.fromEntries(new FormData(form));

  if (!data.parent || !validatePhone(data.phone)) {
    err.textContent = "Будь ласка, введіть ім'я та коректний телефон.";
    err.style.display = "block";
    return;
  }

  if (CONFIG.formEndpoint) {
    try {
      const formData = new FormData(form);

      const res = await fetch(CONFIG.formEndpoint, {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        ok.style.display = "block";
        form.reset();
      } else {
        throw new Error("FormSubmit error");
      }
    } catch (ex) {
      console.error(ex);
      err.textContent =
        "Не вдалося надіслати форму. Будь ласка, спробуйте пізніше або подзвоніть нам.";
      err.style.display = "block";
    }
  }
});

// ====== Smooth scroll для внутрішніх посилань ======
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id && id.length > 1) {
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  });
});

// ====== Lazy fade-in на скрол ======
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.transition = "opacity .6s ease, transform .6s ease";
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll("section .container > *").forEach((el) => {
  el.style.opacity = 0.001;
  el.style.transform = "translateY(16px)";
  io.observe(el);
});

// Helping header not to stay before section title on pressing on any navigation links
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    if (target) {
      const headerOffset = document.querySelector("header").offsetHeight - 50;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});
