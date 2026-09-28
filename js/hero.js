/* =========================================================
   Accueil : navigation, thème, champ neuronal, génération
   du nom, assistant IA, compteurs
   ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const el = (tag, cls, txt) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (txt != null) e.textContent = txt;
  return e;
};
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Identité : initiales et nom complet ---------- */
(() => {
  const words = PROFILE.nameTokens.map((t) => t.trim()).filter(Boolean);
  const initials = (words[0][0] + words[words.length - 1][0]).toUpperCase();
  $$("[data-initials]").forEach((n) => { n.textContent = initials; });
  $$("[data-fullname]").forEach((n) => { n.textContent = words.join(" "); });
})();

/* ---------- Navigation ---------- */
(() => {
  const nav = $(".nav"), links = $("#navLinks"), burger = $("#burger");
  const anchors = $$("a", links);

  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 20);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    nav.classList.toggle("menu-open", open);
    links.classList.toggle("is-open", open);
  };
  burger.addEventListener("click", () => setMenu(!links.classList.contains("is-open")));
  anchors.forEach((a) => a.addEventListener("click", () => setMenu(false)));

  // lien actif = première section (dans l'ordre de la page) qui traverse le milieu de l'écran
  const byId = new Map(anchors.map((a) => [a.getAttribute("href").slice(1), a]));
  const sections = $$("section[id]");
  const inBand = new Set();
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => (e.isIntersecting ? inBand.add(e.target) : inBand.delete(e.target)));
    const active = sections.find((s) => inBand.has(s));
    anchors.forEach((a) => a.classList.toggle("is-active", !!active && a === byId.get(active.id)));
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => io.observe(s));

  $("#year").textContent = new Date().getFullYear();
})();

/* ---------- Thème clair / sombre ---------- */
(() => {
  const root = document.documentElement, btn = $("#themeToggle");

  const sync = () => {
    const light = root.dataset.theme === "light";
    btn.setAttribute("aria-label", light ? "Passer au thème sombre" : "Passer au thème clair");
    btn.setAttribute("aria-pressed", String(light));
  };

  const apply = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem("theme", theme); } catch (e) {}
    sync();
    document.dispatchEvent(new CustomEvent("themechange", { detail: theme }));
  };

  // état suivi à part : deux clics rapides restent cohérents même pendant une transition
  let current = root.dataset.theme;
  btn.addEventListener("click", () => {
    const next = current = current === "light" ? "dark" : "light";
    if (!document.startViewTransition || reduceMotion) return apply(next);
    // le nouveau thème s'étend en cercle depuis le bouton
    const r = btn.getBoundingClientRect();
    const x = r.left + r.width / 2, y = r.top + r.height / 2;
    const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    document.startViewTransition(() => apply(next)).ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${end}px at ${x}px ${y}px)`] },
        { duration: 700, easing: "cubic-bezier(.2,.8,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  });

  sync();
})();

/* ---------- Champ neuronal en fond ---------- */
(() => {
  const c = $("#field"), ctx = c.getContext("2d");
  const mouse = { x: -1e4, y: -1e4 };
  const D = 140;
  let W, H, pts = [], ink, hot, amp;

  // couleurs lues depuis les variables CSS du thème actif
  const readColors = () => {
    const s = getComputedStyle(document.documentElement);
    ink = s.getPropertyValue("--field-ink").trim();
    hot = s.getPropertyValue("--field-hot").trim();
    amp = parseFloat(s.getPropertyValue("--field-alpha")) || 1;
  };
  readColors();

  const resize = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    c.width = W * dpr; c.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.round(Math.min(90, (W * H) / 18000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.3 + 0.5,
      hot: Math.random() < 0.14,
    }));
  };

  addEventListener("pointermove", (e) => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener("pointerleave", () => { mouse.x = mouse.y = -1e4; });

  const draw = () => {
    ctx.clearRect(0, 0, W, H);
    const fade = Math.max(0.35, 1 - scrollY / (H * 1.2));

    for (const p of pts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = W + 20; else if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20; else if (p.y > H + 20) p.y = -20;
      // les neurones gravitent autour du curseur sans s'y effondrer
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 200 && d > 1) {
        const f = ((d - 90) / 200) * 0.6;
        p.x += (dx / d) * f; p.y += (dy / d) * f;
      }
    }

    ctx.lineWidth = 1;
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 > D * D) continue;
        const al = (1 - Math.sqrt(d2) / D) * 0.16 * fade * amp;
        ctx.strokeStyle = a.hot && b.hot ? `rgba(${hot},${al * 2.2})` : `rgba(${ink},${al})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
      const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
      if (md < 200) {
        ctx.strokeStyle = `rgba(${hot},${(1 - md / 200) * 0.35 * fade * amp})`;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }

    for (const p of pts) {
      ctx.fillStyle = p.hot ? `rgba(${hot},${0.9 * fade})` : `rgba(${ink},${0.4 * fade * amp})`;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduceMotion) requestAnimationFrame(draw);
  };

  addEventListener("resize", () => { resize(); if (reduceMotion) draw(); });
  document.addEventListener("themechange", () => { readColors(); if (reduceMotion) draw(); });
  resize();
  draw();
})();

