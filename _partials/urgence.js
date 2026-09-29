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
