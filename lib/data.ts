// Rotas e textos fixos do site. O conteúdo editorial fica em content/ (ver lib/content.ts).

export const routes = {
  home: '/',
  noticia: (slug: string) => `/noticia/${slug}`,
  titulo: (slug: string) => `/titulo/${slug}`,
  tag: (slug: string) => `/tag/${slug}`,
  filmes: '/filmes',
  series: '/series',
  emAlta: '/em-alta',
  trailers: '/trailers',
  criticas: '/criticas',
  bilheteria: '/bilheteria',
  busca: '/busca',
  sobre: '/sobre',
  privacidade: '/privacidade',
  emBreve: '/em-breve',
} as const;

export const nav = [
  { label: 'Home', href: routes.home },
  { label: 'Filmes', href: routes.filmes },
  { label: 'Séries', href: routes.series },
  { label: 'Em alta', href: routes.emAlta },
];

export const footerCols = [
  { h: 'EDITORIAS', l: [['Filmes', routes.filmes], ['Séries', routes.series], ['Críticas', routes.criticas]] },
  { h: 'GUIAS', l: [['Em alta', routes.emAlta], ['Trailers', routes.trailers], ['Bilheteria', routes.bilheteria]] },
  { h: 'SPOILADO', l: [['Sobre', routes.sobre], ['Anuncie', routes.emBreve], ['Contato', routes.emBreve], ['Privacidade', routes.privacidade]] },
];
