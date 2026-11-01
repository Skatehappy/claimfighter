import { APP_CONFIG } from '../data/config.js';

const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderNationalPage(page, states) {
  const url = `https://${APP_CONFIG.domain}/${page.slug}`;
  const faqs = page.faqs || [];
  const faqHTML = faqs.map(f => `
    <div class="faq-item"><div class="faq-q">${esc(f.q)}</div><div class="faq-a">${esc(f.a)}</div></div>`).join('');
  const schema = [
    { '@context': 'https://schema.org', '@type': 'Article', headline: page.h1, description: page.metaDescription, mainEntityOfPage: url, publisher: { '@type': 'Organization', name: APP_CONFIG.name, url: `https://${APP_CONFIG.domain}` } },
    ...(faqs.length ? [{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }] : [])
  ].map(o => `<script type="application/ld+json">${JSON.stringify(o)}</script>`).join('\n');

  const table = page.table && page.table.rows.length ? `
  <table>
    <caption>${esc(page.table.caption)}</caption>
    <thead><tr>${page.table.head.map(h => `<th>${esc(h)}</th>`).join('')}</tr></thead>
    <tbody>${page.table.rows.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>` : '';

  const steps = page.steps && page.steps.length ? `
  <h2>The process, step by step</h2>
  <ol class="steps">${page.steps.map(s => `<li><strong>${esc(s.t)}.</strong> ${esc(s.b)}</li>`).join('')}</ol>` : '';

  const letter = page.letterParts && page.letterParts.length ? `
  <h2>${esc(page.letterH2)}</h2>
  <ol class="steps">${page.letterParts.map(p => `<li>${esc(p)}</li>`).join('')}</ol>` : '';

  const sections = (page.sections || []).map(sec => `
  <h2>${esc(sec.h2)}</h2>
${sec.p.map(p => `  <p>${esc(p)}</p>`).join('\n')}${sec.stateLinks ? `
  <div class="links">${states.map(s => `<a href="/${s.slug}">${esc(s.name)}</a>`).join('')}</div>` : ''}${sec.links ? `
  <div class="links">${sec.links.map(([h, t]) => `<a href="${h}">${esc(t)}</a>`).join('')}</div>` : ''}`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(page.metaTitle)}</title>
<meta name="description" content="${esc(page.metaDescription)}">
<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(page.metaTitle)}">
<meta property="og:description" content="${esc(page.metaDescription)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@700;900&family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
${schema}
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'DM Sans',system-ui,sans-serif;background:#f8fafc;color:#0f0f0f;line-height:1.7}
nav{position:sticky;top:0;z-index:100;background:rgba(248,250,252,0.92);backdrop-filter:blur(12px);border-bottom:1px solid #dde3ec;padding:14px 28px;display:flex;justify-content:space-between;align-items:center}
.nav-brand{display:flex;align-items:center;gap:10px;text-decoration:none}
.nav-icon{width:32px;height:32px;background:linear-gradient(135deg,${APP_CONFIG.primaryColor},#0d1f33);border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:15px}
.nav-name{font-family:'Fraunces',Georgia,serif;font-size:17px;font-weight:700;color:#0f0f0f}
.nav-cta{background:${APP_CONFIG.primaryColor};color:#fff;padding:9px 20px;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600}
.nav-actions{display:flex;align-items:center;gap:16px}.nav-key{color:inherit;font-size:14px;font-weight:600;text-decoration:underline;text-underline-offset:3px}
@media(max-width:640px){nav{flex-wrap:wrap;gap:8px}.nav-actions{gap:10px;flex-wrap:wrap;justify-content:flex-end}.nav-key{font-size:12px}.nav-cta{padding:7px 12px!important;font-size:13px!important}}
.wrap{max-width:820px;margin:0 auto;padding:48px 24px}
h1{font-family:'Fraunces',Georgia,serif;font-size:clamp(30px,5vw,44px);font-weight:900;line-height:1.15;margin-bottom:20px;letter-spacing:-0.02em}
h2{font-family:'Fraunces',Georgia,serif;font-size:26px;font-weight:900;margin:40px 0 14px;letter-spacing:-0.01em}
p{font-size:16px;color:#2a2a2a;margin-bottom:14px}
table{width:100%;border-collapse:collapse;margin:28px 0;background:#fff;font-size:14px}
caption{text-align:left;font-weight:700;padding:0 0 8px}
th,td{border:1px solid #dde3ec;padding:10px 12px;text-align:left;vertical-align:top}
th{background:#eef2f7}
.steps{margin:0 0 14px 22px}.steps li{margin-bottom:10px;font-size:16px;color:#2a2a2a}
.links{display:flex;flex-wrap:wrap;gap:10px;margin:8px 0 16px}
.links a{background:#fff;padding:9px 16px;border-radius:6px;text-decoration:none;color:#0f0f0f;font-weight:500;font-size:14px;border:1px solid #dde3ec}
.links a:hover{background:${APP_CONFIG.primaryColor};color:#fff}
.cta{text-align:center;background:#fff;border:1px solid #dde3ec;border-radius:14px;padding:36px 24px;margin:44px 0}
.cta p{color:#6b6b6b}
.btn{background:${APP_CONFIG.accentColor};color:#0d1f33;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:16px;font-weight:700;display:inline-block}
.faq-item{background:#fff;border:1px solid #dde3ec;border-radius:10px;padding:16px 20px;margin-bottom:12px}
.faq-q{font-weight:700;margin-bottom:6px}.faq-a{font-size:15px;color:#3a3a3a}
footer{background:#0f0f0f;color:rgba(255,255,255,0.5);text-align:center;padding:32px 24px;font-size:12px}
footer a{color:rgba(255,255,255,0.7);text-decoration:none}
</style>
</head>
<body>
<nav>
  <a class="nav-brand" href="/"><div class="nav-icon">${APP_CONFIG.brandIcon}</div><span class="nav-name">${APP_CONFIG.name}</span></a>
  <span class="nav-actions"><a class="nav-key" href="/app">Already purchased? Enter your license key →</a><a class="nav-cta" href="${page.appHref}">${esc(page.cta)} →</a></span>
</nav>
<main class="wrap">
  <h1>${esc(page.h1)}</h1>
${page.intro.map(p => `  <p>${esc(p)}</p>`).join('\n')}${table}${steps}${letter}${sections}

  <div class="cta">
    <h2 style="margin-top:0">${esc(page.cta)}</h2>
    <p>${esc(page.ctaNote)}</p>
    <a class="btn" href="${page.appHref}">${esc(page.cta)} →</a>
  </div>
${faqs.length ? `
  <h2>Frequently asked questions</h2>${faqHTML}` : ''}
</main>
<footer>
  <p>${APP_CONFIG.name} &middot; &copy; 2026 The Super Simple Software Company &middot; <a href="mailto:support@buyappsonce.com">support@buyappsonce.com</a></p>
  <p style="margin-top:8px;font-size:11px;opacity:0.6">Legal Disclaimer: This page provides general information and is not legal advice. Rules change and vary by plan and state; verify current law or consult a licensed attorney for advice on your specific situation.</p>
</footer>
</body>
</html>`;
}
