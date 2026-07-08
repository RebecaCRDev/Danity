// ================================
// Danity.fit - JavaScript Principal (CILINDRO 3D REAL + Lightbox)
// ================================
document.addEventListener("DOMContentLoaded", () => {
  // --- Menú hamburguesa ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("active");
      const expanded =
        menuToggle.getAttribute("aria-expanded") === "true" || false;
      menuToggle.setAttribute("aria-expanded", String(!expanded));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navLinks.classList.contains("active")) {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // =========================================================
  // ✅ FIX 1: FAQ acordeón — el CSS esperaba .faq-item.active
  // pero nadie añadía la clase. Ahora sí.
  // =========================================================
  document.querySelectorAll(".faq-item h3").forEach((h3) => {
    h3.addEventListener("click", () => {
      const item = h3.parentElement;
      const isOpen = item.classList.contains("active");

      // Cerrar los demás (comportamiento acordeón).
      // Si prefieres que puedan estar varios abiertos, borra este forEach.
      document.querySelectorAll(".faq-item.active").forEach((open) => {
        open.classList.remove("active");
      });

      if (!isOpen) item.classList.add("active");
    });
  });

  // =========================================================
  // GALERÍA — EFECTO "CILINDRO" REAL (SWIPER COVERFLOW)
  // =========================================================
  const swiperRoot = document.querySelector(".mySwiper");

  if (swiperRoot && typeof Swiper !== "undefined") {
    const galeriaSwiper = new Swiper(".mySwiper", {
      loop: true,
      centeredSlides: true,
      slidesPerView: "auto",
      grabCursor: true,
      slideToClickedSlide: true,
      speed: 700,

      // ✅ Selectores SCOPEADOS: al haber dos swipers en la página,
      // '.swiper-button-next' a secas es ambiguo
      navigation: {
        nextEl: ".mySwiper .swiper-button-next",
        prevEl: ".mySwiper .swiper-button-prev",
      },

      effect: "coverflow",
      coverflowEffect: {
        rotate: 62,
        stretch: -120,
        depth: 380,
        modifier: 1.1,
        slideShadows: false,
        scale: 0.55,
      },

      watchSlidesProgress: true,
      observer: true,
      observeParents: true,
      updateOnWindowResize: true,
    });

    // ✅ FIX galería invisible: con slides de ancho automático (width:auto)
    // y fotos lazy, Swiper se inicializa cuando las imágenes miden 0px.
    // Recalculamos el layout cada vez que una foto termina de cargar.
    swiperRoot.querySelectorAll("img").forEach((img) => {
      if (img.complete) return;
      img.addEventListener("load", () => galeriaSwiper.update());
      img.addEventListener("error", () => galeriaSwiper.update());
    });
  }

  // =========================================================
  // ✅ TESTIMONIOS — slider plano con autoplay suave
  // (deliberadamente distinto al cilindro de la galería)
  // =========================================================
  const testimoniosRoot = document.querySelector(".testimoniosSwiper");

  if (testimoniosRoot && typeof Swiper !== "undefined") {
    const prefiereMenosMovimiento = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    new Swiper(".testimoniosSwiper", {
      // ✅ rewind en vez de loop: con 6 testimonios y 3 visibles,
      // el modo loop no tiene slides suficientes (warning en consola).
      // rewind vuelve al principio al llegar al final, sin clonar slides.
      rewind: true,
      speed: 600,
      spaceBetween: 24,
      slidesPerView: 1,
      breakpoints: {
        700: { slidesPerView: 2 },
        1100: { slidesPerView: 3 },
      },
      // Autoplay lento; se desactiva si el usuario pide menos movimiento
      autoplay: prefiereMenosMovimiento
        ? false
        : {
            delay: 4500,
            pauseOnMouseEnter: true,
            disableOnInteraction: false,
          },
      // ✅ Flechas propias (scopeadas para no chocar con las de la galería)
      navigation: {
        nextEl: ".testimoniosSwiper .swiper-button-next",
        prevEl: ".testimoniosSwiper .swiper-button-prev",
      },
      pagination: {
        el: ".testimonios .swiper-pagination",
        clickable: true,
      },
      grabCursor: true,
      observer: true,
      observeParents: true,
    });
  }

  // --- Lightbox (abrir/cerrar al clicar imagen) ---
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");

  const openLightbox = (src, alt) => {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "Imagen ampliada";
    if (lightboxCaption) lightboxCaption.textContent = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImg) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
    lightboxImg.alt = "";
    if (lightboxCaption) lightboxCaption.textContent = "";
  };

  document.addEventListener("click", (e) => {
    const img = e.target.closest(".galeria .swiper-slide img");
    if (img) {
      openLightbox(img.currentSrc || img.src, img.alt);
      return;
    }
    if (e.target.closest("[data-close]")) closeLightbox();
  });

  document.addEventListener("keydown", (e) => {
    if (
      e.key === "Escape" &&
      lightbox &&
      lightbox.classList.contains("is-open")
    ) {
      closeLightbox();
    }
  });

  // --- Efecto de desvanecimiento al hacer scroll en hero ---
  const hero = document.querySelector(".hero-scroll");
  if (hero) {
    const maxFade = 900;
    const handleScroll = () => {
      const y = window.scrollY;
      const opacity = Math.max(0, 1 - y / maxFade);
      hero.style.opacity = opacity.toFixed(2);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
  }

  // --- Cambiar fondo del header al hacer scroll ---
  const header = document.querySelector("header");
  if (header) {
    const handleHeaderScroll = () => {
      if (window.scrollY > 50) header.classList.add("scrolled");
      else header.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleHeaderScroll, { passive: true });
    handleHeaderScroll();
  }

  // =========================================================
  // CONTACTO — VALIDACIÓN + ENVÍO REAL (FormSubmit)
  // + Botón "Enviando..." anti doble-submit
  // =========================================================
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    const ids = [
      "error-nombre",
      "error-edad",
      "error-email",
      "error-objetivos",
      "error-experiencia",
      "error-disponibilidad",
      "error-privacidad",
    ];

    const showError = (id, msg) => {
      const el = document.getElementById(id);
      if (el) el.textContent = msg;
    };

    const clearAllErrors = () => {
      ids.forEach((id) => showError(id, ""));
    };

    const isEmailValid = (value) =>
      /^\S+@\S+\.\S+$/.test(String(value || "").trim());

    const nombre = document.getElementById("nombre");
    const edad = document.getElementById("edad");
    const email = document.getElementById("email");
    const objetivos = document.getElementById("objetivos");
    const experiencia = document.getElementById("experiencia");
    const disponibilidad = document.getElementById("disponibilidad");
    const privacidad = document.getElementById("privacidad");

    // Botón submit
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const submitBtnText = submitBtn ? submitBtn.textContent : "";

    const setSubmitting = (state) => {
      if (!submitBtn) return;
      if (state) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("aria-disabled", "true");
        submitBtn.textContent = "Enviando…";
      } else {
        submitBtn.disabled = false;
        submitBtn.setAttribute("aria-disabled", "false");
        submitBtn.textContent = submitBtnText || "Enviar solicitud";
      }
    };

    const validateField = (fieldId) => {
      let ok = true;

      if (fieldId === "nombre" && nombre) {
        if (!nombre.value.trim()) {
          showError("error-nombre", "Introduce tu nombre y apellidos");
          ok = false;
        } else showError("error-nombre", "");
      }

      if (fieldId === "edad" && edad) {
        const v = Number(edad.value);
        if (!edad.value || Number.isNaN(v) || v < 14 || v > 90) {
          showError("error-edad", "Edad válida entre 14 y 90");
          ok = false;
        } else showError("error-edad", "");
      }

      if (fieldId === "email" && email) {
        if (!email.value.trim() || !isEmailValid(email.value)) {
          showError("error-email", "Email válido obligatorio");
          ok = false;
        } else showError("error-email", "");
      }

      if (fieldId === "objetivos" && objetivos) {
        if (!objetivos.value) {
          showError("error-objetivos", "Selecciona un objetivo");
          ok = false;
        } else showError("error-objetivos", "");
      }

      if (fieldId === "experiencia" && experiencia) {
        if (!experiencia.value.trim()) {
          showError("error-experiencia", "Cuéntame tu experiencia");
          ok = false;
        } else showError("error-experiencia", "");
      }

      if (fieldId === "disponibilidad" && disponibilidad) {
        if (!disponibilidad.value) {
          showError("error-disponibilidad", "Selecciona disponibilidad");
          ok = false;
        } else showError("error-disponibilidad", "");
      }

      if (fieldId === "privacidad" && privacidad) {
        if (!privacidad.checked) {
          showError(
            "error-privacidad",
            "Debes aceptar la política de privacidad",
          );
          ok = false;
        } else showError("error-privacidad", "");
      }

      return ok;
    };

    // Validación en blur/change (UX)
    if (nombre) nombre.addEventListener("blur", () => validateField("nombre"));
    if (edad) edad.addEventListener("blur", () => validateField("edad"));
    if (email) email.addEventListener("blur", () => validateField("email"));
    if (objetivos)
      objetivos.addEventListener("change", () => validateField("objetivos"));
    if (experiencia)
      experiencia.addEventListener("blur", () => validateField("experiencia"));
    if (disponibilidad)
      disponibilidad.addEventListener("change", () =>
        validateField("disponibilidad"),
      );
    if (privacidad)
      privacidad.addEventListener("change", () => validateField("privacidad"));

    contactForm.addEventListener("submit", (e) => {
      clearAllErrors();

      let ok = true;
      ok = validateField("nombre") && ok;
      ok = validateField("edad") && ok;
      ok = validateField("email") && ok;
      ok = validateField("objetivos") && ok;
      ok = validateField("experiencia") && ok;
      ok = validateField("disponibilidad") && ok;
      ok = validateField("privacidad") && ok;

      // Si hay errores -> no enviar
      if (!ok) {
        e.preventDefault();
        setSubmitting(false);
        return;
      }

      // ✅ Válido: dejamos enviar por POST y bloqueamos doble submit.
      // (FIX: antes se mostraba un "✅ enviado" ANTES de enviar de verdad.
      // El botón "Enviando…" ya comunica el estado sin mentir al usuario.)
      setSubmitting(true);
    });

    // Si el usuario vuelve atrás o recarga, reactivamos botón
    window.addEventListener("pageshow", () => setSubmitting(false));
  }

  console.log("Danity.fit JS conectado ✅");
});

// --- Restablecer menú al cambiar de tamaño ---
// ✅ FIX 6: 900px para coincidir con el media query del CSS (antes 768)
window.addEventListener("resize", () => {
  const navLinks = document.querySelector(".nav-links");
  const menuToggle = document.querySelector(".menu-toggle");
  if (window.innerWidth > 900 && navLinks && menuToggle) {
    navLinks.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
