export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  region: string;
  author: string;
  authorAvatar?: string;
  createdAt: string;
  isBreaking?: boolean;
  isFeatured?: boolean;
}

export const mockNews: NewsArticle[] = [
  {
    id: "1",
    title: "Prefeitura de Irecê anuncia obras de revitalização do centro histórico",
    excerpt: "Projeto prevê modernização das praças, calçamentos e iluminação pública com investimento de R$ 5 milhões",
    content: "A Prefeitura Municipal de Irecê anunciou nesta terça-feira um ambicioso projeto de revitalização...",
    image: "https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=800&q=80",
    region: "Irecê",
    author: "João Silva",
    createdAt: "2024-01-19T10:30:00",
    isBreaking: true,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Festival de Cultura da Chapada Diamantina atrai mais de 50 mil visitantes",
    excerpt: "Evento celebra a cultura local com apresentações musicais, artesanato e gastronomia típica",
    content: "O Festival de Cultura da Chapada Diamantina superou todas as expectativas...",
    image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&q=80",
    region: "Chapada Diamantina",
    author: "Maria Santos",
    createdAt: "2024-01-19T09:15:00",
    isFeatured: true,
  },
  {
    id: "3",
    title: "Nova linha de ônibus intermunicipal facilita acesso à capital",
    excerpt: "Rota direta reduz tempo de viagem em até 2 horas para moradores da região",
    content: "A partir do próximo mês, uma nova linha de ônibus...",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80",
    region: "Regional",
    author: "Pedro Oliveira",
    createdAt: "2024-01-19T08:00:00",
  },
  {
    id: "4",
    title: "Produtores rurais celebram safra recorde de feijão na região",
    excerpt: "Condições climáticas favoráveis e investimento em tecnologia impulsionam produção agrícola",
    content: "Os agricultores da região de Irecê estão comemorando...",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80",
    region: "Irecê",
    author: "Ana Costa",
    createdAt: "2024-01-18T16:45:00",
  },
  {
    id: "5",
    title: "Hospital Regional amplia atendimento com nova ala de emergência",
    excerpt: "Investimento de R$ 2 milhões garante mais 30 leitos e equipamentos modernos",
    content: "O Hospital Regional inaugurou nesta semana...",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80",
    region: "Bahia",
    author: "Carlos Mendes",
    createdAt: "2024-01-18T14:20:00",
  },
  {
    id: "6",
    title: "Escolas municipais recebem kits de robótica para ensino tecnológico",
    excerpt: "Programa educacional visa preparar estudantes para o mercado de trabalho do futuro",
    content: "A Secretaria de Educação distribuiu kits de robótica...",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80",
    region: "Chapada Diamantina",
    author: "Fernanda Lima",
    createdAt: "2024-01-18T11:30:00",
  },
];

export const getNewsByRegion = (region: string) => 
  mockNews.filter(news => news.region.toLowerCase() === region.toLowerCase());

export const getFeaturedNews = () => 
  mockNews.filter(news => news.isFeatured);

export const getBreakingNews = () => 
  mockNews.filter(news => news.isBreaking);

export const getLatestNews = (limit: number = 6) => 
  [...mockNews].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ).slice(0, limit);
