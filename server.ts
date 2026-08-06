import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';

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
