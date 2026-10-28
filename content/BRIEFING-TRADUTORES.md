# Briefing para tradutores (agentes) do Spoilado

O Spoilado é publicado em três versões: português do Brasil (original), espanhol da Espanha e espanhol
latino-americano (México, Colômbia, Argentina, Chile etc.). Projeto: /home/gabriel/gabriel/projects/site-filmes.

## Estrutura

Cada notícia é uma pasta em `content/noticias/<slug>/`:

```
index.md    original em pt-BR + todos os metadados (NÃO EDITE)
es-ES.md    tradução para espanhol da Espanha       ← você cria
es-419.md   tradução para espanhol latino-americano ← você cria
```

A tradução só tem os campos de texto. Data, imagem, vídeo, fontes, tags etc. vêm do `index.md`:

```markdown
---
title: "Título traduzido"
dek: "Linha fina traduzida"
imageAlt: "Tradução de image.alt"
videoTitle: "Tradução de video.title"     # só se o index.md tiver `video`
titles: ["Nome oficial no mercado"]        # opcional; mesma quantidade e ordem de `titles` do index.md
---

Corpo traduzido em Markdown (mesmos ## subtítulos, listas, citações e links).
```

## Regras

- **Tradução fiel.** Não acrescente, não corte e não "atualize" fatos. Números, datas e nomes iguais ao original.
  Mantenha valores em moeda como estão (ex.: "R$ 17,23 millones").
- Texto natural, de jornalismo cultural, não literal. Mantenha o tom do Spoilado (direto, informativo).
- **es-ES (Espanha):** vosotros quando houver 2ª pessoa do plural, "película", "estreno", "taquilla",
  "ordenador", "móvil", "en cines". Datas como "21 de octubre".
- **es-419 (América Latina):** espanhol neutro (ustedes, sem voseo nem gírias locais): "película",
  "estreno", "taquilla", "computadora", "celular", "en cines".
- **Títulos de filmes/séries:** use o título oficial em cada mercado **só se tiver certeza** (eles mudam entre
  Espanha e América Latina). Na dúvida, use o título original (geralmente em inglês) em itálico.
  O campo `titles` segue a mesma regra; se não souber, omita o campo.
- Consulte `content/titulos-es.json` (nome no Brasil → original, es-ES, es-419) e use esses nomes no texto.
  Se o título não estiver lá, use o original — nunca o nome em português de uma obra estrangeira.
- Nomes de plataformas, pessoas, festivais e prêmios não se traduzem (Netflix, Globoplay, Oscar, Mostra de São Paulo).
- Referências ao Brasil ficam como estão ("en los cines brasileños", "la taquilla brasileña"): é um fato da notícia.
- Não use título `#` no corpo. Não copie o front matter do `index.md`.

## Fluxo

1. Para cada slug do seu lote: leia `content/noticias/<slug>/index.md` e escreva `es-ES.md` e `es-419.md` na mesma pasta.
   Se a tradução já existir, pule.
2. Valide o seu lote (uma chamada com todos os arquivos):
   `node scripts/validate-content.mjs content/noticias/<slug>/es-ES.md content/noticias/<slug>/es-419.md ...`
   e corrija até zerar os erros nos seus arquivos.
3. Não edite `index.md`, não mexa em outros lotes, não rode git.

Resposta final curta: quantos arquivos criou e qualquer problema.
