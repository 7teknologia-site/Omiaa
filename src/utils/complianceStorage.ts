import {
  LegalDocument,
  LegalDocumentId,
  DocumentVersionHistory,
  UserConsentRecord,
  DataSubjectRequest,
  SubjectRequestType,
  SubjectRequestStatus,
  AdminAuditLog,
  AuditLogCategory,
  SecurityStatus,
  BackupRecord
} from '../types/compliance';
import { exportToCSV } from '../features/admin/utils/csvExporter';

const STORAGE_KEYS = {
  DOCUMENTS: 'omiaa_compliance_legal_documents_v1',
  CONSENTS: 'omiaa_compliance_user_consents_v1',
  SUBJECT_REQUESTS: 'omiaa_compliance_lgpd_requests_v1',
  AUDIT_LOGS: 'omiaa_compliance_admin_audit_logs_v1',
  SECURITY: 'omiaa_compliance_security_status_v1',
  BACKUPS: 'omiaa_compliance_backups_v1'
};

// ============================================================================
// DEFAULT LEGAL DOCUMENTS (COMPLETE & PROFESSIONAL COPY IN PORTUGUESE)
// ============================================================================
export const DEFAULT_LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: 'privacy-policy',
    type: 'privacy-policy',
    title: 'Política de Privacidade e Proteção de Dados (LGPD)',
    summary: 'Diretrizes sobre como a Omiaá Alquimia Ancestral coleta, utiliza, armazena e protege seus dados pessoais de acordo com a Lei 13.709/2018 (LGPD).',
    version: '1.2.0',
    publishedAt: '2026-01-15',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'DPO / Encarregado de Dados Omiaá',
    content: `
<h2>1. Introdução e Compromisso com a Privacidade</h2>
<p>A <strong>Omiaá Alquimia Ancestral Ltda</strong> ("Omiaá"), inscrita no CNPJ/MF sob o nº 12.345.678/0001-90, com sede em São Paulo/SP, valoriza a transparência, a segurança e a proteção de dados pessoais de seus clientes, visitantes e parceiros. Esta Política de Privacidade descreve de maneira objetiva como tratamos suas informações em conformidade com a Lei Geral de Proteção de Dados Pessoais (Lei Federal nº 13.709/2018 - LGPD).</p>

<h2>2. Dados Pessoais Coletados e Finalidades</h2>
<p>Coletamos apenas os dados estritamente necessários para oferecer nossos elixires, cosméticos botânicos e serviços de atendimento:</p>
<ul>
  <li><strong>Dados de Identificação e Contato:</strong> Nome completo, e-mail, telefone/WhatsApp, CPF e data de nascimento — para emissão de notas fiscais, processamento de pedidos e autenticação da conta.</li>
  <li><strong>Dados de Entrega:</strong> Endereço completo com CEP e complementos — para cálculo de frete e envio via Correios / transportadoras parceiras.</li>
  <li><strong>Dados Financeiros e de Pagamento:</strong> Informações de cartão de crédito e PIX — processadas diretamente por gateways de pagamento homologados (Mercado Pago / Pagar.me) sob criptografia SSL de 256 bits. A Omiaá <em>não</em> armazena dados sensíveis de cartão de crédito em seus servidores.</li>
  <li><strong>Dados de Navegação e Cookies:</strong> Endereço IP, tipo de navegador, páginas visitadas e preferências alquímicas — coletados de forma anônima mediante seu consentimento expresso.</li>
</ul>

<h2>3. Base Legal para o Tratamento</h2>
<p>O tratamento dos seus dados ocorre fundamentado nas seguintes hipóteses legais da LGPD (Art. 7º):</p>
<ol>
  <li><strong>Execução de Contrato (Art. 7º, V):</strong> Para processamento e entrega das compras efetuadas no e-commerce.</li>
  <li><strong>Cumprimento de Obrigação Legal ou Regulatória (Art. 7º, II):</strong> Para emissão de notas fiscais e obrigações tributárias.</li>
  <li><strong>Consentimento do Titular (Art. 7º, I):</strong> Para envio de newsletters, ofertas personalizadas e cookies de marketing.</li>
  <li><strong>Legítimo Interesse (Art. 7º, IX):</strong> Para melhoria contínua da navegação, prevenção de fraudes e suporte ao cliente.</li>
</ol>

<h2>4. Compartilhamento Seguro de Dados</h2>
<p>Seus dados pessoais não serão vendidos ou comercializados sob nenhuma hipótese. O compartilhamento ocorre estritamente com parceiros indispensáveis à prestação do serviço:</p>
<ul>
  <li><strong>Transportadoras e Correios:</strong> Para efetuar a entrega física dos produtos comprados.</li>
  <li><strong>Processadores de Pagamento:</strong> Para validação e liquidação financeira do pedido.</li>
  <li><strong>Plataformas de Emissão de Nota Fiscal:</strong> Para cumprimento das obrigações fiscais brasileiras.</li>
  <li><strong>Ferramentas de E-mail Marketing (caso autorizado):</strong> Para envio do boletim alchemical quinzenal.</li>
</ul>

<h2>5. Seus Direitos como Titular de Dados (Art. 18 da LGPD)</h2>
<p>Você tem o direito de solicitar a qualquer momento, através da nossa Central de Conformidade:</p>
<ul>
  <li>Confirmação da existência de tratamento e acesso aos seus dados;</li>
  <li>Correção de dados incompletos, inexatos ou desatualizados;</li>
  <li>Anonimização, bloqueio ou eliminação de dados desnecessários;</li>
  <li>Portabilidade dos dados a outro fornecedor de serviço;</li>
  <li>Eliminação dos dados pessoais tratados com o seu consentimento;</li>
  <li>Revogação do consentimento concedido anteriormente.</li>
</ul>

<h2>6. Retenção e Segurança das Informações</h2>
<p>Adotamos medidas técnicas e administrativas aptas a proteger seus dados contra acessos não autorizados, vazamentos, destruição ou alteração. Seus dados serão mantidos pelo tempo necessário para cumprir as finalidades contratadas ou exigências legais e fiscais.</p>

<h2>7. Encarregado de Proteção de Dados (DPO)</h2>
<p>Para exercer seus direitos ou esclarecer dúvidas sobre esta Política, entre em contato com nosso Encarregado de Dados:</p>
<p><strong>E-mail do DPO:</strong> dpo@omiaa.com.br<br /><strong>Endereço:</strong> Alameda das Camomilas, 108 — São Paulo/SP</p>
    `,
    history: [
      {
        id: 'h1',
        version: '1.0.0',
        title: 'Política de Privacidade e Proteção de Dados (LGPD)',
        summary: 'Versão inicial de lançamento do e-commerce Omiaá.',
        content: '<p>Versão inicial simplificada de privacidade.</p>',
        updatedAt: '2025-09-10',
        updatedBy: 'Atendimento Jurídico',
        changeNotes: 'Criação inicial da minuta de privacidade.'
      },
      {
        id: 'h2',
        version: '1.1.0',
        title: 'Política de Privacidade e Proteção de Dados (LGPD)',
        summary: 'Inclusão de cláusulas sobre rastreamento do Meta Pixel e cookies funcionais.',
        content: '<p>Ajustes de segurança de cookies e integração de pixel.</p>',
        updatedAt: '2026-01-15',
        updatedBy: 'DPO Omiaá',
        changeNotes: 'Adequação às diretrizes da ANPD para e-commerce.'
      }
    ]
  },
  {
    id: 'cookie-policy',
    type: 'cookie-policy',
    title: 'Política de Cookies e Tecnologias de Rastreamento',
    summary: 'Explicação detalhada sobre o uso de cookies necessários, funcionais, analíticos e de marketing na loja virtual da Omiaá.',
    version: '1.1.0',
    publishedAt: '2026-02-01',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'Equipe de Segurança & TI Omiaá',
    content: `
<h2>1. O que são Cookies?</h2>
<p>Cookies são pequenos arquivos de texto armazenados no seu navegador ou dispositivo quando você visita nosso site. Eles permitem reconhecer suas preferências, garantir a segurança do checkout e oferecer uma navegação rápida e personalizada.</p>

<h2>2. Categorias de Cookies Utilizadas</h2>
<ul>
  <li><strong>Cookies Estritamente Necessários (Obrigatórios):</strong> Indispensáveis para que o e-commerce funcione. Permitem manter produtos na sacola de compras, realizar autenticação de conta e processar pagamentos seguros. Não podem ser desativados.</li>
  <li><strong>Cookies Funcionais (Opcionais):</strong> Guardam suas preferências personalizadas, como idioma, visualização da fase da lua, fragrâncias salvas e customização do avatar alchemical.</li>
  <li><strong>Cookies Analíticos (Opcionais):</strong> Utilizam ferramentas como Google Analytics 4 para contabilizar visitas, tempo de permanência e páginas populares, sem identificar individualmente os visitantes.</li>
  <li><strong>Cookies de Marketing e Redes Sociais (Opcionais):</strong> Utilizam Meta Pixel e tags de publicidade para exibir conteúdos relevantes aos seus interesses em redes sociais como Instagram e Facebook.</li>
</ul>

<h2>3. Como Gerenciar ou Alterar seus Consentimentos</h2>
<p>Você pode alterar suas preferências de cookies a qualquer momento clicando no link <strong>"Configurações de Privacidade (LGPD)"</strong> localizado no rodapé do nosso site ou limpando o cachê do seu navegador.</p>
    `,
    history: []
  },
  {
    id: 'terms-of-use',
    type: 'terms-of-use',
    title: 'Termos e Condições Gerais de Uso',
    summary: 'Regras, direitos e obrigações que regem a navegação, compra de elixires cosméticos e utilização da plataforma Omiaá.',
    version: '1.0.0',
    publishedAt: '2026-01-01',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'Departamento Jurídico Omiaá',
    content: `
<h2>1. Aceitação dos Termos</h2>
<p>Ao navegar ou efetuar compras na plataforma da <strong>Omiaá Alquimia Ancestral</strong>, você concorda expressamente com estes Termos e Condições Gerais de Uso. Caso não concorde com qualquer disposição, solicitamos que não utilize nossos serviços.</p>

<h2>2. Cadastro e Responsabilidade de Acesso</h2>
<p>O cliente é responsável por fornecer informações exatas, atuais e completas durante o cadastro e garantir a confidencialidade de suas credenciais de acesso (e-mail e senha).</p>

<h2>3. Propriedade Intelectual</h2>
<p>Todo o conteúdo do site — incluindo textos, ilustrações de botânica, logotipos, fórmulas conceituais de fragrâncias, fotografias e design de interface — é de propriedade exclusiva da Omiaá ou de seus licenciantes, protegido pela legislação brasileira de propriedade intelectual.</p>

<h2>4. Preços, Promoções e Disponibilidade</h2>
<p>Os preços e promoções apresentados no site são válidos exclusivamente para compras efetuadas online e sujeitos a alteração sem aviso prévio. Os estoques de matérias-primas botânicas e elixires artesanais são limitados.</p>

<h2>5. Foro e Legislação Aplicável</h2>
<p>Estes Termos são regidos pelas leis da República Federativa do Brasil. Fica eleito o Foro da Comarca de São Paulo/SP para dirimir quaisquer controvérsias decorrentes deste contrato.</p>
    `,
    history: []
  },
  {
    id: 'shipping-policy',
    type: 'shipping-policy',
    title: 'Política de Entrega, Prazos e Frete',
    summary: 'Informações sobre modalidades de frete, cálculo de prazos, postagem de encomendas botânicas e rastreamento de pedidos.',
    version: '1.0.0',
    publishedAt: '2026-01-10',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'Gerência de Logística Omiaá',
    content: `
<h2>1. Prazo de Separação e Postagem</h2>
<p>Devido ao caráter artesanal e manipulação cuidadosa dos nossos elixires e extratos vegetais, o prazo de preparação do pedido é de <strong>1 a 2 dias úteis</strong> após a confirmação do pagamento.</p>

<h2>2. Modalidades de Frete e Prazos de Entrega</h2>
<p>Trabalhamos com integração direta via Melhor Envio, Correios (SEDEX e PAC) e transportadoras privadas de alta confiabilidade:</p>
<ul>
  <li><strong>SEDEX / Frete Express:</strong> Prazo estimado de 1 a 3 dias úteis após a postagem para capitais e regiões metropolitanas.</li>
  <li><strong>PAC / Frete Econômico:</strong> Prazo estimado de 5 a 12 dias úteis conforme a localização do destinatário.</li>
  <li><strong>Frete Grátis:</strong> Válido para compras com valor líquido acima de R$ 250,00 ou quando aplicado cupom promocional vigente de frete grátis.</li>
</ul>

<h2>3. Rastreamento e Notificações</h2>
<p>Assim que o pedido for postado, o código de rastreamento oficial será enviado para seu e-mail cadastrado e ficará disponível no seu Painel de Cliente.</p>

<h2>4. Tentativas de Entrega e Endereço Incorreto</h2>
<p>As transportadoras realizam até 3 (três) tentativas de entrega no endereço informado. Certifique-se de que haverá alguém responsável no local para receber a encomenda.</p>
    `,
    history: []
  },
  {
    id: 'returns-policy',
    type: 'returns-policy',
    title: 'Política de Trocas e Devoluções',
    summary: 'Orientações alinhadas ao Código de Defesa do Consumidor para trocas, devoluções por arrependimento em 7 dias e vícios de produto.',
    version: '1.0.0',
    publishedAt: '2026-01-10',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'Atendimento ao Cliente Omiaá',
    content: `
<h2>1. Direito de Arrependimento (7 dias corridos)</h2>
<p>Em conformidade com o Art. 49 do Código de Defesa do Consumidor (CDC), o cliente tem até <strong>7 (sete) dias corridos</strong> a contar do recebimento do produto para solicitar a devolução do item por arrependimento ou desistência.</p>

<h2>2. Condições para Devolução por Arrependimento</h2>
<p>Para ser elegível à devolução integral:</p>
<ul>
  <li>O produto deve estar em sua embalagem original, sem violação do lacre de segurança das frascos ou potes de cosméticos;</li>
  <li>Não deve apresentar sinais de uso, manchas ou frasco danificado pelo cliente;</li>
  <li>Deve estar acompanhado da respectiva Nota Fiscal (DANFE).</li>
</ul>

<h2>3. Troca por Defeito ou Avaria no Transporte</h2>
<p>Caso o frasco de vidro chegue quebrado ou o elixir apresente inconformidade, entre em contato imediatamente com nossa equipe enviando foto do produto em até 30 dias corridos após o recebimento. Arcaremos com todo o custo de logística reversa e reenvio imediato sem custo adicional.</p>
    `,
    history: []
  },
  {
    id: 'refund-policy',
    type: 'refund-policy',
    title: 'Política de Reembolso e Estorno',
    summary: 'Procedimentos e prazos para devolução de valores em pagamentos via PIX, Cartão de Crédito e Boleto Bancário.',
    version: '1.0.0',
    publishedAt: '2026-01-10',
    updatedAt: '2026-08-01',
    status: 'published',
    author: 'Controladoria Financeira Omiaá',
    content: `
<h2>1. Prazos e Formas de Reembolso</h2>
<p>O reembolso do valor pago será efetuado na mesma modalidade utilizada no momento da compra, após o recebimento e conferência do produto em nosso centro de distribuição:</p>
<ul>
  <li><strong>Pagamentos via PIX:</strong> Estorno efetuado diretamente na conta bancária de origem em até <strong>2 (dois) dias úteis</strong> após a aprovação da devolução.</li>
  <li><strong>Pagamentos via Cartão de Crédito:</strong> O cancelamento é solicitado imediatamente ao gateway de pagamento (Mercado Pago). A restituição do limite poderá ser visualizada em até 2 (duas) faturas subsequentes, conforme regras da administradora do cartão.</li>
</ul>

<h2>2. Custos de Frete na Devolução</h2>
<p>Em casos de desistência por arrependimento no prazo de 7 dias ou defeito de fabricação, o frete de logística reversa é 100% custeado pela Omiaá através de código de postagem gratuito nos Correios.</p>
    `,
    history: []
  }
];

