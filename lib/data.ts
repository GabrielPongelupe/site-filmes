// Conteúdo provisório (placeholder) tirado do protótipo.
// Todas as notícias apontam para a página genérica de notícia e todos os
// títulos para a página genérica de filme/série, até existir um CMS/API.

export const routes = {
  home: '/',
  noticia: '/noticia',
  titulo: '/titulo',
  filmes: '/filmes',
  series: '/series',
  streaming: '/streaming',
  emAlta: '/em-alta',
  estreias: '/estreias',
  emBreve: '/em-breve',
} as const;

export type News = {
  cat: string;
  title: string;
  dek: string;
  time: string;
  img: string;
};

export const nav = [
  { label: 'Home', href: routes.home },
  { label: 'Filmes', href: routes.filmes },
  { label: 'Séries', href: routes.series },
  { label: 'Streaming', href: routes.streaming },
  { label: 'Em alta', href: routes.emAlta },
  { label: 'Estreias', href: routes.estreias },
];

export const ticker = [
  { time: '18:32', text: 'Órbita Zero T2 ganha data: 12 de março' },
  { time: '18:10', text: "Bilheteria: 'Os Últimos Faróis 2' lidera pelo 2º fim de semana" },
  { time: '17:45', text: "Trailer final de 'Cidade Submersa' já passa de 6 mi de views" },
  { time: '17:20', text: 'Globoplay confirma nova série policial para 2027' },
];

export const leadStory = {
  title: 'Órbita Zero volta em março, e o trailer entrega a cena que ninguém esperava',
  dek: 'A segunda temporada ganhou data, pôster e dois minutos de prévia. Separamos cada detalhe, sem spoiler pesado.',
  meta: 'há 12 min · 4 min de leitura',
};

export const news: News[] = [
  { cat: 'FILMES', title: "Sequência de 'Os Últimos Faróis' passa de R$ 40 milhões no 1º fim de semana", dek: 'É a maior abertura nacional do ano e já supera o primeiro filme inteiro.', time: 'há 38 min', img: '[ cena do filme ]' },
  { cat: 'STREAMING', title: 'Tudo que chega à Netflix em novembro: 38 títulos, e três prometem barulho', dek: 'Lista completa com datas, do thriller coreano ao especial de comédia.', time: 'há 1 h', img: '[ colagem ]' },
  { cat: 'TRAILER', title: "'Cidade Submersa' solta trailer final, e o vilão finalmente mostra o rosto", dek: 'Filme estreia em dezembro nos cinemas e chega ao streaming em 2027.', time: 'há 2 h', img: '[ frame trailer ]' },
  { cat: 'FILMES', title: "Diretora de 'Maré Vermelha' confirma versão estendida com 40 minutos inéditos", dek: 'O corte novo deve sair primeiro em sessões especiais.', time: 'há 3 h', img: '[ bastidores ]' },
  { cat: 'SÉRIES', title: "Final de 'Clã Ferreira' divide fãs; elenco responde às críticas", dek: 'Protagonista diz que o desfecho estava planejado desde a primeira temporada.', time: 'há 4 h', img: '[ cena série ]' },
  { cat: 'CRÍTICA', title: "Crítica: 'O Inverno de Lúcia' é o drama brasileiro mais preciso do ano", dek: 'Atuação central sustenta um roteiro econômico e sem atalhos.', time: 'há 5 h', img: '[ still ]' },
  { cat: 'STREAMING', title: 'Max revela as 12 estreias de novembro, com retorno de série de terror', dek: 'Plataforma também confirma documentário musical para o fim do mês.', time: 'há 6 h', img: '[ key art ]' },
  { cat: 'SÉRIES', title: "'Turno da Noite' é renovada para a 3ª temporada antes mesmo da estreia da 2ª", dek: 'Gravações começam em janeiro em São Paulo.', time: 'há 7 h', img: '[ elenco ]' },
];

export const trailers = [
  { title: 'Cidade Submersa · Trailer final', dur: '2:41', plat: 'Cinemas · Dezembro', views: '6,2 mi' },
  { title: 'Órbita Zero · Temporada 2', dur: '2:03', plat: 'Apple TV+ · Março', views: '4,1 mi' },
  { title: 'Casa Vazia · Teaser', dur: '1:12', plat: 'Max · 22 out', views: '1,9 mi' },
  { title: 'Pequenos Gigantes · Trailer dublado', dur: '2:20', plat: 'Disney+ · 23 out', views: '1,3 mi' },
];

export type StreamingItem = { title: string; type: string; date: string };
export type Platform = { name: string; items: StreamingItem[] };

