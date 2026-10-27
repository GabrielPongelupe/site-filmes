#!/usr/bin/env node
// Valida os arquivos de content/ (ver content/README.md).
// Uso: node scripts/validate-content.mjs [--net] [arquivos...]
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const args = process.argv.slice(2);
const net = args.includes('--net');
// --fontes: abre os links das fontes de cada notícia (mais lento; sites podem bloquear robôs)
const checkSources = args.includes('--fontes');
const sourceStats = { ok: 0, bloqueado: 0, quebrado: 0 };
const only = args.filter((a) => !a.startsWith('--')).map((a) => path.resolve(a));

const IMAGE_HOSTS = ['i.ytimg.com', 'upload.wikimedia.org', 'image.tmdb.org'];
const PLATFORMS = ['Netflix', 'HBO Max', 'Prime Video', 'Disney+', 'Apple TV', 'Globoplay'];
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const YT_ID = /^[A-Za-z0-9_-]{11}$/;

const errors = [];
const warnings = [];
const err = (f, m) => errors.push(`${path.relative(root, f)}: ${m}`);
const warn = (f, m) => warnings.push(`${path.relative(root, f)}: ${m}`);
const netChecks = [];

function listMd(dir) {
  const d = path.join(root, dir);
  if (!fs.existsSync(d)) return [];
  return fs.readdirSync(d).filter((f) => f.endsWith('.md')).map((f) => path.join(d, f));
}

function selected(files) {
  return only.length ? files.filter((f) => only.includes(f)) : files;
}

function str(f, data, key, { max, required = true } = {}) {
  const v = data[key];
  if (v === undefined || v === null || v === '') {
    if (required) err(f, `campo "${key}" obrigatório`);
    return;
  }
  if (typeof v !== 'string') return err(f, `"${key}" deve ser texto`);
  if (max && v.length > max) warn(f, `"${key}" tem ${v.length} caracteres (recomendado até ${max})`);
}

function checkImageUrl(f, url, label) {
  if (typeof url !== 'string') return err(f, `${label} ausente`);
  let u;
  try { u = new URL(url); } catch { return err(f, `${label} não é URL válida`); }
  if (u.protocol !== 'https:') err(f, `${label} precisa ser https`);
  if (!IMAGE_HOSTS.includes(u.hostname)) err(f, `${label}: host ${u.hostname} não permitido (${IMAGE_HOSTS.join(', ')})`);
  if (net) netChecks.push(async () => {
    try {
      const r = await fetch(url, { method: 'GET', redirect: 'follow' });
      const ct = r.headers.get('content-type') || '';
      const len = Number(r.headers.get('content-length') || 0);
      if (!r.ok) err(f, `${label} responde ${r.status}`);
      else if (!ct.startsWith('image/')) err(f, `${label} não é imagem (${ct})`);
      // miniatura "vídeo indisponível" do YouTube tem ~1 KB
      else if (u.hostname === 'i.ytimg.com' && len && len < 2000) err(f, `${label} parece miniatura vazia do YouTube`);
      r.body?.cancel?.();
    } catch (e) { err(f, `${label} falhou: ${e.message}`); }
  });
}

function checkYoutube(f, id, label) {
  if (!YT_ID.test(String(id))) return err(f, `${label}: ID do YouTube inválido "${id}"`);
  if (net) netChecks.push(async () => {
    try {
      const r = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
      if (!r.ok) err(f, `${label}: vídeo ${id} indisponível ou não incorporável (${r.status})`);
    } catch (e) { err(f, `${label} falhou: ${e.message}`); }
  });
}