// ============================================================================
// DEFAULT CONSENT RECORDS
// ============================================================================
export const DEFAULT_USER_CONSENTS: UserConsentRecord[] = [
  {
    id: 'cons-1001',
    userIdentifier: 'clarice.alquimia@gmail.com',
    userName: 'Clarice Lispector',
    acceptedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    ipAddress: '189.120.45.12',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    documentVersionsAccepted: {
      privacyPolicy: '1.2.0',
      termsOfUse: '1.0.0',
      cookiePolicy: '1.1.0'
    },
    consents: {
      privacyPolicy: true,
      termsOfUse: true,
      cookiesNecessary: true,
      cookiesFunctional: true,
      cookiesAnalytics: true,
      cookiesMarketing: true,
      newsletterMarketing: true
    },
    revoked: false
  },
  {
    id: 'cons-1002',
    userIdentifier: 'visitante.curitiba@outlook.com',
    userName: 'Visitante Curitiba',
    acceptedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    ipAddress: '200.180.12.98',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    documentVersionsAccepted: {
      privacyPolicy: '1.2.0',
      termsOfUse: '1.0.0',
      cookiePolicy: '1.1.0'
    },
    consents: {
      privacyPolicy: true,
      termsOfUse: true,
      cookiesNecessary: true,
      cookiesFunctional: true,
      cookiesAnalytics: false,
      cookiesMarketing: false,
      newsletterMarketing: false
    },
    revoked: false
  }
];

