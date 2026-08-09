-- ============================================================================
-- OMIAÁ ALQUIMIA ANCESTRAL - SCHEMAS, TABLES, RLS, INDEXES, MIGRATIONS & SEEDS
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
    status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'pago', 'em_preparo', 'enviado', 'entregue', 'cancelado')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pix', 'credit_card', 'boleto')),
    delivery_address JSONB NOT NULL,
    tracking_code TEXT,
    stock_deducted_at TIMESTAMPTZ DEFAULT NULL,
    transaction_nsu TEXT,
    receipt_url TEXT,
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
-- 8. GUIA DAS ERVAS TABLE (BOTANICAL LIBRARY)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.botanical_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    botanical_name TEXT NOT NULL,
    popular_name TEXT NOT NULL,
    category TEXT DEFAULT 'Ervas',
    element TEXT NOT NULL,
    lunar_phase TEXT,
    chakra TEXT,
    medicinal_properties TEXT[] DEFAULT '{}',
    spiritual_properties TEXT[] DEFAULT '{}',
    historical_origin TEXT,
    image_url TEXT NOT NULL,
    rich_content TEXT,
    preparation_method TEXT,
    seo JSONB,
    related_product_ids TEXT[] DEFAULT '{}',
    related_article_ids TEXT[] DEFAULT '{}',
    published BOOLEAN DEFAULT TRUE,
    featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 9. CUSTOM FRAGRANCES TABLE (ATELIER)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_fragrances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_number TEXT,
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    name TEXT NOT NULL,
    top_notes TEXT[] DEFAULT '{}',
    heart_notes TEXT[] DEFAULT '{}',
    base_notes TEXT[] DEFAULT '{}',
    intention TEXT NOT NULL,
    bottle_size TEXT NOT NULL DEFAULT '50ml',
    price NUMERIC(10, 2) DEFAULT 340.00,
    questionnaire JSONB,
    appointment JSONB,
    payment JSONB,
    status TEXT NOT NULL DEFAULT 'solicitado' CHECK (status IN ('solicitado', 'agendado', 'analise_olfativa', 'macerando', 'envasado', 'enviado', 'concluido', 'encomendado', 'rascunho')),
    maceration_start_date DATE,
    maceration_days_total INTEGER DEFAULT 28,
    maceration_days_remaining INTEGER,
    alchemist_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 10. USER ROLES TABLE (RBAC & AUTH PREPARATION)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN (
      'super_admin', 'admin', 'gerente', 'marketing', 'financeiro', 'logistica', 'editor', 'atendimento'
    )),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT user_roles_user_role_unique UNIQUE (user_id, role)
);

-- ----------------------------------------------------------------------------
-- 11. STORE SETTINGS TABLE
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.store_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    data JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================================================
-- SAFE MIGRATIONS FOR EXISTING DATABASES (IDEMPOTENT SCHEMA SYNC)
-- ============================================================================

-- 1. Sync custom_fragrances table columns & constraints
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS batch_number TEXT;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS customer_name TEXT;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS price NUMERIC(10, 2) DEFAULT 340.00;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS questionnaire JSONB;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS appointment JSONB;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS payment JSONB;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS maceration_start_date DATE;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS maceration_days_total INTEGER DEFAULT 28;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS maceration_days_remaining INTEGER;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS alchemist_notes TEXT;
ALTER TABLE public.custom_fragrances ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Update default status to 'solicitado'
ALTER TABLE public.custom_fragrances ALTER COLUMN status SET DEFAULT 'solicitado';

-- Safely update status constraint on custom_fragrances
ALTER TABLE public.custom_fragrances DROP CONSTRAINT IF EXISTS custom_fragrances_status_check;
ALTER TABLE public.custom_fragrances ADD CONSTRAINT custom_fragrances_status_check
  CHECK (status IN ('solicitado', 'agendado', 'analise_olfativa', 'macerando', 'envasado', 'enviado', 'concluido', 'encomendado', 'rascunho'));

