# Portfolio — Yipenè Ange Cenacle BADO

Portfolio personnel d'un AI/ML Engineer : LLM & RAG, computer vision, data engineering.

**En ligne : https://ange735.github.io**

## Contenu

- **Accueil** — nom généré token par token et assistant IA (questions cliquables, réponses écrites en direct)
- **01 À propos** — profil, poste actuel, langues, distinctions
- **02 Espace latent** — carte interactive des compétences
- **03 Projets** — liste et fiche détaillée (problème / approche / résultat)
- **04 Parcours** — frise filtrable : expérience, formation, associatif
- **05 Contact** — formulaire façon terminal

## Technique

HTML, CSS et JavaScript, sans framework ni étape de build. Thème clair/sombre mémorisé,
arrière-plan animé en canvas, compatible mobile.

```
index.html      structure de la page
css/            style.css (base, accueil, à propos) + sections.css
js/data.js      tout le contenu éditable (profil, projets, parcours, compétences)
js/hero.js      navigation, thème, fond animé, assistant
js/sections.js  espace latent, projets, parcours, contact
assets/         CV.pdf
```

Pour modifier le contenu : éditer `js/data.js`.