// ============================================================================
// DEFAULT LGPD SUBJECT REQUESTS
// ============================================================================
export const DEFAULT_SUBJECT_REQUESTS: DataSubjectRequest[] = [
  {
    id: 'req-001',
    protocolNumber: 'PROTOCOL-LGPD-2026-001',
    requesterName: 'Juliana Paes de Andrade',
    requesterEmail: 'juliana.andrade@gmail.com',
    requesterCpf: '123.456.789-00',
    requestType: 'access',
    description: 'Solicito a listagem completa de todos os dados pessoais e histórico de compras mantidos em seu banco de dados.',
    status: 'in_analysis',
    assignedTo: 'DPO / Equipe de Privacidade',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    deadlineDate: new Date(Date.now() + 3600000 * 24 * 12).toISOString().split('T')[0],
    interactions: [
      {
        id: 'int-1',
        date: new Date(Date.now() - 3600000 * 72).toISOString(),
        author: 'Sistema LGPD',
        message: 'Protocolo registrado com sucesso através do canal de atendimento do cliente.'
      },
      {
        id: 'int-2',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        author: 'DPO Omiaá',
        message: 'Identidade verificada. Iniciando compilação do relatório de dados pessoais.',
        statusChange: 'in_analysis'
      }
    ]
  },
  {
    id: 'req-002',
    protocolNumber: 'PROTOCOL-LGPD-2026-002',
    requesterName: 'Matheus Silva',
    requesterEmail: 'matheus.silva@yahoo.com.br',
    requesterCpf: '987.654.321-11',
    requestType: 'revocation',
    description: 'Solicito a revogação do consentimento para recebimento de e-mails de promoção e marketing.',
    status: 'completed',
    assignedTo: 'DPO / Equipe de Privacidade',
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    deadlineDate: new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0],
    completedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    interactions: [
      {
        id: 'int-1',
        date: new Date(Date.now() - 3600000 * 120).toISOString(),
        author: 'Sistema LGPD',
        message: 'Protocolo de revogação de marketing aberto.'
      },
      {
        id: 'int-2',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        author: 'DPO Omiaá',
        message: 'E-mail removido das listas de newsletter e marketing com sucesso. Protocolo encerrado.',
        statusChange: 'completed'
      }
    ]
  }
];

