import { Product, Category, Review } from '../types';

export const CATEGORIES: Category[] = [
  {
    id: 'todos',
    name: 'Toda a Coleção',
    description: 'Explore todos os elixires e preparados alquímicos da nossa apotheca ancestral.',
    iconName: 'Sparkles',
    bannerImage: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'elixires',
    name: 'Elixires Botânicos',
    description: 'Extratos concentrados macerados sob as fases da lua para harmonização sutil.',
    iconName: 'Droplet',
    bannerImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'seruns',
    name: 'Séruns & Óleos Faciais',
    description: 'Nutrição ancestral profunda com prensagem a frio de óleos puros e oleolatos raros.',
    iconName: 'Sparkle',
    bannerImage: 'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'chass',
    name: 'Infusões & Chás Solares',
    description: 'Mesclas botânicas colhidas manualmente com propriedades medicinais equilibrantes.',
    iconName: 'Coffee',
    bannerImage: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'velas',
    name: 'Velas Alquímicas',
    description: 'Cera 100% vegetal infusionada com óleos essenciais puros e ervas sagradas.',
    iconName: 'Flame',
    bannerImage: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop'
  },
  {
    id: 'rituais',
    name: 'Rituais & Cristais',
    description: 'Defumadores naturais, incensos de resina pura e bastões de limpeza energética.',
    iconName: 'Feather',
    bannerImage: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop'
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    slug: 'elixir-lunar-serenidade',
    name: 'Elixir Lunar de Serenidade',
    subtitle: 'Macerado Noturno de Camomila Romana, Melissas & Ametista',
    category: 'elixires',
    price: 189.00,
    originalPrice: 220.00,
    rating: 4.9,
    reviewsCount: 42,
    stock: 14,
    featured: true,
    badges: ['Mais Vendido', 'Feito na Lua Cheia', '100% Orgânico'],
    volumeOrWeight: '50ml',
    shortDescription: 'Uma sinergia alquímica calmante formulada para desacelerar a mente, induzir o sono profundo e restaurar o equilíbrio energético.',
    fullDescription: 'Elaborado artesanalmente sob o ciclo da Lua Cheia na Chapada dos Veadeiros. O Elixir Lunar combina a sabedoria da fitoterapia ancestral com a infusão energética de cristais de Ametista purificada. Macerado durante 28 dias em glicerina vegetal e hydrolatos botânicos.',
    ingredients: [
      'Extrato concentrado de Camomila Romana (Matricaria recutita)',
      'Erva-Cidreira (Melissa officinalis)',
      'Passiflora edulis',
      'Hydrolato de Lavanda Francesa',
      'Glicerina Vegetal de Palmeira Sustentável',
      'Vibracional de Ametista'
    ],
    ancestralOrigin: 'Saber Tradicional Kalunga & Alquimia Hermética Europeia',
    usageInstructions: 'Pingue 5 a 8 gotas debaixo da língua ou dilua em 50ml de água morna antes de dormir. Respire fundo 3 vezes focando na intenção de tranquilidade.',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-ELI-001',
    createdAt: '2026-01-10'
  },
  {
    id: 'prod-2',
    slug: 'serum-facial-ouro-botanico',
    name: 'Sérum Facial Ouro Botânico',
    subtitle: 'Néctar de Rosa Mosqueta, Jojoba & Óleo Essencial de Néroli',
    category: 'seruns',
    price: 245.00,
    originalPrice: 280.00,
    rating: 5.0,
    reviewsCount: 68,
    stock: 8,
    featured: true,
    badges: ['Edição Limitada', 'Prensado a Frio', 'Vegano'],
    volumeOrWeight: '30ml',
    shortDescription: 'Rico em ácidos graxos essenciais, carotenóides e antioxidantes puros que iluminam a pele e regeneram o viço natural.',
    fullDescription: 'Um néctar dourado acetinado prensado a frio que penetra nas camadas mais profundas da derme. A adição do óleo precioso de Néroli (Flor de Laranjeira) e Mirra promove regeneração celular imediata e uma experiência sensorial revigorante.',
    ingredients: [
      'Óleo de Rosa Mosqueta virgem (Rosa rubiginosa)',
      'Óleo de Jojoba Orgânico (Simmondsia chinensis)',
      'Óleo de Semente de Maracujá',
      'Óleo Essencial de Néroli',
      'Resina de Mirra',
      'Vitamina E Natural (Tocoferol)'
    ],
    ancestralOrigin: 'Rituais de Beleza do Antigo Egito e Botânica Amazônica',
    usageInstructions: 'Com a pele limpa e levemente úmida, aplique 3 a 4 gotas na palma das mãos. Aqueça suavemente o óleo e pressione contra a pele do rosto e pescoço com movimentos ascendentes.',
    images: [
      'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-SER-002',
    createdAt: '2026-01-12'
  },
  {
    id: 'prod-3',
    slug: 'infusao-solar-vitalidade',
    name: 'Infusão Solar de Vitalidade',
    subtitle: 'Chá Artesanal de Calêndula, Capim-Santo, Hibisco & Gengibre',
    category: 'chass',
    price: 78.00,
    rating: 4.8,
    reviewsCount: 29,
    stock: 25,
    featured: false,
    badges: ['Colheita Manual', 'Sem Glúten'],
    volumeOrWeight: '100g (Aproximadamente 40 xícaras)',
    shortDescription: 'Blend estimulante sem cafeína sintética, desenhado para despertar o fogo interior e fortalecer o sistema imunológico.',
    fullDescription: 'As pétalas de calêndula cultivadas em horta biodinâmica unem-se ao vigor do gengibre nativo e à vivacidade do hibisco. Um ritual diário para reativar a energia vital logo nas primeiras horas do amanhecer.',
    ingredients: [
      'Flores de Calêndula (Calendula officinalis)',
      'Capim-Santo desidratado no escuro',
      'Cálices de Hibisco Sabdariffa',
      'Gengibre em rodelas secas',
      'Casca de Laranja Doce'
    ],
    ancestralOrigin: 'Medicina Tradicional Chinesa e Herbalismo Brasileiro',
    usageInstructions: 'Adicione 1 colher de sopa para 250ml de água fervente a 90°C. Abafe por 7 a 10 minutos antes de coar. Aprecie morno ou gelado.',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-CHA-003',
    createdAt: '2026-01-15'
  },
  {
    id: 'prod-4',
    slug: 'vela-alquimica-templo-sagrado',
    name: 'Vela Alquímica Templo Sagrado',
    subtitle: 'Cera de Coco, Óleo Essencial de Breu Branco & Palo Santo',
    category: 'velas',
    price: 159.00,
    originalPrice: 180.00,
    rating: 4.9,
    reviewsCount: 51,
    stock: 12,
    featured: true,
    badges: ['Cera 100% Vegetal', 'Pavio de Algodão Cru'],
    volumeOrWeight: '220g (Duração ~45 horas)',
    shortDescription: 'Crie uma atmosfera de purificação e reconexão espiritual em seu lar com a fragrância rústica das resinas florestais.',
    fullDescription: 'Fundida à mão em recipientes de cerâmica artesanal reaproveitável. Infundida com óleo essencial raro de Breu Branco extraído de forma sustentável na Amazônia e raspas de Palo Santo ético.',
    ingredients: [
      'Cera vegetal blend de Coco, Palma sustentável e Arroz',
      'Óleo Essencial de Breu Branco (Protium heptaphyllum)',
      'Resina de Palo Santo',
      'Óleo Essencial de Cedro do Atlas',
      'Pavio duplo de algodão 100% natural'
    ],
    ancestralOrigin: 'Resinoterapia da Floresta Amazônica',
    usageInstructions: 'Na primeira queima, deixe a vela acesa até que toda a superfície derreta por igual (mínimo de 1 hora). Mantenha o pavio aparado em 0,5cm antes de reacender.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-VEL-004',
    createdAt: '2026-01-18'
  },
  {
    id: 'prod-5',
    slug: 'bastao-defumacao-copal-lavanda',
    name: 'Bastão Alquímico de Defumação',
    subtitle: 'Sálvia Branca, Resina Copal & Flores de Lavanda',
    category: 'rituais',
    price: 65.00,
    rating: 4.7,
    reviewsCount: 19,
    stock: 30,
    featured: false,
    badges: ['Atado à Mão', 'Atrações Positivas'],
    volumeOrWeight: 'Aproximadamente 45g',
    shortDescription: 'Bastão artesanal amarrado com fio de algodão natural para limpeza de ambientes, purificação da aura e consagração.',
    fullDescription: 'Cada bastão é amarrado à mão sob cânticos e intenções de paz. Ideal para preparar espaços de meditação, novas casas ou momentos de renovação energética.',
    ingredients: [
      'Ervas secas de Sálvia Branca',
      'Resina Copal Natural',
      'Flores de Lavanda do Campo',
      'Fio 100% Algodão Cru'
    ],
    ancestralOrigin: 'Xamanismo Pan-Americano e Tradição Herbária de Cura',
    usageInstructions: 'Acenda a ponta do bastão na chama de uma vela até formar uma brasa. Assopre delicadamente e espalhe a fumaça perfumada pelo ambiente usando uma pena ou a mão.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-RIT-005',
    createdAt: '2026-01-20'
  },
  {
    id: 'prod-6',
    slug: 'oleo-corporal-alquimico-terra-floresta',
    name: 'Bálsemo Corporal Terra & Floresta',
    subtitle: 'Infundido com Andiroba, Copaíba & Vetiver Profundo',
    category: 'seruns',
    price: 195.00,
    originalPrice: 215.00,
    rating: 4.9,
    reviewsCount: 37,
    stock: 18,
    featured: false,
    badges: ['Bioma Amazônico', 'Dermatologicamente Testado'],
    volumeOrWeight: '120ml',
    shortDescription: 'Um banho de hidratação profunda que alivia tensões musculares e firma a pele com aroma amadeirado hipnotizante.',
    fullDescription: 'Rico nos óleos medicinais da flora brasileira, como Andiroba e Copaíba pura. Restaura a barreira cutânea enquanto ancora a mente através do aroma terroso do óleo essencial de Vetiver.',
    ingredients: [
      'Óleo de Andiroba (Carapa guianensis)',
      'Bálsamo de Copaíba',
      'Óleo de Castanha do Pará',
      'Óleo Essencial de Vetiver de Comores',
      'Óleo Essencial de Patchouli Folha'
    ],
    ancestralOrigin: 'Medicina da Floresta e Cosmetologia Natural',
    usageInstructions: 'Massageie no corpo limpo após o banho, com a pele ainda morna para potencializar a absorção das propriedades lipídicas.',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-SER-006',
    createdAt: '2026-01-22'
  }
];

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    author: 'Mariana S. Vasconcelos',
    rating: 5,
    date: '18 de Junho, 2026',
    comment: 'O Elixir Lunar mudou minhas noites de sono! O aroma é divino, sinto uma paz imediata assim que tomo as gotinhas. Dá pra sentir o carinho e o capricho alquímico.',
    verifiedPurchase: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    author: 'Gabriel Henrique Alencar',
    rating: 5,
    date: '02 de Julho, 2026',
    comment: 'Embalagem maravilhosa, frasco de vidro escuro de alta qualidade e o produto realmente acalma a ansiedade noturna.',
    verifiedPurchase: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    author: 'Dra. Beatriz Costa',
    rating: 5,
    date: '12 de Julho, 2026',
    comment: 'Minha pele absorveu com tanta leveza! Não deixa engordurado, dá um glow dourado supernatural. Recomendo de olhos fechados.',
    verifiedPurchase: true
  }
];

export const INITIAL_USER_PROFILE = {
  name: 'Camila de Oliveira',
  email: 'camila.alquimia@emiaa.com.br',
  phone: '(11) 98765-4321',
  cpf: '345.678.901-22',
  loyaltyPoints: 340,
  tier: 'Iniciado' as const,
  addresses: [
    {
      street: 'Rua das Camélias',
      number: '420',
      complement: 'Apto 82',
      neighborhood: 'Jardim Botânico',
      city: 'São Paulo',
      state: 'SP',
      cep: '04012-010'
    }
  ]
};

export const INITIAL_ORDERS = [
  {
    id: 'ord-8921',
    code: 'OMIA-98214',
    date: '2026-07-15T14:30:00Z',
    items: [
      {
        product: INITIAL_PRODUCTS[0],
        quantity: 1
      },
      {
        product: INITIAL_PRODUCTS[2],
        quantity: 2
      }
    ],
    subtotal: 345.00,
    shippingFee: 0.00,
    discount: 34.50,
    total: 310.50,
    status: 'enviado' as const,
    paymentMethod: 'pix' as const,
    deliveryAddress: INITIAL_USER_PROFILE.addresses[0],
    trackingCode: 'BR-ALQ-9912048'
  }
];