-- 2. Sync botanical_library table columns
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Ervas';
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS rich_content TEXT;
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS preparation_method TEXT;
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS seo JSONB;
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS related_product_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS related_article_ids TEXT[] DEFAULT '{}';
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.botanical_library ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE;

-- 3. Safely update status constraint on orders (to allow 'cancelado')
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pendente', 'pago', 'em_preparo', 'enviado', 'entregue', 'cancelado'));


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
CREATE INDEX IF NOT EXISTS idx_botanical_category ON public.botanical_library(category);
CREATE INDEX IF NOT EXISTS idx_custom_fragrances_customer ON public.custom_fragrances(customer_id);
CREATE INDEX IF NOT EXISTS idx_custom_fragrances_batch ON public.custom_fragrances(batch_number);
CREATE INDEX IF NOT EXISTS idx_user_roles_user ON public.user_roles(user_id);


-- ============================================================================
-- HELPER FUNCTIONS & RLS POLICIES
-- ============================================================================

-- Function to check if a user possesses administrative roles
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = p_user_id
    AND role IN ('super_admin', 'admin', 'gerente', 'marketing', 'financeiro', 'logistica', 'editor', 'atendimento')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to safely validate a coupon code during checkout without exposing all coupons
CREATE OR REPLACE FUNCTION public.validate_coupon(p_code TEXT)
RETURNS TABLE (
  id UUID,
  code TEXT,
  discount_percent INTEGER,
  active BOOLEAN,
  expires_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.code, c.discount_percent, c.active, c.expires_at
  FROM public.coupons c
  WHERE UPPER(c.code) = UPPER(p_code)
    AND c.active = TRUE
    AND (c.expires_at IS NULL OR c.expires_at > NOW())
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ----------------------------------------------------------------------------
-- ATOMIC IDEMPOTENT STOCK DEDUCTION RPC FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.deduct_order_stock(p_order_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_insufficient_items TEXT[] := '{}';
BEGIN
    -- 1. Fetch order with row lock (FOR UPDATE)
    SELECT * INTO v_order
    FROM public.orders
    WHERE id = p_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Pedido não encontrado');
    END IF;

    -- 2. Check Idempotency: If stock was already deducted, return idempotent success
    IF v_order.stock_deducted_at IS NOT NULL THEN
        RETURN jsonb_build_object('success', true, 'idempotent', true, 'message', 'Estoque já baixado anteriormente');
    END IF;

    -- 3. Check stock availability for all order items
    FOR v_item IN
        SELECT oi.product_id, oi.quantity, p.name AS product_name, p.stock
        FROM public.order_items oi
        JOIN public.products p ON p.id = oi.product_id
        WHERE oi.order_id = p_order_id
    LOOP
        IF v_item.stock < v_item.quantity THEN
            v_insufficient_items := array_append(
                v_insufficient_items,
                v_item.product_name || ' (disponível: ' || v_item.stock || ', solicitado: ' || v_item.quantity || ')'
            );
        END IF;
    END LOOP;

    -- If any item has insufficient stock, abort without modifying anything
    IF array_length(v_insufficient_items, 1) > 0 THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Estoque insuficiente para os itens: ' || array_to_string(v_insufficient_items, ', ')
        );
    END IF;

    -- 4. Deduct stock atomically for each product in order_items
    UPDATE public.products p
    SET stock = p.stock - oi.quantity
    FROM public.order_items oi
    WHERE oi.order_id = p_order_id AND oi.product_id = p.id;

    -- 5. Record that stock has been deducted
    UPDATE public.orders
    SET stock_deducted_at = NOW()
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'idempotent', false, 'message', 'Estoque baixado com sucesso');
END;
$$;