// ============================================================================
// DEFAULT ADMIN AUDIT LOGS
// ============================================================================
export const DEFAULT_ADMIN_AUDIT_LOGS: AdminAuditLog[] = [
  {
    id: 'log-8001',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    userName: 'Administrador Master',
    userEmail: 'admin@omiaa.com.br',
    category: 'compliance',
    action: 'Atualização do Documento Legal "Política de Privacidade"',
    details: 'Alteração da versão 1.1.0 para 1.2.0 com novos detalhes sobre cookies de marketing.',
    ipAddress: '177.135.201.44',
    device: 'Chrome 121 / macOS Ventura',
    result: 'success'
  },
  {
    id: 'log-8002',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    userName: 'Gerente Comercial',
    userEmail: 'comercial@omiaa.com.br',
    category: 'coupon',
    action: 'Criação do Cupom BEMVINDO10',
    details: 'Cupom de 10% OFF para primeira compra ativado.',
    ipAddress: '201.88.102.15',
    device: 'Safari / iPadOS',
    result: 'success'
  },
  {
    id: 'log-8003',
    timestamp: new Date(Date.now() - 3600000 * 18).toISOString(),
    userName: 'Estoque & Logística',
    userEmail: 'estoque@omiaa.com.br',
    category: 'inventory',
    action: 'Ajuste de Estoque de Produto',
    details: 'Produto #02 (Sérum Botânico) teve seu saldo atualizado para 42 unidades.',
    ipAddress: '189.12.33.10',
    device: 'Firefox / Windows 11',
    result: 'success'
  },
  {
    id: 'log-8004',
    timestamp: new Date(Date.now() - 3600000 * 28).toISOString(),
    userName: 'Administrador Master',
    userEmail: 'admin@omiaa.com.br',
    category: 'login',
    action: 'Login no Painel Administrativo ERP',
    details: 'Autenticação bem-sucedida via canal seguro.',
    ipAddress: '177.135.201.44',
    device: 'Chrome 121 / macOS Ventura',
    result: 'success'
  }
];

