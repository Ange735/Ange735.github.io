/* =========================================================
   build_corpus.mjs — extrait le texte à encoder depuis js/data.js
   Usage : node tools/build_corpus.mjs
   Sortie : data/corpus.json (lu ensuite par tools/build_latent.py)
   ========================================================= */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = readFileSync(resolve(root, "js/data.js"), "utf8");

// js/data.js ne déclare que des const : on l'évalue et on récupère les tableaux.
const read = new Function(`${source}
  return { PROJECTS, SKILLS, SKILL_CLUSTERS };`);
const { PROJECTS, SKILLS, SKILL_CLUSTERS } = read();

const domains = Object.fromEntries(SKILL_CLUSTERS.map((c) => [c.id, c.label]));
const slug = (s) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const corpus = [
  ...PROJECTS.map((p, i) => ({
    id: `project-${slug(p.title)}`,
    kind: "project",
    index: i,
    label: p.title,
    domain: p.cat,
    // le texte encodé : ce que le projet est, pas des mots-clés jetés en vrac
    text: [p.title, p.summary, p.problem, p.approach, p.result, p.stack.join(", ")]
      .filter(Boolean).join(" "),
  })),
  ...SKILLS.map((s) => ({
    id: `skill-${slug(s.name)}`,
    kind: "skill",
    label: s.name,
    domain: domains[s.c] || s.c,
    level: s.level,
    text: `${s.name}. ${domains[s.c] || s.c}.`,
  })),
];

mkdirSync(resolve(root, "data"), { recursive: true });
writeFileSync(resolve(root, "data/corpus.json"), JSON.stringify(corpus, null, 2) + "\n");
console.log(`corpus.json : ${corpus.length} entrées (${PROJECTS.length} projets, ${SKILLS.length} compétences)`);
