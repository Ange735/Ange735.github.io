/* =========================================================
   DONNÉES DU PORTFOLIO — modifiez ce fichier pour mettre
   à jour le contenu sans toucher au design.
   ========================================================= */

const PROFILE = {
  // Chaque élément = un "token" généré dans l'accueil.
  // Mettez un espace au début des mots suivants. Le dernier mot est mis en couleur.
  nameTokens: ["Yipenè", " Ange", " Cenacle", " BADO"],
};

/* ---------- Accueil · assistant IA (questions / réponses) ----------
   Entourez des mots avec des *étoiles* pour les mettre en valeur.   */
const ASSISTANT = [
  {
    q: "Qui es-tu ?",
    a: "Je suis *AI/ML Engineer* chez *GO AI CORP* et étudiant ingénieur en *Data Science & IA* à l'ENSAM Meknès.",
  },
  {
    q: "Sur quoi tu travailles ?",
    a: "Sur *AFRIKOPPS*, une plateforme qui collecte et analyse les *appels d'offres* et les offres d'emploi en Afrique : scraping multi-pays, *OCR* des documents scannés et extraction par *LLM*.",
  },
  {
    q: "Tes spécialités ?",
    a: "Les *LLM* et le *RAG*, la *vision par ordinateur*, et la mise en production : FastAPI, Celery, Redis, PostgreSQL, Docker.",
  },
  {
    q: "Un projet marquant ?",
    a: "*SEHHA*, un moteur de *triage médical* : un agent LLM mène l'entretien clinique, détecte les signes d'alarme et oriente le patient selon l'échelle *CCMU*.",
  },
  {
    q: "Comment te contacter ?",
    a: "Par email à *baocenacle80@gmail.com*, ou via le formulaire en bas de page : il ouvre directement votre messagerie.",
  },
];

/* ---------- 02 · Espace latent (compétences) ----------
   x, y : position dans le plan (0–100)
   level : maîtrise 1–5 (taille du point)                */
// color : thème sombre · light : thème clair
const SKILL_CLUSTERS = [
  { id: "llm",     label: "NLP & LLM",        color: "#C6F432", light: "#5C8A00" },
  { id: "ml",      label: "Machine Learning", color: "#7CE0FF", light: "#0087B5" },
  { id: "vision",  label: "Computer Vision",  color: "#FF8A5B", light: "#D9531E" },
  { id: "backend", label: "Backend & MLOps",  color: "#B79CFF", light: "#6E4FD6" },
  { id: "data",    label: "Data & Langages",  color: "#F5F1E8", light: "#2C2A26" },
];

const SKILLS = [
  // NLP & LLM
  { name: "Transformers", c: "llm", x: 22, y: 22, level: 5 },
  { name: "RAG", c: "llm", x: 31, y: 15, level: 5 },
  { name: "LangChain", c: "llm", x: 15, y: 15, level: 4 },
  { name: "ChromaDB / FAISS", c: "llm", x: 34, y: 29, level: 4 },
  { name: "Sentence-Transformers", c: "llm", x: 12, y: 31, level: 4 },
  { name: "spaCy / NLTK", c: "llm", x: 24, y: 35, level: 3 },
  // Machine Learning
  { name: "scikit-learn", c: "ml", x: 52, y: 20, level: 5 },
  { name: "TensorFlow", c: "ml", x: 61, y: 13, level: 4 },
  { name: "HuggingFace", c: "ml", x: 64, y: 27, level: 4 },
  { name: "Séries temporelles", c: "ml", x: 58, y: 36, level: 4 },
  { name: "Optuna", c: "ml", x: 50, y: 33, level: 3 },
  // Computer Vision
  { name: "OpenCV", c: "vision", x: 78, y: 26, level: 4 },
  { name: "YOLO", c: "vision", x: 86, y: 16, level: 4 },
  { name: "CNN", c: "vision", x: 76, y: 42, level: 4 },
  { name: "MediaPipe", c: "vision", x: 92, y: 34, level: 3 },
  { name: "CLIP", c: "vision", x: 91, y: 46, level: 3 },
  // Backend & MLOps
  { name: "FastAPI", c: "backend", x: 88, y: 64, level: 5 },
  { name: "Celery / Redis", c: "backend", x: 68, y: 70, level: 4 },
  { name: "PostgreSQL", c: "backend", x: 78, y: 76, level: 4 },
  { name: "Docker", c: "backend", x: 62, y: 80, level: 4 },
  { name: "SQLAlchemy", c: "backend", x: 72, y: 89, level: 3 },
  { name: "Git / GitHub", c: "backend", x: 91, y: 85, level: 4 },
  // Data & Langages
  { name: "Python", c: "data", x: 30, y: 70, level: 5 },
  { name: "Pandas / NumPy", c: "data", x: 38, y: 80, level: 5 },
  { name: "SQL", c: "data", x: 20, y: 80, level: 4 },
  { name: "Web scraping", c: "data", x: 16, y: 62, level: 4 },
  { name: "OCR (Tesseract)", c: "data", x: 42, y: 66, level: 4 },
  { name: "Java / C / PHP", c: "data", x: 26, y: 89, level: 3 },
];