// ============================================================================
// DEFAULT SECURITY STATUS
// ============================================================================
export const DEFAULT_SECURITY_STATUS: SecurityStatus = {
  httpsActive: true,
  sslCertificate: {
    issuer: "Let's Encrypt Authority X3 / Cloudflare TLS 1.3",
    validUntil: '2027-01-15',
    keyType: '256-bit RSA Encryption',
    status: 'valid'
  },
  securityHeaders: {
    hsts: true,
    csp: true,
    xFrameOptions: true,
    xContentTypeOptions: true,
    referrerPolicy: true
  },
  apiStatus: {
    googleGenAI: 'operational',
    mailServer: 'operational',
    paymentGateway: 'operational',
    database: 'operational'
  },
  envIntegrity: true,
  lastBackupTimestamp: new Date(Date.now() - 3600000 * 12).toISOString(),
  lastAuditTimestamp: new Date(Date.now() - 3600000 * 24).toISOString(),
  lastSystemUpdate: '2026-08-01',
  alerts: [
    {
      id: 'alt-1',
      severity: 'info',
      title: 'Certificado SSL Renovado Automática',
      message: 'O certificado de criptografia TLS 1.3 está válido e operando em conformidade.',
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
      resolved: true
    },
    {
      id: 'alt-2',
      severity: 'low',
      title: 'Verificação Periódica de Backup',
      message: 'O último backup do banco de dados e logs foi gerado e verificado com sucesso.',
      date: new Date(Date.now() - 3600000 * 12).toISOString(),
      resolved: true
    }
  ]
};

