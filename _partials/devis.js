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
