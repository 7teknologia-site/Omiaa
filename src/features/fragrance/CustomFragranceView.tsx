import React, { useState, useEffect } from 'react';
import { Sparkles, FlaskConical, Calendar, ShieldCheck, BookOpen, Clock, LayoutDashboard } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CustomFragrance, FragranceQuestionnaire, FragranceAppointment, FragrancePayment } from '../../types';
import { createCustomFragrance, fetchCustomFragrances } from '../../services/supabaseService';
import { SEOHead } from '../../components/seo/SEOHead';
import { Breadcrumb } from '../../components/navigation/Breadcrumb';

import { FragranceRequestStep } from './components/FragranceRequestStep';
import { FragranceQuestionnaireStep } from './components/FragranceQuestionnaireStep';
import { FragranceAppointmentStep } from './components/FragranceAppointmentStep';
import { FragrancePaymentStep } from './components/FragrancePaymentStep';
import { FragranceStatusTracker } from './components/FragranceStatusTracker';
import { FragranceHistory } from './components/FragranceHistory';
import { FragranceAdminPanel } from './components/FragranceAdminPanel';
import { WhatsAppNotifierModal } from './components/WhatsAppNotifierModal';
import { EmailNotifierModal } from './components/EmailNotifierModal';

export type FragranceTab =
  | 'solicitacao'
  | 'questionario'
  | 'agendamento'
  | 'pagamento'
  | 'status'
  | 'historico'
  | 'admin';

