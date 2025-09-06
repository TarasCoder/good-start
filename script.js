const CONFIG = {
  phone: "+380936978118",
  phoneDisplay: "+38 (093) 697-81-18",
  email: "prostir.dobryjstart@gmail.com",
  addressText: "вул. Городоцька, 319а, Львів",
  formEndpoint: "https://formsubmit.co/ajax/4kaskad@gmail.com",
};

const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.getElementById("mobile-menu");
hamburger?.addEventListener("click", () => {
  const isHidden = mobileMenu.hasAttribute("hidden");
  mobileMenu.toggleAttribute("hidden");
  hamburger.setAttribute("aria-expanded", String(isHidden));
});

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
