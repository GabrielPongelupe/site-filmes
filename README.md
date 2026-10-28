# Spoilado

Portal de notícias de cinema, séries e streaming — primeira versão, feita a partir do protótipo `Spoilado.dc.html`.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Estrutura

- `app/` — rotas (Next.js App Router)
  - `/` home · `/filmes` `/series` `/streaming` categorias · `/em-alta` · `/estreias`
  - `/noticia/[slug]` notícia · `/titulo/[slug]` filme/série · `/tag/[tag]` · `/busca`
  - `/trailers` `/criticas` `/bilheteria` · `/sobre` `/privacidade` · `/em-breve` (newsletter, anuncie, contato)
- `components/` — header, ticker, rodapé, publicidade e blocos reutilizáveis
- `content/` — notícias (`.md`), fichas de títulos e calendário de estreias; formato em `content/README.md`
- `lib/content.ts` — lê `content/` no build; `lib/data.ts` — rotas e menus
- `scripts/validate-content.mjs` — valida o conteúdo (`--net` testa imagens e vídeos)
- `app/globals.css` — tokens de cor/tipografia e estilos de todas as telas

## Newsletter

Formulário em `/<idioma>/newsletter`, que envia para `app/api/newsletter/route.ts`.
Os inscritos ficam num banco **Upstash Redis** (plano grátis), criado pela Vercel:

1. Vercel → projeto → **Storage** → **Create Database** → **Upstash** → **Redis** (plano Free) → conectar ao projeto.
   Isso cria sozinho as variáveis `KV_REST_API_URL` e `KV_REST_API_TOKEN`.
2. Vercel → **Settings → Environment Variables**: crie `NEWSLETTER_ADMIN_TOKEN` com uma senha longa e aleatória.
3. Faça um novo deploy.

Rotas:

```bash
# inscrever (é o que o formulário faz)
curl -X POST https://SEU-SITE/api/newsletter -H 'content-type: application/json' -d '{"email":"fulano@exemplo.com","locale":"pt-br"}'

# listar inscritos (JSON) — exige a senha
curl https://SEU-SITE/api/newsletter -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN"

# baixar em CSV
curl "https://SEU-SITE/api/newsletter?formato=csv" -H "Authorization: Bearer $NEWSLETTER_ADMIN_TOKEN" -o inscritos.csv
```
