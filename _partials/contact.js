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
