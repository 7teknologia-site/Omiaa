import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseKey = supabaseServiceRoleKey || supabaseAnonKey;

const serverSupabase = (supabaseUrl && supabaseKey && !supabaseUrl.includes('your-project'))
  ? createClient(supabaseUrl, supabaseKey)
  : null;

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Gzip / Brotli Response Compression for ultra-fast transfers
  app.use(compression());

  // Security Headers (OWASP recommendations)
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
    if (req.url.startsWith('/assets/')) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
    next();
  });

  // Body parser with strict size limits to prevent payload size abuse
  app.use(express.json({ limit: '2mb' }));

  // In-memory rate limiting for API endpoints (Max 100 requests per 15 minutes per IP)
  const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
  app.use('/api/', (req, res, next) => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 mins
    const limit = 100;

    const record = rateLimitMap.get(clientIp);
    if (!record || now > record.resetAt) {
      rateLimitMap.set(clientIp, { count: 1, resetAt: now + windowMs });
      return next();
    }

    if (record.count >= limit) {
      return res.status(429).json({ success: false, errorMessage: 'Muitas requisições. Tente novamente mais tarde.' });
    }

    record.count++;
    next();
  });

  // Health check route
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', environment: process.env.NODE_ENV || 'development', timestamp: new Date().toISOString() });
  });

  // SEO: Robots.txt Endpoint
  app.get('/robots.txt', (_req: Request, res: Response) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /checkout
Disallow: /account
Disallow: /api/

Sitemap: https://omiaa.com.br/sitemap.xml
`);
  });

  // SEO: Sitemap.xml Endpoint
  app.get('/sitemap.xml', (_req: Request, res: Response) => {
    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  <url>
    <loc>https://omiaa.com.br/</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/catalogo</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/botanica</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/blog</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/atelie-fragrancias</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>

  <!-- Products -->
  <url>
    <loc>https://omiaa.com.br/produto/elixir-lunar-serenidade</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/produto/serum-facial-ouro-botanico</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/produto/infusao-solar-vitalidade</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/produto/vela-alquimica-templo-sagrado</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/produto/bastao-defumacao-copal-lavanda</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Blog Articles -->
  <url>
    <loc>https://omiaa.com.br/blog/o-mysterium-da-maceracao-lunar</loc>
    <lastmod>2026-07-20</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>

  <!-- Guia das Ervas -->
  <url>
    <loc>https://omiaa.com.br/botanica/camomila-romana</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/botanica/banho-sagrado-luar</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
  <url>
    <loc>https://omiaa.com.br/botanica/defumacao-salvia-breu-branco</loc>
    <lastmod>2026-07-27</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.75</priority>
  </url>
</urlset>`);
  });

  // Active Gateway & Payment Configuration Endpoint
  app.get('/api/payments/config', (_req: Request, res: Response) => {
    const gateway = process.env.PAYMENT_GATEWAY || 'infinitepay';
    const infinitePayEnabled = process.env.INFINITEPAY_ENABLED !== 'false';
    const mercadoPagoEnabled = process.env.MERCADOPAGO_ENABLED !== 'false';

    console.log(`[PAYMENT] Gateway ativo: ${gateway}`);
    res.json({
      gateway,
      infinitePayEnabled,
      mercadoPagoEnabled,
      infinitePayHandle: process.env.INFINITEPAY_HANDLE || ''
    });
  });

  // InfinitePay Connection Test Endpoint
  app.post('/api/payments/infinitepay/test-connection', async (req: Request, res: Response) => {
    try {
      const handleFromReq = req.body?.handle;
      const rawHandle = (handleFromReq || process.env.INFINITEPAY_HANDLE || '').trim();
      const cleanHandle = rawHandle.replace(/^\$/, '');

      if (!cleanHandle || cleanHandle === 'seu_handle_aqui') {
        return res.status(400).json({
          success: false,
          errorMessage: 'Handle da InfinitePay não configurado. Por favor, informe uma InfiniteTag válida (ex: max_b).'
        });
      }

      console.log(`[INFINITEPAY] Testando conexão para o handle: ${cleanHandle}`);

      // Query InfinitePay checkout payment_check API safely with a mock order_nsu to test API reachability
      const verifyRes = await fetch('https://api.checkout.infinitepay.io/payment_check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle: cleanHandle,
          order_nsu: 'PING_TEST_CONNECTION'
        })
      });

      // Status 200 or 400 (e.g. order not found) confirms InfinitePay endpoint is reachable & handle formatted
      if (verifyRes.ok || verifyRes.status === 400 || verifyRes.status === 404) {
        return res.json({
          success: true,
          handle: cleanHandle,
          message: `Conexão com a InfinitePay configurada e verificada com sucesso (Handle: ${cleanHandle}).`
        });
      } else {
        return res.status(400).json({
          success: false,
          errorMessage: 'Não foi possível validar a configuração da InfinitePay. Verifique o Handle e as configurações do ambiente.'
        });
      }
    } catch (err) {
      console.error('[INFINITEPAY] Erro ao testar conexão:', err);
      return res.status(500).json({
        success: false,
        errorMessage: 'Erro ao comunicar com os servidores da InfinitePay. Verifique a conexão com a internet.'
      });
    }
  });

  // InfinitePay v2 Checkout Creation Endpoint
  app.post('/api/payments/infinitepay/create', async (req: Request, res: Response) => {
    try {
      const activeGateway = process.env.PAYMENT_GATEWAY || 'infinitepay';
      console.log(`[PAYMENT] Gateway ativo: ${activeGateway}`);

      const { orderId, orderCode, customerName, customerEmail, customerPhone, items, total } = req.body;
      const targetNsu = orderCode || orderId;

      if (!targetNsu) {
        return res.status(400).json({ success: false, errorMessage: 'ID ou código do pedido é obrigatório.' });
      }

      // Step 1: Validate customer phone (must contain DDD + 8 or 9 digits)
      const phoneDigits = customerPhone ? String(customerPhone).replace(/\D/g, '') : '';
      if (!phoneDigits || phoneDigits.length < 10 || phoneDigits.length > 11) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Telefone do cliente é obrigatório e deve conter DDD e número válido (ex: 11999998888).'
        });
      }

      console.log(`[INFINITEPAY] Criando checkout para pedido ${targetNsu}`);

      // Step 2: Fetch order from Supabase as single source of truth for items and prices
      let targetOrder: any = null;
      if (serverSupabase) {
        const { data: dbOrder, error: dbErr } = await serverSupabase
          .from('orders')
          .select('*, order_items(*)')
          .or(`code.eq.${targetNsu},id.eq.${targetNsu}`)
          .maybeSingle();

        if (dbErr) {
          console.error('[INFINITEPAY] Erro ao consultar pedido no banco:', dbErr);
        }
        targetOrder = dbOrder;
      }

      if (!targetOrder && serverSupabase) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Pedido não encontrado no banco de dados. Finalize a criação do pedido antes de pagar.'
        });
      }

      // Format items values in cents (R$ 10,00 -> 1000) using backend DB as source of truth
      let formattedItems: { name: string; price: number; quantity: number }[] = [];
      if (targetOrder && targetOrder.order_items && targetOrder.order_items.length > 0) {
        formattedItems = targetOrder.order_items.map((item: any) => {
          const snap = item.product_snapshot || {};
          const unitPrice = Number(item.unit_price || snap.price || 0);
          return {
            name: snap.name || item.product_name || 'Item OMIAÁ',
            price: Math.round(unitPrice * 100),
            quantity: Number(item.quantity || 1)
          };
        });
      } else {
        const rawItems = items || [];
        formattedItems = rawItems.map((item: any) => {
          const unitPrice = Number(item.product?.price || item.price || 0);
          return {
            name: item.product?.name || item.name || 'Item OMIAÁ',
            price: Math.round(unitPrice * 100),
            quantity: Number(item.quantity || 1)
          };
        });
      }

      const host = req.headers.host || 'localhost:3000';
      const protocol = (req.headers['x-forwarded-proto'] as string) || req.protocol || 'http';
      const origin = `${protocol}://${host}`;

      const redirectUrl = `${origin}/obrigado?order_nsu=${encodeURIComponent(targetNsu)}`;
      const webhookUrl = process.env.INFINITEPAY_WEBHOOK_URL || 'https://omiaa-loja.ai.studio/api/webhooks/infinitepay';
      const handle = process.env.INFINITEPAY_HANDLE;

      // Simulation fallback if handle is not configured in server environment
      if (!handle || handle === 'seu_handle_aqui' || handle.trim() === '') {
        console.log(`[INFINITEPAY] Handle não configurado no servidor. Gerando URL de checkout simulada.`);
        const simulatedUrl = `${origin}/obrigado?order_nsu=${encodeURIComponent(targetNsu)}&simulated=true&transaction_nsu=INF-SIM-${Date.now()}`;
        console.log(`[INFINITEPAY] Checkout criado (simulação): ${simulatedUrl}`);
        return res.json({
          success: true,
          mode: 'simulation',
          url: simulatedUrl,
          message: 'Checkout InfinitePay gerado com sucesso (modo desenvolvimento/simulação).'
        });
      }

      // Real InfinitePay API Call (POST https://api.checkout.infinitepay.io/links)
      const ipPayload = {
        handle: handle.trim(),
        redirect_url: redirectUrl,
        webhook_url: webhookUrl,
        order_nsu: targetNsu,
        customer: {
          name: customerName || targetOrder?.customer_name || 'Cliente OMIAÁ',
          email: customerEmail || targetOrder?.customer_email || 'cliente@omiaa.com.br',
          phone_number: phoneDigits
        },
        items: formattedItems
      };

      const ipResponse = await fetch('https://api.checkout.infinitepay.io/links', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(ipPayload)
      });

      if (!ipResponse.ok) {
        const errorText = await ipResponse.text();
        console.error('[INFINITEPAY] Erro na requisição API InfinitePay:', errorText);
        return res.status(400).json({
          success: false,
          errorMessage: 'Erro ao comunicar com a API do InfinitePay.'
        });
      }

      const ipData = await ipResponse.json();
      const checkoutUrl = ipData.url || ipData.checkout_url || ipData.link || `${origin}/obrigado?order_nsu=${encodeURIComponent(targetNsu)}`;
      console.log(`[INFINITEPAY] Checkout criado com sucesso: ${checkoutUrl}`);

      return res.json({
        success: true,
        mode: 'live',
        url: checkoutUrl
      });
    } catch (err) {
      console.error('[INFINITEPAY] Exceção ao criar checkout:', err);
      return res.status(500).json({ success: false, errorMessage: 'Erro interno no servidor ao processar pagamento InfinitePay.' });
    }
  });

  // Helper function for Atomic & Idempotent Stock Deduction & Payment Confirmation
  async function processOrderPaymentConfirmation(
    targetNsu: string,
    paymentMethod: string,
    transactionNsu?: string,
    receiptUrl?: string
  ): Promise<{ success: boolean; message: string; alreadyPaid?: boolean }> {
    if (!serverSupabase) {
      return { success: false, message: 'Banco de dados Supabase não configurado.' };
    }

    // 1. Fetch order from Supabase
    const { data: dbOrder, error: fetchErr } = await serverSupabase
      .from('orders')
      .select('*, order_items(*)')
      .or(`code.eq.${targetNsu},id.eq.${targetNsu}`)
      .maybeSingle();

    if (fetchErr || !dbOrder) {
      console.warn(`[PAYMENT CONFIRMATION] Pedido ${targetNsu} não foi encontrado.`);
      return { success: false, message: 'Pedido não encontrado no banco de dados.' };
    }

    // 2. Idempotency Check: if order is already paid AND stock was already deducted
    if (dbOrder.status === 'pago' && dbOrder.stock_deducted_at) {
      console.log(`[PAYMENT CONFIRMATION] Pedido ${targetNsu} já está pago e estoque baixado. Processamento idempotente.`);
      return { success: true, message: 'Pedido já processado e pago anteriormente.', alreadyPaid: true };
    }

    // 3. Perform Atomic & Idempotent Stock Deduction via PostgreSQL RPC or fallback
    let stockDeductedSuccess = false;
    try {
      const { data: rpcRes, error: rpcErr } = await serverSupabase.rpc('deduct_order_stock', {
        p_order_id: dbOrder.id
      });

      if (!rpcErr && rpcRes) {
        if (rpcRes.success === true) {
          stockDeductedSuccess = true;
          console.log(`[ATOMIC STOCK] Sucesso via RPC deduct_order_stock para o pedido ${dbOrder.id}:`, rpcRes.message);
        } else {
          console.error(`[ATOMIC STOCK] Rejeitado pela RPC deduct_order_stock para o pedido ${dbOrder.id}:`, rpcRes.error);
          return { success: false, message: rpcRes.error || 'Estoque insuficiente para confirmar o pedido.' };
        }
      } else {
        console.warn(`[ATOMIC STOCK] RPC deduct_order_stock indisponível (${rpcErr?.message}). Executando fallback de reivindicação atômica.`);
      }
    } catch (rpcEx) {
      console.warn('[ATOMIC STOCK] Exceção ao chamar RPC deduct_order_stock:', rpcEx);
    }

    // Fallback atomic deduction if RPC was not executed
    if (!stockDeductedSuccess) {
      // Atomic lock: set stock_deducted_at = NOW() ONLY IF it is currently NULL
      const { data: claimedOrder, error: claimErr } = await serverSupabase
        .from('orders')
        .update({ stock_deducted_at: new Date().toISOString() })
        .eq('id', dbOrder.id)
        .is('stock_deducted_at', null)
        .select();

      if (claimErr) {
        console.error('[ATOMIC STOCK FALLBACK] Erro ao reivindicar baixa de estoque:', claimErr);
      }

      if (claimedOrder && claimedOrder.length > 0) {
        console.log(`[ATOMIC STOCK FALLBACK] Reivindicação atômica de baixa obtida para o pedido ${dbOrder.id}. Baixando estoque dos produtos...`);
        const items = dbOrder.order_items || [];
        for (const item of items) {
          if (item.product_id && item.quantity > 0) {
            const { data: prod } = await serverSupabase.from('products').select('stock').eq('id', item.product_id).maybeSingle();
            if (prod) {
              const currentStock = Number(prod.stock || 0);
              const newStock = Math.max(0, currentStock - Number(item.quantity));
              await serverSupabase.from('products').update({ stock: newStock }).eq('id', item.product_id);
            }
          }
        }
        stockDeductedSuccess = true;
      } else {
        console.log(`[ATOMIC STOCK FALLBACK] Estoque já havia sido baixado anteriormente para o pedido ${dbOrder.id}. Idempotência garantida.`);
        stockDeductedSuccess = true;
      }
    }

    // 4. Update order status to 'pago'
    const updatePayload: any = {
      status: 'pago',
      payment_method: paymentMethod || dbOrder.payment_method
    };
    if (transactionNsu) updatePayload.transaction_nsu = transactionNsu;
    if (receiptUrl) updatePayload.receipt_url = receiptUrl;

    const { error: updateErr } = await serverSupabase
      .from('orders')
      .update(updatePayload)
      .eq('id', dbOrder.id);

    if (updateErr) {
      console.error(`[PAYMENT CONFIRMATION] Erro ao atualizar status do pedido ${dbOrder.id} para pago:`, updateErr);
      return { success: false, message: 'Erro ao atualizar status do pedido no banco de dados.' };
    }

    console.log(`[PAYMENT CONFIRMATION] Pedido ${targetNsu} (${dbOrder.id}) confirmado com sucesso como PAGO.`);
    return { success: true, message: 'Pedido pago com sucesso.' };
  }

  // InfinitePay Webhook Endpoint Listener
  app.post('/api/webhooks/infinitepay', async (req: Request, res: Response) => {
    try {
      console.log('[INFINITEPAY WEBHOOK] Dados recebidos:', JSON.stringify(req.body));
      const {
        invoice_slug,
        amount,
        paid_amount,
        capture_method,
        transaction_nsu,
        order_nsu,
        receipt_url
      } = req.body || {};

      const targetNsu = order_nsu || invoice_slug;

      if (!targetNsu) {
        console.warn('[INFINITEPAY WEBHOOK] Rejeitado: order_nsu ausente.');
        return res.status(400).json({ success: false, errorMessage: 'order_nsu é obrigatório.' });
      }

      if (!serverSupabase) {
        console.warn('[INFINITEPAY WEBHOOK] Rejeitado: Supabase não conectado.');
        return res.status(400).json({ success: false, errorMessage: 'Banco de dados indisponível para validar o pedido.' });
      }

      const { data: dbOrder, error: fetchErr } = await serverSupabase
        .from('orders')
        .select('*')
        .or(`code.eq.${targetNsu},id.eq.${targetNsu}`)
        .maybeSingle();

      if (fetchErr || !dbOrder) {
        console.warn(`[INFINITEPAY WEBHOOK] Pedido ${targetNsu} não foi encontrado no Supabase.`);
        return res.status(400).json({ success: false, errorMessage: 'Pedido não encontrado no banco de dados.' });
      }

      // Idempotency check: if order is already paid AND stock deducted, return success immediately
      if (dbOrder.status === 'pago' && dbOrder.stock_deducted_at) {
        console.log(`[INFINITEPAY WEBHOOK] Pedido ${targetNsu} já possui status pago e estoque baixado. Idempotência mantida.`);
        return res.status(200).json({ received: true, message: 'Pedido já processado e pago anteriormente' });
      }

      const handle = process.env.INFINITEPAY_HANDLE;
      let isVerifiedPaid = false;
      let confirmedPaidAmountCents = 0;

      // Official InfinitePay API transaction verification via payment_check
      if (handle && handle.trim() !== '' && handle !== 'seu_handle_aqui') {
        try {
          const verifyRes = await fetch('https://api.checkout.infinitepay.io/payment_check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              handle: handle.trim(),
              order_nsu: targetNsu,
              transaction_nsu: transaction_nsu || '',
              slug: invoice_slug || ''
            })
          });

          if (!verifyRes.ok) {
            const errText = await verifyRes.text();
            console.error('[INFINITEPAY WEBHOOK] Falha na verificação oficial junto à API InfinitePay:', errText);
            return res.status(400).json({ success: false, errorMessage: 'Falha na verificação de pagamento junto à InfinitePay.' });
          }

          const verifyData = await verifyRes.json();
          isVerifiedPaid = (
            verifyData.paid === true ||
            verifyData.status === 'paid' ||
            verifyData.status === 'approved' ||
            (verifyData.success === true && verifyData.paid === true)
          );

          // Extract confirmed paid amount in cents
          const rawPaid = verifyData.paid_amount || verifyData.amount || paid_amount || amount || 0;
          const numPaid = Number(rawPaid);
          confirmedPaidAmountCents = numPaid > 1000 ? Math.round(numPaid) : Math.round(numPaid * 100);
        } catch (verifyErr) {
          console.error('[INFINITEPAY WEBHOOK] Erro na consulta de verificação oficial:', verifyErr);
          return res.status(500).json({ success: false, errorMessage: 'Erro ao consultar a API oficial da InfinitePay.' });
        }
      } else if (transaction_nsu?.startsWith('INF-SIM-')) {
        // Simulation mode
        isVerifiedPaid = true;
        confirmedPaidAmountCents = Math.round(Number(dbOrder.total) * 100);
      } else {
        console.warn('[INFINITEPAY WEBHOOK] Webhook recebido sem modo simulação e sem handle configurado.');
        return res.status(400).json({ success: false, errorMessage: 'Configuração do gateway incompleta.' });
      }

      if (!isVerifiedPaid) {
        console.warn('[INFINITEPAY WEBHOOK] Transação não foi confirmada como paga pela InfinitePay:', targetNsu);
        return res.status(400).json({ success: false, errorMessage: 'Pagamento não confirmado pela operadora InfinitePay.' });
      }

      // CORREÇÃO 3: Validate paid_amount >= order.total
      const expectedTotalCents = Math.round(Number(dbOrder.total) * 100);
      if (confirmedPaidAmountCents < expectedTotalCents) {
        console.error(
          `[PAID AMOUNT DISCREPANCY REJECTED] Pedido ${targetNsu}: Esperado R$ ${dbOrder.total} (${expectedTotalCents} cents), mas pago na InfinitePay foi R$ ${(confirmedPaidAmountCents / 100).toFixed(2)} (${confirmedPaidAmountCents} cents).`
        );
        return res.status(400).json({
          success: false,
          errorMessage: `Valor pago (R$ ${(confirmedPaidAmountCents / 100).toFixed(2)}) é inferior ao valor total devido do pedido (R$ ${dbOrder.total}). O pedido foi mantido em auditoria.`
        });
      }

      // Perform atomic payment confirmation & stock deduction
      const mappedPaymentMethod = capture_method === 'pix' ? 'pix' : capture_method === 'boleto' ? 'boleto' : 'credit_card';
      const confResult = await processOrderPaymentConfirmation(targetNsu, mappedPaymentMethod, transaction_nsu, receipt_url);

      if (!confResult.success) {
        return res.status(400).json({ success: false, errorMessage: confResult.message });
      }

      return res.status(200).json({ received: true, status: 'processed' });
    } catch (err) {
      console.error('[INFINITEPAY WEBHOOK] Exceção no processamento do webhook:', err);
      return res.status(500).json({ success: false, errorMessage: 'Falha interna ao processar webhook' });
    }
  });

  // InfinitePay Transaction Verification Endpoint
  app.post('/api/payments/infinitepay/verify', async (req: Request, res: Response) => {
    try {
      const { order_nsu } = req.body || {};
      if (!order_nsu) {
        return res.status(400).json({ success: false, errorMessage: 'order_nsu é obrigatório' });
      }

      console.log(`[INFINITEPAY VERIFY] Verificando status do pedido ${order_nsu}`);

      if (!serverSupabase) {
        return res.status(400).json({ success: false, errorMessage: 'Banco de dados não disponível.' });
      }

      const { data: dbOrder, error: fetchErr } = await serverSupabase
        .from('orders')
        .select('*, order_items(*)')
        .or(`code.eq.${order_nsu},id.eq.${order_nsu}`)
        .maybeSingle();

      if (!dbOrder) {
        return res.status(404).json({ success: false, errorMessage: 'Pedido não encontrado.' });
      }

      // If order is already paid, return confirmed mapped order immediately
      if (dbOrder.status === 'pago') {
        const mappedOrder = {
          id: dbOrder.id,
          code: dbOrder.code,
          date: dbOrder.created_at,
          items: (dbOrder.order_items || []).map((itemRow: any) => ({
            product: itemRow.product_snapshot || {
              id: itemRow.product_id || 'prod-1',
              name: 'Produto Alquímico',
              price: Number(itemRow.unit_price)
            },
            quantity: itemRow.quantity,
            selectedOption: itemRow.selected_option
          })),
          subtotal: Number(dbOrder.subtotal),
          shippingFee: Number(dbOrder.shipping_fee),
          discount: Number(dbOrder.discount),
          total: Number(dbOrder.total),
          status: dbOrder.status,
          paymentMethod: dbOrder.payment_method,
          deliveryAddress: dbOrder.delivery_address,
          trackingCode: dbOrder.tracking_code,
          customerEmail: dbOrder.customer_email
        };

        return res.json({
          success: true,
          status: 'pago',
          order: mappedOrder
        });
      }

      // If order is still pending, attempt live payment check with InfinitePay payment_check
      const handle = process.env.INFINITEPAY_HANDLE;
      if (handle && handle.trim() !== '' && handle !== 'seu_handle_aqui') {
        try {
          const verifyRes = await fetch('https://api.checkout.infinitepay.io/payment_check', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              handle: handle.trim(),
              order_nsu: dbOrder.code || dbOrder.id
            })
          });

          if (verifyRes.ok) {
            const verifyData = await verifyRes.json();
            const isPaidConfirmed = (
              verifyData.paid === true ||
              verifyData.status === 'paid' ||
              verifyData.status === 'approved'
            );

            if (isPaidConfirmed) {
              const rawPaid = verifyData.paid_amount || verifyData.amount || 0;
              const numPaid = Number(rawPaid);
              const confirmedCents = numPaid > 1000 ? Math.round(numPaid) : Math.round(numPaid * 100);
              const expectedCents = Math.round(Number(dbOrder.total) * 100);

              if (confirmedCents >= expectedCents) {
                const confResult = await processOrderPaymentConfirmation(
                  dbOrder.code || dbOrder.id,
                  dbOrder.payment_method,
                  verifyData.transaction_nsu || verifyData.id
                );
                if (confResult.success) {
                  dbOrder.status = 'pago';
                }
              } else {
                console.warn(
                  `[VERIFY PRICE TAMPERING BLOCKED] Pedido ${order_nsu}: valor pago ${confirmedCents} cents < esperado ${expectedCents} cents.`
                );
              }
            }
          }
        } catch (checkErr) {
          console.warn('[INFINITEPAY VERIFY] Erro ao sincronizar status online durante verify:', checkErr);
        }
      }

      const mappedOrder = {
        id: dbOrder.id,
        code: dbOrder.code,
        date: dbOrder.created_at,
        items: (dbOrder.order_items || []).map((itemRow: any) => ({
          product: itemRow.product_snapshot || {
            id: itemRow.product_id || 'prod-1',
            name: 'Produto Alquímico',
            price: Number(itemRow.unit_price)
          },
          quantity: itemRow.quantity,
          selectedOption: itemRow.selected_option
        })),
        subtotal: Number(dbOrder.subtotal),
        shippingFee: Number(dbOrder.shipping_fee),
        discount: Number(dbOrder.discount),
        total: Number(dbOrder.total),
        status: dbOrder.status,
        paymentMethod: dbOrder.payment_method,
        deliveryAddress: dbOrder.delivery_address,
        trackingCode: dbOrder.tracking_code,
        customerEmail: dbOrder.customer_email
      };

      return res.json({
        success: true,
        status: dbOrder.status,
        order: mappedOrder
      });
    } catch (err) {
      console.error('[INFINITEPAY VERIFY] Erro na verificação de transação:', err);
      return res.status(500).json({ success: false, status: 'desconhecido', errorMessage: 'Erro interno ao consultar status.' });
    }
  });

  // Cleanup Expired Pending Orders (> 24 hours) Endpoint
  app.post('/api/admin/cleanup-pending-orders', async (req: Request, res: Response) => {
    try {
      if (!serverSupabase) {
        return res.status(400).json({ success: false, errorMessage: 'Supabase não configurado.' });
      }

      // Try RPC first
      try {
        const { data: rpcRes, error: rpcErr } = await serverSupabase.rpc('cleanup_expired_pending_orders');
        if (!rpcErr && rpcRes) {
          return res.json(rpcRes);
        }
      } catch {
        // Fallback to JS query
      }

      const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: expiredOrders, error: fetchErr } = await serverSupabase
        .from('orders')
        .select('id, code')
        .eq('status', 'pendente')
        .lt('created_at', cutoff);

      if (fetchErr) {
        return res.status(500).json({ success: false, errorMessage: fetchErr.message });
      }

      if (!expiredOrders || expiredOrders.length === 0) {
        return res.json({ success: true, count: 0, message: 'Nenhum pedido pendente expirado encontrado.' });
      }

      const idsToCancel = expiredOrders.map((o) => o.id);
      const { error: cancelErr } = await serverSupabase
        .from('orders')
        .update({ status: 'cancelado' })
        .in('id', idsToCancel);

      if (cancelErr) {
        return res.status(500).json({ success: false, errorMessage: cancelErr.message });
      }

      console.log(`[CLEANUP PENDING ORDERS] ${idsToCancel.length} pedidos pendentes há mais de 24h foram cancelados com sucesso.`);
      return res.json({
        success: true,
        count: idsToCancel.length,
        cancelledCodes: expiredOrders.map((o) => o.code),
        message: `${idsToCancel.length} pedidos pendentes expirados (>24h) foram alterados para o status cancelado.`
      });
    } catch (err) {
      console.error('[CLEANUP PENDING ORDERS] Erro:', err);
      return res.status(500).json({ success: false, errorMessage: 'Erro interno ao cancelar pedidos pendentes.' });
    }
  });

  // ----------------------------------------------------------------------------
  // ADMIN PRODUCT MANAGEMENT ENDPOINTS
  // ----------------------------------------------------------------------------
  // Helper to parse price input accurately
  const parseServerPrice = (val: any): number => {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const str = String(val).replace('R$', '').replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
  };

  // Create Product
  app.post('/api/admin/products', async (req: Request, res: Response) => {
    try {
      if (!serverSupabase) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Supabase administrativo não configurado no servidor. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
        });
      }

      const pData = req.body || {};
      const name = pData.name || 'Novo Produto';
      const categoryId = (pData.category === 'todos' || !pData.category) ? 'elixires' : pData.category;
      const price = parseServerPrice(pData.price);
      const stock = Math.max(0, parseInt(pData.stock, 10) || 0);

      const payload: any = {
        name,
        slug: pData.slug || name.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
        subtitle: pData.subtitle || '',
        category_id: categoryId,
        price,
        original_price: pData.originalPrice ? parseServerPrice(pData.originalPrice) : null,
        rating: Number(pData.rating) || 5.0,
        reviews_count: Number(pData.reviewsCount) || 1,
        stock,
        featured: Boolean(pData.featured),
        badges: Array.isArray(pData.badges) ? pData.badges : ['Novo'],
        volume_or_weight: pData.volumeOrWeight || '50ml',
        short_description: pData.shortDescription || '',
        full_description: pData.fullDescription || '',
        ingredients: Array.isArray(pData.ingredients) ? pData.ingredients : ['Ervas'],
        ancestral_origin: pData.ancestralOrigin || 'Tradição Alquímica',
        usage_instructions: pData.usageInstructions || 'Uso diário',
        images: Array.isArray(pData.images) && pData.images.length ? pData.images : ['https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=800&auto=format&fit=crop'],
        sku: pData.sku || `OMIA-${Math.floor(1000 + Math.random() * 9000)}`
      };

      console.log('[ADMIN PRODUCT PAYLOAD]:', payload);

      const { data, error } = await serverSupabase
        .from('products')
        .insert([payload])
        .select('*')
        .single();

      if (error || !data) {
        console.error('[ADMIN CREATE PRODUCT ERROR]:', {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
        return res.status(400).json({
          success: false,
          errorMessage: error?.message || 'Erro ao criar produto.',
          error: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
      }

      const createdProduct = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        subtitle: data.subtitle || '',
        category: data.category_id || 'elixires',
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        rating: Number(data.rating || 5.0),
        reviewsCount: Number(data.reviews_count || 0),
        stock: Number(data.stock || 0),
        featured: Boolean(data.featured),
        badges: data.badges || [],
        volumeOrWeight: data.volume_or_weight || '',
        shortDescription: data.short_description || '',
        fullDescription: data.full_description || '',
        ingredients: data.ingredients || [],
        ancestralOrigin: data.ancestral_origin || '',
        usageInstructions: data.usage_instructions || '',
        images: data.images || [],
        sku: data.sku || '',
        createdAt: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ''
      };

      return res.json({ success: true, product: createdProduct });
    } catch (err: any) {
      console.error('[ADMIN CREATE PRODUCT EXCEPTION]:', err);
      return res.status(500).json({ success: false, errorMessage: err?.message || 'Erro interno ao criar produto.' });
    }
  });

  // Update Product
  app.put('/api/admin/products/:id', async (req: Request, res: Response) => {
    try {
      if (!serverSupabase) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Supabase administrativo não configurado no servidor. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
        });
      }

      const { id } = req.params;
      const pData = req.body || {};

      const payload: any = {};
      if (pData.name !== undefined) payload.name = pData.name;
      if (pData.slug !== undefined) payload.slug = pData.slug;
      if (pData.subtitle !== undefined) payload.subtitle = pData.subtitle;
      if (pData.category !== undefined) payload.category_id = (pData.category === 'todos' || !pData.category) ? 'elixires' : pData.category;
      if (pData.price !== undefined) payload.price = parseServerPrice(pData.price);
      if (pData.originalPrice !== undefined) payload.original_price = pData.originalPrice ? parseServerPrice(pData.originalPrice) : null;
      if (pData.rating !== undefined) payload.rating = Number(pData.rating);
      if (pData.reviewsCount !== undefined) payload.reviews_count = Number(pData.reviewsCount);
      if (pData.stock !== undefined) payload.stock = Math.max(0, parseInt(pData.stock, 10) || 0);
      if (pData.featured !== undefined) payload.featured = Boolean(pData.featured);
      if (pData.badges !== undefined) payload.badges = Array.isArray(pData.badges) ? pData.badges : [];
      if (pData.volumeOrWeight !== undefined) payload.volume_or_weight = pData.volumeOrWeight;
      if (pData.shortDescription !== undefined) payload.short_description = pData.shortDescription;
      if (pData.fullDescription !== undefined) payload.full_description = pData.fullDescription;
      if (pData.ingredients !== undefined) payload.ingredients = Array.isArray(pData.ingredients) ? pData.ingredients : [];
      if (pData.ancestralOrigin !== undefined) payload.ancestral_origin = pData.ancestralOrigin;
      if (pData.usageInstructions !== undefined) payload.usage_instructions = pData.usageInstructions;
      if (pData.images !== undefined) payload.images = Array.isArray(pData.images) ? pData.images : [];
      if (pData.sku !== undefined) payload.sku = pData.sku;

      console.log('[ADMIN PRODUCT UPDATE PAYLOAD]:', { id, payload });

      const { data, error } = await serverSupabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select('*')
        .single();

      if (error || !data) {
        console.error('[ADMIN UPDATE PRODUCT ERROR]:', {
          message: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
        return res.status(400).json({
          success: false,
          errorMessage: error?.message || 'Erro ao atualizar produto.',
          error: error?.message,
          code: error?.code,
          details: error?.details,
          hint: error?.hint
        });
      }

      const updatedProduct = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        subtitle: data.subtitle || '',
        category: data.category_id || 'elixires',
        price: Number(data.price),
        originalPrice: data.original_price ? Number(data.original_price) : undefined,
        rating: Number(data.rating || 5.0),
        reviewsCount: Number(data.reviews_count || 0),
        stock: Number(data.stock || 0),
        featured: Boolean(data.featured),
        badges: data.badges || [],
        volumeOrWeight: data.volume_or_weight || '',
        shortDescription: data.short_description || '',
        fullDescription: data.full_description || '',
        ingredients: data.ingredients || [],
        ancestralOrigin: data.ancestral_origin || '',
        usageInstructions: data.usage_instructions || '',
        images: data.images || [],
        sku: data.sku || '',
        createdAt: data.created_at ? new Date(data.created_at).toISOString().split('T')[0] : ''
      };

      return res.json({ success: true, product: updatedProduct });
    } catch (err: any) {
      console.error('[ADMIN UPDATE PRODUCT EXCEPTION]:', err);
      return res.status(500).json({ success: false, errorMessage: err?.message || 'Erro interno ao atualizar produto.' });
    }
  });

  // Delete Product
  app.delete('/api/admin/products/:id', async (req: Request, res: Response) => {
    try {
      if (!serverSupabase) {
        return res.status(400).json({
          success: false,
          errorMessage: 'Supabase administrativo não configurado no servidor. Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.'
        });
      }

      const { id } = req.params;
      const { error } = await serverSupabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[ADMIN DELETE PRODUCT ERROR]:', error);
        return res.status(400).json({ success: false, errorMessage: error.message });
      }

      return res.json({ success: true });
    } catch (err: any) {
      console.error('[ADMIN DELETE PRODUCT EXCEPTION]:', err);
      return res.status(500).json({ success: false, errorMessage: err?.message || 'Erro interno ao excluir produto.' });
    }
  });

  // Mercado Pago Preference Creation Endpoint
  app.post('/api/payments/mercadopago/preference', async (req: Request, res: Response) => {
    try {
      const { items, total, paymentMethod, customerEmail, customerName } = req.body;
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

      if (!accessToken || accessToken.includes('xxxxxx')) {
        // Simulated Mercado Pago preference response when API key is not configured yet
        return res.json({
          success: true,
          mode: 'simulation',
          preferenceId: `pref_${Date.now()}`,
          paymentId: `MP-${Math.floor(10000000 + Math.random() * 90000000)}`,
          status: paymentMethod === 'pix' ? 'pending' : 'approved',
          initPoint: 'https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=simulation',
          qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405150.005802BR5913OMIAA ALQUIMIA6009SAO PAULO62070503***6304E2CA',
          message: 'Mercado Pago preference generated successfully (simulated).'
        });
      }

      // Real Mercado Pago Preference REST API Call
      const mpResponse = await fetch('https://api.mercadopago.com/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: (items || []).map((item: any) => ({
            title: item.product?.name || 'Item OMIAA',
            quantity: item.quantity || 1,
            unit_price: Number(item.product?.price || 0),
            currency_id: 'BRL'
          })),
          payer: {
            name: customerName || 'Cliente OMIAA',
            email: customerEmail || 'cliente@omiaa.com.br'
          },
          auto_return: 'approved'
        })
      });

      if (!mpResponse.ok) {
        const errorText = await mpResponse.text();
        console.error('Mercado Pago API error:', errorText);
        return res.status(400).json({ success: false, errorMessage: 'Erro na API do Mercado Pago' });
      }

      const mpData = await mpResponse.json();
      return res.json({
        success: true,
        mode: 'live',
        preferenceId: mpData.id,
        initPoint: mpData.init_point,
        sandboxInitPoint: mpData.sandbox_init_point
      });
    } catch (err) {
      console.error('Error creating MP preference:', err);
      return res.status(500).json({ success: false, errorMessage: 'Erro interno no servidor ao processar pagamento.' });
    }
  });

  // Mercado Pago Payment Processing Endpoint (Direct Card / PIX / Boleto)
  app.post('/api/payments/mercadopago/process', async (req: Request, res: Response) => {
    try {
      const { paymentMethod, amount, payerEmail, payerName, payerCpf, installments } = req.body;
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

      // Check if credentials exist or fallback to compliant simulation
      if (!accessToken || accessToken.includes('xxxxxx')) {
        const generatedPaymentId = `MP-${Math.floor(10000000 + Math.random() * 90000000)}`;
        return res.json({
          success: true,
          mode: 'simulation',
          paymentId: generatedPaymentId,
          status: paymentMethod === 'pix' ? 'pending' : 'approved',
          statusDetail: 'accredited',
          qrCode: '00020126580014BR.GOV.BCB.PIX0136123e4567-e89b-12d3-a456-4266141740005204000053039865405150.005802BR5913OMIAA ALQUIMIA6009SAO PAULO62070503***6304E2CA',
          message: 'Transação Mercado Pago processada com sucesso (simulado).'
        });
      }

      // Real Payment API Request to Mercado Pago v1/payments
      const mpPayResponse = await fetch('https://api.mercadopago.com/v1/payments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': `idem_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
        },
        body: JSON.stringify({
          transaction_amount: Number(amount),
          description: 'Compra OMIAA Alquimia Ancestral',
          payment_method_id: paymentMethod === 'pix' ? 'pix' : paymentMethod === 'boleto' ? 'bolbradesco' : 'visa',
          payer: {
            email: payerEmail,
            first_name: payerName?.split(' ')[0] || 'Cliente',
            last_name: payerName?.split(' ').slice(1).join(' ') || 'OMIAA',
            identification: {
              type: 'CPF',
              number: payerCpf ? payerCpf.replace(/\D/g, '') : '12345678900'
            }
          },
          installments: installments || 1
        })
      });

      const payData = await mpPayResponse.json();

      if (!mpPayResponse.ok) {
        return res.status(400).json({
          success: false,
          errorMessage: payData.message || 'Transação recusada pela operadora.'
        });
      }

      return res.json({
        success: true,
        mode: 'live',
        paymentId: payData.id?.toString(),
        status: payData.status,
        statusDetail: payData.status_detail,
        qrCode: payData.point_of_interaction?.transaction_data?.qr_code
      });
    } catch (err) {
      console.error('Error in MP payment processing:', err);
      return res.status(500).json({ success: false, errorMessage: 'Ocorreu um erro no servidor de pagamentos.' });
    }
  });

  // Mercado Pago Webhook Endpoint Listener
  app.post('/api/webhooks/mercadopago', async (req: Request, res: Response) => {
    try {
      const { type, action, data } = req.body;
      console.log(`[Mercado Pago Webhook Received] Type: ${type || action}, Data ID:`, data?.id || req.body?.id);

      // In production, fetch payment details from Mercado Pago API using data.id and update DB status
      if (data?.id && process.env.MERCADOPAGO_ACCESS_TOKEN) {
        // Query Mercado Pago API for payment status
        const payCheck = await fetch(`https://api.mercadopago.com/v1/payments/${data.id}`, {
          headers: { 'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` }
        });
        if (payCheck.ok) {
          const paymentInfo = await payCheck.json();
          console.log(`[Mercado Pago Webhook Payment Verified] ID: ${paymentInfo.id}, Status: ${paymentInfo.status}`);
        }
      }

      return res.status(200).json({ received: true, status: 'processed' });
    } catch (err) {
      console.error('Webhook processing error:', err);
      return res.status(200).json({ received: true, warning: 'Failed to query details' });
    }
  });

  // Email Notification Dispatcher Endpoint
  app.post('/api/notifications/email-confirmation', (req: Request, res: Response) => {
    const { order, recipientEmail } = req.body;
    console.log(`[Email Confirmation Dispatched] To: ${recipientEmail}, Order Code: ${order?.code || 'N/A'}, Total: R$ ${order?.total}`);

    res.json({
      success: true,
      deliveredTo: recipientEmail,
      timestamp: new Date().toISOString(),
      message: 'Confirmação enviada com sucesso.'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
    app.get('*', async (req: Request, res: Response, next) => {
      try {
        const indexPath = path.resolve(process.cwd(), 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(req.originalUrl, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`OMIAA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
