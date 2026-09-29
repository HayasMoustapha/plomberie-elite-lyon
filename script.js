/* ==========================================================================
   Plomberie Élite Lyon — script.js (vanilla, sans dépendance)
   Chaque module s'active seulement si son markup est présent sur la page.
   Sommaire : icônes · header · reveal · compteurs · reflets cartes · carousel
              carte zone · formulaires · hero (manomètre + parallax)
              circuit d'eau · + modules de pages (fusionnés en fin de fichier)
   ========================================================================== */
(() => {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.documentElement.classList.remove("no-js");

  /* ---------------------------------------------------------------------
     1. Sprite d'icônes — tracés inspirés de Lucide (licence ISC)
     Utilisation : <svg class="i" aria-hidden="true"><use href="#i-phone"/></svg>
     --------------------------------------------------------------------- */
  const ICONS = {
    phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
    pin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    bolt: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    bath: '<path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z"/><path d="M6 12V5.5A2.5 2.5 0 0 1 8.5 3c1.2 0 2.2.8 2.45 1.95"/><path d="M7 19l-1 2M17 19l1 2"/>',
    drop: '<path d="M12 2.7s-6 6.5-6 11.3a6 6 0 0 0 12 0c0-4.8-6-11.3-6-11.3z"/>',
    scan: '<path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="3"/><path d="M12 6v2M12 16v2M6 12h2M16 12h2"/>',
    wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
    pressure: '<path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
    thermo: '<path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/><path d="M11.5 10v7"/>',
    wifi: '<path d="M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0"/><path d="M12 20h.01"/>',
    clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M9 12h6M9 16h4"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    star: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    headset: '<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',
    waves: '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    toilet: '<path d="M7 3h10v6H7z"/><path d="M5 9h14v2a7 7 0 0 1-14 0V9z"/><path d="M9 17.5 8 21h8l-1-3.5"/>',
    radiator: '<rect x="3" y="5" width="18" height="13" rx="2"/><path d="M7.5 5v13M12 5v13M16.5 5v13M6 21v-3M18 21v-3"/>',
    power: '<path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><path d="M12 2v10"/>',
    valve: '<circle cx="12" cy="14" r="3"/><path d="M12 11V5M8 5h8M2 14h7M15 14h7"/>',
    bucket: '<path d="M4 7h16l-1.8 12.6A2 2 0 0 1 16.2 21H7.8a2 2 0 0 1-2-1.4L4 7z"/><path d="M4 7c0-2.2 3.6-4 8-4s8 1.8 8 4"/><path d="M9 12c1 .8 2 1 3 1s2-.2 3-1"/>',
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5M12 3v12"/>',
    camera: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3.5"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    "arrow-left": '<path d="M19 12H5M11 18l-6-6 6-6"/>',
    chevron: '<path d="m9 18 6-6-6-6"/>',
    "chevron-left": '<path d="m15 18-6-6 6-6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M18 6 6 18M6 6l12 12"/>',
    sparkle: '<path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15z"/>',
    leaf: '<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/>',
    home: '<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10z"/><path d="M9 22V12h6v10"/>',
    pipe: '<path d="M3 7h8a4 4 0 0 1 4 4v10"/><path d="M3 12h5a2 2 0 0 1 2 2v7"/><path d="M2 5v9M13 21h9"/>',
    instagram: '<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><path d="M17.5 6.5h.01"/>',
    facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
    linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
    google: '<path d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.6h3.3c1.9-1.8 3-4.4 3-7.5z"/><path d="M12 22c2.7 0 5-.9 6.8-2.4l-3.3-2.6c-.9.6-2.1 1-3.5 1-2.7 0-4.9-1.8-5.7-4.2H2.9v2.6A10 10 0 0 0 12 22z"/><path d="M6.3 13.8a6 6 0 0 1 0-3.7V7.5H2.9a10 10 0 0 0 0 9z"/><path d="M12 6c1.5 0 2.8.5 3.9 1.5l2.9-2.9A10 10 0 0 0 2.9 7.5l3.4 2.6C7.1 7.8 9.3 6 12 6z"/>'
  };
  const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">${
    Object.entries(ICONS).map(([id, d]) => `<symbol id="i-${id}" viewBox="0 0 24 24">${d}</symbol>`).join("")
  }</svg>`;
  document.body.insertAdjacentHTML("afterbegin", sprite);

  /* ---------------------------------------------------------------------
     2. Header : état au scroll + menu mobile (Échap, clic lien, focus)
     --------------------------------------------------------------------- */
  const header = $("[data-header]");
  if (header) {
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const toggle = $(".nav-toggle", header);
    const setOpen = (open) => {
      header.classList.toggle("is-open", open);
      toggle?.setAttribute("aria-expanded", String(open));
      toggle?.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
    };
    toggle?.addEventListener("click", () => setOpen(!header.classList.contains("is-open")));
    $$(".nav-links a", header).forEach((a) => a.addEventListener("click", () => setOpen(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("is-open")) { setOpen(false); toggle?.focus(); }
    });
  }

  /* ---------------------------------------------------------------------
     3. Révélations au scroll (une seule fois par élément)
     --------------------------------------------------------------------- */
  const revealEls = $$(".reveal, [data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------------------------------------------------------------------
     4. Compteurs animés : <strong data-count="2500" data-suffix="+">0</strong>
     Options : data-prefix, data-suffix, data-duration (ms), data-decimals
     --------------------------------------------------------------------- */
  const formatNumber = (n, decimals) =>
    n.toLocaleString("fr-FR", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = parseInt(el.dataset.duration || "1800", 10);
    const from = parseFloat(el.dataset.from || "0");
    const prefix = el.dataset.prefix || "";
    const suffix = el.dataset.suffix || "";
    if (reduceMotion) { el.textContent = prefix + formatNumber(target, decimals) + suffix; return; }
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = prefix + formatNumber(from + (target - from) * eased, decimals) + suffix;
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const counters = $$("[data-count]");
  if (counters.length) {
    if ("IntersectionObserver" in window) {
      const cio = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach((el) => cio.observe(el));
    } else counters.forEach(runCounter);
  }

  /* ---------------------------------------------------------------------
     5. Reflet lumineux qui suit le pointeur sur les cartes
     --------------------------------------------------------------------- */
  if (!reduceMotion && window.matchMedia("(hover: hover)").matches) {
    document.addEventListener("pointermove", (e) => {
      const card = e.target.closest?.(".card");
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    }, { passive: true });
  }

  /* ---------------------------------------------------------------------
     6. Carousel (scroll-snap natif + boutons + points)
     Markup : [data-carousel] > .carousel__track, [data-prev], [data-next], .carousel__dots
     --------------------------------------------------------------------- */
  $$("[data-carousel]").forEach((root) => {
    const track = $(".carousel__track", root);
    const slides = [...track.children];
    const prev = $("[data-prev]", root);
    const next = $("[data-next]", root);
    const dotsWrap = $(".carousel__dots", root);
    const step = () => slides[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 16);

    const dots = slides.map((_, i) => {
      const b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", `Aller à l'avis ${i + 1}`);
      b.addEventListener("click", () => track.scrollTo({ left: i * step(), behavior: reduceMotion ? "auto" : "smooth" }));
      dotsWrap?.appendChild(b);
      return b;
    });

    const update = () => {
      const i = Math.round(track.scrollLeft / step());
      dots.forEach((d, j) => d.setAttribute("aria-current", String(i === j)));
      if (prev) prev.disabled = track.scrollLeft < 4;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
    };
    prev?.addEventListener("click", () => track.scrollBy({ left: -step(), behavior: reduceMotion ? "auto" : "smooth" }));
    next?.addEventListener("click", () => track.scrollBy({ left: step(), behavior: reduceMotion ? "auto" : "smooth" }));
    track.addEventListener("scroll", () => requestAnimationFrame(update), { passive: true });
    track.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); next?.click(); }
      if (e.key === "ArrowLeft") { e.preventDefault(); prev?.click(); }
    });
    window.addEventListener("resize", update);
    update();
  });

  /* ---------------------------------------------------------------------
     7. Carte de zone : survol d'une commune dans la liste ↔ point sur la carte
     Markup : .chips li[data-city="villeurbanne"] + .map-svg g.city[data-city="villeurbanne"]
     --------------------------------------------------------------------- */
  $$("[data-zone]").forEach((zone) => {
    const setActive = (id, on) => {
      $$(`[data-city="${id}"]`, zone).forEach((el) => el.classList.toggle("is-active", on));
    };
    $$(".chips [data-city], .map-svg [data-city]", zone).forEach((el) => {
      const id = el.dataset.city;
      ["pointerenter", "focus"].forEach((ev) => el.addEventListener(ev, () => setActive(id, true)));
      ["pointerleave", "blur"].forEach((ev) => el.addEventListener(ev, () => setActive(id, false)));
    });
  });

  /* ---------------------------------------------------------------------
     8. Formulaires : validation accessible + envoi Netlify Forms (fetch)
     Markup : <form data-form name="…" data-netlify="true"> … <div class="form-status" hidden>
     Hors Netlify (fichier local, Vercel…), l'envoi échoue proprement et affiche
     le numéro d'urgence : branchez l'action sur votre propre endpoint si besoin.
     --------------------------------------------------------------------- */
  const MESSAGES = {
    valueMissing: "Ce champ est requis.",
    typeMismatch: { email: "Saisissez une adresse e-mail valide, ex. nom@domaine.fr.", tel: "Saisissez un numéro valide." },
    patternMismatch: "Le format ne correspond pas : vérifiez la saisie.",
    tooShort: (el) => `Saisissez au moins ${el.minLength} caractères.`
  };
  const fieldError = (el) => {
    const v = el.validity;
    if (v.valid) return "";
    if (v.valueMissing) return el.dataset.msgRequired || MESSAGES.valueMissing;
    if (v.typeMismatch) return MESSAGES.typeMismatch[el.type] || MESSAGES.patternMismatch;
    if (v.patternMismatch) return el.dataset.msgPattern || MESSAGES.patternMismatch;
    if (v.tooShort) return MESSAGES.tooShort(el);
    return el.validationMessage;
  };
  const showError = (el) => {
    const msg = fieldError(el);
    const holder = el.closest(".field")?.querySelector(".error");
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (holder) holder.textContent = msg;
    return !msg;
  };
  /** Valide une liste de champs, focalise le premier en erreur. Exposé pour les modules de pages. */
  const validateFields = (fields) => {
    let firstInvalid = null;
    fields.forEach((el) => { if (!showError(el) && !firstInvalid) firstInvalid = el; });
    firstInvalid?.focus();
    return !firstInvalid;
  };

  const submitForm = async (form) => {
    const btn = $(".btn-submit", form);
    const status = $(".form-status", form);
    btn?.classList.add("is-loading");
    status && (status.hidden = true);
    try {
      const data = new FormData(form);
      const hasFile = [...data.values()].some((v) => v instanceof File && v.size);
      const res = await fetch(form.getAttribute("action") || "/", {
        method: "POST",
        // sans fichier : urlencoded, en retirant les champs fichier vides (sinon "[object File]")
        body: hasFile ? data : new URLSearchParams([...data].filter(([, v]) => typeof v === "string")),
        headers: hasFile ? undefined : { "Content-Type": "application/x-www-form-urlencoded" }
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      btn?.classList.remove("is-loading");
      btn?.classList.add("is-done");
      if (status) {
        status.className = "form-status form-status--ok";
        status.innerHTML = form.dataset.success || "Demande envoyée. Nous vous rappelons très vite.";
        status.hidden = false;
      }
      form.dispatchEvent(new CustomEvent("form:sent"));
    } catch (err) {
      btn?.classList.remove("is-loading");
      if (status) {
        status.className = "form-status form-status--err";
        status.innerHTML = 'L\'envoi n\'a pas abouti. Réessayez, ou appelez-nous directement au <a href="tel:+33600000000"><strong>06 XX XX XX XX</strong></a> (24/7).';
        status.hidden = false;
      }
    }
    status?.focus?.();
  };

  $$("form[data-form]").forEach((form) => {
    form.noValidate = true;
    $$("input, textarea, select", form).forEach((el) => {
      el.addEventListener("blur", () => { if (el.type !== "radio" && (el.value || el.getAttribute("aria-invalid") === "true")) showError(el); });
      el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") showError(el); });
    });
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (form.dataset.multistep !== undefined) return; // géré par le module devis
      const fields = $$("input:not([type=hidden]):not(.hp input), textarea, select", form).filter((el) => el.willValidate);
      if (validateFields(fields)) submitForm(form);
    });
  });

  // API minimale partagée avec les modules de pages
  window.PE = { $, $$, reduceMotion, validateFields, showError, submitForm, runCounter };

  /* ---------------------------------------------------------------------
     9. Hero accueil : entrée orchestrée + manomètre + parallax
     --------------------------------------------------------------------- */
  requestAnimationFrame(() => document.body.classList.add("is-loaded"));

  const gauge = $("[data-gauge]");
  if (gauge) {
    const needle = $(".gauge__needle", gauge);
    const minutes = parseFloat(gauge.dataset.gauge || "28");
    const max = 60;                       // échelle 0 → 60 min sur 240°
    const angle = -120 + (minutes / max) * 240;
    const set = () => { needle.style.transform = `rotate(${angle}deg)`; };
    if (reduceMotion) set(); else setTimeout(set, 500);
  }

  const parallaxLayers = $$("[data-parallax]");
  if (parallaxLayers.length && !reduceMotion) {
    let mx = 0, my = 0, ticking = false;
    const apply = () => {
      const y = window.scrollY;
      parallaxLayers.forEach((l) => {
        const s = parseFloat(l.dataset.parallax);
        l.style.transform = `translate3d(${mx * s * 30}px, ${y * s + my * s * 30}px, 0)`;
      });
      ticking = false;
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(apply); } };
    window.addEventListener("scroll", req, { passive: true });
    if (window.matchMedia("(hover: hover)").matches) {
      window.addEventListener("pointermove", (e) => {
        mx = e.clientX / window.innerWidth - 0.5;
        my = e.clientY / window.innerHeight - 0.5;
        req();
      }, { passive: true });
    }
  }

  /* ---------------------------------------------------------------------
     10. Circuit d'eau (signature) : un tuyau lumineux relie les sections
     de [data-flow] en passant par chaque [data-flow-node], et se remplit
     au rythme du scroll. Desktop uniquement (≥ 1024px).
     --------------------------------------------------------------------- */
  const flowHost = $("[data-flow]");
  if (flowHost) {
    const NS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(NS, "svg");
    svg.classList.add("flow-svg");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = `<defs><linearGradient id="flow-grad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#93C5FD"/><stop offset=".6" stop-color="#3B82F6"/><stop offset="1" stop-color="#F59E0B"/></linearGradient></defs>
      <path class="flow-bed"/><path class="flow-water"/><g class="flow-joints"></g>`;
    flowHost.prepend(svg);
    const bed = $(".flow-bed", svg), water = $(".flow-water", svg), jointsG = $(".flow-joints", svg);
    let length = 0, joints = [];

    const build = () => {
      if (window.innerWidth < 1024) return;
      const hostRect = flowHost.getBoundingClientRect();
      const hostTop = hostRect.top + window.scrollY;
      const W = flowHost.clientWidth, H = flowHost.scrollHeight;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const container = $(".container", flowHost);
      const margin = container ? container.getBoundingClientRect().left - hostRect.left : 40;
      const xL = Math.max(14, margin - 34), xR = W - xL;
      const nodes = $$("[data-flow-node]", flowHost);
      const pts = [{ x: xR, y: 0 }];
      nodes.forEach((n, i) => {
        const y = n.getBoundingClientRect().top + window.scrollY - hostTop + 24;
        const from = pts[pts.length - 1];
        const x = i % 2 === 0 ? xL : xR;
        pts.push({ x: from.x, y }, { x, y });
      });
      pts.push({ x: pts[pts.length - 1].x, y: H });
      // chemin orthogonal aux coins arrondis (coudes de plomberie)
      const r = 28;
      let d = `M${pts[0].x},${pts[0].y}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const p0 = pts[i - 1], p = pts[i], p1 = pts[i + 1];
        const inx = Math.sign(p.x - p0.x), iny = Math.sign(p.y - p0.y);
        const outx = Math.sign(p1.x - p.x), outy = Math.sign(p1.y - p.y);
        d += ` L${p.x - inx * r},${p.y - iny * r} Q${p.x},${p.y} ${p.x + outx * r},${p.y + outy * r}`;
      }
      d += ` L${pts[pts.length - 1].x},${pts[pts.length - 1].y}`;
      bed.setAttribute("d", d);
      water.setAttribute("d", d);
      length = water.getTotalLength();
      water.style.strokeDasharray = `${length}`;
      // raccords aux coudes
      jointsG.innerHTML = "";
      joints = pts.slice(1, -1).map((p) => {
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", p.x); c.setAttribute("cy", p.y); c.setAttribute("r", 7);
        c.setAttribute("class", "flow-joint");
        jointsG.appendChild(c);
        return { el: c, y: p.y };
      });
      update();
    };
    const update = () => {
      if (!length) return;
      const top = flowHost.getBoundingClientRect().top;
      const front = window.innerHeight * 0.65 - top;               // position du "front d'eau"
      const progress = Math.min(1, Math.max(0, front / flowHost.scrollHeight));
      water.style.strokeDashoffset = reduceMotion ? 0 : `${length * (1 - progress)}`;
      joints.forEach((j) => j.el.classList.toggle("is-on", reduceMotion || j.y < front));
    };
    let raf = 0;
    window.addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
    let rt;
    window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(build, 150); });
    window.addEventListener("load", build);
    if (document.fonts?.ready) document.fonts.ready.then(build);
    build();
  }

  /* =====================================================================
     Modules de pages (fusionnés ci-dessous)
     ===================================================================== */
  /* @@PARTIALS-START (généré depuis _partials/) */
/* --- Module de page : urgence.html --- */
/* ---------------------------------------------------------------------
     Page urgence : manomètre compact du délai moyen d'intervention
     Markup : .urg-gauge[data-urg-gauge="28"] > .urg-gauge__needle, .urg-gauge__progress
     Échelle 0 → 60 min sur 180° (aiguille au repos à -90°).
     --------------------------------------------------------------------- */
  const urgGauge = $("[data-urg-gauge]");
  if (urgGauge) {
    const needle = $(".urg-gauge__needle", urgGauge);
    const minutes = parseFloat(urgGauge.dataset.urgGauge || "28");
    const angle = -90 + (Math.min(60, Math.max(0, minutes)) / 60) * 180;
    const setGauge = () => {
      urgGauge.classList.add("is-on");
      if (needle) needle.style.transform = `rotate(${angle}deg)`;
    };
    if (reduceMotion || !("IntersectionObserver" in window)) setGauge();
    else {
      const gio = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) { setGauge(); gio.disconnect(); }
      }, { threshold: 0.4 });
      gio.observe(urgGauge);
    }
  }

/* --- Module de page : services.html --- */
/* ---------------------------------------------------------------------
     Services — comparateur avant/après [data-compare]
     input range (clavier, lecteurs d'écran) + glisser au pointeur.
     Moment orchestré de la page : un balayage d'invite à l'entrée dans l'écran.
     --------------------------------------------------------------------- */
  const svcCompare = $("[data-compare]");
  if (svcCompare) {
    const range = $(".svc-compare__range", svcCompare);
    const stage = $(".svc-compare__stage", svcCompare);
    let touched = false;

    const setPos = (value) => {
      const pos = Math.min(100, Math.max(0, value));
      const rounded = Math.round(pos);
      svcCompare.style.setProperty("--pos", `${pos}%`);
      range.value = String(rounded);
      range.setAttribute("aria-valuetext", `${rounded} % de l'image avant visible`);
      svcCompare.dataset.edge = pos < 14 ? "start" : pos > 86 ? "end" : "";
    };

    range.addEventListener("input", () => { touched = true; setPos(Number(range.value)); });
    range.addEventListener("keydown", (e) => {
      const step = { ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5 }[e.key];
      if (step === undefined) return;
      e.preventDefault();
      touched = true;
      setPos(Number(range.value) + step);
    });
    range.addEventListener("focus", () => svcCompare.classList.toggle("is-focus", range.matches(":focus-visible")));
    range.addEventListener("blur", () => svcCompare.classList.remove("is-focus"));

    const fromPointer = (e) => {
      const r = stage.getBoundingClientRect();
      setPos(((e.clientX - r.left) / r.width) * 100);
    };
    const endDrag = () => svcCompare.classList.remove("is-dragging");
    stage.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      touched = true;
      svcCompare.classList.add("is-dragging");
      stage.setPointerCapture?.(e.pointerId);
      fromPointer(e);
      range.focus({ preventScroll: true });
    });
    stage.addEventListener("pointermove", (e) => {
      if (svcCompare.classList.contains("is-dragging")) fromPointer(e);
    });
    stage.addEventListener("pointerup", endDrag);
    stage.addEventListener("pointercancel", endDrag);
    stage.addEventListener("lostpointercapture", endDrag);

    setPos(Number(range.value) || 50);

    // Balayage d'invite (50 → 72 → 30 → 50), interrompu dès que l'utilisateur agit
    if (!reduceMotion && "IntersectionObserver" in window) {
      const hint = () => {
        const keys = [[0, 50], [800, 72], [1800, 30], [2600, 50]];
        const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
        const start = performance.now();
        const tick = (now) => {
          if (touched) return;
          const t = now - start;
          let i = 1;
          while (i < keys.length - 1 && t > keys[i][0]) i++;
          const [t0, v0] = keys[i - 1];
          const [t1, v1] = keys[i];
          const k = Math.min(1, Math.max(0, (t - t0) / (t1 - t0)));
          setPos(v0 + (v1 - v0) * ease(k));
          if (t < keys[keys.length - 1][0]) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      const cio = new IntersectionObserver((entries) => {
        if (!entries[0].isIntersecting) return;
        cio.disconnect();
        setTimeout(() => { if (!touched) hint(); }, 300);
      }, { threshold: 0.6 });
      cio.observe(stage);
    }
  }

  /* ---------------------------------------------------------------------
     Services — bandeau des marques [data-marquee] : bouton pause (WCAG 2.2.2)
     --------------------------------------------------------------------- */
  const svcMarquee = $("[data-marquee]");
  const svcMarqueeBtn = $("[data-marquee-toggle]");
  if (svcMarquee && svcMarqueeBtn && !reduceMotion) {
    svcMarqueeBtn.hidden = false;
    svcMarqueeBtn.addEventListener("click", () => {
      const paused = svcMarquee.classList.toggle("is-paused");
      svcMarqueeBtn.textContent = paused ? "Reprendre le défilement" : "Mettre en pause le défilement";
    });
  }

/* --- Module de page : devis.html --- */
/* ---------------------------------------------------------------------
     Page devis : formulaire multi-étapes (style Typeform)
     Markup : [data-dv] > form[data-multistep] > fieldset[data-dv-step] × 5
     Sans JS : toutes les étapes restent visibles et le formulaire se soumet
     normalement (les attributs hidden ne sont posés qu'ici).
     --------------------------------------------------------------------- */
  const dvRoot = $("[data-dv]");
  const dvForm = dvRoot && $("form[data-multistep]", dvRoot);
  if (dvRoot && dvForm) {
    const steps = $$("[data-dv-step]", dvForm);
    const total = steps.length;
    const progress = $("[data-dv-progress]", dvRoot);
    const pipe = $(".dv-pipe", dvRoot);
    const joints = $$(".dv-pipe__joint", dvRoot);
    const stepNum = $("[data-dv-step-num]", dvRoot);
    const stepName = $("[data-dv-step-name]", dvRoot);
    const announce = $("[data-dv-announce]", dvRoot);
    const urgentBox = $("[data-dv-urgent]", dvRoot);
    const nav = $("[data-dv-nav]", dvForm);
    const backBtn = $("[data-dv-back]", dvForm);
    const nextBtn = $("[data-dv-next]", dvForm);
    const skipBtn = $("[data-dv-skip]", dvForm);
    const desc = $("#dv-desc", dvForm);
    const count = $("[data-dv-count]", dvForm);
    const suggest = $("[data-dv-suggest]", dvForm);
    const chipsList = $("[data-dv-chips]", dvForm);
    const cp = $("#dv-cp", dvForm);
    const zoneNote = $("[data-dv-zone-note]", dvForm);
    const recap = $("[data-dv-recap]", dvForm);
    const recapList = $("[data-dv-recap-list]", dvForm);
    const done = $("[data-dv-done]", dvRoot);
    const DRAFT_KEY = "pe-devis-draft";
    const ZONE_NOTE = zoneNote ? zoneNote.textContent : "";
    let current = 0;
    let autoTimer = 0;

    const SUGGESTIONS = {
      Urgence: ["Fuite sous l'évier", "WC qui déborde", "Canalisation bouchée", "Plus d'eau chaude", "Dégât des eaux chez le voisin", "Robinet d'arrêt bloqué"],
      Installation: ["Douche à l'italienne", "Remplacement baignoire", "Nouveau chauffe-eau", "WC suspendu", "Meuble double vasque", "Adoucisseur d'eau"],
      Entretien: ["Détartrage chauffe-eau", "Désembouage des radiateurs", "Recherche de fuite préventive", "Joints et robinetterie à reprendre", "Contrat de maintenance annuel"],
      "": ["Fuite sous l'évier", "Douche à l'italienne", "Détartrage chauffe-eau", "Canalisation bouchée"]
    };

    const radioValue = (name) => $(`input[name="${name}"]:checked`, dvForm)?.value || "";
    const stepFields = (step) =>
      $$("input, textarea, select", step).filter((el) => el.willValidate && el.type !== "file" && !el.closest(".hp"));

    /* --- Brouillon (sessionStorage, sans les fichiers) --- */
    const DRAFT_FIELDS = ["prestation", "description", "nom", "telephone", "email", "code_postal", "intervention_rapide"];
    const saveDraft = () => {
      try {
        const data = { step: current };
        DRAFT_FIELDS.forEach((n) => {
          const el = dvForm.elements[n];
          data[n] = el ? (el instanceof RadioNodeList ? radioValue(n) : el.value) : "";
        });
        sessionStorage.setItem(DRAFT_KEY, JSON.stringify(data));
      } catch (e) { /* stockage indisponible : on continue sans brouillon */ }
    };
    const loadDraft = () => {
      try { return JSON.parse(sessionStorage.getItem(DRAFT_KEY) || "null"); } catch (e) { return null; }
    };
    const clearDraft = () => { try { sessionStorage.removeItem(DRAFT_KEY); } catch (e) { /* rien */ } };

    /* --- Étape 1 : prestation → encart urgence + suggestions --- */
    const renderChips = () => {
      if (!chipsList) return;
      if (suggest) suggest.hidden = false;
      const list = SUGGESTIONS[radioValue("prestation")] || SUGGESTIONS[""];
      chipsList.innerHTML = "";
      list.forEach((text) => {
        const li = document.createElement("li");
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dv-chip";
        b.textContent = text;
        b.setAttribute("aria-pressed", "false");
        b.addEventListener("click", () => toggleSuggestion(text));
        li.appendChild(b);
        chipsList.appendChild(li);
      });
      syncChips();
    };
    const syncChips = () => {
      if (!chipsList) return;
      const val = desc.value.toLowerCase();
      $$(".dv-chip", chipsList).forEach((b) => b.setAttribute("aria-pressed", String(val.includes(b.textContent.toLowerCase()))));
    };
    const toggleSuggestion = (text) => {
      const v = desc.value;
      const i = v.toLowerCase().indexOf(text.toLowerCase());
      if (i > -1) {
        desc.value = (v.slice(0, i) + v.slice(i + text.length)).replace(/^[\s.,;:]+|[\s,;:]+$/g, "").replace(/\.\s*\./g, ".").replace(/\s{2,}/g, " ");
      } else {
        const base = v.trim();
        desc.value = base ? `${base.replace(/[.,;]$/, "")}. ${text}` : `${text} : `;
      }
      desc.dispatchEvent(new Event("input", { bubbles: true }));
      desc.focus();
      const end = desc.value.length;
      desc.setSelectionRange(end, end);
    };
    const onPrestation = () => {
      if (urgentBox) urgentBox.hidden = radioValue("prestation") !== "Urgence";
      renderChips();
    };

    /* --- Étape 2 : compteur --- */
    const updateCount = () => {
      if (!count) return;
      const n = desc.value.trim().length;
      const min = desc.minLength > 0 ? desc.minLength : 20;
      count.textContent = n < min ? `${n} / ${min} caractères minimum` : `${n} caractères · parfait`;
      count.classList.toggle("is-ok", n >= min);
      syncChips();
    };

    /* --- Étape 4 : zone d'intervention (prévenir sans bloquer) --- */
    const updateZone = () => {
      if (!zoneNote || !cp) return;
      const v = cp.value.trim();
      const out = /^\d{5}$/.test(v) && !/^(69|01|38)\d{3}$/.test(v);
      zoneNote.classList.toggle("is-warn", out);
      zoneNote.textContent = out
        ? "Ce code postal semble hors de notre zone (Rhône, Ain, Nord-Isère). Envoyez quand même : nous vous dirons vite si nous pouvons intervenir."
        : ZONE_NOTE;
    };

    /* --- Étape 3 : photos (drag & drop, aperçus, limites) --- */
    const photoInput = $("#dv-photos", dvForm);
    const extraInputs = $$("[data-dv-extra]", dvForm);
    const dropField = $("[data-dv-drop]", dvForm);
    const dropZone = dropField && $(".dv-drop__zone", dropField);
    const thumbs = $("[data-dv-thumbs]", dvForm);
    const photoError = $("[data-dv-photo-error]", dvForm);
    const MAX_FILES = 3, MAX_SIZE = 8 * 1024 * 1024, MAX_TOTAL = 8 * 1024 * 1024; // Netlify : 8 Mo par requête
    const canRebuild = (() => { try { return !!new DataTransfer(); } catch (e) { return false; } })();
    let photos = [];   // [{ file, url }]

    const fmtSize = (b) => (b >= 1048576 ? `${(b / 1048576).toFixed(1).replace(".", ",")} Mo` : `${Math.max(1, Math.round(b / 1024))} Ko`);
    const setInputFiles = (input, files) => {
      if (!canRebuild || !input) return;
      const dt = new DataTransfer();
      files.forEach((f) => dt.items.add(f));
      input.files = dt.files;
    };
    const renderThumbs = () => {
      if (!thumbs) return;
      thumbs.innerHTML = "";
      photos.forEach((p, i) => {
        const li = document.createElement("li");
        li.className = "dv-thumb";
        const img = document.createElement("img");
        img.src = p.url;
        img.alt = `Aperçu : ${p.file.name}`;
        img.width = 96; img.height = 96;
        const meta = document.createElement("span");
        meta.className = "dv-thumb__meta";
        meta.textContent = fmtSize(p.file.size);
        const rm = document.createElement("button");
        rm.type = "button";
        rm.className = "dv-thumb__rm";
        rm.setAttribute("aria-label", `Supprimer la photo ${p.file.name}`);
        rm.innerHTML = '<svg class="i" aria-hidden="true"><use href="#i-close"/></svg>';
        rm.addEventListener("click", () => removePhoto(i));
        li.append(img, meta, rm);
        thumbs.appendChild(li);
      });
      dropField?.classList.toggle("is-full", photos.length >= MAX_FILES);
    };
    const syncPhotoInput = () => setInputFiles(photoInput, photos.map((p) => p.file));
    const addPhotos = (fileList) => {
      const errors = [];
      let totalSize = photos.reduce((s, p) => s + p.file.size, 0);
      [...fileList].forEach((file) => {
        if (photos.some((p) => p.file.name === file.name && p.file.size === file.size)) return;
        if (!file.type.startsWith("image/")) { errors.push(`« ${file.name} » n'est pas une image.`); return; }
        if (file.size > MAX_SIZE) { errors.push(`« ${file.name} » dépasse 8 Mo (${fmtSize(file.size)}).`); return; }
        if (photos.length >= MAX_FILES) { errors.push(`3 photos maximum : « ${file.name} » n'a pas été ajoutée.`); return; }
        if (totalSize + file.size > MAX_TOTAL) { errors.push(`« ${file.name} » ferait dépasser 8 Mo au total : réduisez la taille des photos ou envoyez-en moins.`); return; }
        totalSize += file.size;
        photos.push({ file, url: URL.createObjectURL(file) });
      });
      if (photoError) photoError.textContent = errors.join(" ");
      if (canRebuild) syncPhotoInput();
      renderThumbs();
    };
    const removePhoto = (i) => {
      const [p] = photos.splice(i, 1);
      if (p) URL.revokeObjectURL(p.url);
      if (!canRebuild) { photos.forEach((x) => URL.revokeObjectURL(x.url)); photos = []; if (photoInput) photoInput.value = ""; }
      if (photoError) photoError.textContent = "";
      syncPhotoInput();
      renderThumbs();
      const next = $$(".dv-thumb__rm", thumbs)[Math.min(i, photos.length - 1)];
      (next || photoInput)?.focus();
    };
    /* Netlify n'accepte qu'un fichier par champ : répartit photos → photos / photo_2 / photo_3 */
    const distributePhotos = () => {
      if (!canRebuild || !photoInput) return;
      setInputFiles(photoInput, photos[0] ? [photos[0].file] : []);
      extraInputs.forEach((input, k) => setInputFiles(input, photos[k + 1] ? [photos[k + 1].file] : []));
    };

    if (photoInput) {
      photoInput.addEventListener("change", () => {
        const picked = [...photoInput.files];
        if (canRebuild) addPhotos(picked);
        else {
          // Navigateur ancien : pas de reconstruction possible, on vérifie seulement
          photos.forEach((p) => URL.revokeObjectURL(p.url));
          photos = [];
          addPhotos(picked);
          if (picked.length > photos.length) { photoInput.value = ""; photos.forEach((p) => URL.revokeObjectURL(p.url)); photos = []; renderThumbs(); }
        }
      });
    }
    if (dropZone && canRebuild) {
      ["dragenter", "dragover"].forEach((ev) => dropZone.addEventListener(ev, (e) => {
        e.preventDefault();
        dropField.classList.add("is-drag");
      }));
      ["dragleave", "dragend"].forEach((ev) => dropZone.addEventListener(ev, (e) => {
        if (!dropZone.contains(e.relatedTarget)) dropField.classList.remove("is-drag");
      }));
      dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropField.classList.remove("is-drag");
        if (e.dataTransfer?.files?.length) addPhotos(e.dataTransfer.files);
      });
    }
    window.addEventListener("pagehide", () => photos.forEach((p) => URL.revokeObjectURL(p.url)));

    /* --- Récapitulatif (étape 5 + écran de confirmation) --- */
    const recapRows = () => {
      const d = desc.value.trim();
      const contact = [dvForm.elements.nom?.value, dvForm.elements.telephone?.value, dvForm.elements.email?.value, cp?.value]
        .map((v) => (v || "").trim()).filter(Boolean).join(" · ");
      return [
        { label: "Prestation", value: radioValue("prestation") || "Non renseignée", step: 0 },
        { label: "Description", value: d ? (d.length > 160 ? `${d.slice(0, 157)}…` : d) : "Non renseignée", step: 1 },
        { label: "Photos", value: photos.length ? `${photos.length} photo${photos.length > 1 ? "s" : ""} jointe${photos.length > 1 ? "s" : ""}` : "Aucune", step: 2 },
        { label: "Coordonnées", value: contact || "Non renseignées", step: 3 },
        { label: "Intervention rapide", value: radioValue("intervention_rapide") || "À choisir ci-dessus", step: total - 1 }
      ];
    };
    const fillRecap = (list, withEdit) => {
      if (!list) return;
      list.innerHTML = "";
      recapRows().forEach((row) => {
        const wrap = document.createElement("div");
        wrap.className = "dv-recap__row";
        const dt = document.createElement("dt");
        dt.textContent = row.label;
        const dd = document.createElement("dd");
        const span = document.createElement("span");
        span.textContent = row.value;
        dd.appendChild(span);
        if (withEdit && row.step !== total - 1) {
          const b = document.createElement("button");
          b.type = "button";
          b.className = "dv-recap__edit";
          b.textContent = "Modifier";
          b.setAttribute("aria-label", `Modifier : ${row.label.toLowerCase()}`);
          b.addEventListener("click", () => go(row.step));
          dd.appendChild(b);
        }
        wrap.append(dt, dd);
        list.appendChild(wrap);
      });
    };

    /* --- Navigation entre étapes --- */
    const updateProgress = () => {
      const name = steps[current].dataset.dvName || "";
      const text = `Étape ${current + 1} sur ${total} : ${name.toLowerCase()}`;
      if (stepNum) stepNum.textContent = String(current + 1);
      if (stepName) stepName.textContent = name;
      if (pipe) {
        pipe.style.setProperty("--p", String(total > 1 ? current / (total - 1) : 1));
        pipe.setAttribute("aria-valuenow", String(current + 1));
        pipe.setAttribute("aria-valuetext", text);
      }
      joints.forEach((j, k) => {
        j.classList.toggle("is-on", k <= current);
        j.classList.toggle("is-current", k === current);
      });
      return text;
    };
    const go = (to, { focus = true, dir } = {}) => {
      clearTimeout(autoTimer);
      to = Math.max(0, Math.min(total - 1, to));
      const from = current;
      current = to;
      steps.forEach((s, k) => {
        s.hidden = k !== to;
        s.classList.remove("dv-in-next", "dv-in-prev");
      });
      if (!reduceMotion && focus && from !== to) {
        void steps[to].offsetWidth; // relance l'animation
        steps[to].classList.add((dir ?? to - from) > 0 ? "dv-in-next" : "dv-in-prev");
      }
      if (backBtn) backBtn.hidden = to === 0;
      if (nextBtn) nextBtn.hidden = to === total - 1;
      if (skipBtn) skipBtn.hidden = false;
      if (to === total - 1) { fillRecap(recapList, true); if (recap) recap.hidden = false; }
      const text = updateProgress();
      if (focus) {
        if (announce) announce.textContent = text;
        const legend = $(".dv-step__legend", steps[to]);
        legend?.focus({ preventScroll: true });
        const top = dvRoot.getBoundingClientRect().top;
        if (top < 0 || top > window.innerHeight * 0.4) dvRoot.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
      saveDraft();
    };
    const next = () => {
      if (!validateFields(stepFields(steps[current]))) return;
      if (current < total - 1) go(current + 1);
    };

    backBtn?.addEventListener("click", () => go(current - 1));
    nextBtn?.addEventListener("click", next);
    skipBtn?.addEventListener("click", () => { if (photoError) photoError.textContent = ""; go(current + 1); });

    // Entrée dans un champ = continuer (jamais d'envoi prématuré)
    dvForm.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" || e.isComposing) return;
      const t = e.target;
      if (!(t instanceof HTMLInputElement) || ["file", "button", "submit", "checkbox"].includes(t.type)) return;
      e.preventDefault();
      if (current < total - 1) next();
    });

    // Étape 1 : passage automatique après choix (souris, toucher, Espace) ; pas avec les flèches
    let arrowNav = false;
    $$('input[name="prestation"]', dvForm).forEach((radio) => {
      radio.addEventListener("keydown", (e) => { arrowNav = e.key.startsWith("Arrow"); });
      radio.addEventListener("pointerdown", () => { arrowNav = false; });
      radio.closest("label")?.addEventListener("pointerdown", () => { arrowNav = false; });
      radio.addEventListener("change", () => {
        onPrestation();
        saveDraft();
        if (arrowNav) { arrowNav = false; return; }
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => { if (current === 0) go(1); }, reduceMotion ? 250 : 450);
      });
    });

    desc?.addEventListener("input", updateCount);
    cp?.addEventListener("input", updateZone);
    let saveTimer = 0;
    dvForm.addEventListener("input", () => { clearTimeout(saveTimer); saveTimer = setTimeout(saveDraft, 300); });
    dvForm.addEventListener("change", (e) => {
      // un choix radio efface l'erreur de tout le groupe
      if (e.target.type === "radio") $$(`input[name="${e.target.name}"]`, dvForm).forEach((r) => showError(r));
      saveDraft();
      if (current === total - 1) fillRecap(recapList, true);
    });

    /* --- Envoi --- */
    dvForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // première étape invalide (toutes étapes confondues)
      const bad = steps.findIndex((s) => stepFields(s).some((el) => !el.checkValidity()));
      if (bad > -1) {
        if (bad !== current) go(bad);
        validateFields(stepFields(steps[bad]));
        return;
      }
      distributePhotos();
      submitForm(dvForm);
    });

    dvForm.addEventListener("form:sent", () => {
      clearDraft();
      if (pipe) { pipe.style.setProperty("--p", "1"); pipe.classList.add("is-full"); }
      joints.forEach((j) => j.classList.add("is-on"));
      const first = (dvForm.elements.nom?.value || "").trim().split(/\s+/)[0];
      const titleEl = $("[data-dv-done-title]", done);
      if (titleEl) titleEl.textContent = first ? `Demande reçue, merci ${first}` : "Demande reçue, merci";
      const delay = $("[data-dv-done-delay]", done);
      if (delay && radioValue("prestation") === "Urgence") {
        delay.textContent = "Urgence notée : un conseiller vous rappelle dans les minutes qui suivent. Si l'eau coule encore, coupez le robinet d'arrêt général.";
      } else if (delay && radioValue("intervention_rapide") === "Oui") {
        delay.textContent = "Un conseiller vous rappelle sous 1 h ouvrée (lun – sam, 7h – 20h) pour caler une intervention sous 24 à 48 h.";
      }
      fillRecap($("[data-dv-done-recap]", done), false);
      const show = () => {
        dvForm.hidden = true;
        if (urgentBox) urgentBox.hidden = true;
        if (progress) progress.hidden = true;
        if (done) {
          done.hidden = false;
          if (!reduceMotion) done.classList.add("dv-in-next");
          dvRoot.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
          titleEl?.focus({ preventScroll: true });
        }
      };
      setTimeout(show, reduceMotion ? 0 : 900);
    });

    /* --- Initialisation (amélioration progressive) --- */
    dvRoot.classList.add("is-enhanced");
    if (progress) progress.hidden = false;
    if (nav) nav.hidden = false;
    const draft = loadDraft();
    let startStep = 0;
    if (draft) {
      DRAFT_FIELDS.forEach((n) => {
        const el = dvForm.elements[n];
        const v = draft[n];
        if (!el || typeof v !== "string" || !v) return;
        if (el instanceof RadioNodeList) {
          const r = $$(`input[name="${n}"]`, dvForm).find((x) => x.value === v);
          if (r) r.checked = true;
        } else el.value = v;
      });
      startStep = Number.isInteger(draft.step) ? draft.step : 0;
    }
    onPrestation();
    updateCount();
    updateZone();
    go(startStep, { focus: false });
  }