-- ----------------------------------------------------------------------------
-- CLEANUP PENDING EXPIRED ORDERS (> 24 Hours) RPC FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cleanup_expired_pending_orders()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cancelled_count INTEGER;
BEGIN
    UPDATE public.orders
    SET status = 'cancelado'
    WHERE status = 'pendente'
      AND created_at < NOW() - INTERVAL '24 hours';

    GET DIAGNOSTICS v_cancelled_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'success', true,
        'cancelled_count', v_cancelled_count,
        'message', v_cancelled_count || ' pedidos pendentes expirados foram cancelados.'
    );
END;
$$;

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
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing legacy / open policies to ensure clean execution
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
DROP POLICY IF EXISTS "Public Read Products" ON public.products;
DROP POLICY IF EXISTS "Public Read Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Read Blog Posts" ON public.blog_posts;
DROP POLICY IF EXISTS "Public Read Botanical Library" ON public.botanical_library;
DROP POLICY IF EXISTS "Allow All for Admin or Anon Insert Products" ON public.products;
DROP POLICY IF EXISTS "Allow All for Admin Categories" ON public.categories;
DROP POLICY IF EXISTS "Allow All for Admin Coupons" ON public.coupons;
DROP POLICY IF EXISTS "Public Read/Insert Customers" ON public.customers;
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
DROP POLICY IF EXISTS "Public Insert/Select Custom Fragrances" ON public.custom_fragrances;
DROP POLICY IF EXISTS "Public Read Store Settings" ON public.store_settings;
DROP POLICY IF EXISTS "Admin Write Store Settings" ON public.store_settings;
DROP POLICY IF EXISTS "User Roles Select Policy" ON public.user_roles;
DROP POLICY IF EXISTS "Admin User Roles Management" ON public.user_roles;

-- Drop newly named policies if existing
DROP POLICY IF EXISTS "Categories Public Select" ON public.categories;
DROP POLICY IF EXISTS "Categories Admin Manage" ON public.categories;
DROP POLICY IF EXISTS "Products Public Select" ON public.products;
DROP POLICY IF EXISTS "Products Admin Manage" ON public.products;
DROP POLICY IF EXISTS "Customers Self Select" ON public.customers;
DROP POLICY IF EXISTS "Customers Self Insert" ON public.customers;
DROP POLICY IF EXISTS "Customers Self Update" ON public.customers;
DROP POLICY IF EXISTS "Customers Admin Delete" ON public.customers;
DROP POLICY IF EXISTS "Orders Self/Admin Select" ON public.orders;
DROP POLICY IF EXISTS "Orders Self/Admin Insert" ON public.orders;
DROP POLICY IF EXISTS "Orders Admin Update" ON public.orders;
DROP POLICY IF EXISTS "Orders Admin Delete" ON public.orders;
DROP POLICY IF EXISTS "Order Items Self/Admin Select" ON public.order_items;
DROP POLICY IF EXISTS "Order Items Self/Admin Insert" ON public.order_items;
DROP POLICY IF EXISTS "Order Items Admin Update" ON public.order_items;
DROP POLICY IF EXISTS "Order Items Admin Delete" ON public.order_items;
DROP POLICY IF EXISTS "Custom Fragrances Self/Admin Select" ON public.custom_fragrances;
DROP POLICY IF EXISTS "Custom Fragrances Self/Admin Insert" ON public.custom_fragrances;
DROP POLICY IF EXISTS "Custom Fragrances Self/Admin Update" ON public.custom_fragrances;
DROP POLICY IF EXISTS "Custom Fragrances Admin Delete" ON public.custom_fragrances;
DROP POLICY IF EXISTS "Coupons Admin Select" ON public.coupons;
DROP POLICY IF EXISTS "Coupons Admin Insert" ON public.coupons;
DROP POLICY IF EXISTS "Coupons Admin Update" ON public.coupons;
DROP POLICY IF EXISTS "Coupons Admin Delete" ON public.coupons;
DROP POLICY IF EXISTS "Blog Public Published Select" ON public.blog_posts;
DROP POLICY IF EXISTS "Blog Admin Manage" ON public.blog_posts;
DROP POLICY IF EXISTS "Botanical Public Published Select" ON public.botanical_library;
DROP POLICY IF EXISTS "Botanical Admin Manage" ON public.botanical_library;
DROP POLICY IF EXISTS "Store Settings Public Select" ON public.store_settings;
DROP POLICY IF EXISTS "Store Settings Admin Manage" ON public.store_settings;
DROP POLICY IF EXISTS "User Roles Admin Manage" ON public.user_roles;


