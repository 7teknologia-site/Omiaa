import { supabase, isSupabaseConfigured } from '../lib/supabase';
export { isSupabaseConfigured };
import { swrFetch, invalidateCache } from './cacheService';
import {
  Product,
  Category,
  FilterState,
  Order,
  CartItem,
  CustomerProfile,
  Coupon,
  BlogPost,
  BotanicalEntry,
  CustomFragrance,
  StoreSettings
} from '../types';

// Fallback initial data in case Supabase is not yet connected to a live database project
const INITIAL_CATEGORIES_FALLBACK: Category[] = [
  {
    id: 'todos',
    name: 'Toda a Coleção',
    description: 'Explore todos os elixires e preparados alquímicos da nossa marca de alquimia ancestral.',
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

const INITIAL_PRODUCTS_FALLBACK: Product[] = [
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
    badges: ['Novo', 'Mais Vendido', 'Artesanal'],
    volumeOrWeight: '50ml',
    shortDescription: 'Uma sinergia alquímica calmante formulada para desacelerar a mente, induzir o sono profundo e restaurar o equilíbrio energético.',
    fullDescription: 'Elaborado artesanalmente sob o ciclo da Lua Cheia na Chapada dos Veadeiros. O Elixir Lunar combina a sabedoria da fitoterapia ancestral com a infusão energética de cristais de Ametista purificada. Macerado durante 28 dias em glicerina vegetal e hydrolatos botânicos.',
    ingredients: [
      'Extrato concentrado de Camomila Romana (Matricaria recutita)',
      'Erva-Cidreira (Melissa officinalis)',
      'Passiflora edulis',
      'Hydrolato de Lavanda Francesa',
      'Glicerina Vegetal',
      'Vibracional de Ametista'
    ],
    ancestralOrigin: 'Saber Tradicional Kalunga & Alquimia Hermética Europeia',
    usageInstructions: 'Pingue 5 a 8 gotas debaixo da língua ou dilua em 50ml de água morna antes de dormir.',
    images: [
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-ELI-001',
    createdAt: '2026-07-20'
  },
  {
    id: 'prod-2',
    slug: 'serum-facial-ouro-botanico',
    name: 'Sérum Facial Ouro Botânico',
    subtitle: 'Néctar de Rosa Mosqueta, Jojoba & Óleo Essencial de Néroli',
    category: 'seruns',
    price: 245.00,
    originalPrice: 290.00,
    rating: 5.0,
    reviewsCount: 68,
    stock: 3,
    featured: true,
    badges: ['Promoção', 'Exclusivo', 'Artesanal'],
    volumeOrWeight: '30ml',
    shortDescription: 'Rico em ácidos graxos essenciais, carotenóides e antioxidantes puros que iluminam a pele e regeneram o viço natural.',
    fullDescription: 'Um néctar dourado acetinado prensado a frio que penetra nas camadas mais profundas da derme. A adição do óleo precioso de Néroli e Mirra promove regeneração celular imediata.',
    ingredients: [
      'Óleo de Rosa Mosqueta virgem',
      'Óleo de Jojoba Orgânico',
      'Óleo de Semente de Maracujá',
      'Óleo Essencial de Néroli',
      'Resina de Mirra',
      'Vitamina E Natural'
    ],
    ancestralOrigin: 'Rituais de Beleza do Antigo Egito e Botânica Amazônica',
    usageInstructions: 'Com a pele limpa e levemente úmida, aplique 3 a 4 gotas na palma das mãos. Aqueça e pressione no rosto.',
    images: [
      'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-SER-002',
    createdAt: '2026-07-22'
  },
  {
    id: 'prod-3',
    slug: 'infusao-solar-vitalidade',
    name: 'Infusão Solar de Vitalidade',
    subtitle: 'Chá Artesanal de Calêndula, Capim-Santo, Hibisco & Gengibre',
    category: 'chass',
    price: 78.00,
    originalPrice: 95.00,
    rating: 4.8,
    reviewsCount: 29,
    stock: 25,
    featured: false,
    badges: ['Promoção', 'Artesanal'],
    volumeOrWeight: '100g',
    shortDescription: 'Blend estimulante sem cafeína sintética, desenhado para despertar o fogo interior e fortalecer o sistema imunológico.',
    fullDescription: 'As pétalas de calêndula cultivadas em horta biodinâmica unem-se ao vigor do gengibre nativo e à vivacidade do hibisco.',
    ingredients: [
      'Flores de Calêndula',
      'Capim-Santo desidratado',
      'Cálices de Hibisco',
      'Gengibre em rodelas secas',
      'Casca de Laranja Doce'
    ],
    ancestralOrigin: 'Medicina Tradicional Chinesa e Herbalismo Brasileiro',
    usageInstructions: 'Adicione 1 colher de sopa para 250ml de água fervente. Abafe por 7 a 10 minutos.',
    images: [
      'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-CHA-003',
    createdAt: '2026-06-15'
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
    badges: ['Exclusivo', 'Artesanal', 'Mais Vendido'],
    volumeOrWeight: '220g',
    shortDescription: 'Crie uma atmosfera de purificação e reconexão espiritual em seu lar com a fragrância rústica das resinas florestais.',
    fullDescription: 'Fundida à mão em recipientes de cerâmica artesanal reaproveitável. Infundida com óleo essencial raro de Breu Branco.',
    ingredients: [
      'Cera vegetal de Coco e Palma',
      'Óleo Essencial de Breu Branco',
      'Resina de Palo Santo',
      'Óleo Essencial de Cedro',
      'Pavio de algodão natural'
    ],
    ancestralOrigin: 'Resinoterapia da Floresta Amazônica',
    usageInstructions: 'Deixe a vela acesa até que toda a superfície derreta por igual.',
    images: [
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-VEL-004',
    createdAt: '2026-05-18'
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
    stock: 0,
    featured: false,
    badges: ['Artesanal', 'Exclusivo'],
    volumeOrWeight: '45g',
    shortDescription: 'Bastão artesanal amarrado com fio de algodão natural para limpeza de ambientes, purificação da aura e consagração.',
    fullDescription: 'Cada bastão é amarrado à mão sob cânticos e intenções de paz. Ideal para preparar espaços de meditação.',
    ingredients: [
      'Ervas secas de Sálvia Branca',
      'Resina Copal Natural',
      'Flores de Lavanda do Campo',
      'Fio de Algodão Cru'
    ],
    ancestralOrigin: 'Xamanismo Pan-Americano e Tradição Herbária',
    usageInstructions: 'Acenda a ponta do bastão na chama de uma vela até formar uma brasa.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-RIT-005',
    createdAt: '2026-04-20'
  },
  {
    id: 'prod-6',
    slug: 'elixir-fogo-sagrado-energia',
    name: 'Elixir Fogo Sagrado de Energia',
    subtitle: 'Ginseng Brasileiro, Guarana de Maues & Oleolato de Canela',
    category: 'elixires',
    price: 198.00,
    originalPrice: 230.00,
    rating: 4.9,
    reviewsCount: 34,
    stock: 2,
    featured: true,
    badges: ['Novo', 'Promoção', 'Exclusivo'],
    volumeOrWeight: '50ml',
    shortDescription: 'Fórmula ativadora do fogo metabólico e clareza mental para dias de alta demanda vibracional.',
    fullDescription: 'Macerado sob a energia do Sol do Meio-Dia. Combina tônicos adaptógenos da Amazônia com especiarias aquecedoras que estimulam o foco e a determinação.',
    ingredients: [
      'Extrato de Ginseng Brasileiro (Pfaffia paniculata)',
      'Guaraná de Maués orgânico',
      'Oleolato de Canela do Cordeiro',
      'Glicerina Vegetal',
      'Vibracional de Olho de Tigre'
    ],
    ancestralOrigin: 'Etnobotânica Amazônica & Tradição Tônica',
    usageInstructions: 'Tomar 10 gotas pela manhã diluídas em suco ou água pura.',
    images: [
      'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-ELI-006',
    createdAt: '2026-07-25'
  },
  {
    id: 'prod-7',
    slug: 'oleo-corporal-santalum-maracuja',
    name: 'Óleo Corporal Santalum & Maracujá',
    subtitle: 'Sândalo Doce, Semente de Maracujá & Resina de Benjoim',
    category: 'seruns',
    price: 175.00,
    rating: 4.8,
    reviewsCount: 22,
    stock: 9,
    featured: false,
    badges: ['Novo', 'Artesanal'],
    volumeOrWeight: '100ml',
    shortDescription: 'Óleo de toque seco com aroma aveludado e propriedades relaxantes para automassagem e autocuidado diário.',
    fullDescription: 'Nutrição sedosa para a pele do corpo. O óleo de semente de maracujá atua como um calmante epidérmico rico em bioflavonoides.',
    ingredients: [
      'Óleo de Semente de Maracujá puro',
      'Óleo Essencial de Sândalo Amarelo',
      'Resina de Benjoim',
      'Vitamina E natural'
    ],
    ancestralOrigin: 'Aromaterapia Ayurvédica',
    usageInstructions: 'Massageie no corpo todo após o banho com a pele ainda morna.',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-SER-007',
    createdAt: '2026-07-26'
  },
  {
    id: 'prod-8',
    slug: 'kit-ritual-alquimia-ancestral',
    name: 'Coleção Mestra Alquimia Ancestral',
    subtitle: 'Edição de Luxo com Elixir Lunar, Vela Templo & Cristais',
    category: 'rituais',
    price: 420.00,
    originalPrice: 480.00,
    rating: 5.0,
    reviewsCount: 15,
    stock: 5,
    featured: true,
    badges: ['Exclusivo', 'Novo', 'Promoção', 'Artesanal'],
    volumeOrWeight: 'Caixa de Madeira Nobre',
    shortDescription: 'Cofre artesanal com a trilogia de consagração e equilíbrio corporal, mental e espiritual.',
    fullDescription: 'A experiência máxima da Omiaá Alquimia Ancestral. Acompanha 1 Elixir Lunar 50ml, 1 Vela Templo 220g, 1 Bastão de Defumação, 1 Drusa de Ametista e 1 Carta Ritual Guia.',
    ingredients: [
      'Elixir Lunar 50ml',
      'Vela Templo Sagrado 220g',
      'Bastão de Defumação Sálvia',
      'Ametista Natural Bruta',
      'Caixa de Cedro Artesanal'
    ],
    ancestralOrigin: 'Sinergia Total dos 4 Elementos',
    usageInstructions: 'Consulte o livro guia incluso para criar o seu santuário em casa.',
    images: [
      'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop'
    ],
    sku: 'OMIA-RIT-008',
    createdAt: '2026-07-27'
  }
];

// Helper to map Supabase database product row to Product interface
function mapProductRow(row: any): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    category: row.category_id || 'elixires',
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : undefined,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    stock: Number(row.stock || 0),
    featured: Boolean(row.featured),
    badges: row.badges || [],
    volumeOrWeight: row.volume_or_weight || '',
    shortDescription: row.short_description || '',
    fullDescription: row.full_description || '',
    ingredients: row.ingredients || [],
    ancestralOrigin: row.ancestral_origin || '',
    usageInstructions: row.usage_instructions || '',
    images: row.images || [],
    sku: row.sku || '',
    createdAt: row.created_at ? new Date(row.created_at).toISOString().split('T')[0] : ''
  };
}

// ============================================================================
// CATEGORIES SERVICE
// ============================================================================
export async function fetchCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return INITIAL_CATEGORIES_FALLBACK;

  return swrFetch(
    'categories',
    async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error || !data || data.length === 0) {
        console.warn('Supabase fetchCategories fallback:', error);
        return INITIAL_CATEGORIES_FALLBACK;
      }

      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        description: row.description || '',
        iconName: row.icon_name || 'Sparkles',
        bannerImage: row.banner_image || ''
      }));
    },
    { ttl: 120_000 } // 2 minutes TTL
  );
}

