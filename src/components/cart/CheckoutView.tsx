import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  FileText,
  Lock,
  Sparkles,
  ArrowLeft,
  Copy,
  Check,
  Truck,
  UserCheck,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Search,
  ChevronRight,
  Send,
  Mail
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Address, Order } from '../../types';

interface ShippingOption {
  id: string;
  name: string;
  carrier: string;
  days: string;
  price: number;
}

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartTotal,
    appliedCoupon,
    user,
    createOrder,
    setViewMode,
    latestOrder,
    showToast
  } = useShop();

  // Wizard Step State (1: Identificação, 2: Endereço, 3: Envio, 4: Pagamento, 5: Revisão)
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields & Validation
  const [customerName, setCustomerName] = useState(user.name || '');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [customerCpf, setCustomerCpf] = useState('123.456.789-00');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '(11) 98765-4321');

  const [address, setAddress] = useState<Address>(user.addresses[0] || {
    street: 'Rua das Camélias',
    number: '420',
    complement: 'Apto 12',
    neighborhood: 'Jardim Botânico',
    city: 'São Paulo',
    state: 'SP',
    cep: '04012-010'
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Shipping Selection (Melhor Envio)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>({
    id: 'pac',
    name: 'Correios PAC (Econômico)',
    carrier: 'Correios',
    days: '4 a 6 dias úteis',
    price: cartSubtotal >= 250 ? 0 : 14.90
  });

  const shippingOptions: ShippingOption[] = [
    {
      id: 'sedex',
      name: 'Correios SEDEX (Express Alquímico)',
      carrier: 'Correios',
      days: '1 a 2 dias úteis',
      price: 24.90
    },
    {
      id: 'pac',
      name: 'Correios PAC (Entrega Padrão)',
      carrier: 'Correios',
      days: '4 a 6 dias úteis',
      price: cartSubtotal >= 250 ? 0 : 14.90
    },
    {
      id: 'jadlog',
      name: 'Jadlog Express (Transportadora)',
      carrier: 'Jadlog',
      days: '2 a 3 dias úteis',
      price: 18.90
    }
  ];

  // Payment Options (Mercado Pago)
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('pix');
  const [installments, setInstallments] = useState<number>(1);
  const [cardHolder, setCardHolder] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvc, setCardCvc] = useState('882');

  const [pixCopied, setPixCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Mock PIX payload
  const mockPixPayload = '00020126580014BR.GOV.BCB.PIX0136omiaa-alquimia-pix-489215204000053039865802BR5925OMIAA ALQUIMIA ANCESTRAL6009SAO PAULO62070503***6304C102';

  const handleCopyPix = () => {
    navigator.clipboard.writeText(mockPixPayload);
    setPixCopied(true);
    showToast('Chave PIX Copiada!', 'Cole no seu app do banco para pagar.', 'success');
    setTimeout(() => setPixCopied(false), 3000);
  };

  // CEP Lookup Simulator
  const handleCepLookup = () => {
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setErrors({ ...errors, cep: 'CEP deve conter 8 dígitos' });
      return;
    }
    setIsLoadingCep(true);
    setErrors({ ...errors, cep: '' });

    setTimeout(() => {
      setIsLoadingCep(false);
      setAddress(prev => ({
        ...prev,
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      }));
      showToast('Endereço Encontrado', 'Dados preenchidos via consulta de CEP.', 'info');
    }, 600);
  };

  // Validation functions per step
  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!customerName.trim()) newErrors.customerName = 'Nome completo é obrigatório';
      if (!customerEmail.trim() || !customerEmail.includes('@')) newErrors.customerEmail = 'E-mail válido é obrigatório';
      if (!customerCpf.trim()) newErrors.customerCpf = 'CPF é obrigatório para emissão da nota';
    } else if (step === 2) {
      if (!address.cep.trim()) newErrors.cep = 'CEP é obrigatório';
      if (!address.street.trim()) newErrors.street = 'Logradouro é obrigatório';
      if (!address.number.trim()) newErrors.number = 'Número é obrigatório';
      if (!address.neighborhood.trim()) newErrors.neighborhood = 'Bairro é obrigatório';
      if (!address.city.trim()) newErrors.city = 'Cidade é obrigatória';
      if (!address.state.trim()) newErrors.state = 'Estado é obrigatório';
    } else if (step === 4 && paymentMethod === 'credit_card') {
      if (!cardHolder.trim()) newErrors.cardHolder = 'Nome do titular é obrigatório';
      if (!cardNumber.trim()) newErrors.cardNumber = 'Número do cartão é obrigatório';
      if (!cardExpiry.trim()) newErrors.cardExpiry = 'Validade é obrigatória';
      if (!cardCvc.trim()) newErrors.cardCvc = 'CVV é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(5, prev + 1));
    } else {
      showToast('Verifique os campos', 'Preencha todos os campos obrigatórios para avançar.', 'alert');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Calculations
  const pixDiscount = paymentMethod === 'pix' ? (cartSubtotal * 0.05) : 0;
  const couponDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const currentShippingFee = selectedShipping.price;
  const calculatedTotal = Math.max(0, cartSubtotal - couponDiscount - pixDiscount + currentShippingFee);

  const handleFinishCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      createOrder(paymentMethod, address);
      setIsSubmitting(false);
      showToast('E-mail enviado!', `Confirmação enviada para ${customerEmail}`, 'success');
      setViewMode('order-success');
    }, 1200);
  };

  if (cart.length === 0 && !latestOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4 font-sans">
        <h2 className="font-serif text-3xl font-bold text-[#14281D]">Sua sacola está vazia</h2>
        <p className="text-xs text-[#718096]">Adicione itens à sua sacola para proceder ao checkout.</p>
        <button
          onClick={() => setViewMode('catalog')}
          className="bg-[#14281D] text-[#FAF7F2] px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
        >
          Ir para a Apotheca
        </button>
      </div>
    );
  }

  const stepsList = [
    { num: 1, label: 'Identificação', icon: UserCheck },
    { num: 2, label: 'Endereço', icon: MapPin },
    { num: 3, label: 'Envio', icon: Truck },
    { num: 4, label: 'Pagamento', icon: CreditCard },
    { num: 5, label: 'Revisão', icon: ShieldCheck }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2D9C8] pb-6">
        <button
          onClick={() => setViewMode('catalog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          Voltar para a Apotheca
        </button>

        <div className="flex items-center gap-2 text-xs text-[#14281D] font-bold bg-[#FAF7F2] px-4 py-1.5 rounded-full border border-[#E2D9C8]">
          <Lock className="w-4 h-4 text-[#C5A059]" />
          <span>Mercado Pago & SSL 256-bit Protegido</span>
        </div>
      </div>

      {/* Checkout 5-Step Stepper Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E2D9C8] shadow-xs overflow-x-auto">
        <div className="flex items-center justify-between min-w-[550px] px-2">
          {stepsList.map((st, idx) => {
            const IconComp = st.icon;
            const isCompleted = currentStep > st.num;
            const isActive = currentStep === st.num;

            return (
              <React.Fragment key={st.num}>
                <button
                  onClick={() => {
                    if (st.num < currentStep) setCurrentStep(st.num);
                  }}
                  disabled={st.num > currentStep}
                  className={`flex items-center gap-2 transition-all ${
                    isActive
                      ? 'text-[#14281D] font-bold scale-105'
                      : isCompleted
                      ? 'text-emerald-800 font-semibold cursor-pointer'
                      : 'text-gray-400 font-normal cursor-not-allowed'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#14281D] text-[#C5A059] ring-2 ring-[#C5A059]'
                        : isCompleted
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-[#FAF7F2] text-gray-400 border border-[#E2D9C8]'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <IconComp className="w-4 h-4" />}
                  </div>
                  <span className="text-xs uppercase tracking-wider whitespace-nowrap">{st.label}</span>
                </button>

                {idx < stepsList.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded-full ${
                      currentStep > st.num ? 'bg-emerald-600' : 'bg-[#E2D9C8]'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Steps Form vs Sticky Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Interactive Wizard Form */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: IDENTIFICAÇÃO DO CLIENTE */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
                    <UserCheck className="w-6 h-6 text-[#C5A059]" />
                    1. Identificação Alquímica
                  </h3>
                  <span className="text-[11px] text-[#8C7A5B] font-bold uppercase">Passo 1 de 5</span>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Seu nome completo"
                      className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                        errors.customerName ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                      }`}
                    />
                    {errors.customerName && <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.customerName}</p>}
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                      E-mail para confirmação e rastreio *
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="seuemail@exemplo.com"
                      className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                        errors.customerEmail ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                      }`}
                    />
                    {errors.customerEmail && <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.customerEmail}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                        CPF (Nota Fiscal) *
                      </label>
                      <input
                        type="text"
                        value={customerCpf}
                        onChange={(e) => setCustomerCpf(e.target.value)}
                        placeholder="000.000.000-00"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.customerCpf ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.customerCpf && <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.customerCpf}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                        WhatsApp / Celular
                      </label>
                      <input
                        type="text"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                        placeholder="(00) 00000-0000"
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2D9C8] flex justify-end">
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3.5 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>Avançar para Endereço</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ENDEREÇO DE ENTREGA */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
                    <MapPin className="w-6 h-6 text-[#C5A059]" />
                    2. Endereço de Entrega
                  </h3>
                  <span className="text-[11px] text-[#8C7A5B] font-bold uppercase">Passo 2 de 5</span>
                </div>

                <div className="space-y-4 text-xs">
                  {/* CEP Input with automatic lookup */}
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                      CEP *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={address.cep}
                        onChange={(e) => setAddress({ ...address, cep: e.target.value })}
                        placeholder="00000-000"
                        className={`flex-1 bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.cep ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={handleCepLookup}
                        disabled={isLoadingCep}
                        className="bg-[#14281D] text-[#FAF7F2] px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#C5A059] hover:text-[#14281D] transition-colors"
                      >
                        <Search className="w-3.5 h-3.5" />
                        <span>{isLoadingCep ? 'Buscando...' : 'Buscar CEP'}</span>
                      </button>
                    </div>
                    {errors.cep && <p className="text-[10px] text-red-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.cep}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Logradouro *</label>
                      <input
                        type="text"
                        value={address.street}
                        onChange={(e) => setAddress({ ...address, street: e.target.value })}
                        placeholder="Rua / Avenida"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.street ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.street && <p className="text-[10px] text-red-600 mt-1">{errors.street}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Número *</label>
                      <input
                        type="text"
                        value={address.number}
                        onChange={(e) => setAddress({ ...address, number: e.target.value })}
                        placeholder="123"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.number ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.number && <p className="text-[10px] text-red-600 mt-1">{errors.number}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Complemento</label>
                      <input
                        type="text"
                        value={address.complement || ''}
                        onChange={(e) => setAddress({ ...address, complement: e.target.value })}
                        placeholder="Apto, Bloco, Ref."
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Bairro *</label>
                      <input
                        type="text"
                        value={address.neighborhood}
                        onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                        placeholder="Bairro"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.neighborhood ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.neighborhood && <p className="text-[10px] text-red-600 mt-1">{errors.neighborhood}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="col-span-2">
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Cidade *</label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                        placeholder="Cidade"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.city ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.city && <p className="text-[10px] text-red-600 mt-1">{errors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">UF *</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value.toUpperCase() })}
                        placeholder="SP"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none uppercase ${
                          errors.state ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.state && <p className="text-[10px] text-red-600 mt-1">{errors.state}</p>}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>Escolher Opção de Envio</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: MÉTODO DE ENVIO (MELHOR ENVIO INTEGRATION) */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
                    <Truck className="w-6 h-6 text-[#C5A059]" />
                    3. Opções de Frete e Envio
                  </h3>
                  <span className="text-[11px] text-[#8C7A5B] font-bold uppercase">Passo 3 de 5</span>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8] text-xs text-[#4A5568] flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#C5A059] shrink-0" />
                  <div>
                    <span className="font-bold text-[#14281D]">Entregar em:</span> {address.street}, {address.number} - {address.neighborhood}, {address.city}/{address.state} ({address.cep})
                  </div>
                </div>

                {/* Shipping Services List */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#14281D] uppercase tracking-wider block">
                    Selecione o serviço de entrega (via Melhor Envio):
                  </span>

                  {shippingOptions.map((opt) => {
                    const isSelected = selectedShipping.id === opt.id;
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#14281D] text-[#FAF7F2] border-[#C5A059] shadow-md'
                            : 'bg-white text-[#14281D] border-[#E2D9C8] hover:border-[#14281D]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'border-[#C5A059] bg-[#C5A059]' : 'border-gray-300'
                          }`}>
                            {isSelected && <Check className="w-3 h-3 text-[#14281D]" />}
                          </div>
                          <div>
                            <span className="font-bold text-xs block">{opt.name}</span>
                            <span className={`text-[11px] ${isSelected ? 'text-[#A8B2A6]' : 'text-gray-500'}`}>
                              Estimativa de entrega: {opt.days}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-serif font-bold text-sm block">
                            {opt.price === 0 ? (
                              <strong className="text-emerald-400 font-sans">GRÁTIS</strong>
                            ) : (
                              `R$ ${opt.price.toFixed(2).replace('.', ',')}`
                            )}
                          </span>
                          <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-[#C5A059]' : 'text-[#8C7A5B]'}`}>
                            {opt.carrier}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>Ir para Pagamento</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: FORMA DE PAGAMENTO (MERCADO PAGO INTEGRATION) */}
            {currentStep === 4 && (
              <motion.div
                key="step-4"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-[#C5A059]" />
                    4. Forma de Pagamento (Mercado Pago)
                  </h3>
                  <span className="text-[11px] text-[#8C7A5B] font-bold uppercase">Passo 4 de 5</span>
                </div>

                {/* Method selector buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'pix'
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#C5A059] shadow-md'
                        : 'bg-[#FAF7F2] text-[#4A5568] border-[#E2D9C8] hover:border-[#14281D]'
                    }`}
                  >
                    <QrCode className="w-6 h-6 text-[#C5A059]" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">Pix Mercado Pago</span>
                      <span className="text-[10px] text-emerald-400 font-bold">5% OFF Extra</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#C5A059] shadow-md'
                        : 'bg-[#FAF7F2] text-[#4A5568] border-[#E2D9C8] hover:border-[#14281D]'
                    }`}
                  >
                    <CreditCard className="w-6 h-6 text-[#C5A059]" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">Cartão de Crédito</span>
                      <span className="text-[10px] text-[#C5A059]">Até 6x Sem Juros</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === 'boleto'
                        ? 'bg-[#14281D] text-[#FAF7F2] border-[#C5A059] shadow-md'
                        : 'bg-[#FAF7F2] text-[#4A5568] border-[#E2D9C8] hover:border-[#14281D]'
                    }`}
                  >
                    <FileText className="w-6 h-6 text-[#C5A059]" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">Boleto Bancário</span>
                      <span className="text-[10px] text-gray-400">Aprovação em 1 dia</span>
                    </div>
                  </button>
                </div>

                {/* PIX Body */}
                {paymentMethod === 'pix' && (
                  <div className="bg-[#FAF7F2] p-6 rounded-2xl border border-[#E2D9C8] space-y-4 text-center">
                    <div className="inline-block p-3 bg-white rounded-2xl border border-[#E2D9C8] shadow-xs">
                      <div className="w-36 h-36 bg-[#14281D] p-2 rounded-xl flex flex-col items-center justify-center text-white text-[10px] space-y-1">
                        <QrCode className="w-20 h-20 text-[#C5A059]" />
                        <span className="font-mono text-[#C5A059]">OMIAÁ PIX MP</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-[#4A5568]">
                        Você ganhou <strong>5% de desconto extra</strong> no PIX!
                      </p>

                      <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#E2D9C8]">
                        <input
                          type="text"
                          readOnly
                          value={mockPixPayload}
                          className="w-full text-[10px] font-mono text-gray-600 bg-transparent focus:outline-none truncate"
                        />
                        <button
                          type="button"
                          onClick={handleCopyPix}
                          className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 shrink-0 transition-colors"
                        >
                          {pixCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{pixCopied ? 'Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Credit Card Body */}
                {paymentMethod === 'credit_card' && (
                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                        Nome impresso no Cartão *
                      </label>
                      <input
                        type="text"
                        value={cardHolder}
                        onChange={(e) => setCardHolder(e.target.value)}
                        placeholder="Nome como está no cartão"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.cardHolder ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.cardHolder && <p className="text-[10px] text-red-600 mt-1">{errors.cardHolder}</p>}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                        Número do Cartão *
                      </label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                          errors.cardNumber ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                        }`}
                      />
                      {errors.cardNumber && <p className="text-[10px] text-red-600 mt-1">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">Validade (MM/AA) *</label>
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM/AA"
                          className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                            errors.cardExpiry ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">CVV *</label>
                        <input
                          type="text"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="123"
                          className={`w-full bg-[#FAF7F2] border rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none ${
                            errors.cardCvc ? 'border-red-500' : 'border-[#E2D9C8] focus:border-[#C5A059]'
                          }`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#4A5568] uppercase mb-1">
                        Opções de Parcelamento
                      </label>
                      <select
                        value={installments}
                        onChange={(e) => setInstallments(Number(e.target.value))}
                        className="w-full bg-[#FAF7F2] border border-[#E2D9C8] rounded-xl p-3 text-[#14281D] font-semibold focus:outline-none focus:border-[#C5A059]"
                      >
                        <option value={1}>1x de R$ {calculatedTotal.toFixed(2).replace('.', ',')} sem juros</option>
                        <option value={2}>2x de R$ {(calculatedTotal / 2).toFixed(2).replace('.', ',')} sem juros</option>
                        <option value={3}>3x de R$ {(calculatedTotal / 3).toFixed(2).replace('.', ',')} sem juros</option>
                        <option value={6}>6x de R$ {(calculatedTotal / 6).toFixed(2).replace('.', ',')} sem juros</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Boleto Body */}
                {paymentMethod === 'boleto' && (
                  <div className="bg-[#FAF7F2] p-5 rounded-2xl border border-[#E2D9C8] text-xs text-[#4A5568] space-y-2">
                    <p>O boleto bancário será gerado com código de barras com vencimento em 2 dias úteis.</p>
                    <p className="font-bold text-[#14281D]">Aprovação em até 1 dia útil após o pagamento em bancos ou lotéricas.</p>
                  </div>
                )}

                <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-3 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-sm"
                  >
                    <span>Revisar Pedido</span>
                    <ChevronRight className="w-4 h-4 text-[#C5A059]" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 5: REVISÃO E CONFIRMAÇÃO FINAL */}
            {currentStep === 5 && (
              <motion.div
                key="step-5"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-[#C5A059]/50 shadow-md space-y-6"
              >
                <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
                  <h3 className="font-serif text-2xl font-bold text-[#14281D] flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-[#C5A059]" />
                    5. Revisão Final do Pedido Alquímico
                  </h3>
                  <span className="text-[11px] text-[#8C7A5B] font-bold uppercase">Passo Final</span>
                </div>

                {/* Review cards */}
                <div className="space-y-4 text-xs">
                  {/* Customer & Delivery */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Comprador(a)</span>
                      <strong className="text-[#14281D] block">{customerName}</strong>
                      <span className="text-gray-500 block">{customerEmail}</span>
                      <span className="text-gray-500 block">CPF: {customerCpf}</span>
                    </div>

                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Endereço de Entrega</span>
                      <strong className="text-[#14281D] block">{address.street}, {address.number}</strong>
                      <span className="text-gray-500 block">{address.neighborhood} - {address.city}/{address.state}</span>
                      <span className="text-gray-500 block">CEP: {address.cep}</span>
                    </div>
                  </div>

                  {/* Shipping & Payment Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Método de Envio</span>
                      <strong className="text-[#14281D] block">{selectedShipping.name}</strong>
                      <span className="text-emerald-800 font-semibold block">{selectedShipping.days}</span>
                    </div>

                    <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-[#E2D9C8]">
                      <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">Forma de Pagamento</span>
                      <strong className="text-[#14281D] uppercase block">
                        {paymentMethod === 'pix' ? 'Pix (Mercado Pago)' : paymentMethod === 'credit_card' ? `Cartão em ${installments}x` : 'Boleto Bancário'}
                      </strong>
                      <span className="text-gray-500 block">Processamento instantâneo via Mercado Pago</span>
                    </div>
                  </div>

                  {/* Notification Notice */}
                  <div className="bg-amber-50 text-amber-900 p-3.5 rounded-2xl border border-amber-200 flex items-center gap-3">
                    <Mail className="w-5 h-5 text-amber-700 shrink-0" />
                    <span className="text-[11px] leading-relaxed">
                      Ao finalizar, você receberá um <strong>e-mail de confirmação imediato</strong> e código de rastreio em <strong>{customerEmail}</strong>.
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E2D9C8] flex justify-between">
                  <button
                    type="button"
                    onClick={handlePrevStep}
                    className="border border-[#E2D9C8] text-[#14281D] hover:bg-[#FAF7F2] px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider"
                  >
                    Voltar
                  </button>

                  <button
                    type="button"
                    onClick={handleFinishCheckout}
                    disabled={isSubmitting}
                    className="bg-[#14281D] text-[#FAF7F2] hover:bg-[#C5A059] hover:text-[#14281D] px-8 py-4 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all shadow-md disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Consagrando Pedido...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-[#C5A059]" />
                        <span>Finalizar Compra Alquímica</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Right Sticky Order Summary Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E2D9C8] shadow-xs space-y-6 sticky top-28">
            <h3 className="font-serif text-2xl font-bold text-[#14281D]">
              Resumo do Pedido Alquímico
            </h3>

            {/* List of cart items */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {cart.map(({ product, quantity }) => (
                <div key={product.id} className="flex items-center gap-3 text-xs">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-xl object-cover bg-[#F4EFE6] border border-[#E2D9C8]"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-bold text-[#14281D] truncate">{product.name}</h5>
                    <span className="text-[10px] text-gray-500">Qtd: {quantity} • {product.volumeOrWeight}</span>
                  </div>
                  <span className="font-serif font-bold text-[#14281D]">
                    R$ {(product.price * quantity).toFixed(2).replace('.', ',')}
                  </span>
                </div>
              ))}
            </div>

            {/* Breakdown */}
            <div className="border-t border-[#E2D9C8] pt-4 space-y-2 text-xs text-[#4A5568]">
              <div className="flex justify-between">
                <span>Subtotal ({cart.reduce((a, b) => a + b.quantity, 0)} itens)</span>
                <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Desconto ({appliedCoupon.code})</span>
                  <span>- R$ {couponDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-emerald-800 font-semibold">
                  <span>Bônus Pix (5% OFF)</span>
                  <span>- R$ {pixDiscount.toFixed(2).replace('.', ',')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Frete ({selectedShipping.carrier})</span>
                <span>
                  {currentShippingFee === 0 ? (
                    <strong className="text-emerald-800">GRÁTIS</strong>
                  ) : (
                    `R$ ${currentShippingFee.toFixed(2).replace('.', ',')}`
                  )}
                </span>
              </div>

              <div className="flex justify-between text-base font-serif font-bold text-[#14281D] pt-3 border-t border-[#E2D9C8]">
                <span>Total Final</span>
                <span className="text-[#14281D]">R$ {calculatedTotal.toFixed(2).replace('.', ',')}</span>
              </div>
            </div>

            <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-2">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>Garantia de Satisfação & Devolução Grátis em até 7 dias</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};


