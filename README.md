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
  - `/noticia` — página genérica de notícia (todas as notícias apontam para ela)
  - `/titulo` — página genérica de filme/série (todos os títulos apontam para ela)
  - `/em-breve` — página genérica para seções ainda não implementadas (trailers, newsletter, busca, institucional)
- `components/` — header, ticker, rodapé, publicidade e blocos reutilizáveis
- `lib/data.ts` — conteúdo provisório (placeholder) usado em todas as telas
- `app/globals.css` — tokens de cor/tipografia e estilos de todas as telas