// ============================================================================
// PRODUCTS SERVICE (OPTIMIZED QUERYING WITH SWR CACHE)
// ============================================================================
export async function fetchProducts(filters?: FilterState): Promise<Product[]> {
  if (!isSupabaseConfigured) return INITIAL_PRODUCTS_FALLBACK;

  const cacheKey = `products:${JSON.stringify(filters || {})}`;

  return swrFetch(
    cacheKey,
    async () => {
      let query = supabase.from('products').select('*');

      if (filters) {
        if (filters.category && filters.category !== 'todos') {
          query = query.eq('category_id', filters.category);
        }

        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
          const q = `%${filters.searchQuery.trim()}%`;
          query = query.or(`name.ilike.${q},subtitle.ilike.${q},short_description.ilike.${q}`);
        }

        if (filters.maxPrice) {
          query = query.lte('price', filters.maxPrice);
        }

        if (filters.onlyInStock) {
          query = query.gt('stock', 0);
        }

        // Sort ordering
        if (filters.sortBy === 'price-asc') {
          query = query.order('price', { ascending: true });
        } else if (filters.sortBy === 'price-desc') {
          query = query.order('price', { ascending: false });
        } else if (filters.sortBy === 'rating') {
          query = query.order('rating', { ascending: false });
        } else if (filters.sortBy === 'newest') {
          query = query.order('created_at', { ascending: false });
        } else {
          query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });
        }
      } else {
        query = query.order('created_at', { ascending: false });
      }

      const { data, error } = await query;

      if (error || !data) {
        console.warn('Supabase fetchProducts fallback:', error);
        return INITIAL_PRODUCTS_FALLBACK;
      }

      return data.map(mapProductRow);
    },
    { ttl: 60_000 } // 1 minute TTL
  );
}

function parseClientPrice(val: any): number {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  const str = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : num;
}

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }
  } catch (err) {
    console.warn('Failed to retrieve session token:', err);
  }
  return headers;
}