export const CustomFragranceView: React.FC = () => {
  const { user, showToast } = useShop();

  const [activeTab, setActiveTab] = useState<FragranceTab>('solicitacao');
  const [userFragrances, setUserFragrances] = useState<CustomFragrance[]>([]);

  // Workflow Data Accumulator
  const [workflowData, setWorkflowData] = useState<Partial<CustomFragrance>>({
    customerName: user.name || 'Aline Mendes',
    customerEmail: user.email || 'cliente@omiaa.com.br',
    customerPhone: '+55 11 98765-4321',
    name: 'Perfume Ritual de Prosperidade',
    bottleSize: '50ml',
    price: 340,
    topNotes: ['Bergamota Calábria'],
    heartNotes: ['Rosa Damascena', 'Néroli Flor'],
    baseNotes: ['Breu Branco', 'Cedro do Atlas'],
    intention: 'Abertura de caminhos profissionais, magnetismo pessoal e proteção no lar.'
  });

  // Active Modals
  const [whatsappModalFragrance, setWhatsappModalFragrance] = useState<CustomFragrance | null>(null);
  const [emailModalFragrance, setEmailModalFragrance] = useState<CustomFragrance | null>(null);

  // Load user fragrances
  useEffect(() => {
    fetchCustomFragrances(user.email).then((data) => {
      setUserFragrances(data || []);
    });
  }, [user.email]);

  const handleQuestionnaireComplete = (questionnaireResult: {
    name: string;
    intention: string;
    topNotes: string[];
    heartNotes: string[];
    baseNotes: string[];
    bottleSize: string;
    price: number;
    questionnaire: FragranceQuestionnaire;
  }) => {
    setWorkflowData((prev) => ({
      ...prev,
      ...questionnaireResult
    }));
    setActiveTab('agendamento');
  };

  const handleAppointmentComplete = (appointment: FragranceAppointment) => {
    setWorkflowData((prev) => ({
      ...prev,
      appointment
    }));
    setActiveTab('pagamento');
  };

  const handlePaymentComplete = async (payment: FragrancePayment) => {
    const finalFragrance: CustomFragrance = {
      customerName: workflowData.customerName || user.name || 'Aline Mendes',
      customerEmail: workflowData.customerEmail || user.email || 'cliente@omiaa.com.br',
      customerPhone: workflowData.customerPhone || '+55 11 98765-4321',
      name: workflowData.name || 'Perfume Ritual OMIAA',
      topNotes: workflowData.topNotes || ['Bergamota Calábria'],
      heartNotes: workflowData.heartNotes || ['Rosa Damascena'],
      baseNotes: workflowData.baseNotes || ['Breu Branco'],
      intention: workflowData.intention || 'Abertura e Prosperidade',
      bottleSize: workflowData.bottleSize || '50ml',
      price: workflowData.price || 340,
      questionnaire: workflowData.questionnaire,
      appointment: workflowData.appointment,
      payment,
      status: 'macerando',
      macerationStartDate: new Date().toISOString().split('T')[0],
      macerationDaysTotal: 28,
      macerationDaysRemaining: 28,
      alchemistNotes: 'Fórmula registrada e iniciada infusão botânica de 28 dias.'
    };

    const created = await createCustomFragrance(finalFragrance);

    if (created) {
      setUserFragrances((prev) => [created, ...prev]);
    } else {
      setUserFragrances((prev) => [finalFragrance, ...prev]);
    }

    showToast(
      'Fragrância Encomendada!',
      'Sua fórmula exclusiva foi salva e o ciclo de 28 dias de maceração foi iniciado.',
      'success'
    );

    setActiveTab('status');
  };

  const handleReorder = (item: CustomFragrance) => {
    setWorkflowData({
      name: `Réplica de ${item.name}`,
      topNotes: item.topNotes,
      heartNotes: item.heartNotes,
      baseNotes: item.baseNotes,
      intention: item.intention,
      bottleSize: item.bottleSize,
      price: item.price || 340,
      questionnaire: item.questionnaire
    });
    setActiveTab('pagamento');
    showToast('Reordenação de Fórmula', `Replicando a fórmula "${item.name}".`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Dynamic SEO Head */}
      <SEOHead
        title="Atelier de Fragrâncias Personalizadas - OMIÁA"
        description="Criação e formulação sob medida de fragrâncias rituais exclusivas, com notas de topo, coração e fundo personalizadas e maceração lunar de 28 dias."
        keywords={['Perfumaria Sob Medida', 'Fragrância Exclusiva', 'Atelier Olfativo', 'Maceração Lunar', 'Perfumaria Botânica']}
        canonicalUrl="/atelie-fragrancias"
        breadcrumbItems={[
          { name: 'Início', item: '/' },
          { name: 'Atelier de Fragrâncias', item: '/atelie-fragrancias' }
        ]}
      />

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-6">
        <Breadcrumb items={[{ label: 'Atelier de Fragrâncias', active: true }]} />

        <div className="flex items-center gap-2">
          <FlaskConical className="w-6 h-6 text-[#C5A059]" />
          <h1 className="font-serif text-2xl font-bold text-[#14281D]">
            Atelier de Fragrâncias Personalizadas
          </h1>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white p-2 rounded-2xl border border-[#E2D9C8] shadow-xs flex flex-wrap gap-1">
        {[
          { id: 'solicitacao', label: '1. Solicitação', icon: Sparkles },
          { id: 'questionario', label: '2. Questionário', icon: FlaskConical },
          { id: 'agendamento', label: '3. Agendamento', icon: Calendar },
          { id: 'pagamento', label: '4. Pagamento', icon: ShieldCheck },
          { id: 'status', label: '5. Status & Área Cliente', icon: Clock, badge: userFragrances.length || null },
          { id: 'historico', label: '6. Histórico', icon: BookOpen },
          { id: 'admin', label: 'Painel Admin ERP', icon: LayoutDashboard }
        ].map((tab) => {
          const IconComp = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as FragranceTab)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#14281D] text-[#FAF7F2] shadow-sm'
                  : 'text-[#14281D] hover:bg-[#FAF7F2] hover:text-[#C5A059]'
              }`}
            >
              <IconComp className={`w-4 h-4 ${isActive ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-[#C5A059] text-[#14281D]' : 'bg-[#E2D9C8] text-[#14281D]'}`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Active Tab View Rendering */}
      <div>
        {activeTab === 'solicitacao' && (
          <FragranceRequestStep
            onStartQuestionnaire={() => setActiveTab('questionario')}
            onGoToAppointment={() => setActiveTab('agendamento')}
            onViewStatus={() => setActiveTab('status')}
          />
        )}

        {activeTab === 'questionario' && (
          <FragranceQuestionnaireStep
            onComplete={handleQuestionnaireComplete}
            onBack={() => setActiveTab('solicitacao')}
          />
        )}

        {activeTab === 'agendamento' && (
          <FragranceAppointmentStep
            onComplete={handleAppointmentComplete}
            onBack={() => setActiveTab('questionario')}
          />
        )}

        {activeTab === 'pagamento' && (
          <FragrancePaymentStep
            fragranceData={workflowData}
            onCompletePayment={handlePaymentComplete}
            onBack={() => setActiveTab('agendamento')}
          />
        )}

        {activeTab === 'status' && (
          <FragranceStatusTracker
            fragrances={userFragrances}
            onOpenWhatsApp={(f) => setWhatsappModalFragrance(f)}
            onOpenEmail={(f) => setEmailModalFragrance(f)}
            onReorder={handleReorder}
          />
        )}

        {activeTab === 'historico' && (
          <FragranceHistory
            fragrances={userFragrances}
            onReorder={handleReorder}
          />
        )}

        {activeTab === 'admin' && (
          <FragranceAdminPanel
            onSendToast={(title, desc, type) => showToast(title, desc || '', type || 'success')}
          />
        )}
      </div>

      {/* Global Modals */}
      {whatsappModalFragrance && (
        <WhatsAppNotifierModal
          fragrance={whatsappModalFragrance}
          isOpen={!!whatsappModalFragrance}
          onClose={() => setWhatsappModalFragrance(null)}
          onSendToast={(msg) => showToast('WhatsApp', msg, 'success')}
        />
      )}

      {emailModalFragrance && (
        <EmailNotifierModal
          fragrance={emailModalFragrance}
          isOpen={!!emailModalFragrance}
          onClose={() => setEmailModalFragrance(null)}
          onSendToast={showToast}
        />
      )}

    </div>
  );
};
