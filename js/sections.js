/* =========================================================
   Sections : à propos, espace latent, projets, parcours, contact
   (dépend de hero.js pour $, $$, el, wait, reduceMotion)
   ========================================================= */
const SVG_NS = "http://www.w3.org/2000/svg";
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const svgEl = (tag, attrs = {}) => {
  const e = document.createElementNS(SVG_NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  return e;
};
const pad2 = (v) => String(v).padStart(2, "0");

/* ---------- 01 · À propos : halo au survol + heure locale ---------- */
(() => {
  $("#bento").addEventListener("pointermove", (e) => {
    const tile = e.target.closest(".tile");
    if (!tile) return;
    const r = tile.getBoundingClientRect();
    tile.style.setProperty("--mx", `${e.clientX - r.left}px`);
    tile.style.setProperty("--my", `${e.clientY - r.top}px`);
  });

  const clock = $("#localTime");
  const opts = { hour: "2-digit", minute: "2-digit" };
  let fmt;
  try { fmt = new Intl.DateTimeFormat("fr-FR", { ...opts, timeZone: clock.dataset.tz }); }
  catch (e) { fmt = new Intl.DateTimeFormat("fr-FR", opts); }
  const tick = () => { clock.textContent = fmt.format(new Date()); };
  tick();
  setInterval(tick, 20000);
})();

/* ---------- 02 · Espace latent ---------- */
(() => {
  const svg = $("#latentSvg"), plot = $("#latentPlot"), tip = $("#latentTip"), legend = $("#latentLegend");
  const clusters = Object.fromEntries(SKILL_CLUSTERS.map((c) => [c.id, c]));
  const idx = (name) => SKILLS.findIndex((k) => k.name === name);
  const PAD = 48;
  const col = (c) => (document.documentElement.dataset.theme === "light" ? c.light : c.color);

  // liens : 2 plus proches voisins dans le même cluster + quelques ponts
  const links = [];
  const addLink = (a, b, bridge = false) => {
    if (a < 0 || b < 0 || links.some((l) => (l.a === a && l.b === b) || (l.a === b && l.b === a))) return;
    links.push({ a, b, bridge });
  };
  SKILLS.forEach((a, i) => {
    SKILLS.map((b, j) => ({ j, d: Math.hypot(a.x - b.x, a.y - b.y) }))
      .filter((o) => o.j !== i && SKILLS[o.j].c === a.c)
      .sort((p, q) => p.d - q.d)
      .slice(0, 2)
      .forEach((o) => addLink(i, o.j));
  });
  [["PyTorch", "Transformers"], ["PyTorch", "YOLO"], ["FastAPI", "RAG"], ["Python", "PyTorch"], ["MLflow", "Pandas / Polars"]]
    .forEach(([a, b]) => addLink(idx(a), idx(b), true));

  let W = 0, H = 0, nodes = [], lines = [], hulls = [], focused = -1, visible = false;

  const build = () => {
    const r = plot.getBoundingClientRect();
    W = r.width; H = r.height;
    if (!W) return;
    // en portrait (mobile), on transpose le plan pour mieux remplir l'espace
    const portrait = H > W;
    const px = (k) => {
      const [u, v] = portrait ? [k.y, k.x] : [k.x, k.y];
      return [PAD + (u / 100) * (W - 2 * PAD), PAD + (v / 100) * (H - 2 * PAD)];
    };
    const narrow = W < 520;
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.replaceChildren();

    hulls = SKILL_CLUSTERS.map((c) => {
      const pts = SKILLS.filter((k) => k.c === c.id).map(px);
      const cx = pts.reduce((a, p) => a + p[0], 0) / pts.length;
      const cy = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      const rad = Math.max(...pts.map(([x, y]) => Math.hypot(x - cx, y - cy))) + (narrow ? 22 : 30);
      const h = svgEl("circle", { class: "lt-hull", cx, cy, r: rad, fill: col(c), stroke: col(c) });
      h.dataset.c = c.id;
      // étiquette au-dessus du groupe, ou en dessous pour la moitié basse
      const ly = cy > H / 2 ? Math.min(H - 10, cy + rad + 16) : Math.max(16, cy - rad - 10);
      const label = svgEl("text", { x: Math.min(Math.max(cx, 60), W - 60), y: ly, fill: col(c), opacity: 0.6, "text-anchor": "middle", "font-family": "JetBrains Mono, monospace", "font-size": 10, "letter-spacing": 1.5 });
      label.textContent = c.label.toUpperCase();
      svg.append(h, label);
      return h;
    });

    lines = links.map((l) => svg.appendChild(svgEl("line", { class: "lt-link", ...(l.bridge ? { "stroke-dasharray": "2 4" } : {}) })));

    nodes = SKILLS.map((k, i) => {
      const c = clusters[k.c], rr = narrow ? 2.5 + k.level * 1.1 : 3 + k.level * 1.5, base = px(k);
      const g = svgEl("g", { class: "lt-node", tabindex: 0 });
      const flip = base[0] > W * 0.78;
      const t = svgEl("text", { x: flip ? -(rr + 7) : rr + 7, y: 4, "text-anchor": flip ? "end" : "start" });
      t.textContent = k.name;
      if (narrow) t.setAttribute("opacity", 0); // sur mobile : nom affiché au toucher
      g.append(svgEl("circle", { r: rr * 2.6, fill: col(c), opacity: 0.12 }), svgEl("circle", { r: rr, fill: col(c) }), t);
      g.addEventListener("mouseenter", () => focusNode(i));
      g.addEventListener("focus", () => focusNode(i));
      g.addEventListener("click", () => focusNode(i));
      g.addEventListener("mouseleave", clear);
      g.addEventListener("blur", clear);
      svg.appendChild(g);
      return { g, k, base, cur: base.slice(), phase: Math.random() * Math.PI * 2 };
    });
    place();
  };

  const place = () => {
    nodes.forEach((n) => n.g.setAttribute("transform", `translate(${n.cur[0].toFixed(1)} ${n.cur[1].toFixed(1)})`));
    links.forEach((l, i) => {
      const A = nodes[l.a].cur, B = nodes[l.b].cur;
      lines[i].setAttribute("x1", A[0]); lines[i].setAttribute("y1", A[1]);
      lines[i].setAttribute("x2", B[0]); lines[i].setAttribute("y2", B[1]);
    });
    if (focused >= 0) {
      const [x, y] = nodes[focused].cur;
      tip.style.left = `${Math.min(Math.max(x, 120), W - 120)}px`;
      tip.style.top = `${y}px`;
    }
  };

  const focusNode = (i) => {
    focused = i;
    const k = SKILLS[i], on = new Set([i]);
    svg.classList.add("is-focus");
    links.forEach((l, li) => {
      const hit = l.a === i || l.b === i;
      lines[li].classList.toggle("is-on", hit);
      if (hit) { on.add(l.a); on.add(l.b); }
    });
    nodes.forEach((n, j) => n.g.classList.toggle("is-on", on.has(j)));
    const z = `z=[${(k.x / 50 - 1).toFixed(2)}, ${(1 - k.y / 50).toFixed(2)}]`;
    tip.replaceChildren(
      el("b", null, k.name), document.createTextNode(`  ·  ${clusters[k.c].label}`), el("br"),
      el("span", "dim", `niveau ${"▮".repeat(k.level)}${"▯".repeat(5 - k.level)} · ${z}`)
    );
    tip.classList.add("is-on");
    place();
  };

  const focusCluster = (id) => {
    focused = -1;
    tip.classList.remove("is-on");
    svg.classList.add("is-focus");
    nodes.forEach((n) => n.g.classList.toggle("is-on", n.k.c === id));
    links.forEach((l, li) => lines[li].classList.toggle("is-on", SKILLS[l.a].c === id && SKILLS[l.b].c === id));
    hulls.forEach((h) => { h.style.fillOpacity = h.dataset.c === id ? 0.1 : ""; });
  };

  function clear() {
    focused = -1;
    svg.classList.remove("is-focus");
    tip.classList.remove("is-on");
    hulls.forEach((h) => { h.style.fillOpacity = ""; });
    $$(".lg-item", legend).forEach((b) => b.classList.remove("is-on"));
  }

  const dots = [];
  SKILL_CLUSTERS.forEach((c) => {
    const b = el("button", "lg-item");
    const dot = el("i");
    dot.style.background = col(c);
    dots.push([dot, c]);
    b.append(dot, el("span", null, c.label), el("span", "n", pad2(SKILLS.filter((k) => k.c === c.id).length)));
    const on = () => { clear(); focusCluster(c.id); b.classList.add("is-on"); };
    b.addEventListener("mouseenter", on);
    b.addEventListener("focus", on);
    b.addEventListener("mouseleave", clear);
    b.addEventListener("blur", clear);
    legend.appendChild(b);
  });

  new ResizeObserver(build).observe(plot);
  document.addEventListener("themechange", () => {
    build();
    dots.forEach(([dot, c]) => { dot.style.background = col(c); });
  });
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(plot);

  const frame = (t) => {
    if (visible && !reduceMotion && nodes.length) {
      nodes.forEach((n) => {
        n.cur[0] = n.base[0] + Math.sin(t / 1400 + n.phase) * 4;
        n.cur[1] = n.base[1] + Math.cos(t / 1700 + n.phase) * 4;
      });
      place();
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();

/* ---------- 03 · Projets : liste + fiche détaillée ---------- */
(() => {
  const list = $("#projList"), panel = $("#projPanel");
  const mobile = matchMedia("(max-width: 860px)");

  // générateur pseudo-aléatoire déterministe : un même projet garde toujours le même visuel
  const seeded = (str) => {
    let h = 2166136261;
    for (const ch of str) h = Math.imul(h ^ ch.charCodeAt(0), 16777619);
    return () => {
      h = Math.imul(h ^ (h >>> 15), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  };

  // visuel : un réseau de points traversé par un signal
  const visual = (p) => {
    const rnd = seeded(p.title), cols = 20, rows = 5, W = 640, H = 160;
    const gx = W / (cols + 1), gy = H / (rows + 1);
    const near = (r) => Math.min(rows - 1, Math.max(0, r + Math.round((rnd() - 0.5) * 2)));
    const f = (v) => v.toFixed(1);
    const pts = Array.from({ length: cols }, (_, c) =>
      Array.from({ length: rows }, (_, r) => [gx * (c + 1) + (rnd() - 0.5) * 10, gy * (r + 1) + (rnd() - 0.5) * 10]));

    let lines = "";
    for (let c = 0; c < cols - 1; c++) {
      for (let r = 0; r < rows; r++) {
        if (rnd() < 0.5) continue;
        const [x1, y1] = pts[c][r], [x2, y2] = pts[c + 1][near(r)];
        lines += `<line class="pv-line" x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}"/>`;
      }
    }
    const dots = pts.flat().map(([x, y]) => `<circle class="pv-dot" cx="${f(x)}" cy="${f(y)}" r="1.6"/>`).join("");

    let r = Math.floor(rnd() * rows);
    const route = pts.map((column) => { const pt = column[r]; r = near(r); return pt; });
    const d = route.map(([x, y], k) => `${k ? "L" : "M"}${f(x)} ${f(y)}`).join(" ");
    const hot = route.filter((_, k) => k % 3 === 0).map(([x, y]) => `<circle class="pv-hot" cx="${f(x)}" cy="${f(y)}" r="3"/>`).join("");

    return `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${lines}${dots}<path class="pv-path" d="${d}"/>${hot}</svg>`;
  };

  const link = (url, label) => {
    if (!url) return "";
    const ext = /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";
    return `<a href="${esc(url)}"${ext}>${label} ↗</a>`;
  };

  const detail = (p, i) => `
    <article class="pd">
      <div class="pd__visual">
        ${visual(p)}
        <span class="pd__num">${pad2(i + 1)}</span>
        <span class="tag ${p.status === "production" ? "tag--ok" : "tag--warn"}">● ${esc(p.status)}</span>
      </div>
      <div class="pd__body">
        <h3 class="pd__title">${esc(p.title)}</h3>
        <p class="pd__summary">${esc(p.summary)}</p>
        <dl class="pd__steps">
          <div><dt>problème</dt><dd>${esc(p.problem)}</dd></div>
          <div><dt>approche</dt><dd>${esc(p.approach)}</dd></div>
          <div><dt>résultat</dt><dd>${esc(p.result)}</dd></div>
        </dl>
        <div class="pd__metrics">${p.metrics.map((m) => `<div><b>${esc(m.v)}</b><span>${esc(m.k)}</span></div>`).join("")}</div>
        <div class="pd__foot">
          <div class="pd__stack">${p.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
          <div class="pd__links">${link(p.links.code, "code")}${link(p.links.demo, "démo")}</div>
        </div>
      </div>
    </article>`;

  list.innerHTML = PROJECTS.map((p, i) => `
    <li class="proj__item">
      <button class="proj__row" type="button" aria-expanded="false">
        <span class="proj__n">${pad2(i + 1)}</span>
        <span class="proj__title">${esc(p.title)}</span>
        <span class="proj__meta"><span>${esc(p.cat)}</span><span>${esc(p.year)}</span></span>
        <span class="proj__arrow" aria-hidden="true">→</span>
      </button>
      <div class="proj__inline"></div>
    </li>`).join("");

  const items = $$(".proj__item", list);
  let current = -1;

  const select = (i, toggle = false) => {
    // sur mobile, cliquer à nouveau sur le projet ouvert le referme
    if (toggle && mobile.matches && i === current) {
      items[i].classList.remove("is-active");
      $(".proj__row", items[i]).setAttribute("aria-expanded", "false");
      $(".proj__inline", items[i]).innerHTML = "";
      current = -1;
      return;
    }
    if (i === current) return;
    current = i;
    items.forEach((it, j) => {
      it.classList.toggle("is-active", j === i);
      $(".proj__row", it).setAttribute("aria-expanded", String(j === i));
      $(".proj__inline", it).innerHTML = mobile.matches && j === i ? detail(PROJECTS[j], j) : "";
    });
    if (!mobile.matches) {
      panel.innerHTML = detail(PROJECTS[i], i);
      panel.classList.remove("is-swap");
      void panel.offsetWidth;
      panel.classList.add("is-swap");
    }
  };

  items.forEach((it, i) => {
    const row = $(".proj__row", it);
    row.addEventListener("click", () => {
      select(i, true);
      // sur mobile, garde le projet ouvert visible sous la barre de navigation
      if (mobile.matches && row.getBoundingClientRect().top < 80) {
        scrollTo({ top: row.getBoundingClientRect().top + scrollY - 90, behavior: reduceMotion ? "auto" : "smooth" });
      }
    });
    row.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse" && !mobile.matches) select(i);
    });
  });

  mobile.addEventListener("change", () => {
    const i = Math.max(current, 0);
    current = -1;
    panel.innerHTML = "";
    select(i);
  });
  select(0);
})();

/* ---------- 04 · Parcours : frise filtrable ---------- */
(() => {
  const list = $("#pathList"), path = $("#path"), fill = $("#pathFill");
  const TYPES = { work: "💼 Expérience", edu: "🎓 Formation", assoc: "🤝 Associatif" };

  list.innerHTML = PARCOURS.map((s) => `
    <li class="step" data-type="${esc(s.type)}">
      <div class="step__when">
        <span class="step__period">${esc(s.period)}</span>
        <span class="step__type">${TYPES[s.type] || ""}</span>
      </div>
      <span class="step__node" aria-hidden="true"></span>
      <article class="step__card reveal">
        <div class="step__head">
          <h3 class="step__role">${esc(s.role)}</h3>
          ${s.badge ? `<span class="tag ${s.type === "work" ? "tag--ok" : ""}">${esc(s.badge)}</span>` : ""}
        </div>
        <p class="step__org"><b>${esc(s.org)}</b>${s.place ? ` · ${esc(s.place)}` : ""}</p>
        ${s.desc ? `<p class="step__desc">${esc(s.desc)}</p>` : ""}
        ${s.points && s.points.length ? `<ul class="step__points">${s.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>` : ""}
        <div class="step__tags">${(s.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</div>
      </article>
    </li>`).join("");

  const steps = $$(".step", list);

  // la ligne se remplit et les points s'allument au fil du défilement
  const update = () => {
    const r = path.getBoundingClientRect();
    const mid = innerHeight * 0.6;
    fill.style.setProperty("--p", Math.min(1, Math.max(0, (mid - r.top) / r.height)).toFixed(3));
    steps.forEach((s) => s.classList.toggle("is-passed", $(".step__node", s).getBoundingClientRect().top < mid));
  };
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { update(); ticking = false; });
  }, { passive: true });
  addEventListener("resize", update);

  const buttons = $$("#pathFilter button");
  buttons.forEach((b) => b.addEventListener("click", () => {
    buttons.forEach((x) => x.classList.toggle("is-active", x === b));
    steps.forEach((s) => s.classList.toggle("is-hidden", b.dataset.f !== "all" && s.dataset.type !== b.dataset.f));
    update();
  }));
  update();
})();

/* ---------- 05 · Contact (terminal) ---------- */
(() => {
  const form = $("#termForm"), out = $("#termOut");
  const mail = $('a[href^="mailto:"]').getAttribute("href").slice(7);
  const line = (txt, cls) => out.appendChild(el("div", cls, txt));

  // Entrée envoie, Maj+Entrée fait un retour à la ligne
  $("textarea", form).addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); form.requestSubmit(); }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    out.replaceChildren();
    if (!form.checkValidity()) {
      line("✕ erreur : champ manquant ou email invalide", "err");
      form.reportValidity();
      return;
    }
    const d = Object.fromEntries(new FormData(form));
    line(`> tokenisation du prompt… ${Math.ceil((d.name + d.email + d.message).length / 4)} tokens`);
    await wait(450);
    line(`> routage vers ${mail}…`);
    await wait(500);
    line("✓ client mail ouvert · réponse estimée < 24 h", "ok");
    const subject = encodeURIComponent(`Portfolio — message de ${d.name}`);
    const body = encodeURIComponent(`${d.message}\n\n— ${d.name} (${d.email})`);
    location.href = `mailto:${mail}?subject=${subject}&body=${body}`;
  });
})();

/* ---------- Apparition au scroll ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  $$(".reveal").forEach((n) => io.observe(n));
})();
