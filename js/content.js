/* =========================================================
   content.js — TOUT le contenu du site est ici.

   Comment compléter :
     un champ rempli   ->  "mon texte"
     un champ à écrire ->  { todo: "la consigne" }   (affiche un encadré rouge)

   Remplacez l'objet { todo: ... } par votre texte entre guillemets,
   le marqueur disparaît. Rien d'autre à toucher.
   ========================================================= */

const CONTENT = {
  /* ---------- identité (faits, déjà remplis) ---------- */
  identite: {
    prenoms: "Yipenè Ange Cenacle",
    nom: "BADO",
    poste: "AI/ML Engineer",
    entreprise: "GO AI CORP",
    depuis: "juillet 2026",
    ecole: "ENSAM Meknès",
    cursus: "cycle ingénieur Data Science & IA, 2ᵉ année",
    lieu: "Meknès, Maroc",
    origine: "né au Burkina Faso",
    email: "baocenacle80@gmail.com",
    github: "https://github.com/Ange735",
    githubLabel: "Ange735",
    linkedin: "https://www.linkedin.com/in/ange-bado",
    linkedinLabel: "in/ange-bado",
    cv: "assets/CV.pdf",
  },

  /* ---------- accueil ---------- */
  accroche: { todo: "Ta phrase d'accroche, en une ou deux lignes, tes mots. Ce que tu fais et pourquoi ça compte. Interdit : « passionné », « innovant », « transformer des idées en réalité »." },

  troisMots: { todo: "Les 3 mots que tes proches utiliseraient pour te décrire, séparés par des virgules. Ex : têtu, curieux, calme." },

  leSoir: { todo: "Une ligne sur ta passion cyber : ce que tu as vraiment monté (machines du home lab, outils, plateformes de CTF). Concret, pas « passionné de cybersécurité »." },

  /* ---------- assistant (réponses pré-écrites, assumées) ---------- */
  assistant: {
    note: "Réponses écrites à l'avance. Aucune inférence ici : les vrais RAG sont dans les projets.",
    questions: [
      { q: "Qui es-tu ?", r: { todo: "Réponds en 2 phrases, comme si on te le demandait à un salon." } },
      { q: "Sur quoi tu travailles en ce moment ?", r: { todo: "AFRIKOPPS en 2 phrases, sans jargon inutile." } },
      { q: "Pourquoi la cybersécurité ?", r: { todo: "2 phrases : ce qui t'attire là-dedans, et ce que ça t'apporte en IA." } },
      { q: "Tu cherches quoi ?", r: { todo: "Stage, PFE, alternance, projets ? Dis ce que tu veux vraiment, et à partir de quand." } },
    ],
  },

  /* ---------- projets racontés en entier ---------- */
  projets: [
    {
      id: "project-afrikopps-intelligence-des-appels-d-offres",
      titre: "AFRIKOPPS",
      sousTitre: "Intelligence des appels d'offres et de l'emploi en Afrique",
      role: "AI/ML Engineer · GO AI CORP",
      annee: "2026 →",
      etat: "en production",
      contexte: "Les appels d'offres publics africains sont éparpillés sur des dizaines de portails (ARCOP, ARMP, DGCMEF, UEMOA, BCEAO), souvent publiés en PDF scannés. Les entreprises qui veulent y répondre passent un temps considérable à les chercher, puis à vérifier si elles remplissent les critères.",
      fait: [
        "Conception et maintenance de plus de 20 sources de scraping multi-pays, avec extraction des résultats d'attribution.",
        "Qualité des données : dédoublonnage par double empreinte SHA-256, normalisation géographique par gazetteers, filtrage par pays, classification sectorielle.",
        "OCR : repli Tesseract sur les avis scannés, découpage des dossiers de soumission, détection des signatures et des cachets.",
        "Requirement Extractor : extraction par LLM des critères d'un dossier d'appel d'offres en JSON structuré, pour le Gap Matching, avec jeu de référence et appels LLM fiabilisés (sortie JSON, relances bornées).",
        "Backend : architecture multi-tenant PostgreSQL et migrations Alembic, bus d'événements Redis Streams avec file d'erreurs surveillée, files Celery dédiées, internationalisation du portail.",
      ],
      plante: { todo: "Ce qui a planté : la source qui change de structure sans prévenir, l'OCR illisible, le LLM qui invente un critère, la file qui explose… Raconte un cas précis." },
      marche: { todo: "Ce qui a marché, et pourquoi : la décision technique dont tu es content." },
      resultat: { todo: "Le résultat mesuré, uniquement ce que tu as le droit de publier (volume traité, taux, temps gagné…). Si tout est confidentiel, écris-le ici, je le formulerai autrement." },
      retiens: { todo: "Ce que tu en retiens, en une ou deux phrases." },
      stack: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "SQLAlchemy", "Alembic", "Tesseract", "LLM", "Docker", "Next.js"],
      liens: [],
    },
    {
      id: "project-sehha-moteur-ia-de-triage-medical",
      titre: "SEHHA",
      sousTitre: "Moteur IA de triage médical",
      role: "Youth Nexus Cyber AI Challenge",
      annee: "2026",
      etat: "prototype de compétition",
      contexte: "Aux urgences, l'orientation d'un patient dépend d'un entretien clinique, alors que certains signes d'alarme doivent déclencher une prise en charge immédiate.",
      fait: [
        "Agent conversationnel LLM menant un entretien clinique adaptatif, avec extraction des informations en JSON structuré.",
        "Exploration des signes d'alarme propres à chaque motif, avec court-circuit immédiat quand ils apparaissent.",
        "Triage sur l'échelle CCMU (1 à 5), inspiré du Manchester Triage System, par raisonnement LLM en plusieurs étapes appuyé sur un RAG de protocoles médicaux (ChromaDB, Sentence-Transformers).",
        "Score de confiance et validation humaine en cas de doute ; orientation du patient (téléconsultation, généraliste, spécialiste, urgence) et notification structurée à l'équipe hospitalière.",
        "Bascule automatique entre LLM cloud (Groq) et LLM local (Ollama) pour garantir la disponibilité.",
      ],
      plante: { todo: "Ce qui a planté : un modèle trop bavard, un triage à côté, une latence impossible en salle d'attente… un cas précis." },
      marche: { todo: "Ce qui a marché, et pourquoi." },
      resultat: { todo: "Le résultat mesuré : classement obtenu, cas de test passés, avis des médecins consultés… ce que tu peux prouver." },
      retiens: { todo: "Ce que tu en retiens." },
      stack: ["Python", "LLM", "RAG", "ChromaDB", "Sentence-Transformers", "Groq", "Ollama"],
      liens: [{ label: "code", href: "https://github.com/Ange735/sehha" }],
    },
    {
      id: "project-smart-blind-assistant",
      titre: "Smart Blind Assistant",
      sousTitre: "Assistance mobile pour personnes malvoyantes",
      role: "Projet académique, en cours",
      annee: "2026 →",
      etat: "en développement",
      contexte: "Retrouver un objet chez soi, se repérer dans une pièce, éviter un obstacle : autant de gestes qui demandent une aide extérieure quand on est malvoyant.",
      fait: [
        "Architecture Flutter + FastAPI : application mobile cross-platform et backend Python communiquant par API REST, pour un traitement en temps réel des images et du texte.",
        "Pipeline de vision : détection et classification des objets de la scène captée par la caméra, puis description vocale de l'environnement.",
        "Module NLP et intégration STT/TTS pour une interaction entièrement mains libres.",
      ],
      plante: { todo: "Ce qui a planté : latence, détection instable, batterie, retours d'utilisateurs… un cas précis." },
      marche: { todo: "Ce qui a marché, et pourquoi." },
      resultat: { todo: "Où en est le projet aujourd'hui, avec un élément vérifiable (test utilisateur, démo, distinction…)." },
      retiens: { todo: "Ce que tu en retiens." },
      stack: ["Flutter", "FastAPI", "OpenCV", "NLP", "STT / TTS"],
      liens: [{ label: "code", href: "https://github.com/Ange735/Smart_Blind_Assistant" }],
    },
  ],

  /* ---------- les autres projets, en liste courte ---------- */
  autresProjets: [
    {
      id: "project-prediction-des-passages-aux-urgences",
      titre: "Prédiction des passages aux urgences",
      note: "Hôpital Mohammed V, Meknès. Données hospitalières réelles, feature engineering temporel (saisonnalité, jours fériés, tendances), comparaison ARIMA / Prophet / LSTM évaluée en MAE et RMSE.",
      href: "https://github.com/Ange735/Prediction_PassageAuxUrgences",
      annee: "2026",
    },
    {
      id: "project-visual-rag-tourisme-au-maroc",
      titre: "Visual RAG — tourisme au Maroc",
      note: "Reconnaissance de monuments marocains par CLIP, recherche dans un index ChromaDB, fiche touristique générée par un LLM local (Ollama).",
      href: "https://github.com/Ange735/visual-rag-tourisme-maroc",
      annee: "2026",
    },
    {
      id: "project-detection-de-fraude-mobile-money",
      titre: "Détection de fraude Mobile Money",
      note: "8 130 transactions non étiquetées, moins de 2 % de fraudes. K-means, choix de k par silhouette, coude et stabilité ; score d'anomalie normalisé par cluster et règles d'alerte explicables, évaluées en précision et rappel.",
      href: "https://github.com/Ange735/mobile-money-fraude-kmeans",
      annee: "2026",
    },
    {
      id: "project-ensam-market",
      titre: "ENSAM Market",
      note: "Marketplace d'achat et de vente entre étudiants de l'ENSAM Meknès, en PHP et MySQL. Le projet le moins IA de la liste, et celui qui m'a appris le plus sur les bases de données.",
      href: "https://github.com/Ange735/E_Com_Dev",
      annee: "2026",
    },
  ],

  /* ---------- parcours ---------- */
  parcours: [
    {
      periode: "Juillet 2026 →",
      type: "poste",
      titre: "AI/ML Engineer",
      lieu: "GO AI CORP · Meknès",
      detail: "Projet AFRIKOPPS : collecte multi-pays, OCR, extraction LLM, moteur de conformité des appels d'offres.",
    },
    {
      periode: "2025 → 2028",
      type: "école",
      titre: "Cycle ingénieur · Data Science & Intelligence Artificielle",
      lieu: "ENSAM Meknès",
      detail: "Machine learning, deep learning, computer vision, NLP, séries temporelles, bases de données, développement web.",
    },
    {
      periode: "2025",
      type: "distinction",
      titre: "1ᵉʳ prix — Compétition Data IA, GO AI ACADEMY",
      lieu: "GO AI ACADEMY",
      detail: { todo: "L'histoire du prix en 2 ou 3 lignes : le sujet, ce que tu as fait, contre qui, et ce que ça a changé pour toi." },
    },
    {
      periode: "2025 →",
      type: "associatif",
      titre: "Cellule informatique, CEEAM",
      lieu: "ENSAM Meknès",
      detail: "Développement et déploiement du site de l'association étudiante.",
    },
    {
      periode: "2025 → 2026",
      type: "associatif",
      titre: "Responsable communication, AEBM",
      lieu: "Meknès",
      detail: "Affiches et communication des événements.",
    },
    {
      periode: "2023 → 2025",
      type: "école",
      titre: "DEUST · Mathématiques, Informatique, Physique",
      lieu: "Faculté des Sciences et Techniques, Fès",
      detail: "Bases en mathématiques, algorithmique et programmation.",
    },
  ],

  certifications: [
    { titre: "Machine Learning Specialization", org: "Andrew Ng · Stanford / Coursera", annee: "2026" },
    { titre: "Mathematics for Machine Learning and Data Science", org: "DeepLearning.AI / Coursera", annee: "2025" },
    { titre: "Data Science & AI", org: "GO AI ACADEMY", annee: "2025" },
  ],

  /* ---------- hors entraînement ---------- */
  horsEntrainement: {
    intro: { todo: "Une phrase d'introduction : ce que tu fais quand tu ne codes pas." },
    blocs: [
      { titre: "Home lab", texte: { todo: "Les machines, le réseau, ce qui tourne dessus, et pourquoi tu l'as monté." } },
      { titre: "Cyber", texte: { todo: "CTF, plateformes (HTB, TryHackMe…), ce que tu y cherches, un truc que tu as compris grâce à ça." } },
      { titre: "Sport", texte: { todo: "Ce que tu pratiques, à quelle fréquence, ce que ça t'apporte." } },
      { titre: "Musique", texte: { todo: "Ce que tu écoutes, ou ce que tu joues. Un nom précis vaut mieux qu'un genre." } },
    ],
  },
};
