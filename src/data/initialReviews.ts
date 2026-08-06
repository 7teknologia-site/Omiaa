import { Review } from '../types';

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-101',
    productId: 'prod-1', // Elixir Orvalho da Manhã
    author: 'Helena Vasconcelos',
    title: 'Textura celestial e aroma inigualável!',
    rating: 5,
    date: '18/07/2026',
    comment: 'Uso todas as manhãs antes da meditação. A pele absorve imediatamente sem deixar residual oleoso. É visceral sentir a pureza da rosa mosqueta e do ácido hialurônico de alta viscosidade. Minha tez nunca esteve tão radiante.',
    verifiedPurchase: true,
    location: 'São Paulo, SP',
    recommends: true,
    helpfulLikes: 24,
    images: [
      'https://images.unsplash.com/photo-1608248597260-2646c2f30b9d?auto=format&fit=crop&w=600&q=80'
    ],
    replyFromBrand: {
      date: '19/07/2026',
      text: 'Gratidão por compartilhar sua experiência, Helena! O Orvalho da Manhã foi formulado justamente para harmonizar a pele e a energia do início do dia.'
    }
  },
  {
    id: 'rev-102',
    productId: 'prod-1',
    author: 'Clara Mello',
    title: 'Renovou minha pele em duas semanas',
    rating: 5,
    date: '10/07/2026',
    comment: 'Sofria com viço apagado devido à poluição da cidade. O elixir deu uma luminosidade natural incrível. A embalagem de vidro escuro preserva o aroma vegetal puríssimo.',
    verifiedPurchase: true,
    location: 'Curitiba, PR',
    recommends: true,
    helpfulLikes: 15
  },
  {
    id: 'rev-103',
    productId: 'prod-1',
    author: 'Beatriz Fonseca',
    title: 'Simplesmente apaixonante',
    rating: 4,
    date: '02/07/2026',
    comment: 'Produto maravilhoso, gotas concentradas de puro bem-estar. Apenas dou 4 estrelas porque a entrega dos Correios demorou 1 dia a mais do que o esperado, mas a alquimia em si é nota 10.',
    verifiedPurchase: true,
    location: 'Belo Horizonte, MG',
    recommends: true,
    helpfulLikes: 8
  },
  {
    id: 'rev-201',
    productId: 'prod-2', // Sérum Ouro Botânico
    author: 'Dra. Mariana Luz',
    title: 'Ouro líquido para a pele madura',
    rating: 5,
    date: '22/07/2026',
    comment: 'Atuo como dermatologista integrativa e fiquei impressionada com a sinergia dos óleos de resinas e bakuchiol vegetal. Resultados visíveis nas linhas finas e toque aveludado único.',
    verifiedPurchase: true,
    location: 'Rio de Janeiro, RJ',
    recommends: true,
    helpfulLikes: 38,
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=600&q=80'
    ],
    replyFromBrand: {
      date: '23/07/2026',
      text: 'Um privilégio receber esse olhar clínico e afetuoso, Dra. Mariana. O Ouro Botânico honra a resina pura de mirra e olíbano ancestral.'
    }
  },
  {
    id: 'rev-202',
    productId: 'prod-2',
    author: 'Renata Camargo',
    title: 'Substituiu todos os meus séruns importados',
    rating: 5,
    date: '12/07/2026',
    comment: 'Sempre gastei fortunas em cosméticos europeus, mas o Sérum Ouro Botânico da Omiaá superou todos. O aroma aromático profundo acalma antes de dormir.',
    verifiedPurchase: true,
    location: 'Florianópolis, SC',
    recommends: true,
    helpfulLikes: 19
  },
  {
    id: 'rev-301',
    productId: 'prod-3', // Chá Ritualístico Infusão da Lua
    author: 'Fernanda Albuquerque',
    title: 'Sabor suave e sono profundo e reparador',
    rating: 5,
    date: '20/07/2026',
    comment: 'A combinação de camomila real, lavanda francesa e capim-santo é uma verdadeira sinfonia para o sistema nervoso. Preparo na prensa francesa todas as noites. É meu ritual sagrado.',
    verifiedPurchase: true,
    location: 'Brasília, DF',
    recommends: true,
    helpfulLikes: 12
  },
  {
    id: 'rev-302',
    productId: 'prod-3',
    author: 'Lucas Siqueira',
    title: 'Blend de ervas visivelmente inteiras e frescas',
    rating: 5,
    date: '05/07/2026',
    comment: 'Dá para ver as flores inteiras de lavanda e camomila, nada daquela poeira de chá de saquinho. Embalagem que mantém o frescor excelente.',
    verifiedPurchase: true,
    location: 'Porto Alegre, RS',
    recommends: true,
    helpfulLikes: 9
  },
  {
    id: 'rev-401',
    productId: 'prod-4', // Vela Alquímica Breu Branco
    author: 'Camila Peixoto',
    title: 'Aroma que purifica a casa inteira',
    rating: 5,
    date: '24/07/2026',
    comment: 'O breu branco nativo da Amazônia traz uma nota amadeirada e mística inigualável. O pavio de algodão queima limpo, sem fumaça preta. Já pedi a segunda vela!',
    verifiedPurchase: true,
    location: 'Manaus, AM',
    recommends: true,
    helpfulLikes: 31,
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=600&q=80'
    ]
  },
  {
    id: 'rev-501',
    productId: 'prod-5', // Bálsamo Botânico de Lavanda
    author: 'Gisele Aguiar',
    title: 'Alívio instantâneo para pele irritada e sienes',
    rating: 5,
    date: '15/07/2026',
    comment: 'Uso nos pulsos antes de dormir e nas áreas ressecadas dos cotovelos e lábios. A manteiga de karité com alfazema pura é de uma riqueza extrema.',
    verifiedPurchase: true,
    location: 'Salvador, BA',
    recommends: true,
    helpfulLikes: 11
  },
  {
    id: 'rev-601',
    productId: 'prod-6', // Bruma Facial Hidratante da Terra
    author: 'Patrícia Prado',
    title: 'Frescor que salva as tardes de trabalho no computador',
    rating: 5,
    date: '11/07/2026',
    comment: 'Deixo a bruma na minha mesa de trabalho. Duas borrifadas trazem hidratação imediata e um aroma refrescante de néroli e água de gerânio.',
    verifiedPurchase: true,
    location: 'Campinas, SP',
    recommends: true,
    helpfulLikes: 14
  }
];