/* --- Module de page : contact.html --- */
/* ---------------------------------------------------------------------
     Page contact : statut d'ouverture en direct (heure de Paris)
     Markup : [data-ct-hours] > [data-ct-status] .ct-status__label
              + lignes [data-day="Mon Tue …"] (jours au format court anglais)
     Ouvert : lundi → samedi, 7h00 → 19h59. Dimanche : urgences uniquement.
     --------------------------------------------------------------------- */
  const ctHours = $("[data-ct-hours]");
  if (ctHours) {
    const ctStatus = $("[data-ct-status]", ctHours);
    const ctLabel = $(".ct-status__label", ctStatus);
    let ctFmt = null;
    try {
      ctFmt = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Paris", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
      });
    } catch (e) { ctFmt = null; }

    const ctUpdate = () => {
      if (!ctFmt || !ctStatus || !ctLabel) return;
      const parts = {};
      ctFmt.formatToParts(new Date()).forEach((p) => { parts[p.type] = p.value; });
      const day = parts.weekday;                                       // "Mon" … "Sun"
      const mins = (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10);
      const open = day !== "Sun" && mins >= 7 * 60 && mins < 20 * 60;
      const text = open ? "Ouvert maintenant, jusqu'à 20h" : "Fermé, urgences 24/7 joignables";
      ctStatus.classList.toggle("ct-status--open", open);
      ctStatus.classList.toggle("ct-status--closed", !open);
      if (ctLabel.textContent !== text) ctLabel.textContent = text;   // n'annonce qu'en cas de changement
      $$("[data-day]", ctHours).forEach((row) => {
        row.classList.toggle("is-today", row.dataset.day.split(" ").includes(day));
      });
    };
    ctUpdate();
    ctStatus?.setAttribute("role", "status"); // n'annonce que les changements ultérieurs
    setInterval(ctUpdate, 60 * 1000);
  }

