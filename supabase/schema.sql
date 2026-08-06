-- ============================================================================
-- OMIAÁ ALQUIMIA ANCESTRAL - SCHEMAS, TABLES, RLS, INDEXES & SEEDS
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. CATEGORIES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    icon_name TEXT,
    banner_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. PRODUCTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    original_price NUMERIC(10, 2) CHECK (original_price >= 0),
    rating NUMERIC(3, 2) DEFAULT 5.0,
    reviews_count INTEGER DEFAULT 0,
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    featured BOOLEAN DEFAULT FALSE,
    badges TEXT[] DEFAULT '{}',
    volume_or_weight TEXT,
    short_description TEXT,
    full_description TEXT,
    ingredients TEXT[] DEFAULT '{}',
    ancestral_origin TEXT,
    usage_instructions TEXT,
    images TEXT[] DEFAULT '{}',
    sku TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. CUSTOMERS TABLE (Profiles)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    cpf TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    loyalty_points INTEGER DEFAULT 0,
    tier TEXT DEFAULT 'Neófito' CHECK (tier IN ('Neófito', 'Iniciado', 'Mestre Alquimista')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. ORDERS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    customer_email TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'em_preparo', 'enviado', 'entregue')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    delivery_address JSONB NOT NULL,
    tracking_code TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. ORDER ITEMS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_snapshot JSONB NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10, 2) NOT NULL,
    selected_option TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 6. COUPONS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    discount_percent INTEGER NOT NULL CHECK (discount_percent > 0 AND discount_percent <= 100),
    active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 7. BLOG POSTS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    author TEXT NOT NULL DEFAULT 'Mestre Alquimista Omiaá',
    category TEXT NOT NULL,
    read_time TEXT DEFAULT '5 min',
    cover_image TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    published_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 8. GUIA DAS ERVAS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.botanical_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    botanical_name TEXT NOT NULL,
    popular_name TEXT NOT NULL,
    element TEXT NOT NULL,
    lunar_phase TEXT,
    chakra TEXT,
    medicinal_properties TEXT[] DEFAULT '{}',
    spiritual_properties TEXT[] DEFAULT '{}',
    historical_origin TEXT,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. CUSTOM FRAGRANCES TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_fragrances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_email TEXT,
    name TEXT NOT NULL,
    top_notes TEXT[] DEFAULT '{}',
    heart_notes TEXT[] DEFAULT '{}',
    base_notes TEXT[] DEFAULT '{}',
    intention TEXT NOT NULL,
    bottle_size TEXT NOT NULL DEFAULT '50ml',
    status TEXT NOT NULL DEFAULT 'encomedado' CHECK (status IN ('rascunho', 'encomedado', 'macerando', 'concluido')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. STORE SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Store Settings" ON public.store_settings FOR SELECT USING (true);
CREATE POLICY "Admin Write Store Settings" ON public.store_settings FOR ALL USING (true);


-- ============================================================================
-- OPTIMIZED DATABASE INDEXES
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON public.products(price);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON public.orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_botanical_slug ON public.botanical_library(slug);
CREATE INDEX IF NOT EXISTS idx_custom_fragrances_customer ON public.custom_fragrances(customer_id);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.botanical_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_fragrances ENABLE ROW LEVEL SECURITY;

-- Categories & Products & Coupons & Blog & Botanical Library: Public Read Access
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Blog Posts" ON public.blog_posts FOR SELECT USING (true);
CREATE POLICY "Public Read Botanical Library" ON public.botanical_library FOR SELECT USING (true);

-- Admin insert/update on catalog & content
CREATE POLICY "Allow All for Admin or Anon Insert Products" ON public.products FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Admin Categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow All for Admin Coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- Customers table policies
CREATE POLICY "Public Read/Insert Customers" ON public.customers FOR ALL USING (true) WITH CHECK (true);

-- Orders and Order Items policies
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- Custom Fragrances policies
CREATE POLICY "Public Insert/Select Custom Fragrances" ON public.custom_fragrances FOR ALL USING (true) WITH CHECK (true);

-- ============================================================================
-- INITIAL SEED DATA
-- ============================================================================

-- Seed Categories
INSERT INTO public.categories (id, name, description, icon_name, banner_image) VALUES
('todos', 'Toda a Coleção', 'Explore todos os elixires e preparados alquímicos da nossa marca de alquimia ancestral.', 'Sparkles', 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1200&auto=format&fit=crop'),
('elixires', 'Elixires Botânicos', 'Extratos concentrados macerados sob as fases da lua para harmonização sutil.', 'Droplet', 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop'),
('seruns', 'Séruns & Óleos Faciais', 'Nutrição ancestral profunda com prensagem a frio de óleos puros e oleolatos raros.', 'Sparkle', 'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=1200&auto=format&fit=crop'),
('chass', 'Infusões & Chás Solares', 'Mesclas botânicas colhidas manualmente com propriedades medicinais equilibrantes.', 'Coffee', 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=1200&auto=format&fit=crop'),
('velas', 'Velas Alquímicas', 'Cera 100% vegetal infusionada com óleos essenciais puros e ervas sagradas.', 'Flame', 'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop'),
('rituais', 'Rituais & Cristais', 'Defumadores naturais, incensos de resina pura e bastões de limpeza energética.', 'Feather', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1200&auto=format&fit=crop')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Products
INSERT INTO public.products (
    slug, name, subtitle, category_id, price, original_price, rating, reviews_count, stock, featured, badges, volume_or_weight, short_description, full_description, ingredients, ancestral_origin, usage_instructions, images, sku
) VALUES
(
    'elixir-lunar-serenidade',
    'Elixir Lunar de Serenidade',
    'Macerado Noturno de Camomila Romana, Melissas & Ametista',
    'elixires',
    189.00,
    220.00,
    4.90,
    42,
    14,
    TRUE,
    ARRAY['Mais Vendido', 'Feito na Lua Cheia', '100% Orgânico'],
    '50ml',
    'Uma sinergia alquímica calmante formulada para desacelerar a mente, induzir o sono profundo e restaurar o equilíbrio energético.',
    'Elaborado artesanalmente sob o ciclo da Lua Cheia na Chapada dos Veadeiros. O Elixir Lunar combina a sabedoria da fitoterapia ancestral com a infusão energética de cristais de Ametista purificada. Macerado durante 28 dias em glicerina vegetal e hydrolatos botânicos.',
    ARRAY['Extrato concentrado de Camomila Romana', 'Erva-Cidreira', 'Passiflora edulis', 'Hydrolato de Lavanda Francesa', 'Glicerina Vegetal', 'Vibracional de Ametista'],
    'Saber Tradicional Kalunga & Alquimia Hermética Europeia',
    'Pingue 5 a 8 gotas debaixo da língua ou dilua em 50ml de água morna antes de dormir.',
    ARRAY['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=800&auto=format&fit=crop'],
    'OMIA-ELI-001'
),
(
    'serum-facial-ouro-botanico',
    'Sérum Facial Ouro Botânico',
    'Néctar de Rosa Mosqueta, Jojoba & Óleo Essencial de Néroli',
    'seruns',
    245.00,
    280.00,
    5.00,
    68,
    8,
    TRUE,
    ARRAY['Edição Limitada', 'Prensado a Frio', 'Vegano'],
    '30ml',
    'Rico em ácidos graxos essenciais, carotenóides e antioxidantes puros que iluminam a pele e regeneram o viço natural.',
    'Um néctar dourado acetinado prensado a frio que penetra nas camadas mais profundas da derme. A adição do óleo precioso de Néroli e Mirra promove regeneração celular imediata.',
    ARRAY['Óleo de Rosa Mosqueta virgem', 'Óleo de Jojoba Orgânico', 'Óleo de Semente de Maracujá', 'Óleo Essencial de Néroli', 'Resina de Mirra', 'Vitamina E Natural'],
    'Rituais de Beleza do Antigo Egito e Botânica Amazônica',
    'Com a pele limpa e levemente úmida, aplique 3 a 4 gotas na palma das mãos. Aqueça e pressione no rosto.',
    ARRAY['https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'],
    'OMIA-SER-002'
),
(
    'infusao-solar-vitalidade',
    'Infusão Solar de Vitalidade',
    'Chá Artesanal de Calêndula, Capim-Santo, Hibisco & Gengibre',
    'chass',
    78.00,
    NULL,
    4.80,
    29,
    25,
    FALSE,
    ARRAY['Colheita Manual', 'Sem Glúten'],
    '100g',
    'Blend estimulante sem cafeína sintética, desenhado para despertar o fogo interior e fortalecer o sistema imunológico.',
    'As pétalas de calêndula cultivadas em horta biodinâmica unem-se ao vigor do gengibre nativo e à vivacidade do hibisco.',
    ARRAY['Flores de Calêndula', 'Capim-Santo desidratado', 'Cálices de Hibisco', 'Gengibre em rodelas secas', 'Casca de Laranja Doce'],
    'Medicina Tradicional Chinesa e Herbalismo Brasileiro',
    'Adicione 1 colher de sopa para 250ml de água fervente. Abafe por 7 a 10 minutos.',
    ARRAY['https://images.unsplash.com/photo-1576092768241-dec231879fc3?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?q=80&w=800&auto=format&fit=crop'],
    'OMIA-CHA-003'
),
(
    'vela-alquimica-templo-sagrado',
    'Vela Alquímica Templo Sagrado',
    'Cera de Coco, Óleo Essencial de Breu Branco & Palo Santo',
    'velas',
    159.00,
    180.00,
    4.90,
    51,
    12,
    TRUE,
    ARRAY['Cera 100% Vegetal', 'Pavio de Algodão Cru'],
    '220g',
    'Crie uma atmosfera de purificação e reconexão espiritual em seu lar com a fragrância rústica das resinas florestais.',
    'Fundida à mão em recipientes de cerâmica artesanal reaproveitável. Infundida com óleo essencial raro de Breu Branco.',
    ARRAY['Cera vegetal de Coco e Palma', 'Óleo Essencial de Breu Branco', 'Resina de Palo Santo', 'Óleo Essencial de Cedro', 'Pavio de algodão natural'],
    'Resinoterapia da Floresta Amazônica',
    'Deixe a vela acesa até que toda a superfície derreta por igual.',
    ARRAY['https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=800&auto=format&fit=crop'],
    'OMIA-VEL-004'
),
(
    'bastao-defumacao-copal-lavanda',
    'Bastão Alquímico de Defumação',
    'Sálvia Branca, Resina Copal & Flores de Lavanda',
    'rituais',
    65.00,
    NULL,
    4.70,
    19,
    30,
    FALSE,
    ARRAY['Atado à Mão', 'Atrações Positivas'],
    '45g',
    'Bastão artesanal amarrado com fio de algodão natural para limpeza de ambientes, purificação da aura e consagração.',
    'Cada bastão é amarrado à mão sob cânticos e intenções de paz. Ideal para preparar espaços de meditação.',
    ARRAY['Ervas secas de Sálvia Branca', 'Resina Copal Natural', 'Flores de Lavanda do Campo', 'Fio de Algodão Cru'],
    'Xamanismo Pan-Americano e Tradição Herbária',
    'Acenda a ponta do bastão na chama de uma vela até formar uma brasa.',
    ARRAY['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1602928321679-560bb453f190?q=80&w=800&auto=format&fit=crop'],
    'OMIA-RIT-005'
)
ON CONFLICT (slug) DO UPDATE SET price = EXCLUDED.price;

-- Seed Coupons
INSERT INTO public.coupons (code, discount_percent, active) VALUES
('ALQUIMIA10', 10, TRUE),
('OMIAA10', 10, TRUE),
('LUNAR15', 15, TRUE),
('PRIMEIRACOMPRA', 15, TRUE)
ON CONFLICT (code) DO NOTHING;

-- Seed Blog Posts
INSERT INTO public.blog_posts (slug, title, excerpt, content, author, category, read_time, cover_image, tags) VALUES
(
    'o-mysterium-da-maceracao-lunar',
    'O Mysterium da Maceração Lunar na Fitoterapia',
    'Descubra como os ciclos da Lua influenciam a extração de ativos botânicos e o poder vibracional dos elixires.',
    'A maceração sob a luz prateada do astro noturno não é apenas um ritual poético; é uma ciência sutil refinada ao longo de milênios. Durante a Lua Cheia, a pressão gravitacional e a bioenergética das plantas atinge o ápice...',
    'Mestre Alquimista Omiaá',
    'Rituais & Saberes',
    '6 min',
    'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=1200&auto=format&fit=crop',
    ARRAY['Alquimia', 'Lua Cheia', 'Fitoterapia', 'Elixires']
),
(
    'o-poder-das-resinas-amazonicus',
    'Breu Branco e Copaíba: As Resinas Sagradas da Floresta',
    'Conheça a história e as propriedades terapêuticas do Breu Branco e do Bálsamo de Copaíba na perfumaria botânica.',
    'Coletadas de forma sustentável pelas comunidades ribeirinhas da Amazônia, as resinas silvestres carregam o aroma profundo da terra molhada e a sabedoria ancestral da cura das florestas...',
    'Etnobotânica Clara Luz',
    'Botânica Sagrada',
    '4 min',
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1200&auto=format&fit=crop',
    ARRAY['Amazônia', 'Breu Branco', 'Perfumes Naturais']
)
ON CONFLICT (slug) DO NOTHING;

-- Seed Guia das Ervas
INSERT INTO public.botanical_library (slug, botanical_name, popular_name, element, lunar_phase, chakra, medicinal_properties, spiritual_properties, historical_origin, image_url) VALUES
(
    'matricaria-recutita',
    'Matricaria recutita',
    'Camomila Romana',
    'Água',
    'Lua Crescente / Cheia',
    'Chakra Plexo Solar',
    ARRAY['Calmante digestivo', 'Ansiolítico suave', 'Anti-inflamatório cutâneo'],
    ARRAY['Pacificação emocional', 'Abertura para o sono reparador', 'Dissolução do estresse'],
    'Utilizada pelos antigos egípcios e consagrada ao Deus Sol Rá por sua capacidade de acalmar e curar febres.',
    'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'
),
(
    'rosa-rubiginosa',
    'Rosa rubiginosa',
    'Rosa Mosqueta Ancestral',
    'Fogo / Terra',
    'Lua Nova',
    'Chakra Cardíaco',
    ARRAY['Regenerador celular', 'Cicatrização profunda', 'Antioxidante rico em Vitamina C'],
    ARRAY['Amor-próprio', 'Recomposição do campo áurico', 'Abertura do coração'],
    'Originária da Patagônia e cultivada em solos vulcânicos pelo povo Mapuche há gerações.',
    'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;