/* ---------- 03 · Projets ----------
   status : "production" s'affiche en vert, tout autre texte en orange
   links  : mettez "" pour masquer un lien                              */
const PROJECTS = [
  {
    title: "AFRIKOPPS — intelligence des appels d'offres",
    cat: "LLM · Data",
    year: "2026",
    status: "production",
    summary: "Plateforme multi-pays qui collecte et analyse les appels d'offres, offres d'emploi et stages en Afrique, chez GO AI CORP.",
    problem: "Les opportunités publiques sont éparpillées sur des dizaines de portails, souvent en PDF scannés, et les dossiers d'appel d'offres sont longs à décortiquer.",
    approach: "Plus de 20 sources de scraping (ARCOP, ARMP, DGCMEF, UEMOA, BCEAO), repli OCR Tesseract sur les avis scannés, puis un Requirement Extractor qui sort les critères d'un DAO en JSON structuré pour le Gap Matching.",
    result: "Données dédoublonnées (double empreinte SHA-256), normalisées par pays et secteur, servies par une architecture multi-tenant avec files Celery et bus Redis Streams.",
    metrics: [{ k: "sources de collecte", v: "20+" }, { k: "portails publics", v: "5" }, { k: "extraction DAO", v: "JSON" }],
    stack: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "Tesseract", "LLM", "Docker"],
    links: { code: "", demo: "" },
  },
  {
    title: "SEHHA — moteur IA de triage médical",
    cat: "LLM · Santé",
    year: "2026",
    status: "hackathon",
    summary: "Le moteur IA d'une plateforme hospitalière, développé pour le Youth Nexus Cyber AI Challenge.",
    problem: "Aux urgences, l'orientation d'un patient dépend d'un entretien clinique long, alors que les signes d'alarme doivent être repérés immédiatement.",
    approach: "Un agent conversationnel LLM mène un entretien adaptatif, extrait les réponses en JSON et raisonne en plusieurs étapes sur un RAG de protocoles médicaux (ChromaDB, Sentence-Transformers).",
    result: "Triage sur l'échelle CCMU (1 à 5), court-circuit immédiat sur les signes d'alarme, score de confiance avec validation humaine, et bascule automatique entre LLM cloud (Groq) et local (Ollama).",
    metrics: [{ k: "échelle de triage", v: "CCMU 1-5" }, { k: "base de connaissances", v: "RAG" }, { k: "secours LLM", v: "cloud ↔ local" }],
    stack: ["Python", "LLM", "RAG", "ChromaDB", "Sentence-Transformers", "Ollama"],
    links: { code: "https://github.com/Ange735/sehha", demo: "" },
  },
  {
    title: "Smart Blind Assistant",
    cat: "Vision · Mobile",
    year: "2026",
    status: "en cours",
    summary: "Application mobile d'assistance aux personnes malvoyantes : retrouver ses affaires, se repérer chez soi, éviter les obstacles.",
    problem: "Se déplacer et retrouver un objet chez soi reste difficile sans aide extérieure quand on est malvoyant.",
    approach: "Application Flutter reliée à un backend FastAPI : détection et classification d'objets en temps réel sur le flux de la caméra, description vocale de la scène, module NLP et intégration STT/TTS.",
    result: "Une interaction entièrement mains libres, aujourd'hui poussée vers une solution commercialisable.",
    metrics: [{ k: "interaction", v: "100 % vocale" }, { k: "traitement", v: "temps réel" }],
    stack: ["Flutter", "FastAPI", "OpenCV", "NLP", "STT / TTS"],
    links: { code: "https://github.com/Ange735/Smart_Blind_Assistant", demo: "" },
  },
  {
    title: "Prédiction des passages aux urgences",
    cat: "Séries temporelles",
    year: "2026",
    status: "terminé",
    summary: "Prévision du flux quotidien de patients à l'hôpital Mohammed V de Meknès, pour mieux dimensionner les équipes.",
    problem: "Sans visibilité sur l'affluence à venir, les plannings des urgences sont subis plutôt que préparés.",
    approach: "Nettoyage de données hospitalières réelles, traitement des valeurs manquantes et feature engineering temporel : saisonnalité, jours fériés, tendances.",
    result: "Comparaison d'ARIMA, Prophet et LSTM sur les mêmes données, évaluée en MAE et RMSE.",
    metrics: [{ k: "modèles comparés", v: "3" }, { k: "évaluation", v: "MAE · RMSE" }],
    stack: ["Python", "ARIMA", "Prophet", "LSTM", "Pandas"],
    links: { code: "https://github.com/Ange735/Prediction_PassageAuxUrgences", demo: "" },
  },
  {
    title: "Visual RAG — tourisme au Maroc",
    cat: "Vision · RAG",
    year: "2026",
    status: "terminé",
    summary: "Reconnaître un monument marocain à partir d'une photo, puis générer sa fiche touristique.",
    problem: "Une photo de monument ne dit rien au voyageur qui ne sait pas ce qu'il regarde.",
    approach: "Encodage des images avec CLIP, recherche du monument le plus proche dans un index vectoriel ChromaDB, puis rédaction de la fiche par un LLM local via Ollama.",
    result: "Un RAG visuel complet qui tourne en local, de la photo à la fiche touristique.",
    metrics: [{ k: "reconnaissance", v: "CLIP" }, { k: "index vectoriel", v: "ChromaDB" }, { k: "génération", v: "locale" }],
    stack: ["CLIP", "ChromaDB", "Ollama", "Python"],
    links: { code: "https://github.com/Ange735/visual-rag-tourisme-maroc", demo: "" },
  },
  {
    title: "Détection de fraude Mobile Money",
    cat: "ML non supervisé",
    year: "2026",
    status: "terminé",
    summary: "Repérer des transactions frauduleuses rares dans un jeu de données non étiqueté, par clustering.",
    problem: "Sans étiquettes, impossible d'entraîner un classifieur : les fraudes représentent moins de 2 % des transactions.",
    approach: "Feature engineering (ratio montant/solde, encodage cyclique de l'heure, transformations log, standardisation), choix de k par silhouette, coude et stabilité des clusters.",
    result: "Un score d'anomalie normalisé par cluster et des règles d'alerte explicables, évaluées en précision et rappel.",
    metrics: [{ k: "transactions analysées", v: "8 130" }, { k: "part de fraudes", v: "< 2 %" }],
    stack: ["scikit-learn", "K-means", "Pandas", "Seaborn"],
    links: { code: "https://github.com/Ange735/mobile-money-fraude-kmeans", demo: "" },
  },
  {
    title: "ENSAM Market",
    cat: "Web · PHP",
    year: "2026",
    status: "terminé",
    summary: "Marketplace d'achat et de vente entre étudiants de l'ENSAM Meknès.",
    problem: "Les ventes entre étudiants se faisaient de groupe en groupe, sans historique ni recherche possible.",
    approach: "Application PHP / MySQL complète : comptes, annonces, recherche, messagerie et back-office.",
    result: "Une place de marché interne à l'école, développée de la base de données à l'interface.",
    metrics: [{ k: "rôle", v: "full-stack" }, { k: "base de données", v: "MySQL" }],
    stack: ["PHP", "MySQL", "HTML/CSS", "JavaScript"],
    links: { code: "https://github.com/Ange735/E_Com_Dev", demo: "" },
  },
];