export async function createProduct(productData: Omit<Product, 'id' | 'createdAt'>): Promise<Product | null> {
  // 1. Try server API endpoint first for reliable admin bypass / persistence
  try {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers,
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.product) {
        invalidateCache('products');
        return json.product;
      }
    }
  } catch (apiErr) {
    console.warn('Backend /api/admin/products error, trying direct Supabase client call:', apiErr);
  }

  // 2. Direct Supabase client fallback
  if (!isSupabaseConfigured) return null;

  try {
    const categoryId = (productData.category === 'todos' || !productData.category) ? 'elixires' : productData.category;
    const price = parseClientPrice(productData.price);
    const stock = Math.max(0, Number(productData.stock) || 0);

    const payload = {
      slug: productData.slug || productData.name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      name: productData.name,
      subtitle: productData.subtitle || '',
      category_id: categoryId,
      price,
      original_price: productData.originalPrice ? parseClientPrice(productData.originalPrice) : null,
      rating: Number(productData.rating) || 5.0,
      reviews_count: Number(productData.reviewsCount) || 1,
      stock,
      featured: Boolean(productData.featured),
      badges: Array.isArray(productData.badges) ? productData.badges : ['Novo'],
      volume_or_weight: productData.volumeOrWeight || '50ml',
      short_description: productData.shortDescription || '',
      full_description: productData.fullDescription || '',
      ingredients: Array.isArray(productData.ingredients) ? productData.ingredients : ['Ervas'],
      ancestral_origin: productData.ancestralOrigin || 'Tradição Alquímica',
      usage_instructions: productData.usageInstructions || 'Uso diário',
      images: Array.isArray(productData.images) && productData.images.length ? productData.images : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'],
      sku: productData.sku || `OMIA-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const { data, error } = await supabase
      .from('products')
      .insert([payload])
      .select('*')
      .single();

    if (error || !data) {
      console.error('createProduct error:', error);
      return null;
    }

    invalidateCache('products');
    return mapProductRow(data);
  } catch (err) {
    console.error('createProduct exception:', err);
    return null;
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  // 1. Try server API endpoint first
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(productData)
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.product) {
        invalidateCache('products');
        return json.product;
      }
    }
  } catch (apiErr) {
    console.warn(`Backend /api/admin/products/${id} error, trying direct Supabase client call:`, apiErr);
  }

  // 2. Direct Supabase client fallback
  if (!isSupabaseConfigured) return null;

  try {
    const payload: any = {};
    if (productData.name !== undefined) payload.name = productData.name;
    if (productData.slug !== undefined) payload.slug = productData.slug;
    if (productData.subtitle !== undefined) payload.subtitle = productData.subtitle;
    if (productData.category !== undefined) payload.category_id = (productData.category === 'todos' || !productData.category) ? 'elixires' : productData.category;
    if (productData.price !== undefined) payload.price = parseClientPrice(productData.price);
    if (productData.originalPrice !== undefined) payload.original_price = productData.originalPrice ? parseClientPrice(productData.originalPrice) : null;
    if (productData.rating !== undefined) payload.rating = Number(productData.rating);
    if (productData.reviewsCount !== undefined) payload.reviews_count = Number(productData.reviewsCount);
    if (productData.stock !== undefined) payload.stock = Math.max(0, Number(productData.stock) || 0);
    if (productData.featured !== undefined) payload.featured = Boolean(productData.featured);
    if (productData.badges !== undefined) payload.badges = Array.isArray(productData.badges) ? productData.badges : [];
    if (productData.volumeOrWeight !== undefined) payload.volume_or_weight = productData.volumeOrWeight;
    if (productData.shortDescription !== undefined) payload.short_description = productData.shortDescription;
    if (productData.fullDescription !== undefined) payload.full_description = productData.fullDescription;
    if (productData.ingredients !== undefined) payload.ingredients = Array.isArray(productData.ingredients) ? productData.ingredients : [];
    if (productData.ancestralOrigin !== undefined) payload.ancestral_origin = productData.ancestralOrigin;
    if (productData.usageInstructions !== undefined) payload.usage_instructions = productData.usageInstructions;
    if (productData.images !== undefined) payload.images = Array.isArray(productData.images) ? productData.images : [];
    if (productData.sku !== undefined) payload.sku = productData.sku;

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error || !data) {
      console.error('updateProduct error:', error);
      return null;
    }

    invalidateCache('products');
    return mapProductRow(data);
  } catch (err) {
    console.error('updateProduct exception:', err);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Try server API endpoint first
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success) {
        invalidateCache('products');
        return true;
      }
    }
  } catch (apiErr) {
    console.warn(`Backend DELETE /api/admin/products/${id} error, trying direct Supabase client call:`, apiErr);
  }

  // 2. Direct Supabase client fallback
  if (!isSupabaseConfigured) return false;

  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('deleteProduct error:', error);
      return false;
    }

    invalidateCache('products');
    return true;
  } catch (err) {
    console.error('deleteProduct exception:', err);
    return false;
  }
}

// ============================================================================
// COUPONS SERVICE
// ============================================================================
export async function validateCoupon(code: string): Promise<Coupon | null> {
  const normalized = code.trim().toUpperCase();
  const fallbackCoupons: Record<string, number> = {
    ALQUIMIA10: 10,
    ANCESTRAL20: 20,
    FRETEGRATIS: 15,
    PRIMEIRACOMPRA: 15,
    OMIAA10: 10,
    LUNAR15: 15,
    OMIAA50: 50,
    BENVINDO: 10
  };

  if (!isSupabaseConfigured) {
    if (fallbackCoupons[normalized] !== undefined) {
      return { code: normalized, discountPercent: fallbackCoupons[normalized], active: true };
    }
    return null;
  }

  try {
    const { data, error } = await supabase.rpc('validate_coupon', { p_code: normalized });

    if (!error && data) {
      const couponRecord = Array.isArray(data) ? data[0] : data;
      if (couponRecord) {
        const discount = couponRecord.discount_percent ?? couponRecord.discountPercent ?? couponRecord.discount_value ?? 0;
        return {
          id: couponRecord.id || `coup-${normalized}`,
          code: couponRecord.code || normalized,
          discountPercent: Number(discount),
          active: couponRecord.active ?? true
        };
      }
    }

    // Fallback to predefined coupons if database doesn't have the specific record
    if (fallbackCoupons[normalized] !== undefined) {
      return { code: normalized, discountPercent: fallbackCoupons[normalized], active: true };
    }

    return null;
  } catch (err) {
    console.error('validateCoupon error:', err);
    if (fallbackCoupons[normalized] !== undefined) {
      return { code: normalized, discountPercent: fallbackCoupons[normalized], active: true };
    }
    return null;
  }
}

// ============================================================================
// ORDERS & ORDER ITEMS SERVICE
// ============================================================================
export async function createOrderWithItems(
  orderData: Omit<Order, 'id'>,
  items: CartItem[],
  customerId?: string
): Promise<Order | null> {
  if (!isSupabaseConfigured) return null;

  try {
    // 1. Verify authenticated active session
    const { data: { session }, error: sessionErr } = await supabase.auth.getSession();
    if (sessionErr || !session || !session.user) {
      console.error('createOrderWithItems error: User not authenticated.');
      throw new Error('Para finalizar sua compra, entre na sua conta ou cadastre-se.');
    }

    // 2. Validate input items and quantities
    if (!items || items.length === 0) {
      throw new Error('Seu carrinho está vazio.');
    }

    const sanitizedItems = items.map((item) => ({
      ...item,
      quantity: Math.max(1, Math.floor(Number(item.quantity) || 1))
    }));

    // 3. Fetch official products from DB (Supabase) for server-side price & stock verification
    const productIds = sanitizedItems
      .map((i) => i.product?.id)
      .filter((id) => id && typeof id === 'string' && id.length > 0);

    let dbProductMap = new Map<string, any>();
    if (productIds.length > 0) {
      const { data: dbProducts, error: dbProdErr } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (!dbProdErr && dbProducts) {
        dbProductMap = new Map(dbProducts.map((p: any) => [p.id, p]));
      }
    }

    // 4. Calculate SERVER-SIDE OFFICIAL subtotal & verify stock availability
    let officialSubtotal = 0;
    const verifiedOrderItems = sanitizedItems.map((item) => {
      const dbProd = dbProductMap.get(item.product.id);
      let officialUnitPrice = Number(item.product.price || 0);

      if (dbProd) {
        officialUnitPrice = Number(dbProd.price || 0);
        // Verify stock
        if (dbProd.stock < item.quantity) {
          throw new Error(`Estoque insuficiente para o produto "${dbProd.name}". Estoque disponível: ${dbProd.stock}.`);
        }
      }

      const itemSubtotal = Math.round(officialUnitPrice * item.quantity * 100) / 100;
      officialSubtotal += itemSubtotal;

      return {
        product_id: dbProd ? dbProd.id : (item.product.id.length > 30 ? item.product.id : null),
        product_snapshot: {
          ...item.product,
          price: officialUnitPrice
        },
        quantity: item.quantity,
        unit_price: officialUnitPrice,
        selected_option: item.selectedOption || null
      };
    });

    officialSubtotal = Math.round(officialSubtotal * 100) / 100;

    // 5. Server-side coupon re-validation and discount calculation
    let officialDiscount = 0;
    const couponToValidate = orderData.couponCode;
    if (couponToValidate) {
      const validCoup = await validateCoupon(couponToValidate);
      if (validCoup && validCoup.active) {
        officialDiscount += Math.round((officialSubtotal * validCoup.discountPercent) / 100 * 100) / 100;
      }
    }

    // Server-side PIX 5% discount validation
    if (orderData.paymentMethod === 'pix') {
      const pixDisc = Math.round(officialSubtotal * 0.05 * 100) / 100;
      officialDiscount += pixDisc;
    }

    officialDiscount = Math.min(officialSubtotal, Math.round(officialDiscount * 100) / 100);

    // 6. Server-side shipping fee calculation
    let officialShippingFee = 14.90; // Default standard shipping
    if (orderData.couponCode === 'FRETEGRATIS' || officialSubtotal >= 250) {
      officialShippingFee = Number(orderData.shippingFee) === 25 ? 25 : 0; // Express option preserves R$25, else FREE
    } else if (Number(orderData.shippingFee) === 25) {
      officialShippingFee = 25; // Express option
    }

    // 7. Calculate SERVER-SIDE OFFICIAL TOTAL
    const officialTotal = Math.max(0, Math.round((officialSubtotal - officialDiscount + officialShippingFee) * 100) / 100);

    // Log price tampering prevention warning if client values differed
    if (
      Math.abs(Number(orderData.subtotal || 0) - officialSubtotal) > 0.01 ||
      Math.abs(Number(orderData.total || 0) - officialTotal) > 0.01
    ) {
      console.warn(
        `[PRICE TAMPERING BLOCKED] Cliente enviou total R$ ${orderData.total} (subtotal R$ ${orderData.subtotal}), mas o servidor calculou total oficial R$ ${officialTotal} (subtotal R$ ${officialSubtotal}). Aplicando valores oficiais do servidor.`
      );
    }

    // 8. Obtain customer profile linked to auth_user_id
    let activeCustomer = null;
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('id, email, name')
      .eq('auth_user_id', session.user.id)
      .maybeSingle();

    if (existingCustomer) {
      activeCustomer = existingCustomer;
    } else {
      const ensured = await ensureCustomerProfile(session.user);
      if (ensured && ensured.id) {
        activeCustomer = { id: ensured.id, email: ensured.email, name: ensured.name };
      }
    }

    if (!activeCustomer) {
      console.error('createOrderWithItems error: Valid customer profile missing.');
      throw new Error('Não foi possível carregar seu perfil. Atualize seus dados antes de continuar.');
    }

    // 9. Create order with OFFICIAL SERVER-CALCULATED VALUES ONLY
    const orderPayload = {
      code: orderData.code,
      customer_id: activeCustomer.id,
      customer_email: session.user.email, // Always use authenticated user's email
      subtotal: officialSubtotal,
      shipping_fee: officialShippingFee,
      discount: officialDiscount,
      total: officialTotal,
      status: 'pendente', // Initial status ALWAYS 'pendente' until payment confirmation
      payment_method: orderData.paymentMethod,
      delivery_address: orderData.deliveryAddress,
      tracking_code: orderData.trackingCode
    };

    const { data: insertedOrder, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select('*')
      .single();

    if (orderError || !insertedOrder) {
      console.error('createOrder error:', orderError);
      throw new Error('Não foi possível criar seu pedido. Verifique sua sessão e tente novamente.');
    }

    // 10. Create order_items with official unit prices
    const orderItemsPayload = verifiedOrderItems.map((item) => ({
      order_id: insertedOrder.id,
      product_id: item.product_id,
      product_snapshot: item.product_snapshot,
      quantity: item.quantity,
      unit_price: item.unit_price,
      selected_option: item.selected_option
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsPayload);

    if (itemsError) {
      console.error('createOrderItems error:', itemsError);
      try {
        await supabase.from('orders').delete().eq('id', insertedOrder.id);
      } catch {
        // ignore
      }
      throw new Error('Não foi possível criar os itens do seu pedido. Tente novamente.');
    }

    return {
      id: insertedOrder.id,
      code: insertedOrder.code,
      date: insertedOrder.created_at,
      items: sanitizedItems,
      subtotal: Number(insertedOrder.subtotal),
      shippingFee: Number(insertedOrder.shipping_fee),
      discount: Number(insertedOrder.discount),
      total: Number(insertedOrder.total),
      status: insertedOrder.status,
      paymentMethod: insertedOrder.payment_method,
      deliveryAddress: insertedOrder.delivery_address,
      trackingCode: insertedOrder.tracking_code
    };
  } catch (err: any) {
    console.error('createOrderWithItems exception:', err);
    throw err;
  }
}

export async function fetchCustomerOrders(customerId?: string): Promise<Order[]> {
  if (!isSupabaseConfigured) return [];

  try {
    let query = supabase.from('orders').select('*, order_items(*)').order('created_at', { ascending: false });
    if (customerId) {
      query = query.eq('customer_id', customerId);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      code: row.code,
      date: row.created_at,
      items: (row.order_items || []).map((itemRow: any) => ({
        product: itemRow.product_snapshot || {
          id: itemRow.product_id || 'prod-1',
          name: 'Produto Alquímico',
          price: Number(itemRow.unit_price),
          images: ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800']
        },
        quantity: itemRow.quantity,
        selectedOption: itemRow.selected_option
      })),
      subtotal: Number(row.subtotal),
      shippingFee: Number(row.shipping_fee),
      discount: Number(row.discount),
      total: Number(row.total),
      status: row.status,
      paymentMethod: row.payment_method,
      deliveryAddress: row.delivery_address,
      trackingCode: row.tracking_code
    }));
  } catch (err) {
    console.error('fetchCustomerOrders error:', err);
    return [];
  }
}

// ============================================================================
// CUSTOMERS / PROFILES SERVICE
// ============================================================================
export async function fetchCustomerProfile(authUserId: string): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured) return null;

  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('auth_user_id', authUserId)
      .maybeSingle();

    if (error || !data) return null;

    return {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone || '',
      cpf: data.cpf || '',
      addresses: data.addresses || [],
      loyaltyPoints: data.loyalty_points || 0,
      tier: data.tier || 'Neófito'
    };
  } catch (err) {
    console.error('fetchCustomerProfile error:', err);
    return null;
  }
}

export async function ensureCustomerProfile(authUser: {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}): Promise<CustomerProfile | null> {
  if (!isSupabaseConfigured || !authUser.id || !authUser.email) return null;

  try {
    // 1. Check if profile already exists by auth_user_id
    const existing = await fetchCustomerProfile(authUser.id);
    if (existing) {
      return existing;
    }

    // 2. Check if profile exists by email (to avoid duplicate key error and link if needed)
    const { data: existingByEmail, error: emailErr } = await supabase
      .from('customers')
      .select('*')
      .eq('email', authUser.email)
      .maybeSingle();

    if (!emailErr && existingByEmail) {
      // Link existing customer record with auth_user_id
      const { data: updated, error: updateErr } = await supabase
        .from('customers')
        .update({ auth_user_id: authUser.id })
        .eq('id', existingByEmail.id)
        .select('*')
        .single();

      if (!updateErr && updated) {
        return {
          id: updated.id,
          name: updated.name,
          email: updated.email,
          phone: updated.phone || '',
          cpf: updated.cpf || '',
          addresses: updated.addresses || [],
          loyaltyPoints: updated.loyalty_points || 0,
          tier: updated.tier || 'Neófito'
        };
      } else if (updateErr) {
        console.warn('[ensureCustomerProfile] Erro ao vincular auth_user_id ao perfil existente por e-mail:', updateErr);
      }
    }

    // 3. Create new customer profile in public.customers
    const name =
      authUser.user_metadata?.full_name ||
      authUser.user_metadata?.name ||
      (authUser.email ? authUser.email.split('@')[0] : 'Cliente Omiaá');

    const phone = authUser.user_metadata?.phone || '';

    const newCustomerPayload = {
      auth_user_id: authUser.id,
      email: authUser.email,
      name,
      phone,
      cpf: '',
      addresses: [],
      loyalty_points: 0,
      tier: 'Neófito'
    };

    const { data: inserted, error: insertError } = await supabase
      .from('customers')
      .insert([newCustomerPayload])
      .select('*')
      .single();

    if (insertError) {
      console.error('[ensureCustomerProfile] Erro explícito ao criar registro do cliente em public.customers:', insertError);
      return null;
    }

    if (inserted) {
      return {
        id: inserted.id,
        name: inserted.name,
        email: inserted.email,
        phone: inserted.phone || '',
        cpf: inserted.cpf || '',
        addresses: inserted.addresses || [],
        loyaltyPoints: inserted.loyalty_points || 0,
        tier: inserted.tier || 'Neófito'
      };
    }

    return null;
  } catch (err) {
    console.error('[ensureCustomerProfile] Exceção ao garantir perfil do cliente:', err);
    return null;
  }
}

export async function upsertCustomerProfile(profile: CustomerProfile, authUserId?: string): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const payload: any = {
      email: profile.email,
      name: profile.name,
      phone: profile.phone,
      cpf: profile.cpf,
      addresses: profile.addresses,
      loyalty_points: profile.loyaltyPoints,
      tier: profile.tier
    };

    if (authUserId) {
      payload.auth_user_id = authUserId;
    }

    if (profile.id) {
      const { error: updateError } = await supabase
        .from('customers')
        .update(payload)
        .eq('id', profile.id);

      if (!updateError) return true;
    }

    const { error } = await supabase
      .from('customers')
      .upsert(payload, { onConflict: 'email' });

    if (error) {
      console.error('upsertCustomerProfile error:', error);
      return false;
    }
    return true;
  } catch (err) {
    console.error('upsertCustomerProfile exception:', err);
    return false;
  }
}

// ============================================================================
// BLOG POSTS SERVICE
// ============================================================================
export async function fetchBlogPosts(): Promise<BlogPost[]> {
  const FALLBACK_BLOG: BlogPost[] = [
    {
      id: 'post-1',
      slug: 'o-mysterium-da-maceracao-lunar',
      title: 'O Mysterium da Maceração Lunar na Fitoterapia',
      excerpt: 'Descubra como os ciclos da Lua influenciam a extração de ativos botânicos e o poder vibracional dos elixires.',
      content: 'A maceração sob a luz prateada do astro noturno não é apenas um ritual poético; é uma ciência sutil refinada ao longo de milênios...',
      author: 'Mestre Alquimista Omiaá',
      category: 'Rituais & Saberes',
      readTime: '6 min',
      coverImage: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop',
      tags: ['Alquimia', 'Lua Cheia', 'Fitoterapia'],
      publishedAt: '2026-07-20'
    }
  ];

  if (!isSupabaseConfigured) return FALLBACK_BLOG;

  try {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false });

    if (error || !data || data.length === 0) return FALLBACK_BLOG;

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      title: row.title,
      excerpt: row.excerpt,
      content: row.content,
      author: row.author,
      category: row.category,
      readTime: row.read_time,
      coverImage: row.cover_image,
      tags: row.tags || [],
      publishedAt: row.published_at ? new Date(row.published_at).toISOString().split('T')[0] : ''
    }));
  } catch (err) {
    console.error('fetchBlogPosts error:', err);
    return FALLBACK_BLOG;
  }
}

// ============================================================================
// BOTANICAL LIBRARY SERVICE (CMS)
// ============================================================================
export async function fetchBotanicalEntries(): Promise<BotanicalEntry[]> {
  const FALLBACK_BOTANICAL: BotanicalEntry[] = [
    {
      id: 'bot-1',
      slug: 'camomila-romana',
      botanicalName: 'Matricaria recutita',
      popularName: 'Camomila Romana',
      category: 'Ervas',
      element: 'Água',
      lunarPhase: 'Lua Crescente / Cheia',
      chakra: 'Plexo Solar',
      medicinalProperties: ['Calmante digestivo', 'Ansiolítico suave', 'Anti-inflamatório'],
      spiritualProperties: ['Pacificação emocional', 'Dissolução do estresse'],
      historicalOrigin: 'Utilizada pelos antigos egípcios e consagrada ao Deus Sol Rá.',
      imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Propriedades Alquímicas da Camomila</h3><p>Macerada sob a luz da Lua Crescente para potencializar a extração dos flavonóides bisabolol e camazuleno.</p><h4>Preparo da Infusão:</h4><p>Adicione 1 colher de sopa para 250ml de água morna. Abafe por 8 minutos.</p>',
      preparationMethod: 'Infusão morna por 8 a 10 minutos',
      seo: {
        metaTitle: 'Camomila Romana (Matricaria recutita): Guia de Ervas | OMIAA',
        metaDescription: 'Aprenda sobre a Camomila Romana. Benefícios medicinais, infusão calmante, elemento Água e uso alquímico.',
        keywords: ['Camomila Romana', 'Ervas', 'Fitoterapia', 'OMIAA Alquimia Ancestral']
      },
      relatedProductIds: ['prod-1', 'prod-3'],
      relatedArticleIds: ['post-1']
    },
    {
      id: 'bot-2',
      slug: 'banho-sagrado-luar',
      botanicalName: 'Alquimia Herbal Banhos',
      popularName: 'Banho Sagrado de Purificação do Luar',
      category: 'Banhos',
      element: 'Água / Ar',
      lunarPhase: 'Lua Cheia',
      chakra: 'Coronal',
      medicinalProperties: ['Descarrego de tensões musculares', 'Relaxamento epidérmico'],
      spiritualProperties: ['Limpeza do campo áurico', 'Abertura de caminhos e clareza mental'],
      historicalOrigin: 'Fórmula tradicional das lavadeiras e herveiras do Vale do Ribeira.',
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Ritual de Banho Sagrado</h3><p>Combinação consagrada de Manjericão, Arruda, Alfazema e Sal Marinho do Atlântico.</p><ol><li>Ferva 2 litros de água de fonte.</li><li>Desligue e junte as ervas em oração.</li><li>Despeje do pescoço para baixo.</li></ol>',
      preparationMethod: 'Decocção suave das ervas e infusão por 15 minutos',
      seo: {
        metaTitle: 'Banho Sagrado de Purificação do Luar: Guia de Banhos | OMIAA',
        metaDescription: 'Aprenda o ritual de banho sagrado de limpeza áurica e descarrego com ervas frescas.',
        keywords: ['Banhos de Ervas', 'Banho Sagrado', 'Purificação', 'OMIAA Alquimia Ancestral']
      },
      relatedProductIds: ['prod-5', 'prod-8'],
      relatedArticleIds: ['post-1']
    },
    {
      id: 'bot-3',
      slug: 'defumacao-salvia-breu-branco',
      botanicalName: 'Salvia apiana & Protium heptaphyllum',
      popularName: 'Bastão de Defumação Sálvia & Breu Branco',
      category: 'Defumações',
      element: 'Fogo / Ar',
      lunarPhase: 'Lua Minguante',
      chakra: 'Terceiro Olho',
      medicinalProperties: ['Bactericida aéreo natural', 'Desobstrução das vias respiratórias'],
      spiritualProperties: ['Transmutação de energias estagnadas', 'Proteção e consagração de altares'],
      historicalOrigin: 'Sabedoria xamânica pan-americana unida à resina nativa da Amazônia.',
      imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Ritual de Defumação Ancestral</h3><p>Amarrado artesanalmente com fio de algodão cru sob intenções de harmonização.</p><ol><li>Acenda a ponta do bastão em chama natural.</li><li>Passar a fumaça de trás para a frente no ambiente.</li></ol>',
      preparationMethod: 'Braseamento lento e sopro direcionado com pena de consagração',
      seo: {
        metaTitle: 'Bastão de Defumação Sálvia & Breu Branco: Guia de Defumações | OMIAA',
        metaDescription: 'Descubra como realizar a defumação e limpeza energética de ambientes com resinas nativas.',
        keywords: ['Defumações', 'Sálvia Branca', 'Breu Branco', 'OMIAA Alquimia Ancestral']
      },
      relatedProductIds: ['prod-5', 'prod-8'],
      relatedArticleIds: ['post-1']
    },
    {
      id: 'bot-4',
      slug: 'oleo-macerado-alecrim-jojoba',
      botanicalName: 'Salvia rosmarinus & Simmondsia chinensis',
      popularName: 'Óleo Macerado de Alecrim & Jojoba',
      category: 'Óleos',
      element: 'Fogo / Terra',
      lunarPhase: 'Lua Crescente',
      chakra: 'Plexo Solar',
      medicinalProperties: ['Estímulo da circulação e foco', 'Fortalecimento capilar e folicular'],
      spiritualProperties: ['Despertar do vigor pessoal', 'Proteção vibracional e clareza de propósito'],
      historicalOrigin: 'Utilizado no Mediterrâneo antigo por estudantes para aprimorar a memória.',
      imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Oleolato de Alecrim Prensado a Frio</h3><p>Macerado durante um ciclo solar completo de 28 dias em óleo vegetal carreador de jojoba virgem.</p>',
      preparationMethod: 'Aplicação de 3 a 5 gotas em massagem suave no couro cabeludo ou têmporas',
      seo: {
        metaTitle: 'Óleo Macerado de Alecrim & Jojoba: Guia de Óleos | OMIAA',
        metaDescription: 'Guia completo do Óleo Macerado de Alecrim. Conheça as propriedades estimulantes e como usar.',
        keywords: ['Óleos Botânicos', 'Oleolatos', 'Alecrim', 'Jojoba', 'OMIAA']
      },
      relatedProductIds: ['prod-2', 'prod-7'],
      relatedArticleIds: ['post-1']
    },
    {
      id: 'bot-5',
      slug: 'resina-copal-dourado',
      botanicalName: 'Hymenaea courbaril',
      popularName: 'Resina Sagrada de Copal Dourado',
      category: 'Resinas',
      element: 'Ar / Éter',
      lunarPhase: 'Lua Cheia',
      chakra: 'Coronal & Laríngeo',
      medicinalProperties: ['Inalação purificadora', 'Acalma os batimentos cardíacos'],
      spiritualProperties: ['Elevação da frequência meditativa', 'Conexão com os reinos sutis'],
      historicalOrigin: 'Considerada a lágrimas dos deuses pelas civilizações maia e asteca.',
      imageUrl: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Lágrimas de Resina Sagrada</h3><p>Colhida de forma sustentável nas florestas tropicais. Queima sobre carvão vegetal incandescente.</p>',
      preparationMethod: 'Colocar pequenos grãos sobre disco de carvão vegetal aceso em incensário de cerâmica',
      seo: {
        metaTitle: 'Resina Sagrada de Copal Dourado: Guia de Resinas | OMIAA',
        metaDescription: 'Saiba tudo sobre o Copal Dourado. Resinas medicinais e rituais de queima sagrada.',
        keywords: ['Resinas', 'Copal Dourado', 'Incenso Natural', 'OMIAA']
      },
      relatedProductIds: ['prod-5', 'prod-8'],
      relatedArticleIds: ['post-1']
    },
    {
      id: 'bot-6',
      slug: 'guine-do-cerrado',
      botanicalName: 'Petiveria tetrandra',
      popularName: 'Planta Ancestral Guiné do Cerrado',
      category: 'Plantas',
      element: 'Terra / Fogo',
      lunarPhase: 'Lua Minguante',
      chakra: 'Básico (Muladhara)',
      medicinalProperties: ['Analgésico tópico', 'Anti-reumático tradicional'],
      spiritualProperties: ['Aterramento profundo', 'Escudo contra obsessões e inveja'],
      historicalOrigin: 'Planta sagrada da caboclaria e medicina popular brasileira.',
      imageUrl: 'https://images.unsplash.com/photo-1515586000433-45406d8e6662?q=80&w=800&auto=format&fit=crop',
      richContent: '<h3>Força e Aterramento da Guiné</h3><p>A Guiné atua como uma barreira protetora para lares e altares pessoais.</p>',
      preparationMethod: 'Pequenos ramos secos para saquinhos de proteção ou cultivo em vasos na entrada do lar',
      seo: {
        metaTitle: 'Planta Ancestral Guiné do Cerrado: Guia de Plantas | OMIAA',
        metaDescription: 'Aprenda sobre a Guiné do Cerrado, planta de aterramento e proteção energética.',
        keywords: ['Plantas', 'Guiné do Cerrado', 'Aterramento', 'Proteção']
      },
      relatedProductIds: ['prod-5', 'prod-8'],
      relatedArticleIds: ['post-1']
    }
  ];

  if (!isSupabaseConfigured) return FALLBACK_BOTANICAL;

  try {
    const { data, error } = await supabase
      .from('botanical_library')
      .select('*')
      .order('popular_name');

    if (error || !data || data.length === 0) return FALLBACK_BOTANICAL;

    return data.map((row: any) => ({
      id: row.id,
      slug: row.slug,
      botanicalName: row.botanical_name,
      popularName: row.popular_name,
      category: row.category || 'Ervas',
      element: row.element,
      lunarPhase: row.lunar_phase,
      chakra: row.chakra,
      medicinalProperties: row.medicinal_properties || [],
      spiritualProperties: row.spiritual_properties || [],
      historicalOrigin: row.historical_origin || '',
      imageUrl: row.image_url,
      richContent: row.rich_content || row.full_content || '',
      preparationMethod: row.preparation_method || '',
      seo: row.seo || undefined,
      relatedProductIds: row.related_product_ids || [],
      relatedArticleIds: row.related_article_ids || []
    }));
  } catch (err) {
    console.error('fetchBotanicalEntries error:', err);
    return FALLBACK_BOTANICAL;
  }
}

// ============================================================================
// CUSTOM FRAGRANCES SERVICE
// ============================================================================

const FALLBACK_CUSTOM_FRAGRANCES: CustomFragrance[] = [
  {
    id: 'frag-1',
    batchNumber: 'BATCH-2026-OMIAA-001',
    customerName: 'Aline Mendes',
    customerEmail: 'cliente@omiaa.com.br',
    customerPhone: '+55 11 98765-4321',
    name: 'Essência Solar de Prosperidade',
    topNotes: ['Bergamota Calábria', 'Laranja Doce'],
    heartNotes: ['Rosa Damascena', 'Néroli Flor'],
    baseNotes: ['Breu Branco', 'Cedro do Atlas'],
    intention: 'Abertura de caminhos profissionais, magnetismo pessoal e proteção no lar.',
    bottleSize: '50ml',
    price: 340,
    status: 'macerando',
    macerationStartDate: '2026-07-10',
    macerationDaysTotal: 28,
    macerationDaysRemaining: 11,
    alchemistNotes: 'Infusão com óleo essencial puro de Neroli e macerado sob solstício solar.',
    questionnaire: {
      intention: 'Prosperidade e Magnetismo',
      olfactiveFamily: 'Cítrico Resinoso',
      intensity: 'Marcante',
      concentration: 'Eau de Parfum (20%)',
      bottleEngraving: 'Aline - Abundância 2026',
      preferredElement: 'Fogo',
      moodOrChakra: 'Plexo Solar'
    },
    appointment: {
      date: '2026-07-08',
      time: '14:30',
      type: 'virtual',
      perfumer: 'Gabriel Alquimista',
      confirmed: true
    },
    payment: {
      method: 'pix',
      status: 'pago',
      amount: 340,
      paidAt: '2026-07-08T15:00:00Z',
      pixCopyPaste: '00020126580014BR.GOV.BCB.PIX0136omiaa-custom-fragrance-001'
    },
    createdAt: '2026-07-08T14:00:00Z'
  },
  {
    id: 'frag-2',
    batchNumber: 'BATCH-2026-OMIAA-002',
    customerName: 'Rodrigo Silveira',
    customerEmail: 'rodrigo@exemplo.com.br',
    customerPhone: '+55 21 99123-8877',
    name: 'Névoa da Floresta Sagrada',
    topNotes: ['Sálvia Esclaréia', 'Grapefruit Rosa'],
    heartNotes: ['Gerânio Egípcio'],
    baseNotes: ['Palo Santo', 'Vetiver de Comores', 'Sândalo Mysore'],
    intention: 'Desconexão do estresse urbano e reconexão com os ciclos da terra.',
    bottleSize: '100ml',
    price: 580,
    status: 'envasado',
    macerationStartDate: '2026-06-25',
    macerationDaysTotal: 28,
    macerationDaysRemaining: 0,
    alchemistNotes: 'Maceração completa de 28 dias finalizada. Filtrado e envasado com lacre dourado.',
    questionnaire: {
      intention: 'Aterramento e Paz Interior',
      olfactiveFamily: 'Amadeirado Herbal',
      intensity: 'Moderada',
      concentration: 'Extrait de Parfum (30%)',
      bottleEngraving: 'Rodrigo S. - Raízes',
      preferredElement: 'Terra',
      moodOrChakra: 'Básico (Muladhara)'
    },
    appointment: {
      date: '2026-06-24',
      time: '16:00',
      type: 'presencial',
      perfumer: 'Sofia Perfumista',
      confirmed: true
    },
    payment: {
      method: 'credit_card',
      status: 'pago',
      amount: 580,
      paidAt: '2026-06-24T16:45:00Z',
      cardLast4: '4821'
    },
    createdAt: '2026-06-24T15:30:00Z'
  },
  {
    id: 'frag-3',
    batchNumber: 'BATCH-2026-OMIAA-003',
    customerName: 'Aline Mendes',
    customerEmail: 'cliente@omiaa.com.br',
    customerPhone: '+55 11 98765-4321',
    name: 'Elixir de Íris & Mirra',
    topNotes: ['Lavanda Francesa'],
    heartNotes: ['Íris Imperial', 'Jasmim Real'],
    baseNotes: ['Mirra Sagrada', 'Breu Branco'],
    intention: 'Intuição espiritual e paz meditativa profunda.',
    bottleSize: '30ml',
    price: 220,
    status: 'analise_olfativa',
    alchemistNotes: 'Sessão de agendamento confirmada para análise da pirâmide.',
    questionnaire: {
      intention: 'Paz e Meditação',
      olfactiveFamily: 'Floral Oriental',
      intensity: 'Suave',
      concentration: 'Eau de Parfum (20%)',
      preferredElement: 'Água',
      moodOrChakra: 'Terceiro Olho'
    },
    appointment: {
      date: '2026-07-29',
      time: '11:00',
      type: 'virtual',
      perfumer: 'Gabriel Alquimista',
      confirmed: true
    },
    payment: {
      method: 'pix',
      status: 'pago',
      amount: 220,
      paidAt: '2026-07-26T10:00:00Z'
    },
    createdAt: '2026-07-26T09:30:00Z'
  }
];

export async function fetchCustomFragrances(customerEmail?: string): Promise<CustomFragrance[]> {
  if (!isSupabaseConfigured) {
    if (customerEmail) {
      return FALLBACK_CUSTOM_FRAGRANCES.filter(
        (f) => f.customerEmail?.toLowerCase() === customerEmail.toLowerCase()
      );
    }
    return FALLBACK_CUSTOM_FRAGRANCES;
  }

  try {
    let query = supabase.from('custom_fragrances').select('*').order('created_at', { ascending: false });
    if (customerEmail) {
      query = query.eq('customer_email', customerEmail);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      if (customerEmail) {
        return FALLBACK_CUSTOM_FRAGRANCES.filter(
          (f) => f.customerEmail?.toLowerCase() === customerEmail.toLowerCase()
        );
      }
      return FALLBACK_CUSTOM_FRAGRANCES;
    }

    return data.map((row: any) => ({
      id: row.id,
      batchNumber: row.batch_number || `BATCH-${row.id?.slice(0, 6)}`,
      customerId: row.customer_id,
      customerName: row.customer_name || 'Cliente Atelier',
      customerEmail: row.customer_email,
      customerPhone: row.customer_phone || '',
      name: row.name,
      topNotes: row.top_notes || [],
      heartNotes: row.heart_notes || [],
      baseNotes: row.base_notes || [],
      intention: row.intention,
      bottleSize: row.bottle_size,
      price: row.price || 340,
      questionnaire: row.questionnaire || undefined,
      appointment: row.appointment || undefined,
      payment: row.payment || undefined,
      status: row.status || 'solicitado',
      macerationStartDate: row.maceration_start_date,
      macerationDaysTotal: row.maceration_days_total || 28,
      macerationDaysRemaining: row.maceration_days_remaining,
      alchemistNotes: row.alchemist_notes,
      createdAt: row.created_at
    }));
  } catch (err) {
    console.error('fetchCustomFragrances error:', err);
    return FALLBACK_CUSTOM_FRAGRANCES;
  }
}

export async function createCustomFragrance(fragrance: CustomFragrance): Promise<CustomFragrance | null> {
  const newBatch = `BATCH-2026-OMIAA-${Math.floor(100 + Math.random() * 900)}`;
  const createdObj: CustomFragrance = {
    ...fragrance,
    id: fragrance.id || `frag-${Date.now()}`,
    batchNumber: fragrance.batchNumber || newBatch,
    status: fragrance.status || 'solicitado',
    createdAt: new Date().toISOString()
  };

  if (!isSupabaseConfigured) return createdObj;

  try {
    const payload = {
      batch_number: createdObj.batchNumber,
      customer_name: createdObj.customerName || 'Cliente Atelier',
      customer_email: createdObj.customerEmail || 'cliente@omiaa.com.br',
      customer_phone: createdObj.customerPhone || '',
      name: createdObj.name,
      top_notes: createdObj.topNotes,
      heart_notes: createdObj.heartNotes,
      base_notes: createdObj.baseNotes,
      intention: createdObj.intention,
      bottle_size: createdObj.bottleSize,
      price: createdObj.price || 340,
      questionnaire: createdObj.questionnaire || null,
      appointment: createdObj.appointment || null,
      payment: createdObj.payment || null,
      status: createdObj.status,
      maceration_start_date: createdObj.macerationStartDate || null,
      alchemist_notes: createdObj.alchemistNotes || ''
    };

    const { data, error } = await supabase
      .from('custom_fragrances')
      .insert([payload])
      .select('*')
      .single();

    if (error || !data) {
      console.error('createCustomFragrance error:', error);
      return createdObj;
    }

    return {
      id: data.id,
      batchNumber: data.batch_number,
      customerName: data.customer_name,
      customerEmail: data.customer_email,
      customerPhone: data.customer_phone,
      name: data.name,
      topNotes: data.top_notes || [],
      heartNotes: data.heart_notes || [],
      baseNotes: data.base_notes || [],
      intention: data.intention,
      bottleSize: data.bottle_size,
      price: data.price,
      questionnaire: data.questionnaire,
      appointment: data.appointment,
      payment: data.payment,
      status: data.status,
      macerationStartDate: data.maceration_start_date,
      alchemistNotes: data.alchemist_notes,
      createdAt: data.created_at
    };
  } catch (err) {
    console.error('createCustomFragrance exception:', err);
    return createdObj;
  }
}

export async function updateCustomFragranceStatus(
  id: string,
  status: string,
  alchemistNotes?: string,
  macerationDaysRemaining?: number
): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const { error } = await supabase
      .from('custom_fragrances')
      .update({
        status,
        alchemist_notes: alchemistNotes,
        maceration_days_remaining: macerationDaysRemaining
      })
      .eq('id', id);

    return !error;
  } catch (err) {
    console.error('updateCustomFragranceStatus error:', err);
    return true;
  }
}

// ----------------------------------------------------------------------------
// STORE SETTINGS SERVICE
// ----------------------------------------------------------------------------

export async function fetchRemoteStoreSettings(): Promise<StoreSettings | null> {
  if (!isSupabaseConfigured) return null;

  return swrFetch(
    'store_settings',
    async () => {
      const { data, error } = await supabase
        .from('store_settings')
        .select('data')
        .eq('id', 'default')
        .maybeSingle();

      if (error || !data || !data.data) return null;
      return data.data as StoreSettings;
    },
    { ttl: 180_000 } // 3 minutes TTL
  );
}

export async function upsertRemoteStoreSettings(settings: StoreSettings): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  try {
    const { error } = await supabase
      .from('store_settings')
      .upsert({
        id: 'default',
        data: settings,
        updated_at: new Date().toISOString()
      });

    if (error) {
      console.error('upsertRemoteStoreSettings error:', error);
      return false;
    }

    // Invalidate store settings cache
    invalidateCache('store_settings');
    return true;
  } catch (err) {
    console.error('upsertRemoteStoreSettings exception:', err);
    return false;
  }
}