/* --- Module de page : about.html --- */
/* --- À propos : frise dont le tuyau se remplit au scroll -------------------
   Markup : [data-ab-timeline] > .ab-tl__pipe > .ab-tl__water
                               > .ab-tl__list > .ab-tl__item > .ab-tl__joint
   Pose --ab-fill (0 → 1) sur la frise et .is-on sur chaque date atteinte.
   ------------------------------------------------------------------------- */
const abTimeline = $("[data-ab-timeline]");
if (abTimeline) {
  const abItems = $$(".ab-tl__item", abTimeline);
  if (reduceMotion) {
    abTimeline.style.setProperty("--ab-fill", "1");
    abItems.forEach((it) => it.classList.add("is-on"));
  } else {
    abTimeline.classList.add("ab-tl--live");
    let abRaf = 0;
    const abUpdate = () => {
      abRaf = 0;
      const rect = abTimeline.getBoundingClientRect();
      const front = window.innerHeight * 0.6 - rect.top;          // front d'eau, en px depuis le haut de la frise
      const fill = Math.min(1, Math.max(0, front / rect.height));
      abTimeline.style.setProperty("--ab-fill", fill.toFixed(4));
      abItems.forEach((it) => {
        const joint = $(".ab-tl__joint", it);
        const y = it.offsetTop + (joint ? joint.offsetTop + joint.offsetHeight / 2 : 0);
        it.classList.toggle("is-on", y <= front);
      });
    };
    const abRequest = () => { if (!abRaf) abRaf = requestAnimationFrame(abUpdate); };
    window.addEventListener("scroll", abRequest, { passive: true });
    window.addEventListener("resize", abRequest);
    abUpdate();
  }
}
  /* @@PARTIALS-END */
})();
