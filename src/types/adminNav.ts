import { LucideIcon } from 'lucide-react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Boxes,
  Award,
  Warehouse,
  MessageSquare,
  Users,
  Mail,
  Heart,
  Tag,
  Megaphone,
  Sparkles,
  Image,
  Search,
  BookOpen,
  Droplet,
  FlaskConical,
  FileText,
  CreditCard,
  RefreshCw,
  BarChart3,
  Truck,
  MapPin,
  Compass,
  Store,
  Phone,
  Share2,
  Palette,
  Home,
  Layout,
  Sliders,
  Cpu,
  Globe,
  Shield,
  Cookie,
  FileCheck,
  DollarSign,
  UserCheck,
  ClipboardList,
  Activity,
  History,
  Database,
  Lock,
  Gauge,
  ShieldAlert,
  Save,
  Eye,
  Key,
  Download,
  Upload,
  Zap,
  HardDrive,
  Wrench
} from 'lucide-react';

export interface AdminSearchItem {
  moduleId: string;
  moduleLabel: string;
  subItemId: string;
  subItemLabel: string;
  description: string;
  keywords: string[];
  icon: LucideIcon;
}

export type AdminRole =
  | 'super_admin'
  | 'admin'
  | 'gerente'
  | 'marketing'
  | 'financeiro'
  | 'logistica'
  | 'editor'
  | 'atendimento';

export interface AdminRoleConfig {
  id: AdminRole;
  title: string;
  description: string;
  badgeColor: string;
  permissions: Record<string, AdminActionPermission>;
}

export type AdminAction = 'view' | 'create' | 'edit' | 'delete' | 'export' | 'configure';

export interface AdminActionPermission {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  export: boolean;
  configure: boolean;
}

export type AdminModuleId =
  | 'dashboard'
  | 'orders'
  | 'products'
  | 'customers'
  | 'marketing'
  | 'content'
  | 'financial'
  | 'logistics'
  | 'settings'
  | 'compliance'
  | 'health'
  | 'users'
  | 'tools';

export type AdminSubModuleId = string;

export interface AdminNavigationSubItem {
  id: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string | null;
  description?: string;
  keywords?: string[];
}

export interface AdminNavigationModule {
  id: AdminModuleId;
  label: string;
  icon: LucideIcon;
  badge?: number | string | null;
  subItems: AdminNavigationSubItem[];
}

