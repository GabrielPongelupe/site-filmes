# Conteúdo do Spoilado

Todo o conteúdo do site é arquivo estático neste diretório, sem backend.
No build, o Next.js lê esses arquivos e gera as páginas.

```
content/
  noticias/<slug>.md        uma notícia por arquivo
  titulos/<slug>.md         ficha de filme/série
  calendario/cinema.json    estreias nos cinemas (Brasil)
  calendario/streaming.json estreias no streaming (Brasil)
```

Valide sempre depois de editar:

```bash
node scripts/validate-content.mjs              # tudo, sem rede
node scripts/validate-content.mjs --net        # também testa imagens e vídeos
node scripts/validate-content.mjs --net content/noticias/2026-05-*.md   # só alguns arquivos
```

---

## Notícias — `content/noticias/<slug>.md`

**Slug / nome do arquivo:** `AAAA-MM-DD-titulo-curto-sem-acentos.md`
(data da publicação + 3 a 8 palavras em minúsculas, separadas por hífen, só `a-z0-9-`).
Ex.: `2026-05-14-duna-parte-tres-ganha-trailer.md`

```markdown
---
title: "Título da notícia, em português, até ~110 caracteres"
dek: "Linha fina: 1 ou 2 frases que complementam o título (até ~220 caracteres)."
date: "2026-05-14T15:30:00-03:00"
category: filmes          # filmes | series | streaming
kind: noticia             # noticia | trailer | bilheteria | critica
tags: [Duna, Warner, FicçãoCientífica]
platforms: [Netflix]      # opcional — plataformas onde o título está/chega no Brasil
                          # (Netflix, HBO Max, Prime Video, Disney+, Apple TV, Globoplay)
titles:                   # filmes/séries centrais da notícia (0 a 3)
  - name: "Duna: Parte Três"
    type: filme           # filme | serie
    year: 2026
image:
  src: "https://i.ytimg.com/vi/XXXXXXXXXXX/maxresdefault.jpg"
  alt: "Descrição objetiva da imagem"
  credit: "Warner Bros. / YouTube"
video:                    # opcional — só trailer/vídeo oficial no YouTube
  youtube: "XXXXXXXXXXX"
  title: "Trailer oficial legendado"
sources:                  # 1 a 4 links das fontes consultadas
  - name: "Variety"
    url: "https://variety.com/..."
featured: false           # true em no máx. ~3 notícias por mês (as mais importantes)
---

Corpo em Markdown, português do Brasil, 250 a 500 palavras.
```

### Regras editoriais

- **Fatos reais e verificáveis**, publicados no mês indicado no nome do arquivo. Nada inventado:
  números, datas, nomes e declarações precisam estar nas fontes listadas.
- **Texto 100% original.** Reescreva com suas palavras; nunca copie parágrafos ou frases das fontes.
  Citação direta só se for curta (até ~15 palavras), entre aspas, atribuída a quem falou.
- Tom do Spoilado: direto, informativo, sem spoiler pesado (avise quando houver).
- Foco no público brasileiro: datas de estreia no Brasil, plataformas disponíveis aqui,
  bilheteria nacional quando fizer sentido, produções brasileiras.
- O corpo pode ter subtítulos `##`, listas e uma citação `>` em destaque. Não repita o título no corpo.
- `kind: critica` = repercussão da crítica especializada (o que os críticos disseram, notas
  agregadas, com fontes) — não invente opinião própria sobre algo que não foi visto.

### Categorias

| category  | quando usar |
|-----------|-------------|
| `filmes`  | cinema: lançamentos, produção, elenco, bilheteria, festivais, prêmios |
| `series`  | séries de TV/streaming: renovações, temporadas, elenco, finais |
| `streaming` | negócios e catálogos das plataformas: "o que chega na Netflix em junho", preços, fusões, lançamentos de filmes direto no streaming |

### Imagens (obrigatória) — só destes hosts

1. **Miniatura de vídeo oficial do YouTube** (preferida): `https://i.ytimg.com/vi/<ID>/maxresdefault.jpg`
   (se não existir em alta, use `hqdefault.jpg`). Crédito: `"<Estúdio/Canal> / YouTube"`.
2. **Wikimedia Commons**: `https://upload.wikimedia.org/...` (fotos de atores, diretores, eventos).
   Crédito: `"<Autor> / Wikimedia Commons (<licença>)"`.
3. **TMDB**: `https://image.tmdb.org/t/p/original/...` (pôsteres e backdrops). Crédito: `"Divulgação / TMDB"`.

Teste a URL antes de usar: `curl -sI <url>` precisa responder 200 com `content-type: image/...`.

### Vídeo (opcional)

Só IDs de vídeos **oficiais** no YouTube (canal do estúdio/plataforma/distribuidora).
Confirme que existe e permite incorporação:
`curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<ID>&format=json"`
precisa retornar JSON (não "Not Found"/"Unauthorized").

---

## Títulos — `content/titulos/<slug>.md`

Slug: nome sem acentos, minúsculo, com hífens (+ ano se houver ambiguidade). Ex.: `duna-parte-tres.md`.

```markdown
---
name: "Duna: Parte Três"
originalName: "Dune: Part Three"
type: filme               # filme | serie
year: 2026
genres: [Ficção científica, Aventura]
rating: "14"              # classificação indicativa no Brasil: L, 10, 12, 14, 16, 18 (ou omitir)
runtime: "2h46"           # filmes; séries: omitir
seasons: 2                # séries; filmes: omitir
release: "2026-12-17"     # estreia no Brasil (cinema ou streaming)
where:                    # onde assistir no Brasil
  - name: "Cinemas"
    kind: "Em cartaz"
credits:                  # pares chave/valor da ficha
  - k: "Direção"
    v: "Denis Villeneuve"
cast:                     # até 6
  - name: "Timothée Chalamet"
    role: "Paul Atreides"
poster: "https://image.tmdb.org/t/p/w500/...."
backdrop: "https://image.tmdb.org/t/p/original/...."
trailer: "XXXXXXXXXXX"    # ID YouTube oficial (opcional)
---

Sinopse original em português, 60 a 120 palavras, sem spoilers.
```

---

## Calendário — `content/calendario/*.json`

`cinema.json`:
```json
[{ "date": "2026-10-23", "title": "Nome no Brasil", "genre": "Terror", "runtime": "1h41",
   "rating": "16", "distributor": "Paris Filmes", "synopsis": "1 frase original.",
   "poster": "https://image.tmdb.org/t/p/w500/...", "trailer": "YouTubeID" }]
```

`streaming.json`:
```json
[{ "date": "2026-10-24", "platform": "Netflix", "title": "Nome no Brasil",
   "type": "Série", "genre": "Drama", "poster": "https://image.tmdb.org/t/p/w500/..." }]
```

Plataformas aceitas: `Netflix`, `HBO Max`, `Prime Video`, `Disney+`, `Apple TV`, `Globoplay`.
Campos `poster`, `trailer`, `runtime`, `rating` são opcionais.
