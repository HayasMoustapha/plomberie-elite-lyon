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