export const platforms: Platform[] = [
  { name: 'Netflix', items: [{ title: 'Noite de Vidro', type: 'Filme · Suspense', date: '23 OUT' }, { title: 'Herança', type: 'Série · Drama', date: '24 OUT' }, { title: 'Kombi 77', type: 'Filme · Comédia', date: '25 OUT' }, { title: 'Fronteira Sul', type: 'Série · Policial', date: '27 OUT' }] },
  { name: 'Max', items: [{ title: 'Casa Vazia', type: 'Série · Terror', date: '22 OUT' }, { title: 'O Último Set', type: 'Doc · Música', date: '24 OUT' }, { title: 'Plano B', type: 'Filme · Ação', date: '26 OUT' }, { title: 'Herdeiros', type: 'Série · Drama', date: '27 OUT' }] },
  { name: 'Prime Video', items: [{ title: 'Calor de Março', type: 'Filme · Romance', date: '22 OUT' }, { title: 'Divisão 9', type: 'Série · Ação', date: '25 OUT' }, { title: 'Pé na Estrada', type: 'Reality', date: '26 OUT' }, { title: 'Sem Sinal', type: 'Filme · Suspense', date: '27 OUT' }] },
  { name: 'Disney+', items: [{ title: 'Pequenos Gigantes', type: 'Animação', date: '23 OUT' }, { title: 'Ilha Norte', type: 'Série · Aventura', date: '24 OUT' }, { title: 'Corrida Final', type: 'Doc · Esporte', date: '26 OUT' }, { title: 'Ecos', type: 'Série · Fantasia', date: '27 OUT' }] },
  { name: 'Apple TV+', items: [{ title: 'Órbita Zero T1', type: 'Série · Sci-fi', date: '21 OUT' }, { title: 'Linha d’Água', type: 'Filme · Drama', date: '24 OUT' }, { title: 'O Inventor', type: 'Série · Biografia', date: '25 OUT' }, { title: 'Faixa 4', type: 'Série · Comédia', date: '27 OUT' }] },
  { name: 'Globoplay', items: [{ title: 'Clã Ferreira', type: 'Série · Drama', date: '22 OUT' }, { title: 'Sertão Neon', type: 'Filme · Ação', date: '23 OUT' }, { title: 'Turno da Noite T2', type: 'Série · Policial', date: '25 OUT' }, { title: 'Bairro', type: 'Doc', date: '27 OUT' }] },
];

export const mostRead = [
  'Órbita Zero: data, trailer e tudo sobre a 2ª temporada',
  'Final de Clã Ferreira explicado',
  'Os 38 lançamentos da Netflix em novembro',
  'Os Últimos Faróis 2 tem cena pós-créditos?',
  'Elenco de Cidade Submersa: quem é quem',
];

// ---------- notícia ----------

export const article = {
  section: { label: 'Séries', href: routes.series },
  crumb: 'Órbita Zero',
  kicker: 'SÉRIES · EXCLUSIVO',
  title: leadStory.title,
  dek: leadStory.dek,
  author: 'Marina Takeda',
  date: '21 out 2026, 18h32 · 4 min de leitura',
  caption: 'Cena da 2ª temporada de Órbita Zero. Foto: divulgação',
  tags: ['ÓrbitaZero', 'AppleTV', 'FicçãoCientífica', 'Trailers'],
};

export const share = ['WhatsApp', 'X', 'Copiar link', 'Salvar'];

// ---------- filme / série ----------

export const title = {
  name: 'Órbita Zero',
  meta: 'SÉRIE · 2025– · 2 TEMPORADAS · 16 ANOS',
  boxMeta: 'SÉRIE · 2025– · FICÇÃO CIENTÍFICA',
  where: 'Apple TV+',
  genres: ['Ficção científica', 'Drama', 'Suspense'],
  synopsis: 'Isolada após uma falha de comunicação, a tripulação da estação Kepler precisa decidir entre esperar um resgate que talvez não venha ou tentar voltar para casa por conta própria.',
  scores: [
    { v: '8,4', l: 'Crítica Spoilado', accent: true },
    { v: '91%', l: 'Público', accent: false },
    { v: '#1', l: 'Em alta hoje', accent: false },
  ],
  cast: [['Helena Prado', 'Cmdt. Ana Reis'], ['Tomás Okafor', 'Dr. Ilan'], ['Bia Kume', 'Yara'], ['Diego Sá', 'Caio'], ['Lena Voss', 'Dra. Mahler'], ['Rui Matos', 'Bento']].map(([n, r]) => ({ n, r })),
  review: {
    score: '8,4',
    head: 'Uma ficção científica contida, que troca explosões por tensão psicológica',
    text: 'A primeira temporada acerta no ritmo e no elenco, mas tropeça no penúltimo episódio. Ainda assim, é uma das séries de gênero mais consistentes do ano.',
  },
  related: [
    { title: 'Órbita Zero T2: data de estreia e trailer', time: 'há 12 min' },
    { title: 'O final da 1ª temporada explicado', time: '3 dias' },
    { title: 'Onde foi gravado Órbita Zero', time: '2 semanas' },
  ],
  providers: [
    { name: 'Apple TV+', kind: 'Assinatura' },
    { name: 'Prime Video', kind: 'Aluguel R$ 9,90' },
  ],
  ficha: [
    { k: 'Criação', v: 'Carla Menezes' },
    { k: 'Temporadas', v: '2 (16 episódios)' },
    { k: 'Estreia', v: 'Abril de 2025' },
    { k: 'País', v: 'EUA / Brasil' },
    { k: 'Classificação', v: '16 anos' },
  ],
};

