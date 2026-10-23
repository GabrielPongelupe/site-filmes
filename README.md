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
