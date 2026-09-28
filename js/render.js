/* =========================================================
   render.js — construit la page à partir de js/content.js
   Un champ { todo: "..." } devient un encadré « à compléter ».
   ========================================================= */
(() => {
  const C = window.CONTENT || CONTENT;
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const isTodo = (v) => v && typeof v === "object" && typeof v.todo === "string";
  const has = (v) => (isTodo(v) ? true : typeof v === "string" && v.trim().length > 0);

  /* un champ : le texte, ou la consigne à compléter */
  const f = (v) => isTodo(v)
    ? `<span class="todo" data-todo><b class="mono">à compléter</b> ${esc(v.todo)}</span>`
    : esc(v);

  const mount = (id, html) => { const node = document.getElementById(id); if (node) node.innerHTML = html; };
  const list = (items, fn) => items.map(fn).join("");

  const id = C.identite;

  /* ---------- accueil ---------- */
  mount("heroName", `<span>${esc(id.prenoms)}</span><span class="surname">${esc(id.nom)}</span>`);
  mount("heroAccroche", `<p class="hero__lede lede">${f(C.accroche)}</p>`);
  mount("heroSide", `
    <dl>
      <div><dt>poste</dt><dd>${esc(id.poste)}, ${esc(id.entreprise)}<br /><span class="dim">depuis ${esc(id.depuis)}</span></dd></div>
      <div><dt>école</dt><dd>${esc(id.ecole)}<br /><span class="dim">${esc(id.cursus)}</span></dd></div>
      <div><dt>lieu</dt><dd>${esc(id.lieu)}<br /><span class="dim">${esc(id.origine)}</span></dd></div>
      <div><dt>le soir</dt><dd>${f(C.leSoir)}</dd></div>
      <div><dt>en trois mots</dt><dd>${f(C.troisMots)}</dd></div>
    </dl>`);

  /* ---------- questions / réponses ---------- */
  mount("assistant", `
    <p class="qa__note meta">${esc(C.assistant.note)}</p>
    <div class="qa__list">
      ${list(C.assistant.questions, (item, i) => `
        <details class="qa__item"${i === 0 ? " open" : ""}>
          <summary>${esc(item.q)}</summary>
          <div class="qa__rep">${f(item.r)}</div>
        </details>`)}
    </div>`);

  /* ---------- projets racontés ---------- */
  const run = (label, value) => `<div><dt>${label}</dt><dd>${f(value)}</dd></div>`;
  mount("projets-liste", list(C.projets, (p) => `
    <article class="projet weave weave--nested" id="${esc(p.id)}">
      <header class="projet__head">
        <p class="projet__meta meta">${esc(p.annee)} · ${esc(p.etat)}</p>
        <h3 class="projet__titre">${esc(p.titre)}</h3>
        <p class="projet__sous">${esc(p.sousTitre)}</p>
        <p class="projet__role meta">${esc(p.role)}</p>
      </header>
      <div class="projet__corps">
        <p class="projet__contexte">${esc(p.contexte)}</p>
        <ul class="projet__fait">${list(p.fait, (t) => `<li>${esc(t)}</li>`)}</ul>
        <dl class="run">
          ${run("ce qui a planté", p.plante)}
          ${run("ce qui a marché", p.marche)}
          ${run("résultat", p.resultat)}
          ${run("ce que j'en retiens", p.retiens)}
        </dl>
      </div>
      <footer class="projet__pied">
        <p class="mono dim">${p.stack.map(esc).join(" · ")}</p>
        ${p.liens.length ? `<p class="projet__liens">${list(p.liens, (l) =>
          `<a class="link-underline" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`)}</p>` : ""}
      </footer>
    </article>`));

  /* ---------- autres projets ---------- */
  mount("autres", list(C.autresProjets, (p) => `
    <li class="autre" id="${esc(p.id)}">
      <a class="autre__titre link-underline" href="${esc(p.href)}" target="_blank" rel="noopener">${esc(p.titre)} ↗</a>
      <span class="autre__annee meta">${esc(p.annee)}</span>
      <p class="autre__note">${esc(p.note)}</p>
    </li>`));

  /* ---------- parcours ---------- */
  mount("parcours-liste", list(C.parcours, (e) => `
    <li class="etape">
      <p class="etape__periode meta">${esc(e.periode)}<span class="etape__type">${esc(e.type)}</span></p>
      <div class="etape__corps">
        <h3 class="etape__titre">${esc(e.titre)}</h3>
        <p class="etape__lieu">${esc(e.lieu)}</p>
        <p class="etape__detail">${f(e.detail)}</p>
      </div>
    </li>`));

  mount("certifs", `
    <h3 class="certifs__titre meta">certifications</h3>
    <ul class="certifs__liste">
      ${list(C.certifications, (c) => `<li><span>${esc(c.titre)}</span><span class="dim">${esc(c.org)}</span><span class="meta">${esc(c.annee)}</span></li>`)}
    </ul>`);

  /* ---------- hors entraînement ---------- */
  mount("hors", `
    <p class="hors__intro lede">${f(C.horsEntrainement.intro)}</p>
    <div class="hors__blocs">
      ${list(C.horsEntrainement.blocs, (b) => `
        <section class="hors__bloc">
          <h3 class="hors__titre meta">${esc(b.titre)}</h3>
          <p>${f(b.texte)}</p>
        </section>`)}
    </div>`);

  /* ---------- contact ---------- */
  mount("contactList", `
    <li><span class="meta">email</span><a class="link-underline" href="mailto:${esc(id.email)}">${esc(id.email)}</a></li>
    <li><span class="meta">github</span><a class="link-underline" href="${esc(id.github)}" target="_blank" rel="noopener">${esc(id.githubLabel)}</a></li>
    <li><span class="meta">linkedin</span><a class="link-underline" href="${esc(id.linkedin)}" target="_blank" rel="noopener">${esc(id.linkedinLabel)}</a></li>
    <li><span class="meta">cv</span><a class="link-underline" href="${esc(id.cv)}" download>CV.pdf</a></li>`);

  /* ---------- compteur de brouillon ----------
     Disparaît tout seul quand tous les champs sont remplis. */
  const restants = document.querySelectorAll("[data-todo]").length;
  const badge = document.getElementById("todoCount");
  if (badge) {
    if (restants === 0) badge.remove();
    else badge.innerHTML = `<b>${restants}</b> emplacement${restants > 1 ? "s" : ""} à compléter dans <code>js/content.js</code>`;
  }
})();