// ---------- categorias ----------

export const categories = {
  filmes: { name: 'Filmes', lead: "Sequência de 'Os Últimos Faróis' passa de R$ 40 milhões e vira a maior abertura nacional do ano" },
  series: { name: 'Séries', lead: 'Órbita Zero volta em março, e o trailer entrega a cena que ninguém esperava' },
  streaming: { name: 'Streaming', lead: 'Novembro no streaming: o calendário completo de Netflix, Max, Prime Video, Disney+ e Apple TV+' },
} as const;

export const subcats = ['Tudo', 'Notícias', 'Críticas', 'Trailers', 'Bilheteria'];

// ---------- em alta ----------

export type Trend = { title: string; type: string; move: string; buzz: string };

export const trending: Trend[] = [
  ['Órbita Zero', 'Série · Apple TV+', '▲ 4', '2,1 mi'],
  ['Os Últimos Faróis 2', 'Filme · Cinemas', '—', '1,8 mi'],
  ['Clã Ferreira', 'Série · Globoplay', '▲ 2', '1,2 mi'],
  ['Cidade Submersa', 'Filme · Dez/26', '▲ 7', '980 mil'],
  ['Casa Vazia', 'Série · Max', '▼ 2', '870 mil'],
  ['Noite de Vidro', 'Filme · Netflix', 'NOVO', '760 mil'],
  ['Maré Vermelha', 'Filme · Cinemas', '▼ 3', '610 mil'],
  ['Divisão 9', 'Série · Prime Video', '▲ 1', '540 mil'],
  ['O Inverno de Lúcia', 'Filme · Cinemas', '▲ 5', '420 mil'],
  ['Pequenos Gigantes', 'Animação · Disney+', '▼ 1', '390 mil'],
].map(([title, type, move, buzz]) => ({ title, type, move, buzz }));

export const topics = ['ÓrbitaZero', 'ClãFerreira', 'Bilheteria', 'NetflixNovembro', 'CidadeSubmersa', 'Oscar2027', 'TrailerFinal', 'CenaPósCréditos'];

// ---------- estreias ----------

export const weeks = ['Esta semana', '30 out', '6 nov', '13 nov'];

export const estreias = [
  { title: 'Os Últimos Faróis 2', genre: 'AÇÃO', dur: '2h14', rating: '14', ratingBg: '#ff8a73', dist: 'Paris Filmes', syn: 'A equipe de resgate volta ao litoral para uma missão que pode ser a última.' },
  { title: 'O Inverno de Lúcia', genre: 'DRAMA', dur: '1h48', rating: '12', ratingBg: '#ffd166', dist: 'Vitrine', syn: 'Uma professora aposentada reencontra a filha depois de vinte anos.' },
  { title: 'Maré Vermelha', genre: 'SUSPENSE', dur: '2h02', rating: '16', ratingBg: '#ff5a36', dist: 'Diamond', syn: 'Pescadores encontram um barco à deriva sem tripulação.' },
  { title: 'Pequenos Gigantes', genre: 'ANIMAÇÃO', dur: '1h36', rating: 'L', ratingBg: '#7fd49a', dist: 'Disney', syn: 'Formigas operárias decidem sair do formigueiro pela primeira vez.' },
  { title: 'Quarto 112', genre: 'TERROR', dur: '1h41', rating: '16', ratingBg: '#ff5a36', dist: 'Imagem', syn: 'Um hotel de beira de estrada guarda um hóspede que nunca fez check-out.' },
  { title: 'Samba de Domingo', genre: 'COMÉDIA', dur: '1h52', rating: '10', ratingBg: '#8fc7ff', dist: 'Downtown', syn: 'Três irmãs herdam um bar e uma dívida com a escola de samba do bairro.' },
];

// ---------- rodapé ----------

export const footerCols = [
  { h: 'EDITORIAS', l: [['Filmes', routes.filmes], ['Séries', routes.series], ['Streaming', routes.streaming], ['Críticas', routes.emBreve]] },
  { h: 'GUIAS', l: [['Estreias', routes.estreias], ['Em alta', routes.emAlta], ['Trailers', routes.emBreve], ['Bilheteria', routes.emBreve]] },
  { h: 'SPOILADO', l: [['Sobre', routes.emBreve], ['Anuncie', routes.emBreve], ['Contato', routes.emBreve], ['Privacidade', routes.emBreve]] },
];
