// Deterministic markdown -> house-styled HTML playbook.
// Converts claude-code-lead-gen-guide.md into content/playbooks/<slug>.html
// preserving EVERY word of the source. No summarizing, no dropping.
import { readFileSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SLUG = "claude-code-lead-gen-guide";
const SRC = "/Users/ghilesmoussaoui/Desktop/BizOps/marketing/lead-magnets/claude-code-lead-gen-guide.md";
const OUT = join(ROOT, "content", "playbooks", `${SLUG}.html`);

const raw = readFileSync(SRC, "utf-8");
const lines = raw.replace(/\r\n/g, "\n").split("\n");

function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
// inline: escape, then inline-code, then bold. (code first so ** inside code is left alone)
function inline(s) {
  let t = esc(s);
  t = t.replace(/`([^`]+)`/g, (_, c) => `<code>${c}</code>`);
  t = t.replace(/\*\*([^*]+)\*\*/g, (_, c) => `<strong>${c}</strong>`);
  return t;
}

// ---- locate the intro (before Contents) and the chapters ----
const out = [];
const toc = [];
let i = 0;

// title
let title = "Run Your Entire Lead Gen and Outbound Motion with Claude Code";
while (i < lines.length && !/^#\s+/.test(lines[i])) i++;
if (i < lines.length) {
  title = lines[i].replace(/^#\s+/, "").trim();
  i++;
}

// intro paragraphs until "**Contents**"
const introParas = [];
{
  let buf = [];
  const flush = () => {
    if (buf.length) {
      introParas.push(buf.join(" ").trim());
      buf = [];
    }
  };
  while (i < lines.length) {
    const ln = lines[i];
    if (/^\*\*Contents\*\*/.test(ln)) {
      i++;
      break;
    }
    if (ln.trim() === "") {
      flush();
    } else if (/^#{1,4}\s/.test(ln)) {
      break;
    } else {
      buf.push(ln.trim());
    }
    i++;
  }
  flush();
}

// TOC list (numbered) right after **Contents**
while (i < lines.length) {
  const ln = lines[i].trim();
  const m = ln.match(/^(\d+)\.\s+(.+)$/);
  if (m) {
    toc.push({ n: m[1], text: m[2] });
    i++;
  } else if (ln === "" || ln === "---") {
    i++;
    if (toc.length) break; // stop once we've consumed the list + trailing blank
  } else {
    break;
  }
}

// ---- body block parser ----
const body = [];
let justH2 = false;

function pushPara(buf) {
  if (!buf.length) return;
  const text = buf.join(" ").trim();
  if (!text) return;
  const cls = justH2 && text.length < 240 ? ' class="lede"' : "";
  body.push(`  <p${cls}>${inline(text)}</p>`);
  justH2 = false;
}

let para = [];
while (i < lines.length) {
  const ln = lines[i];
  const t = ln.trim();

  // fenced code block
  const fence = ln.match(/^```(.*)$/);
  if (fence) {
    pushPara(para);
    para = [];
    const codeLines = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i])) {
      codeLines.push(lines[i]);
      i++;
    }
    i++; // consume closing ```
    // title from a leading "# comment" line, else omit
    let ctitle = "";
    const first = codeLines[0] || "";
    const cm = first.match(/^#\s+(.+)$/);
    if (cm) ctitle = cm[1].trim();
    const codeHtml = codeLines.map((c) => esc(c)).join("\n");
    const titleHtml = ctitle
      ? `\n    <p class="code-title">${inline(ctitle)}</p>`
      : "";
    body.push(
      `  <div class="codewrap">${titleHtml}\n    <button class="copy" type="button" aria-label="Copy code">Copy</button>\n    <pre><code>${codeHtml}</code></pre>\n  </div>`
    );
    justH2 = false;
    continue;
  }

  // headings
  const h = ln.match(/^(#{2,4})\s+(.+)$/);
  if (h) {
    pushPara(para);
    para = [];
    const level = h[1].length;
    const text = h[2].trim();
    if (level === 2) {
      const cm = text.match(/^(\d+)\.\s+(.+)$/);
      const id = cm ? `ch${cm[1]}` : text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      body.push(`  <h2 id="${id}">${inline(text)}</h2>`);
      justH2 = true;
    } else if (level === 3) {
      body.push(`  <h3>${inline(text)}</h3>`);
      justH2 = false;
    } else {
      body.push(`  <h4>${inline(text)}</h4>`);
      justH2 = false;
    }
    i++;
    continue;
  }

  // horizontal rule / chapter divider -> skip, but keep a Sources footer note
  if (/^---\s*$/.test(t)) {
    pushPara(para);
    para = [];
    i++;
    continue;
  }

  // checklist
  if (/^- \[[ xX]\]\s+/.test(t)) {
    pushPara(para);
    para = [];
    const items = [];
    while (i < lines.length && /^\s*- \[[ xX]\]\s+/.test(lines[i])) {
      items.push(lines[i].trim().replace(/^- \[[ xX]\]\s+/, ""));
      i++;
    }
    body.push(
      `  <ul class="checklist">\n${items
        .map((it) => `    <li>${inline(it)}</li>`)
        .join("\n")}\n  </ul>`
    );
    justH2 = false;
    continue;
  }

  // table
  if (/^\|/.test(t) && lines[i + 1] && /^\|[\s:|-]+\|/.test(lines[i + 1].trim())) {
    pushPara(para);
    para = [];
    const rows = [];
    while (i < lines.length && /^\|/.test(lines[i].trim())) {
      rows.push(lines[i].trim());
      i++;
    }
    const cells = (r) =>
      r
        .replace(/^\|/, "")
        .replace(/\|$/, "")
        .split("|")
        .map((c) => c.trim());
    const header = cells(rows[0]);
    const dataRows = rows.slice(2); // skip header + separator
    const thead = `      <thead><tr>${header
      .map((c) => `<th>${inline(c)}</th>`)
      .join("")}</tr></thead>`;
    const tbody = `      <tbody>\n${dataRows
      .map(
        (r) =>
          `        <tr>${cells(r)
            .map((c) => `<td>${inline(c)}</td>`)
            .join("")}</tr>`
      )
      .join("\n")}\n      </tbody>`;
    body.push(
      `  <div class="tw">\n    <table>\n${thead}\n${tbody}\n    </table>\n  </div>`
    );
    justH2 = false;
    continue;
  }

  // ordered list
  if (/^\d+\.\s+/.test(t)) {
    pushPara(para);
    para = [];
    const items = [];
    while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
      items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
      i++;
    }
    body.push(
      `  <ol class="numlist">\n${items
        .map((it) => `    <li>${inline(it)}</li>`)
        .join("\n")}\n  </ol>`
    );
    justH2 = false;
    continue;
  }

  // unordered list
  if (/^-\s+/.test(t)) {
    pushPara(para);
    para = [];
    const items = [];
    while (i < lines.length && /^\s*-\s+/.test(lines[i]) && !/^\s*- \[[ xX]\]/.test(lines[i])) {
      items.push(lines[i].trim().replace(/^-\s+/, ""));
      i++;
    }
    body.push(
      `  <ul class="bullets">\n${items
        .map((it) => `    <li>${inline(it)}</li>`)
        .join("\n")}\n  </ul>`
    );
    justH2 = false;
    continue;
  }

  // blank -> paragraph break
  if (t === "") {
    pushPara(para);
    para = [];
    i++;
    continue;
  }

  // accumulate paragraph text
  para.push(t);
  i++;
}
pushPara(para);

