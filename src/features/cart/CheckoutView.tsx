import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCheckout } from '../../hooks/useCheckout';
import { CheckoutStepper } from './CheckoutWizard/CheckoutStepper';
import { StepIdentification } from './CheckoutWizard/StepIdentification';
import { StepAddress } from './CheckoutWizard/StepAddress';
import { StepShipping } from './CheckoutWizard/StepShipping';
import { StepPayment } from './CheckoutWizard/StepPayment';
import { StepReview } from './CheckoutWizard/StepReview';
import { OrderSummarySidebar } from './CheckoutWizard/OrderSummarySidebar';

export const CheckoutView: React.FC = () => {
  const checkout = useCheckout();

  if (checkout.cart.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4 font-sans">
        <h2 className="font-serif text-2xl font-bold text-[#14281D]">Sua sacola está vazia</h2>
        <p className="text-xs text-[#718096]">Adicione produtos para iniciar o processo de checkout.</p>
        <button
          onClick={() => checkout.setViewMode('catalog')}
          className="bg-[#14281D] text-[#FAF7F2] px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-wider"
        >
          Ir para o Catálogo
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-[#E2D9C8] pb-4">
        <button
          onClick={() => checkout.setViewMode('catalog')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#14281D] hover:text-[#C5A059] transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-[#C5A059]" />
          Voltar para a Loja
        </button>
        <h1 className="font-serif text-xl sm:text-2xl font-bold text-[#14281D]">
          Checkout Alquímico Seguro
        </h1>
      </div>

      {/* Stepper Progress */}
      <CheckoutStepper currentStep={checkout.currentStep} />

      {/* Wizard Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Step Forms (Left 8 Cols) */}
        <div className="lg:col-span-8">
          {checkout.currentStep === 1 && (
            <StepIdentification
              customerName={checkout.customerName}
              setCustomerName={checkout.setCustomerName}
              customerEmail={checkout.customerEmail}
              setCustomerEmail={checkout.setCustomerEmail}
              customerCpf={checkout.customerCpf}
              setCustomerCpf={checkout.setCustomerCpf}
              customerPhone={checkout.customerPhone}
              setCustomerPhone={checkout.setCustomerPhone}
              errors={checkout.errors}
              handleNextStep={checkout.handleNextStep}
            />
          )}

          {checkout.currentStep === 2 && (
            <StepAddress
              address={checkout.address}
              setAddress={checkout.setAddress}
              isLoadingCep={checkout.isLoadingCep}
              handleCepLookup={checkout.handleCepLookup}
              errors={checkout.errors}
              handleNextStep={checkout.handleNextStep}
              handlePrevStep={checkout.handlePrevStep}
            />
          )}

          {checkout.currentStep === 3 && (
            <StepShipping
              shippingOptions={checkout.shippingOptions}
              selectedShipping={checkout.selectedShipping}
              setSelectedShipping={checkout.setSelectedShipping}
              cartSubtotal={checkout.cartSubtotal}
              handleNextStep={checkout.handleNextStep}
              handlePrevStep={checkout.handlePrevStep}
            />
          )}

          {checkout.currentStep === 4 && (
            <StepPayment
              paymentMethod={checkout.paymentMethod}
              setPaymentMethod={checkout.setPaymentMethod}
              installments={checkout.installments}
              setInstallments={checkout.setInstallments}
              cardHolder={checkout.cardHolder}
              setCardHolder={checkout.setCardHolder}
              cardNumber={checkout.cardNumber}
              setCardNumber={checkout.setCardNumber}
              cardExpiry={checkout.cardExpiry}
              setCardExpiry={checkout.setCardExpiry}
              cardCvc={checkout.cardCvc}
              setCardCvc={checkout.setCardCvc}
              pixCopied={checkout.pixCopied}
              handleCopyPix={checkout.handleCopyPix}
              calculatedTotal={checkout.calculatedTotal}
              errors={checkout.errors}
              handleNextStep={checkout.handleNextStep}
              handlePrevStep={checkout.handlePrevStep}
            />
          )}

          {checkout.currentStep === 5 && (
            <StepReview
              customerName={checkout.customerName}
              customerEmail={checkout.customerEmail}
              customerPhone={checkout.customerPhone}
              address={checkout.address}
              selectedShipping={checkout.selectedShipping}
              paymentMethod={checkout.paymentMethod}
              installments={checkout.installments}
              calculatedTotal={checkout.calculatedTotal}
              isSubmitting={checkout.isSubmitting}
              handleFinishCheckout={checkout.handleFinishCheckout}
              handlePrevStep={checkout.handlePrevStep}
            />
          )}
        </div>

        {/* Summary Sidebar (Right 4 Cols) */}
        <div className="lg:col-span-4">
          <OrderSummarySidebar
            currentShippingFee={checkout.currentShippingFee}
            pixDiscount={checkout.pixDiscount}
            calculatedTotal={checkout.calculatedTotal}
          />
        </div>

      </div>

    </div>
  );
};