// ============================================================================
// DEFAULT BACKUP RECORDS
// ============================================================================
export const DEFAULT_BACKUPS: BackupRecord[] = [
  {
    id: 'bkp-20260806-01',
    filename: 'omiaa_backup_full_2026-08-06_0800.json',
    timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
    sizeBytes: 24580120, // ~24.5 MB
    status: 'completed',
    type: 'scheduled',
    checksum: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    contentsSummary: 'Banco de Produtos, Pedidos, Documentos Legais, Logs de Consentimento e Cupons.'
  },
  {
    id: 'bkp-20260805-01',
    filename: 'omiaa_backup_full_2026-08-05_0000.json',
    timestamp: new Date(Date.now() - 3600000 * 25).toISOString(),
    sizeBytes: 23910400, // ~23.9 MB
    status: 'verified',
    type: 'scheduled',
    checksum: 'sha256:8f4b23f86e901a182a3921580d28373b3c3b0183204928b99182a1738271a39d',
    contentsSummary: 'Backup Diário Automático do Sistema Omiaá.'
  }
];

// ============================================================================
// PERSISTENCE GETTERS & SETTERS
// ============================================================================

// 1. LEGAL DOCUMENTS
export function getSavedLegalDocuments(): LegalDocument[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(DEFAULT_LEGAL_DOCUMENTS));
      return DEFAULT_LEGAL_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_LEGAL_DOCUMENTS;
  }
}