-- ----------------------------------------------------------------------------
-- 1. CATEGORIES POLICIES
-- ----------------------------------------------------------------------------
-- Public reading of category catalog
CREATE POLICY "Categories Public Select" ON public.categories
    FOR SELECT USING (true);

-- Admin full management
CREATE POLICY "Categories Admin Manage" ON public.categories
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 2. PRODUCTS POLICIES
-- ----------------------------------------------------------------------------
-- Public reading of product catalog
CREATE POLICY "Products Public Select" ON public.products
    FOR SELECT USING (true);

-- Admin full management
CREATE POLICY "Products Admin Manage" ON public.products
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 3. CUSTOMERS POLICIES
-- ----------------------------------------------------------------------------
-- Users see only their own profile; admins see all
CREATE POLICY "Customers Self Select" ON public.customers
    FOR SELECT USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

-- Users insert only their own profile during sign up
CREATE POLICY "Customers Self Insert" ON public.customers
    FOR INSERT WITH CHECK (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

-- Users update only their own profile; admins can update
CREATE POLICY "Customers Self Update" ON public.customers
    FOR UPDATE USING (auth.uid() = auth_user_id OR public.is_admin(auth.uid()))
    WITH CHECK (auth.uid() = auth_user_id OR public.is_admin(auth.uid()));

-- Admin only delete
CREATE POLICY "Customers Admin Delete" ON public.customers
    FOR DELETE USING (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 4. ORDERS POLICIES
-- ----------------------------------------------------------------------------
-- Customer reads only their own orders (by linked customer_id or email); Admin reads all
CREATE POLICY "Orders Self/Admin Select" ON public.orders
    FOR SELECT USING (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = orders.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    );

-- Authenticated customers create only their own orders; Admin can create
CREATE POLICY "Orders Self/Admin Insert" ON public.orders
    FOR INSERT WITH CHECK (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = orders.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    );

-- Admin only update
CREATE POLICY "Orders Admin Update" ON public.orders
    FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Admin only delete
CREATE POLICY "Orders Admin Delete" ON public.orders
    FOR DELETE USING (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 5. ORDER ITEMS POLICIES
-- ----------------------------------------------------------------------------
-- Customer reads order items belonging to their own orders; Admin reads all
CREATE POLICY "Order Items Self/Admin Select" ON public.order_items
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.orders o
            LEFT JOIN public.customers c ON o.customer_id = c.id
            WHERE o.id = order_items.order_id
            AND (c.auth_user_id = auth.uid() OR o.customer_email = auth.jwt() ->> 'email')
        )
        OR public.is_admin(auth.uid())
    );

-- Insert permitted during creation of customer's own order; Admin can insert
CREATE POLICY "Order Items Self/Admin Insert" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.orders o
            LEFT JOIN public.customers c ON o.customer_id = c.id
            WHERE o.id = order_items.order_id
            AND (c.auth_user_id = auth.uid() OR o.customer_email = auth.jwt() ->> 'email')
        )
        OR public.is_admin(auth.uid())
    );

-- Admin only update
CREATE POLICY "Order Items Admin Update" ON public.order_items
    FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- Admin only delete