// intro paragraphs html (all rendered, none dropped)
const introHtml = introParas
  .map((p, idx) => {
    if (idx === 0) return `  <p class="hero__thesis">${inline(p)}</p>`;
    return `  <p>${inline(p)}</p>`;
  })
  .join("\n");

const tocHtml = toc
  .map((t) => `    <li><a href="#ch${t.n}">${t.n}. ${esc(t.text)}</a></li>`)
  .join("\n");

const heroLead =
  "Every GTM tool is an API behind a login. Claude Code calls them directly, moves the data between jobs, and runs the whole motion from your files.";

const CSS = readFileSync(join(ROOT, "scripts", "playbook-shell.css"), "utf-8");

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Muditek</title>
<meta name="description" content="Run the whole go-to-market motion from Claude Code: context layer, a collapsed tool stack, lead sourcing, an enrichment waterfall, deterministic scoring, cold email with deliverability, an automated reply desk, signal-based outbound, and a weekly measurement loop.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
${CSS}
</style>
</head>
<body>
<div id="top"></div>
<header class="letterhead">
  <img src="/media/${SLUG}/muditek-logo.svg" alt="Muditek">
  <span class="letterhead__meta">Lead Gen From Claude Code</span>
</header>

<header class="hero">
  <h1>${inline(title)}</h1>
  <p class="hero__lead">${esc(heroLead)}</p>