/* ---------- Génération du nom token par token ---------- */
(() => {
  const h1 = $("#genName"), box = $("#logits");
  const tokens = PROFILE.nameTokens;
  const pool = ["Ingénieur", " IA", "Data", " Humain", "Curieux", " ML", "Builder", " Neural"];
  const caret = el("span", "caret");
  h1.setAttribute("aria-label", tokens.join("").trim());
  h1.appendChild(caret);

  const logitRow = (text, p) => {
    const row = el("span", "logit");
    const bar = el("span", "logit__bar");
    const fill = el("i");
    fill.style.width = `${p * 100}%`;
    bar.appendChild(fill);
    row.append(el("span", null, `"${text.trim()}"`), bar, el("span", null, p.toFixed(2)));
    return row;
  };

  const addTok = (t, last) => {
    // l'espace devant un mot devient un vrai espace : le titre passe à la ligne proprement
    if (/^\s/.test(t)) h1.insertBefore(document.createTextNode(" "), caret);
    const s = el("span", last ? "tok tok--accent" : "tok", t.trim());
    s.setAttribute("aria-hidden", "true");
    h1.insertBefore(s, caret);
    void s.offsetWidth; // force le rendu de l'état initial pour que la transition se joue
    s.classList.add("is-in");
  };

  (async () => {
    const lastIdx = tokens.length - 1;
    if (reduceMotion) { tokens.forEach((t, i) => addTok(t, i === lastIdx)); return; }
    await wait(500);
    const t0 = performance.now();
    for (const [i, t] of tokens.entries()) {
      const p = 0.78 + Math.random() * 0.18;
      const alts = pool.filter((x) => x.trim() !== t.trim()).sort(() => Math.random() - 0.5);
      const p2 = (1 - p) * (0.55 + Math.random() * 0.3);
      box.replaceChildren(logitRow(t, p), logitRow(alts[0], p2), logitRow(alts[1], 1 - p - p2));
      await wait(420);
      box.firstChild.classList.add("is-pick");
      await wait(220);
      addTok(t, i === lastIdx);
      await wait(300);
    }
    const ms = Math.round(performance.now() - t0);
    box.replaceChildren(el("span", "logit is-pick", `✓ <eos> · ${tokens.length} tokens · ${ms} ms · top_p=0.95`));
  })();
})();

/* ---------- Assistant IA : réponses écrites en direct ---------- */
(() => {
  const card = $(".chat"), body = $("#chatBody"), chips = $("#chatChips"), stats = $("#chatStats");
  let run = 0, auto = true, inView = true;

  const buttons = ASSISTANT.map((item, i) => {
    const b = el("button", "chip", item.q);
    b.type = "button";
    b.addEventListener("click", () => { auto = false; ask(i); });
    return chips.appendChild(b);
  });

  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }).observe(card);

  // découpe la réponse en mots ; *texte* = mis en valeur
  const tokenize = (text) => {
    const out = [];
    let bold = false;
    text.split(" ").forEach((word) => {
      let w = word;
      if (w.startsWith("*")) { bold = true; w = w.slice(1); }
      const end = w.indexOf("*");
      if (end >= 0) {
        out.push({ text: w.slice(0, end), bold: true });
        if (w.slice(end + 1)) out.push({ text: w.slice(end + 1), bold: false, glue: true });
        bold = false;
      } else {
        out.push({ text: w, bold });
      }
    });
    return out;
  };

  const ask = async (i) => {
    const my = ++run;
    buttons.forEach((b, j) => b.classList.toggle("is-on", j === i));
    body.replaceChildren(el("div", "msg msg--user", ASSISTANT[i].q));
    const answer = body.appendChild(el("div", "msg msg--bot"));
    const typing = answer.appendChild(el("span", "typing"));
    typing.append(el("i"), el("i"), el("i"));
    stats.textContent = "réflexion…";
    await wait(reduceMotion ? 0 : 700);
    if (my !== run) return;

    const caret = el("span", "caret-sm");
    answer.replaceChildren(caret);
    const toks = tokenize(ASSISTANT[i].a);
    const t0 = performance.now();
    for (const [k, t] of toks.entries()) {
      if (my !== run) return;
      if (k && !t.glue) answer.insertBefore(document.createTextNode(" "), caret);
      answer.insertBefore(t.bold ? el("b", null, t.text) : document.createTextNode(t.text), caret);
      body.scrollTop = body.scrollHeight; // une réponse longue défile au lieu d'être coupée
      if (!reduceMotion) await wait(28 + Math.random() * 50);
    }
    const secs = Math.max((performance.now() - t0) / 1000, 0.001);
    stats.textContent = `${toks.length} tokens · ${Math.round(toks.length / secs)} tok/s`;

    // démo automatique : question suivante tant que le visiteur n'a pas cliqué
    if (!auto || reduceMotion) return;
    await wait(5200);
    while (my === run && (document.hidden || !inView)) await wait(600);
    if (my === run && auto) ask((i + 1) % ASSISTANT.length);
  };

  setTimeout(() => { if (run === 0) ask(0); }, reduceMotion ? 0 : 2600);
})();

/* ---------- Compteurs ---------- */
(() => {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      const node = e.target, end = +node.dataset.count, t0 = performance.now();
      const step = (t) => {
        const k = reduceMotion ? 1 : Math.min(1, (t - t0) / 1400);
        node.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  $$("[data-count]").forEach((n) => io.observe(n));
})();
