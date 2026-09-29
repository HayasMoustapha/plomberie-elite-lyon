# Plomberie Élite Lyon — site vitrine

Site statique HTML/CSS/JS vanilla (aucune dépendance, aucun build), dark premium, mobile-first.

## Pages
| Fichier | Rôle |
|---|---|
| `index.html` | Accueil : hero « manomètre » (délai d'intervention), bento services, pourquoi nous, avis, carte de zone, devis express |
| `urgence.html` | Conversion urgence : bandeau rouge sticky, appel pleine largeur, jauge 28 min, 6 situations, 3 gestes, rappel immédiat |
| `services.html` | 8 prestations + prix, détail par ancre, slider avant/après, marques partenaires |
| `devis.html` | Formulaire 5 étapes (progression « tuyau »), photos, brouillon auto, récapitulatif |
| `contact.html` | Coordonnées, horaires « ouvert maintenant », Google Maps sombre, formulaire, zone |
| `about.html` | Frise 2011 → aujourd'hui, valeurs, équipe, certifications, compteurs |

Signature visuelle : le **circuit d'eau** — un tuyau lumineux qui relie les sections de l'accueil et se remplit au scroll (desktop), repris dans la frise « À propos » et la progression du devis.

## Structure
- `styles.css` — tokens + composants partagés, puis styles de pages.
- `script.js` — modules partagés (icônes, nav, reveal, compteurs, carousel, formulaires, hero, circuit d'eau), puis modules de pages.
- `_partials/` — **sources** des styles/scripts propres à chaque page. Ils sont recopiés dans `styles.css` / `script.js` entre les marqueurs `@@PARTIALS-START` / `@@PARTIALS-END`. Si vous modifiez un partial, re-fusionnez (ou éditez directement la section correspondante et supprimez `_partials/`).
- `assets/` — logo, favicon, illustrations SVG (`img/equipe.svg`, `img/avant.svg`, `img/apres.svg`).

## Déploiement
- **Netlify (recommandé)** : glisser-déposer le dossier, ou connecter le dépôt ; `netlify.toml` est prêt (pas de build). Les 4 formulaires (`devis-express`, `rappel-urgence`, `devis`, `contact`) sont détectés automatiquement (Netlify Forms, honeypot inclus). Activer les notifications e-mail dans *Site settings → Forms*.
- **Vercel** : fonctionne (`vercel.json`), mais Netlify Forms n'existe pas là-bas : brancher les formulaires sur un service (Formspree, Basin…) via l'attribut `action` de chaque `<form>` — le JS envoie vers `action` s'il est défini.
- En local : `python -m http.server` puis http://localhost:8000 (l'envoi de formulaire affiche alors un message d'échec avec le numéro d'urgence, c'est normal).

## À remplacer avant la mise en ligne
Recherchez ces valeurs dans tous les fichiers :
- **Téléphone** : `06 XX XX XX XX` (affichage) et `+33600000000` (liens `tel:` et JSON-LD).
- **Domaine** : `https://www.plomberie-elite-lyon.fr/` (canonical, og:url, JSON-LD, `sitemap.xml`, `robots.txt`).
- **E-mail** : `contact@plomberie-elite-lyon.fr`.
- **Adresse** : commentaires `TODO` dans `contact.html` (adresse exacte + iframe Maps) ; coordonnées `geo` du JSON-LD.
- **Réseaux sociaux** : liens `href="#"` du footer ; mentions légales / confidentialité.
- **Contenus de démonstration à valider ou remplacer par du réel** — la loi (pratiques commerciales trompeuses, avis en ligne) impose qu'ils soient vrais :
  - avis clients (accueil) et la note « 4,9/5 · 250+ avis » ;
  - chiffres (2 500 interventions, 98 %, 28 min, 12 artisans, techniciens de garde…) ;
  - certifications (Qualibat, RGE, PG Gaz, décennale) — numéros de certificat en `TODO` dans `about.html` ;
  - équipe (prénoms, rôles) et frise historique ; prix « à partir de » des services ;
  - illustrations d'équipe et d'avant/après : à remplacer idéalement par de vraies photos (WebP, `loading="lazy"`, `width`/`height`).
- Le JSON-LD n'inclut volontairement **pas** d'`aggregateRating` : à n'ajouter qu'avec des avis réels et vérifiables.

## Accessibilité & performance
- Navigation clavier complète, focus visible, lien d'évitement, `prefers-reduced-motion` respecté (animations coupées, compteurs affichés directement).
- Contraste AA : texte blanc sur rouge en gras ≥ 1,2 rem ; boutons bleus sur `#2563EB`.
- `backdrop-filter` limité au header, badges et overlays (coût GPU sur Android d'entrée de gamme).
- Pas de framework ; polices Google Fonts en `display=swap`. Pour minifier : `npx lightningcss --minify styles.css -o styles.min.css` et `npx terser script.js -c -m -o script.min.js`, puis pointer les pages vers les `.min`.