export const ADMIN_NAVIGATION_MODULES: AdminNavigationModule[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    subItems: [
      { id: 'dashboard-overview', label: 'Dashboard Geral', icon: LayoutDashboard, description: 'Visão consolidada de vendas, estoque e alertas.' }
    ]
  },
  {
    id: 'orders',
    label: 'Pedidos',
    icon: ShoppingBag,
    subItems: [
      { id: 'orders-list', label: 'Pedidos', icon: ShoppingBag, description: 'Gestão de pedidos, envios e status de pagamento.' }
    ]
  },
  {
    id: 'products',
    label: 'Produtos',
    icon: Package,
    subItems: [
      { id: 'products-list', label: 'Produtos', icon: Package, description: 'Catálogo de produtos, elixires e velas alquímicas.' },
      { id: 'products-categories', label: 'Categorias', icon: Layers, description: 'Organização de categorias e subcategorias.' },
      { id: 'products-collections', label: 'Coleções', icon: Boxes, description: 'Agrupamentos e coleções rituais.' },
      { id: 'products-brands', label: 'Marcas', icon: Award, description: 'Fornecedores e marcas botânicas.' },
      { id: 'products-inventory', label: 'Estoque', icon: Warehouse, description: 'Controle de saldo, baixo estoque e reposição.' },
      { id: 'products-reviews', label: 'Avaliações', icon: MessageSquare, description: 'Depoimentos e avaliações dos clientes.' }
    ]
  },
  {
    id: 'customers',
    label: 'Clientes',
    icon: Users,
    subItems: [
      { id: 'customers-list', label: 'Clientes', icon: Users, description: 'Base de clientes cadastrados e perfil CRM.' },
      { id: 'customers-newsletter', label: 'Newsletter', icon: Mail, description: 'Assinantes e captura de e-mails.' },
      { id: 'customers-wishlist', label: 'Lista de Desejos', icon: Heart, description: 'Produtos favoritados pelos clientes.' }
    ]
  },
  {
    id: 'marketing',
    label: 'Marketing',
    icon: Megaphone,
    subItems: [
      { id: 'marketing-coupons', label: 'Cupons', icon: Tag, description: 'Cupons de desconto e campanhas promocionais.' },
      { id: 'marketing-campaigns', label: 'Campanhas', icon: Megaphone, description: 'Divulgações e promoções de rituais.' },
      { id: 'marketing-popups', label: 'Pop-ups', icon: Sparkles, description: 'Pop-ups de entrada, captura e oferta.' },
      { id: 'marketing-banners', label: 'Banners', icon: Image, description: 'Banners promocionais da homepage.' },
      { id: 'marketing-seo', label: 'SEO', icon: Search, description: 'Otimização de busca e meta tags.' }
    ]
  },
  {
    id: 'content',
    label: 'Conteúdo',
    icon: BookOpen,
    subItems: [
      { id: 'content-blog', label: 'Blog', icon: BookOpen, description: 'Artigos sobre alquimia, ervas e espiritualidade.' },
      { id: 'content-botanical', label: 'Guia das Ervas', icon: Droplet, description: 'Enciclopédia de plantas medicinais e botânicas.' },
      { id: 'content-fragrances', label: 'Fragrâncias Personalizadas', icon: FlaskConical, description: 'Perfumes e sinergias artesanais.' },
      { id: 'content-pages', label: 'Páginas Institucionais', icon: FileText, description: 'Sobre nós, manifesto e páginas de apoio.' }
    ]
  },
  {
    id: 'financial',
    label: 'Financeiro',
    icon: CreditCard,
    subItems: [
      { id: 'financial-payments', label: 'Pagamentos', icon: CreditCard, description: 'Gateways de pagamento, Pix e cartão.' },
      { id: 'financial-refunds', label: 'Reembolsos', icon: RefreshCw, description: 'Gestão de estornos e devoluções.' },
      { id: 'financial-reports', label: 'Relatórios', icon: BarChart3, description: 'Balanço financeiro e ticket médio.' }
    ]
  },
  {
    id: 'logistics',
    label: 'Logística',
    icon: Truck,
    subItems: [
      { id: 'logistics-freight', label: 'Fretes', icon: Truck, description: 'Regras de frete grátis e tabelas por região.' },
      { id: 'logistics-carriers', label: 'Transportadoras', icon: MapPin, description: 'Integração Correios, Melhor Envio e Jadlog.' },
      { id: 'logistics-tracking', label: 'Rastreamento', icon: Compass, description: 'Status de entrega e envio automatizado.' }
    ]
  },
  {
    id: 'settings',
    label: 'Configurações da Loja',
    icon: Store,
    subItems: [
      { id: 'settings-brand', label: 'Informações da Marca', icon: Store, description: 'Nome, CNPJ, dados cadastrais e logo.' },
      { id: 'settings-contact', label: 'Contato', icon: Phone, description: 'E-mail, WhatsApp e SAC.' },
      { id: 'settings-social', label: 'Redes Sociais', icon: Share2, description: 'Links do Instagram, YouTube e TikTok.' },
      { id: 'settings-visual', label: 'Identidade Visual', icon: Palette, description: 'Cores institucionais e tipografia.' },
      { id: 'settings-home', label: 'Página Inicial', icon: Home, description: 'Layout da home, vitrines e seções.' },
      { id: 'settings-footer', label: 'Rodapé', icon: Layout, description: 'Links do rodapé e selos de segurança.' },
      { id: 'settings-integrations', label: 'Integrações', icon: Sliders, description: 'Webhooks, ERPs externos e aplicativos.' },
      { id: 'settings-apis', label: 'APIs', icon: Cpu, description: 'Chaves de API e tokens de autenticação.' },
      { id: 'settings-smtp', label: 'SMTP', icon: Mail, description: 'Configuração de servidor de e-mail transacional.' },
      { id: 'settings-google', label: 'Google', icon: Globe, description: 'Google Analytics, Merchant Center e Tag Manager.' },
      { id: 'settings-meta', label: 'Meta', icon: Share2, description: 'Pixel do Facebook, Meta Ads e WhatsApp API.' }
    ]
  },
  {
    id: 'compliance',
    label: 'Centro de Conformidade',
    icon: Shield,
    subItems: [
      { id: 'compliance-privacy', label: 'Política de Privacidade', icon: Shield, description: 'Documento legal de proteção aos dados do usuário.' },
      { id: 'compliance-cookies', label: 'Política de Cookies', icon: Cookie, description: 'Mapeamento e aviso de rastreadores.' },
      { id: 'compliance-terms', label: 'Termos de Uso', icon: FileCheck, description: 'Regras de utilização do e-commerce.' },
      { id: 'compliance-shipping', label: 'Política de Entrega', icon: Truck, description: 'Prazos, taxas e abrangência de envio.' },
      { id: 'compliance-returns', label: 'Política de Trocas', icon: RefreshCw, description: 'Regras de troca de itens e devoluções.' },
      { id: 'compliance-refund', label: 'Política de Reembolso', icon: DollarSign, description: 'Prazos de estorno e ressarcimento.' },
      { id: 'compliance-consents', label: 'Consentimentos LGPD', icon: UserCheck, description: 'Histórico de aceites e optar-in de clientes.' },
      { id: 'compliance-requests', label: 'Solicitações LGPD', icon: ClipboardList, description: 'Pedidos de titulares (exclusão, exportação).' },
      { id: 'compliance-audit', label: 'Auditoria', icon: Activity, description: 'Auditoria de segurança e acessos.' },
      { id: 'compliance-logs', label: 'Logs', icon: History, description: 'Logs de histórico de versões dos documentos.' }
    ]
  },
  {
    id: 'health',
    label: 'Saúde do Sistema',
    icon: Activity,
    subItems: [
      { id: 'health-overview', label: 'Status Geral', icon: Activity, description: 'Painel unificado de monitoramento de serviços.' },
      { id: 'health-apis', label: 'APIs', icon: Cpu, description: 'Latência e disponibilidade de rotas backend.' },
      { id: 'health-database', label: 'Banco de Dados', icon: Database, description: 'Leitura, escrita e conexões ativas.' },
      { id: 'health-auth', label: 'Autenticação', icon: Lock, description: 'Sessões ativas e tokens JWT/OAuth.' },
      { id: 'health-perf', label: 'Performance', icon: Gauge, description: 'Tempo de renderização e carregamento.' },
      { id: 'health-security', label: 'Segurança', icon: ShieldAlert, description: 'Proteção WAF, SSL e tentativas suspeitas.' },
      { id: 'health-backups', label: 'Backups', icon: Save, description: 'Snapshots diários e retenção de dados.' },
      { id: 'health-monitoring', label: 'Monitoramento', icon: Eye, description: 'Telemetria e logs em tempo real.' }
    ]
  },
  {
    id: 'users',
    label: 'Usuários',
    icon: UserCheck,
    subItems: [
      { id: 'users-admins', label: 'Administradores', icon: UserCheck, description: 'Gerenciamento de operadores e equipe.' },
      { id: 'users-roles', label: 'Funções', icon: Shield, description: 'Criação de cargos e perfis de usuário.' },
      { id: 'users-permissions', label: 'Permissões', icon: Key, description: 'Matriz granular de controle de acesso (RBAC).' }
    ]
  },
  {
    id: 'tools',
    label: 'Ferramentas',
    icon: Wrench,
    subItems: [
      { id: 'tools-import', label: 'Importar Produtos', icon: Download, description: 'Importação em massa via CSV/JSON.' },
      { id: 'tools-export', label: 'Exportar Dados', icon: Upload, description: 'Exportação de relatórios e acervo.' },
      { id: 'tools-cache', label: 'Limpeza de Cache', icon: Zap, description: 'Purga do cache de ativos e páginas.' },
      { id: 'tools-backup', label: 'Backup Manual', icon: HardDrive, description: 'Geração de cópia de segurança sob demanda.' },
      { id: 'tools-maintenance', label: 'Modo Manutenção', icon: Wrench, description: 'Bloqueio temporário da loja para ajustes.' }
    ]
  }
];
