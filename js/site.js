/* =========================================================
   site.js — thème (écru / nuit) et carte des compétences
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const SVG_NS = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const node = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) node.setAttribute(k, attrs[k]);
  return node;
};

/* ---------- thème ---------- */
(() => {
  const root = document.documentElement;
  const button = $("#themeToggle");
  if (!button) return;
  const label = $("[data-theme-label]", button);
  const names = { light: "écru", dark: "nuit" };

  const sync = () => {
    const theme = root.dataset.theme === "dark" ? "dark" : "light";
    label.textContent = names[theme];
    button.setAttribute("aria-label", `Thème ${names[theme]}. Passer au thème ${names[theme === "dark" ? "light" : "dark"]}.`);
  };

  button.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) { /* navigation privée */ }
    sync();
  });
  sync();
})();

/* ---------- carte : projection calculée hors ligne ---------- */
(async () => {
  const frame = $("#mapFrame"), svg = $("#mapSvg"), tip = $("#mapTip"), meta = $("#mapMeta");
  if (!frame) return;

  let data;
  try {
    data = await (await fetch("data/latent.json")).json();
  } catch (e) {
    frame.innerHTML = '<p class="meta" style="padding:1em">carte indisponible : data/latent.json n\'a pas pu être chargé</p>';
    return;
  }

  const byId = new Map(data.points.map((p) => [p.id, p]));

  // fiche technique : on affiche ce qui a réellement servi au calcul
  const date = new Date(data.generated_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  meta.innerHTML = [
    ["points", `${data.counts.points} (${data.counts.projects} projets, ${data.counts.skills} technologies)`],
    ["modèle", data.model.split("/").pop()],
    ["vecteurs", `${data.params.dimensions} dimensions`],
    ["projection", `t-SNE cosinus · perplexity ${data.params.perplexity} · seed ${data.params.seed}`],
    ["liens", `${data.counts.edges} paires les plus proches`],
    ["calculé le", date],
  ].map(([k, v]) => `<dt>${k}</dt><dd>${v}</dd>`).join("");

  const nodes = new Map();
  let focused = null;

  const draw = () => {
    const rect = frame.getBoundingClientRect();
    const W = Math.round(rect.width), H = Math.round(rect.height);
    if (!W || !H) return;
    const pad = W < 520 ? 22 : 34;
    const px = (p) => [pad + (p.x / 100) * (W - 2 * pad), pad + (p.y / 100) * (H - 2 * pad)];

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.replaceChildren();
    nodes.clear();

    // liens : opacité proportionnelle à la similarité cosinus réelle
    const sims = data.edges.map((e) => e.similarity);
    const lo = Math.min(...sims), hi = Math.max(...sims);
    data.edges.forEach((edge) => {
      const a = px(byId.get(edge.a)), b = px(byId.get(edge.b));
      const t = hi === lo ? 1 : (edge.similarity - lo) / (hi - lo);
      const line = svgEl("line", {
        class: "map__edge", x1: a[0], y1: a[1], x2: b[0], y2: b[1],
        "stroke-width": (0.5 + t * 0.9).toFixed(2),
        "stroke-opacity": (0.06 + t * 0.3).toFixed(3),
      });
      line.dataset.a = edge.a;
      line.dataset.b = edge.b;
      svg.appendChild(line);
    });

    data.points.forEach((point) => {
      const [x, y] = px(point);
      const isProject = point.kind === "project";
      const g = svgEl("g", {
        class: `map__node ${isProject ? "map__project" : ""}`,
        transform: `translate(${x.toFixed(1)} ${y.toFixed(1)})`,
        tabindex: 0,
        role: isProject ? "link" : "img",
        "aria-label": isProject ? `Projet ${point.label}` : `Technologie ${point.label}`,
      });

      // losange pour les projets (le motif du pagne), point pour les technologies
      const size = isProject ? 6 : 2.4 + (point.level || 3) * 0.55;
      g.appendChild(isProject
        ? svgEl("rect", { class: "map__shape", x: -size, y: -size, width: size * 2, height: size * 2, transform: "rotate(45)" })
        : svgEl("circle", { class: "map__shape map__dot", r: size }));
      g.appendChild(svgEl("circle", { class: "map__hit", r: 14, fill: "transparent" }));

      if (isProject) {
        // près du bord droit, l'étiquette bascule à gauche pour ne pas être coupée
        const flip = x > W * 0.68;
        const text = svgEl("text", {
          class: "map__label", x: flip ? -12 : 12, y: 4,
          "text-anchor": flip ? "end" : "start",
        });
        text.textContent = point.label.split(" — ")[0];
        g.appendChild(text);
      }

      const open = () => { if (isProject) location.hash = point.id; };
      g.addEventListener("pointerenter", () => focus(point));
      g.addEventListener("pointerleave", clear);
      g.addEventListener("focus", () => focus(point));
      g.addEventListener("blur", clear);
      g.addEventListener("click", open);
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
      });

      nodes.set(point.id, { g, point, xy: [x, y] });
      svg.appendChild(g);
    });
  };

  const focus = (point) => {
    focused = point;
    svg.classList.add("is-focus");
    const linked = new Set([point.id]);
    svg.querySelectorAll(".map__edge").forEach((line) => {
      const hit = line.dataset.a === point.id || line.dataset.b === point.id;
      line.classList.toggle("is-on", hit);
      if (hit) { linked.add(line.dataset.a); linked.add(line.dataset.b); }
    });
    nodes.forEach(({ g }, id) => g.classList.toggle("is-on", linked.has(id)));

    const voisins = point.near
      .map((n) => `<li><span>${byId.get(n.id).label}</span><span>${n.similarity.toFixed(2)}</span></li>`)
      .join("");
    tip.innerHTML = `<b>${point.label}</b><span class="meta">${point.kind === "project" ? "projet" : point.domain}</span>
      <ul>${voisins}</ul>
      <span class="meta">${point.kind === "project" ? "cliquer pour ouvrir" : "similarité cosinus"}</span>`;

    const [x, y] = nodes.get(point.id).xy;
    const w = frame.clientWidth, h = frame.clientHeight;
    tip.hidden = false;
    tip.classList.add("is-on");
    const tw = tip.offsetWidth, th = tip.offsetHeight;
    tip.style.left = `${Math.min(Math.max(x - tw / 2, 6), w - tw - 6)}px`;
    tip.style.top = `${y - th - 16 < 6 ? y + 18 : y - th - 16}px`;
  };

  function clear() {
    focused = null;
    svg.classList.remove("is-focus");
    svg.querySelectorAll(".is-on").forEach((n) => n.classList.remove("is-on"));
    tip.classList.remove("is-on");
    tip.hidden = true;
  }

  draw();
  let timer;
  new ResizeObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(() => { draw(); if (focused) clear(); }, 120);
  }).observe(frame);
})();