export function saveLegalDocument(updatedDoc: LegalDocument, changeNotes: string = 'Atualização de conteúdo pelo painel'): LegalDocument[] {
  const currentDocs = getSavedLegalDocuments();
  
  const updatedList = currentDocs.map((doc) => {
    if (doc.id === updatedDoc.id) {
      // Create version history entry of previous state
      const historyEntry: DocumentVersionHistory = {
        id: `ver-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        version: doc.version,
        title: doc.title,
        summary: doc.summary,
        content: doc.content,
        updatedAt: doc.updatedAt,
        updatedBy: doc.author || 'Administrador',
        changeNotes
      };

      const newHistory = [historyEntry, ...(doc.history || [])];

      return {
        ...updatedDoc,
        updatedAt: new Date().toISOString().split('T')[0],
        history: newHistory
      };
    }
    return doc;
  });

  try {
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(updatedList));
    // Record audit log
    recordAdminAuditLog('compliance', `Atualização do documento legal "${updatedDoc.title}" v${updatedDoc.version}`, changeNotes);
  } catch (err) {
    console.error('Failed to save legal document:', err);
  }

  return updatedList;
}

export function revertLegalDocumentVersion(docId: LegalDocumentId, historyId: string): LegalDocument[] {
  const docs = getSavedLegalDocuments();
  const targetDoc = docs.find((d) => d.id === docId);
  if (!targetDoc) return docs;

  const historicVersion = targetDoc.history.find((h) => h.id === historyId);
  if (!historicVersion) return docs;

  const restoredDoc: LegalDocument = {
    ...targetDoc,
    title: historicVersion.title,
    summary: historicVersion.summary,
    content: historicVersion.content,
    version: `${historicVersion.version}-restored`,
    updatedAt: new Date().toISOString().split('T')[0]
  };

  return saveLegalDocument(restoredDoc, `Restauração da versão ${historicVersion.version}`);
}

// 2. USER CONSENT RECORDS
export function getSavedUserConsents(): UserConsentRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONSENTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(DEFAULT_USER_CONSENTS));
      return DEFAULT_USER_CONSENTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_USER_CONSENTS;
  }
}

export function saveUserConsentRecord(record: UserConsentRecord): void {
  const consents = getSavedUserConsents();
  consents.unshift(record);
  try {
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(consents.slice(0, 1000)));
  } catch (err) {
    console.error('Failed to save consent record:', err);
  }
}

export function revokeUserConsentRecord(id: string, notes: string = 'Revogado a pedido do titular'): UserConsentRecord[] {
  const consents = getSavedUserConsents();
  const updated = consents.map((c) => {
    if (c.id === id) {
      return {
        ...c,
        revoked: true,
        revokedAt: new Date().toISOString(),
        revocationNotes: notes
      };
    }
    return c;
  });

  try {
    localStorage.setItem(STORAGE_KEYS.CONSENTS, JSON.stringify(updated));
    recordAdminAuditLog('compliance', `Revogação de Consentimento #${id}`, notes);
  } catch (err) {
    console.error('Failed to revoke consent:', err);
  }

  return updated;
}

// 3. LGPD SUBJECT REQUESTS
export function getSavedSubjectRequests(): DataSubjectRequest[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBJECT_REQUESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBJECT_REQUESTS, JSON.stringify(DEFAULT_SUBJECT_REQUESTS));
      return DEFAULT_SUBJECT_REQUESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_SUBJECT_REQUESTS;
  }
}

export function createSubjectRequest(data: Omit<DataSubjectRequest, 'id' | 'protocolNumber' | 'createdAt' | 'deadlineDate' | 'interactions'>): DataSubjectRequest {
  const requests = getSavedSubjectRequests();
  const seqNumber = (requests.length + 1).toString().padStart(3, '0');
  const protocolNumber = `PROTOCOL-LGPD-2026-${seqNumber}`;

  const now = new Date();
  const deadline = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000); // 15 days deadline per LGPD

  const newRequest: DataSubjectRequest = {
    ...data,
    id: `req-${Date.now()}`,
    protocolNumber,
    createdAt: now.toISOString(),
    deadlineDate: deadline.toISOString().split('T')[0],
    interactions: [
      {
        id: `int-${Date.now()}`,
        date: now.toISOString(),
        author: 'Sistema LGPD',
        message: 'Protocolo de solicitação de titular aberto no sistema.'
      }
    ]
  };

  requests.unshift(newRequest);
  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECT_REQUESTS, JSON.stringify(requests));
    recordAdminAuditLog('compliance', `Nova Solicitação LGPD Registrada: ${protocolNumber}`, `Titular: ${data.requesterName}`);
  } catch (err) {
    console.error('Failed to create LGPD request:', err);
  }

  return newRequest;
}

export function updateSubjectRequestStatus(id: string, newStatus: SubjectRequestStatus, message: string, author: string = 'DPO Omiaá'): DataSubjectRequest[] {
  const requests = getSavedSubjectRequests();
  const updated = requests.map((req) => {
    if (req.id === id) {
      const interaction = {
        id: `int-${Date.now()}`,
        date: new Date().toISOString(),
        author,
        message,
        statusChange: newStatus
      };

      return {
        ...req,
        status: newStatus,
        completedAt: newStatus === 'completed' || newStatus === 'rejected' ? new Date().toISOString() : req.completedAt,
        interactions: [...req.interactions, interaction]
      };
    }
    return req;
  });

  try {
    localStorage.setItem(STORAGE_KEYS.SUBJECT_REQUESTS, JSON.stringify(updated));
    recordAdminAuditLog('compliance', `Atualização do Protocolo LGPD #${id}`, `Novo status: ${newStatus}`);
  } catch (err) {
    console.error('Failed to update request:', err);
  }

  return updated;
}

// 4. ADMIN AUDIT LOGS
export function getSavedAdminAuditLogs(): AdminAuditLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(DEFAULT_ADMIN_AUDIT_LOGS));
      return DEFAULT_ADMIN_AUDIT_LOGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_ADMIN_AUDIT_LOGS;
  }
}

