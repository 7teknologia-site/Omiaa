import React from 'react';
import { User, MapPin, Truck, CreditCard, CheckCircle2 } from 'lucide-react';

interface CheckoutStepperProps {
  currentStep: number;
}

export const CheckoutStepper: React.FC<CheckoutStepperProps> = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Identificação', icon: User },
    { num: 2, label: 'Endereço', icon: MapPin },
    { num: 3, label: 'Frete', icon: Truck },
    { num: 4, label: 'Pagamento', icon: CreditCard },
    { num: 5, label: 'Revisão', icon: CheckCircle2 }
  ];

  return (
    <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#E2D9C8] shadow-xs">
      <div className="flex items-center justify-between max-w-2xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[#E2D9C8] -translate-y-1/2 z-0" />
        {steps.map((s) => {
          const Icon = s.icon;
          const isDone = currentStep > s.num;
          const isCurrent = currentStep === s.num;

          return (
            <div key={s.num} className="relative z-10 flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-800 text-white'
                    : isCurrent
                    ? 'bg-[#14281D] text-[#C5A059] ring-4 ring-[#C5A059]/20'
                    : 'bg-[#FAF7F2] text-[#8C7A5B] border border-[#E2D9C8]'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider hidden sm:block ${
                isCurrent ? 'text-[#14281D]' : 'text-[#8C7A5B]'
              }`}>
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