/* ---------- 04 · Parcours ----------
   type : "work" (expérience), "edu" (formation) ou "assoc" (associatif)
   Du plus récent au plus ancien.                                        */
const PARCOURS = [
  {
    type: "work",
    period: "Juillet 2026 — aujourd'hui",
    role: "AI/ML Engineer",
    org: "GO AI CORP",
    place: "Meknès, Maroc",
    badge: "En poste",
    desc: "Projet AFRIKOPPS : plateforme d'intelligence des appels d'offres et de l'emploi dans plusieurs pays africains.",
    points: [
      "Conception et maintenance de plus de 20 sources de scraping (ARCOP, ARMP, DGCMEF, UEMOA, BCEAO)",
      "OCR des avis scannés, analyse des dossiers de soumission, détection des signatures et cachets",
      "Requirement Extractor : extraction par LLM des critères d'un DAO en JSON structuré, avec jeu de référence",
      "Architecture multi-tenant PostgreSQL, bus Redis Streams, files Celery et internationalisation du portail",
    ],
    tags: ["Python", "FastAPI", "Celery", "Redis", "PostgreSQL", "Docker", "LLM", "OCR"],
  },
  {
    type: "edu",
    period: "2025 — 2028",
    role: "Cycle ingénieur · Data Science & Intelligence Artificielle",
    org: "ENSAM Meknès",
    place: "2e année (Bac+4 en cours)",
    badge: "En cours",
    desc: "École Nationale Supérieure d'Arts et Métiers.",
    points: [
      "Machine Learning, Deep Learning, Computer Vision, NLP, séries temporelles",
      "Bases de données et développement web",
    ],
    tags: ["Machine Learning", "Deep Learning", "NLP", "Computer Vision"],
  },
  {
    type: "assoc",
    period: "2025 — aujourd'hui",
    role: "Membre de la cellule informatique",
    org: "CEEAM, ENSAM Meknès",
    place: "Association étudiante",
    badge: "Bénévolat",
    desc: "Développement et déploiement du site web de l'association.",
    points: [],
    tags: ["Web", "Déploiement"],
  },
  {
    type: "assoc",
    period: "2025 — 2026",
    role: "Responsable communication",
    org: "AEBM Meknès",
    place: "Association étudiante",
    badge: "Bénévolat",
    desc: "Création des affiches et communication des événements.",
    points: [],
    tags: ["Communication", "Design"],
  },
  {
    type: "edu",
    period: "2023 — 2025",
    role: "DEUST · Mathématiques, Informatique, Physique",
    org: "Faculté des Sciences et Techniques",
    place: "Fès, Maroc",
    badge: "Diplôme",
    desc: "Bases en mathématiques, algorithmique et programmation.",
    points: [],
    tags: ["Mathématiques", "Algorithmique", "Physique"],
  },
];