async function checkSource(f, s) {
  try {
    const r = await fetch(s.url, {
      redirect: 'follow',
      signal: AbortSignal.timeout(15000),
      headers: { 'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36', 'accept-language': 'pt-BR,pt;q=0.9,en;q=0.8' },
    });
    r.body?.cancel?.();
    if (r.ok) sourceStats.ok++;
    else if ([401, 402, 403, 429, 451].includes(r.status)) {
      sourceStats.bloqueado++;
      if (args.includes('--verbose')) warn(f, `fonte bloqueia robôs (${r.status}): ${s.url}`);
    } else {
      sourceStats.quebrado++;
      warn(f, `fonte "${s.name}" responde ${r.status}: ${s.url}`);
    }
  } catch (e) {
    sourceStats.quebrado++;
    warn(f, `fonte "${s.name}" não abriu (${e.name === 'TimeoutError' ? 'tempo esgotado' : e.message}): ${s.url}`);
  }
}

// ---------- notícias ----------
const allNews = listMd('content/noticias');
const newsSlugs = new Set();
for (const f of allNews) newsSlugs.add(path.basename(f, '.md'));

const titlesSeen = new Map();
for (const f of selected(allNews)) {
  const slug = path.basename(f, '.md');
  const m = /^(\d{4}-\d{2}-\d{2})-(.+)$/.exec(slug);
  if (!m || !SLUG.test(m[2])) err(f, 'nome deve ser AAAA-MM-DD-slug (a-z0-9-)');
  let parsed;
  try { parsed = matter(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, `YAML inválido: ${e.message}`); continue; }
  const { data, content } = parsed;

  str(f, data, 'title', { max: 120 });
  str(f, data, 'dek', { max: 240 });
  const date = typeof data.date === 'string' ? data.date : data.date instanceof Date ? data.date.toISOString() : null;
  if (!date || Number.isNaN(Date.parse(date))) err(f, '"date" inválida (use "2026-05-14T15:30:00-03:00")');
  else if (m && !date.startsWith(m[1]) && !(data.date instanceof Date)) err(f, `"date" (${date}) não bate com o nome do arquivo (${m[1]})`);
  if (date && Date.parse(date) > Date.now() + 864e5) err(f, '"date" no futuro');

  if (!['filmes', 'series', 'streaming'].includes(data.category)) err(f, '"category" deve ser filmes | series | streaming');
  if (!['noticia', 'trailer', 'bilheteria', 'critica'].includes(data.kind)) err(f, '"kind" deve ser noticia | trailer | bilheteria | critica');
  if (!Array.isArray(data.tags) || data.tags.length === 0) err(f, '"tags" precisa ser lista não vazia');
  if (data.platforms !== undefined) {
    if (!Array.isArray(data.platforms)) err(f, '"platforms" deve ser lista');
    else for (const p of data.platforms) if (!PLATFORMS.includes(p)) err(f, `"platforms": "${p}" inválida (${PLATFORMS.join(', ')})`);
  }

  if (data.titles !== undefined) {
    if (!Array.isArray(data.titles)) err(f, '"titles" deve ser lista');
    else for (const t of data.titles) {
      if (!t?.name || !['filme', 'serie'].includes(t?.type)) err(f, `"titles": cada item precisa de name e type (filme|serie)`);
      else {
        const key = `${t.name}|${t.type}`;
        titlesSeen.set(key, (titlesSeen.get(key) || 0) + 1);
      }
    }
  }

  if (!data.image) err(f, '"image" obrigatória');
  else {
    checkImageUrl(f, data.image.src, 'image.src');
    if (!data.image.alt) err(f, '"image.alt" obrigatório');
    if (!data.image.credit) err(f, '"image.credit" obrigatório');
  }
  if (data.video) {
    checkYoutube(f, data.video.youtube, 'video.youtube');
    if (!data.video.title) warn(f, '"video.title" recomendado');
  }
  if (data.kind === 'trailer' && !data.video) err(f, 'kind=trailer exige "video"');

  if (!Array.isArray(data.sources) || data.sources.length === 0) err(f, '"sources" precisa de ao menos 1 fonte');
  else for (const s of data.sources) {
    if (!s?.name || !s?.url) err(f, 'cada fonte precisa de name e url');
    else try {
      new URL(s.url);
      if (checkSources) netChecks.push(() => checkSource(f, s));
    } catch { err(f, `fonte com URL inválida: ${s.url}`); }
  }

  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (words < 200) err(f, `corpo com ${words} palavras (mínimo 200)`);
  if (words > 700) warn(f, `corpo com ${words} palavras (recomendado até 500)`);
  if (/^#\s/m.test(content)) err(f, 'não use título # no corpo (só ## em diante)');
}

// ---------- títulos ----------
for (const f of selected(listMd('content/titulos'))) {
  const slug = path.basename(f, '.md');
  if (!SLUG.test(slug)) err(f, 'slug inválido (a-z0-9-)');
  let parsed;
  try { parsed = matter(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, `YAML inválido: ${e.message}`); continue; }
  const { data, content } = parsed;
  str(f, data, 'name');
  if (!['filme', 'serie'].includes(data.type)) err(f, '"type" deve ser filme | serie');
  if (!Number.isInteger(data.year)) err(f, '"year" deve ser número');
  if (!Array.isArray(data.genres) || !data.genres.length) err(f, '"genres" obrigatório');
  checkImageUrl(f, data.poster, 'poster');
  if (data.backdrop) checkImageUrl(f, data.backdrop, 'backdrop');
  if (data.trailer) checkYoutube(f, data.trailer, 'trailer');
  if (data.where && !Array.isArray(data.where)) err(f, '"where" deve ser lista');
  if (data.cast && !Array.isArray(data.cast)) err(f, '"cast" deve ser lista');
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  if (words < 40) err(f, `sinopse com ${words} palavras (mínimo 40)`);
}

// ---------- calendário ----------
for (const [file, kind] of [['content/calendario/cinema.json', 'cinema'], ['content/calendario/streaming.json', 'streaming']]) {
  const f = path.join(root, file);
  if (!fs.existsSync(f) || (only.length && !only.includes(f))) continue;
  let list;
  try { list = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { err(f, `JSON inválido: ${e.message}`); continue; }
  if (!Array.isArray(list)) { err(f, 'deve ser uma lista'); continue; }
  list.forEach((it, i) => {
    const at = `item ${i} (${it?.title})`;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(it?.date || '')) err(f, `${at}: date AAAA-MM-DD`);
    if (!it?.title) err(f, `${at}: title obrigatório`);
    if (!it?.genre) err(f, `${at}: genre obrigatório`);
    if (kind === 'streaming') {
      if (!PLATFORMS.includes(it?.platform)) err(f, `${at}: platform deve ser ${PLATFORMS.join(', ')}`);
      if (!['Filme', 'Série', 'Doc', 'Reality', 'Animação', 'Especial'].includes(it?.type)) err(f, `${at}: type inválido`);
    } else if (!it?.synopsis) err(f, `${at}: synopsis obrigatória`);
    if (it?.poster) checkImageUrl(f, it.poster, `${at} poster`);
    if (it?.trailer) checkYoutube(f, it.trailer, `${at} trailer`);
  });
}

// ---------- rede ----------
if (netChecks.length) {
  const queue = [...netChecks];
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (queue.length) await queue.shift()();
  }));
}

for (const w of warnings) console.log(`aviso  ${w}`);
if (checkSources) {
  console.log(`\nfontes: ${sourceStats.ok} ok · ${sourceStats.bloqueado} bloqueiam robôs (abrem no navegador) · ${sourceStats.quebrado} quebradas/inexistentes`);
}
for (const e of errors) console.log(`ERRO   ${e}`);
console.log(`\n${errors.length} erro(s), ${warnings.length} aviso(s). ${allNews.length} notícia(s) no total.${net ? '' : ' (sem --net: imagens/vídeos não testados)'}`);
process.exit(errors.length ? 1 : 0);