export function recordAdminAuditLog(
  category: AuditLogCategory,
  action: string,
  details?: string,
  result: 'success' | 'failure' | 'warning' = 'success',
  userName: string = 'Administrador Master',
  userEmail: string = 'admin@omiaa.com.br'
): void {
  try {
    const logs = getSavedAdminAuditLogs();
    const newLog: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      userName,
      userEmail,
      category,
      action,
      details,
      ipAddress: '177.135.201.44', // Simulated current admin IP
      device: navigator ? navigator.userAgent : 'Navegador Web Admin',
      result
    };

    logs.unshift(newLog);
    localStorage.setItem(STORAGE_KEYS.AUDIT_LOGS, JSON.stringify(logs.slice(0, 500)));
  } catch (err) {
    console.error('Failed to record audit log:', err);
  }
}

// 5. SECURITY STATUS
export function getSecurityStatus(): SecurityStatus {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SECURITY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(DEFAULT_SECURITY_STATUS));
      return DEFAULT_SECURITY_STATUS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_SECURITY_STATUS;
  }
}

export function saveSecurityStatus(status: SecurityStatus): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SECURITY, JSON.stringify(status));
  } catch (err) {
    console.error('Failed to save security status:', err);
  }
}

// 6. BACKUP ENGINE
export function getSavedBackups(): BackupRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BACKUPS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(DEFAULT_BACKUPS));
      return DEFAULT_BACKUPS;
    }
    return JSON.parse(raw);
  } catch (err) {
    return DEFAULT_BACKUPS;
  }
}

export function triggerManualBackup(): BackupRecord {
  const backups = getSavedBackups();
  const now = new Date();
  const dateStr = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  const filename = `omiaa_backup_manual_${dateStr}.json`;

  // Compile full system snapshot
  const snapshotData = {
    backupDate: now.toISOString(),
    system: 'Omiaá Alquimia Ancestral ERP',
    documents: getSavedLegalDocuments(),
    consents: getSavedUserConsents(),
    lgpdRequests: getSavedSubjectRequests(),
    auditLogs: getSavedAdminAuditLogs(),
    security: getSecurityStatus()
  };

  const jsonString = JSON.stringify(snapshotData, null, 2);
  const sizeBytes = new Blob([jsonString]).size;

  const newBackup: BackupRecord = {
    id: `bkp-${Date.now()}`,
    filename,
    timestamp: now.toISOString(),
    sizeBytes,
    status: 'completed',
    type: 'manual',
    checksum: `sha256:${Math.random().toString(36).substr(2, 16)}${Math.random().toString(36).substr(2, 16)}`,
    contentsSummary: 'Snapshot completo de Documentos Legais, Consentimentos LGPD, Solicitações e Logs Auditáveis.'
  };

  backups.unshift(newBackup);
  try {
    localStorage.setItem(STORAGE_KEYS.BACKUPS, JSON.stringify(backups));
    recordAdminAuditLog('compliance', 'Backup Manual do Sistema Gerado', `Arquivo: ${filename} (${(sizeBytes / 1024 / 1024).toFixed(2)} MB)`);
  } catch (err) {
    console.error('Failed to save backup record:', err);
  }

  return newBackup;
}

export function exportBackupJSON(backupId: string): void {
  const snapshotData = {
    exportedAt: new Date().toISOString(),
    backupId,
    system: 'Omiaá Alquimia Ancestral ERP',
    documents: getSavedLegalDocuments(),
    consents: getSavedUserConsents(),
    lgpdRequests: getSavedSubjectRequests(),
    auditLogs: getSavedAdminAuditLogs(),
    security: getSecurityStatus()
  };

  const blob = new Blob([JSON.stringify(snapshotData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `OMIAA_System_Backup_${backupId}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export CSV Utilities
export function exportConsentsCSV(records: UserConsentRecord[]): void {
  exportToCSV(
    records,
    [
      { key: 'id', label: 'ID' },
      { key: 'userIdentifier', label: 'Usuário' },
      { key: 'acceptedAt', label: 'Data/Hora Aceite' },
      { key: 'ipAddress', label: 'IP' },
      { key: 'revoked', label: 'Revogado' },
      { key: 'userAgent', label: 'Dispositivo / User Agent' }
    ],
    'Consentimentos_LGPD_OMIAA'
  );
}

export function exportAuditLogsCSV(logs: AdminAuditLog[]): void {
  exportToCSV(
    logs,
    [
      { key: 'id', label: 'ID Log' },
      { key: 'timestamp', label: 'Data/Hora' },
      { key: 'userName', label: 'Usuário' },
      { key: 'category', label: 'Categoria' },
      { key: 'action', label: 'Ação Realizada' },
      { key: 'details', label: 'Detalhes' },
      { key: 'ipAddress', label: 'IP' },
      { key: 'result', label: 'Resultado' }
    ],
    'Auditoria_Admin_OMIAA'
  );
}
