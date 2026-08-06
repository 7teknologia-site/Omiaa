import { useState, FormEvent } from 'react';
import { useShop } from '../context/ShopContext';
import { Address, Order, ShippingOption } from '../types';
import { SHIPPING_OPTIONS, MOCK_PIX_PAYLOAD } from '../constants/shop';
import { processMercadoPagoPayment, sendEmailConfirmation } from '../services/mercadopagoService';

export const useCheckout = () => {
  const {
    cart,
    cartSubtotal,
    appliedCoupon,
    user,
    createOrder,
    setViewMode,
    latestOrder,
    showToast
  } = useShop();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form Fields
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
    cep: '01402-000'
  });

  const [isLoadingCep, setIsLoadingCep] = useState(false);

  // Shipping selection
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption>(() => ({
    ...SHIPPING_OPTIONS[1],
    price: cartSubtotal >= 250 ? 0 : 14.90
  }));

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<Order['paymentMethod']>('pix');
  const [installments, setInstallments] = useState<number>(1);
  const [cardHolder, setCardHolder] = useState(user.name || '');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('11/29');
  const [cardCvc, setCardCvc] = useState('882');

  const [pixCopied, setPixCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastPaymentError, setLastPaymentError] = useState<string | null>(null);

  const handleCopyPix = (payload: string) => {
    navigator.clipboard.writeText(payload);
    setPixCopied(true);
    showToast('Chave PIX Copiada!', 'Cole no seu app do banco para pagar.', 'success');
    setTimeout(() => setPixCopied(false), 3000);
  };

  const handleCepLookup = () => {
    const cleanCep = address.cep.replace(/\D/g, '');
    if (cleanCep.length < 8) {
      setErrors((prev) => ({ ...prev, cep: 'CEP deve conter 8 dígitos' }));
      return;
    }
    setIsLoadingCep(true);
    setErrors((prev) => ({ ...prev, cep: '' }));

    setTimeout(() => {
      setIsLoadingCep(false);
      setAddress((prev) => ({
        ...prev,
        street: 'Avenida Paulista',
        neighborhood: 'Bela Vista',
        city: 'São Paulo',
        state: 'SP'
      }));
      showToast('Endereço Encontrado', 'Dados preenchidos via consulta de CEP.', 'info');
    }, 600);
  };

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
      setCurrentStep((prev) => Math.min(5, prev + 1));
    } else {
      showToast('Verifique os campos', 'Preencha todos os campos obrigatórios para avançar.', 'alert');
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const pixDiscount = paymentMethod === 'pix' ? cartSubtotal * 0.05 : 0;
  const couponDiscount = appliedCoupon ? (cartSubtotal * appliedCoupon.discountPercent) / 100 : 0;
  const currentShippingFee = selectedShipping.price;
  const calculatedTotal = Math.max(0, cartSubtotal - couponDiscount - pixDiscount + currentShippingFee);

  const handleFinishCheckout = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setLastPaymentError(null);

    try {
      // Simulate/call Mercado Pago Processing
      const mpResult = await processMercadoPagoPayment({
        paymentMethod,
        amount: calculatedTotal,
        payerEmail: customerEmail,
        payerName: customerName,
        payerCpf: customerCpf,
        installments
      });

      if (!mpResult.success) {
        setIsSubmitting(false);
        setLastPaymentError(mpResult.errorMessage || 'Sua transação não pôde ser aprovada pelo Mercado Pago.');
        setViewMode('order-error');
        return;
      }

      // Generate order payload metadata
      const pixPayloadStr = MOCK_PIX_PAYLOAD;
      const pixQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayloadStr)}`;
      const boletoCode = `34191.79001 01043.510047 91020.150008 5 91230000${Math.floor(calculatedTotal)}`;

      const newOrder = await createOrder(paymentMethod, address, {
        customerName,
        customerEmail,
        customerPhone,
        customerCpf,
        total: calculatedTotal,
        pixPayload: pixPayloadStr,
        pixQrCodeUrl: pixQrUrl,
        boletoBarcode: boletoCode,
        mercadoPagoPaymentId: mpResult.paymentId
      });

      // Dispatch Email Confirmation
      await sendEmailConfirmation(newOrder, customerEmail);

      setIsSubmitting(false);
      showToast('E-mail enviado!', `Confirmação de pedido enviada para ${customerEmail}`, 'success');
      setViewMode('order-success');
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
      setLastPaymentError('Ocorreu uma falha inesperada no processamento. Tente novamente.');
      setViewMode('order-error');
    }
  };

  return {
    cart,
    cartSubtotal,
    appliedCoupon,
    latestOrder,
    setViewMode,
    currentStep,
    setCurrentStep,
    customerName,
    setCustomerName,
    customerEmail,
    setCustomerEmail,
    customerCpf,
    setCustomerCpf,
    customerPhone,
    setCustomerPhone,
    address,
    setAddress,
    isLoadingCep,
    handleCepLookup,
    selectedShipping,
    setSelectedShipping,
    shippingOptions: SHIPPING_OPTIONS,
    paymentMethod,
    setPaymentMethod,
    installments,
    setInstallments,
    cardHolder,
    setCardHolder,
    cardNumber,
    setCardNumber,
    cardExpiry,
    setCardExpiry,
    cardCvc,
    setCardCvc,
    pixCopied,
    handleCopyPix,
    isSubmitting,
    errors,
    lastPaymentError,
    handleNextStep,
    handlePrevStep,
    pixDiscount,
    couponDiscount,
    currentShippingFee,
    calculatedTotal,
    handleFinishCheckout
  };
};