CREATE POLICY "Order Items Admin Delete" ON public.order_items
    FOR DELETE USING (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 6. CUSTOM FRAGRANCES POLICIES
-- ----------------------------------------------------------------------------
-- Customer views only their own fragrance requests; Admin views all
CREATE POLICY "Custom Fragrances Self/Admin Select" ON public.custom_fragrances
    FOR SELECT USING (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = custom_fragrances.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    );

-- Customer creates only their own fragrance requests; Admin can create
CREATE POLICY "Custom Fragrances Self/Admin Insert" ON public.custom_fragrances
    FOR INSERT WITH CHECK (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = custom_fragrances.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    );

-- Customer updates only their own requests; Admin can update
CREATE POLICY "Custom Fragrances Self/Admin Update" ON public.custom_fragrances
    FOR UPDATE USING (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = custom_fragrances.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    ) WITH CHECK (
        (customer_id IS NOT NULL AND EXISTS (
            SELECT 1 FROM public.customers c WHERE c.id = custom_fragrances.customer_id AND c.auth_user_id = auth.uid()
        ))
        OR (customer_email IS NOT NULL AND customer_email = auth.jwt() ->> 'email')
        OR public.is_admin(auth.uid())
    );

-- Admin only delete
CREATE POLICY "Custom Fragrances Admin Delete" ON public.custom_fragrances
    FOR DELETE USING (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 7. COUPONS POLICIES
-- ----------------------------------------------------------------------------
-- Admin only listing, creation, editing and deletion. Non-admins validate via validate_coupon() RPC
CREATE POLICY "Coupons Admin Select" ON public.coupons
    FOR SELECT USING (public.is_admin(auth.uid()));

CREATE POLICY "Coupons Admin Insert" ON public.coupons
    FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coupons Admin Update" ON public.coupons
    FOR UPDATE USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

CREATE POLICY "Coupons Admin Delete" ON public.coupons
    FOR DELETE USING (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 8. BLOG POSTS POLICIES
-- ----------------------------------------------------------------------------
-- Public reads only published articles (published_at <= NOW()); Admin reads all
CREATE POLICY "Blog Public Published Select" ON public.blog_posts
    FOR SELECT USING (published_at <= NOW() OR public.is_admin(auth.uid()));

-- Admin full management for blog
CREATE POLICY "Blog Admin Manage" ON public.blog_posts
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 9. BOTANICAL LIBRARY POLICIES
-- ----------------------------------------------------------------------------
-- Public reads only published entries (published = true); Admin reads all
CREATE POLICY "Botanical Public Published Select" ON public.botanical_library
    FOR SELECT USING (published = TRUE OR public.is_admin(auth.uid()));

-- Admin full management for botanical library
CREATE POLICY "Botanical Admin Manage" ON public.botanical_library
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 10. STORE SETTINGS POLICIES
-- ----------------------------------------------------------------------------
-- Public reading of basic store settings required for site rendering
CREATE POLICY "Store Settings Public Select" ON public.store_settings
    FOR SELECT USING (true);

-- Admin write management
CREATE POLICY "Store Settings Admin Manage" ON public.store_settings
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));


-- ----------------------------------------------------------------------------
-- 11. USER ROLES POLICIES
-- ----------------------------------------------------------------------------
-- Users select their own role or admins select all
CREATE POLICY "User Roles Select Policy" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin(auth.uid()));

-- Admins manage user roles
CREATE POLICY "User Roles Admin Manage" ON public.user_roles
    FOR ALL USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));



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
INSERT INTO public.botanical_library (slug, botanical_name, popular_name, category, element, lunar_phase, chakra, medicinal_properties, spiritual_properties, historical_origin, image_url) VALUES
(
    'matricaria-recutita',
    'Matricaria recutita',
    'Camomila Romana',
    'Ervas',
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
    'Óleos',
    'Fogo / Terra',
    'Lua Nova',
    'Chakra Cardíaco',
    ARRAY['Regenerador celular', 'Cicatrização profunda', 'Antioxidante rico em Vitamina C'],
    ARRAY['Amor-próprio', 'Recomposição do campo áurico', 'Abertura do coração'],
    'Originária da Patagônia e cultivada em solos vulcânicos pelo povo Mapuche há gerações.',
    'https://images.unsplash.com/photo-1608248597263-00079e968b6d?q=80&w=800&auto=format&fit=crop'
)
ON CONFLICT (slug) DO NOTHING;
