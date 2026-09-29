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