${introHtml}
  <div class="system-map" role="img" aria-label="Build path: Context, Stack, Wire, Source, Enrich, Send">
    <div class="map-node"><span>01</span><b>Context</b></div>
    <div class="map-node"><span>02</span><b>Collapse Stack</b></div>
    <div class="map-node is-hot"><span>03</span><b>Wire Tools</b></div>
    <div class="map-node"><span>04</span><b>Source</b></div>
    <div class="map-node is-warn"><span>05</span><b>Enrich + Score</b></div>
    <div class="map-node is-stop"><span>06</span><b>Send + Reply</b></div>
  </div>
  <p class="caption">You don't start with a tool. You start with the context that makes the agent run GTM like your team, then wire the stack under it.</p>
</header>

<nav class="toc" aria-label="Table of contents">
  <h2>Contents</h2>
  <ol>
${tocHtml}
  </ol>
</nav>

<article class="doc">
${body.join("\n")}

  <section class="cta">
    <h2>We wire the whole motion for you</h2>
    <p>This guide is the build. <strong>Muditek stands up the running system.</strong> We write the context layer, collapse your tool stack onto one API, wire sourcing, the enrichment waterfall, deterministic scoring, cold email with deliverability, the reply desk, and signal-based outbound, then keep the right 20 percent in human hands.</p>
    <p>If your outbound reads like a robot wrote it, the fix is not a better prompt. It is the context and the wiring underneath it.</p>
  </section>
</article>

<footer class="footer">
  <img src="/media/${SLUG}/muditek-logo.svg" alt="Muditek">
  <p>Built by Muditek. We build the agent systems that run the work, on infrastructure you control. <a href="https://muditek.com">muditek.com</a></p>
</footer>

<script>
(function(){
  document.querySelectorAll('.copy').forEach(function(btn){
    btn.addEventListener('click', function(){
      var pre = btn.parentElement.querySelector('pre');
      if(!pre) return;
      var text = pre.innerText;
      var done = function(){
        btn.textContent = 'Copied';
        btn.classList.add('ok');
        setTimeout(function(){ btn.textContent = 'Copy'; btn.classList.remove('ok'); }, 1500);
      };
      if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(text).then(done).catch(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try{ document.execCommand('copy'); }catch(e){}
        ta.remove();
        done();
      }
    });
  });
  var ok = !window.matchMedia || !matchMedia('(prefers-reduced-motion: reduce)').matches;
  var root = document.documentElement;
  root.classList.add('js');
  if(!ok) return;
  root.classList.add('motion');
  var els = document.querySelectorAll('.doc h2, .doc .tw, .doc .codewrap, .doc .callout, .doc .cta');
  els.forEach(function(el){ el.classList.add('reveal'); });
  var revealAll = function(){ els.forEach(function(el){ el.classList.add('in'); }); };
  window.addEventListener('beforeprint', revealAll);
  setTimeout(revealAll, 2200);
  if(!('IntersectionObserver' in window)){ revealAll(); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, {rootMargin:'0px 0px -7% 0px', threshold:.05});
  els.forEach(function(el){ io.observe(el); });
})();
</script>
</body>
</html>
`;

writeFileSync(OUT, html, "utf-8");
console.log(`Wrote ${OUT}`);
console.log(`intro paras: ${introParas.length}, toc items: ${toc.length}, body blocks: ${body.length}`);
