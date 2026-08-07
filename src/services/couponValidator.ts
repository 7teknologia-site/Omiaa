import { CartItem, CustomerProfile, Order } from '../types';
import { MarketingCoupon, ValidationResult, CouponUsageLog } from '../types/marketing';

export interface CouponValidationOptions {
  code: string;
  cartItems: CartItem[];
  cartSubtotal: number;
  user?: CustomerProfile | null;
  userEmail?: string;
  userOrders?: Order[];
  availableCoupons: MarketingCoupon[];
  usageLogs: CouponUsageLog[];
}

export function validateMarketingCoupon(options: CouponValidationOptions): ValidationResult {
  const {
    code,
    cartItems,
    cartSubtotal,
    userEmail,
    userOrders = [],
    availableCoupons,
    usageLogs = []
  } = options;

  const normalizedCode = code.trim().toUpperCase().replace(/\s+/g, '');

  if (!normalizedCode) {
    return {
      isValid: false,
      reason: 'inexistente',
      discountAmount: 0,
      isFreeShipping: false,
      message: 'Por favor, informe o código do cupom.'
    };
  }

  // 1. Cupom inexistente
  const coupon = availableCoupons.find(
    (c) => c.code.trim().toUpperCase() === normalizedCode
  );

  if (!coupon) {
    return {
      isValid: false,
      reason: 'inexistente',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${normalizedCode}" não existe ou é inválido.`
    };
  }

  // 2. Cupom desativado
  if (!coupon.status) {
    return {
      isValid: false,
      reason: 'desativado',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" está desativado no momento.`
    };
  }

  // 3. Validação de Datas e Horários (Expirado)
  const now = new Date();
  const currentDateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const currentTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; // HH:mm

  if (coupon.startDate && currentDateStr < coupon.startDate) {
    return {
      isValid: false,
      reason: 'agendado',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" estará válido a partir de ${new Date(coupon.startDate + 'T00:00:00').toLocaleDateString('pt-BR')}.`
    };
  }

  if (coupon.endDate && currentDateStr > coupon.endDate) {
    return {
      isValid: false,
      reason: 'expirado',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" expirou em ${new Date(coupon.endDate + 'T00:00:00').toLocaleDateString('pt-BR')}.`
    };
  }

  if (currentDateStr === coupon.startDate && coupon.startTime && currentTimeStr < coupon.startTime) {
    return {
      isValid: false,
      reason: 'agendado_horario',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" estará válido hoje a partir das ${coupon.startTime}.`
    };
  }

  if (currentDateStr === coupon.endDate && coupon.endTime && currentTimeStr > coupon.endTime) {
    return {
      isValid: false,
      reason: 'expirado_horario',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" expirou hoje às ${coupon.endTime}.`
    };
  }

  // 4. Limite de uso global atingido
  if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
    return {
      isValid: false,
      reason: 'limite_global',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" atingiu o limite máximo de utilizações.`
    };
  }

  // 5. Limite por cliente atingido
  const clientEmail = userEmail || options.user?.email || '';
  if (coupon.limitPerCustomer > 0 && clientEmail) {
    const customerUses = usageLogs.filter(
      (log) => log.couponCode === coupon.code && log.customerEmail.toLowerCase() === clientEmail.toLowerCase()
    ).length;

    if (customerUses >= coupon.limitPerCustomer) {
      return {
        isValid: false,
        reason: 'limite_cliente',
        discountAmount: 0,
        isFreeShipping: false,
        message: `Você já atingiu o limite de ${coupon.limitPerCustomer} uso(s) deste cupom.`
      };
    }
  }

  // 6. Regras de Usuário / Elegibilidade
  const rules = coupon.rules || {};

  // Primeira Compra
  if (rules.firstPurchaseOnly) {
    const previousPaidOrders = userOrders.filter((o) => o.status !== 'cancelado');
    if (previousPaidOrders.length > 0) {
      return {
        isValid: false,
        reason: 'primeira_compra',
        discountAmount: 0,
        isFreeShipping: false,
        message: `O cupom "${coupon.code}" é exclusivo para a primeira compra na Omiaá.`
      };
    }
  }

  // Clientes Recorrentes
  if (rules.recurringCustomersOnly) {
    const previousPaidOrders = userOrders.filter((o) => o.status !== 'cancelado');
    if (previousPaidOrders.length === 0) {
      return {
        isValid: false,
        reason: 'cliente_recorrente',
        discountAmount: 0,
        isFreeShipping: false,
        message: `O cupom "${coupon.code}" é exclusivo para clientes com histórico de compras.`
      };
    }
  }

  // Clientes Específicos
  if (rules.specificCustomerEmails && rules.specificCustomerEmails.length > 0) {
    const isAllowed = rules.specificCustomerEmails.some(
      (e) => e.toLowerCase() === clientEmail.toLowerCase()
    );
    if (!isAllowed) {
      return {
        isValid: false,
        reason: 'cliente_nao_autorizado',
        discountAmount: 0,
        isFreeShipping: false,
        message: `O cupom "${coupon.code}" não está disponível para esta conta de e-mail.`
      };
    }
  }

  // 7. Regras de Valor Mínimo e Máximo da Compra
  if (rules.minOrderValue && rules.minOrderValue > 0 && cartSubtotal < rules.minOrderValue) {
    const diff = rules.minOrderValue - cartSubtotal;
    return {
      isValid: false,
      reason: 'valor_minimo',
      discountAmount: 0,
      isFreeShipping: false,
      message: `Valor mínimo não atingido. Adicione mais R$ ${diff.toFixed(2).replace('.', ',')} para usar o cupom "${coupon.code}".`
    };
  }

  if (rules.maxOrderValue && rules.maxOrderValue > 0 && cartSubtotal > rules.maxOrderValue) {
    return {
      isValid: false,
      reason: 'valor_maximo',
      discountAmount: 0,
      isFreeShipping: false,
      message: `O cupom "${coupon.code}" só é válido para compras até R$ ${rules.maxOrderValue.toFixed(2).replace('.', ',')}.`
    };
  }

  // 8. Regras de Produtos e Categorias (Incompatibilidade)
  // Check if cart has included/excluded products/categories
  const eligibleItems = cartItems.filter((item) => {
    const prodId = item.product.id;
    const catId = item.product.category;

    // Check excluded products
    if (rules.excludedProducts && rules.excludedProducts.length > 0) {
      if (rules.excludedProducts.includes(prodId)) return false;
    }

    // Check excluded categories
    if (rules.excludedCategories && rules.excludedCategories.length > 0) {
      if (rules.excludedCategories.includes(catId)) return false;
    }

    // Check included products
    if (rules.includedProducts && rules.includedProducts.length > 0) {
      if (!rules.includedProducts.includes(prodId)) return false;
    }

    // Check included categories
    if (rules.includedCategories && rules.includedCategories.length > 0) {
      if (!rules.includedCategories.includes(catId)) return false;
    }

    return true;
  });

  if (eligibleItems.length === 0) {
    return {
      isValid: false,
      reason: 'produtos_incompativeis',
      discountAmount: 0,
      isFreeShipping: false,
      message: `Nenhum produto do seu carrinho é compatível com as regras do cupom "${coupon.code}".`
    };
  }

  // Calculate Subtotal for Eligible Items
  const eligibleSubtotal = eligibleItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  // 9. CÁLCULO DE DESCONTO COM BASE NO TIPO DE CUPOM
  let discountAmount = 0;
  let isFreeShipping = false;

  switch (coupon.discountType) {
    case 'percentual': {
      discountAmount = (eligibleSubtotal * (coupon.discountValue || 0)) / 100;
      break;
    }
    case 'valor_fixo': {
      discountAmount = Math.min(eligibleSubtotal, coupon.discountValue || 0);
      break;
    }
    case 'frete_gratis': {
      isFreeShipping = true;
      discountAmount = 0;
      break;
    }
    case 'brinde': {
      // Valor do brinde zerado ou desconto fixo equivalente
      discountAmount = coupon.discountValue || 0;
      break;
    }
    case 'compre_x_leve_y': {
      const buyX = coupon.buyX || 2;
      const getY = coupon.getY || 1;
      const totalQuantity = eligibleItems.reduce((acc, item) => acc + item.quantity, 0);

      if (totalQuantity >= buyX) {
        // Find cheapest item price for discount
        const prices = eligibleItems.flatMap((item) =>
          Array(item.quantity).fill(item.product.price)
        ).sort((a, b) => a - b);

        const freeCount = Math.floor(totalQuantity / buyX) * getY;
        const itemsToDiscount = prices.slice(0, freeCount);
        discountAmount = itemsToDiscount.reduce((acc, p) => acc + p, 0);
      } else {
        return {
          isValid: false,
          reason: 'compre_x_leve_y_nao_atingido',
          discountAmount: 0,
          isFreeShipping: false,
          message: `O cupom "${coupon.code}" exige a compra de pelo menos ${buyX} itens elegíveis.`
        };
      }
      break;
    }
    case 'desconto_progressivo': {
      const tiers = coupon.progressiveTiers || [];
      const sortedTiers = [...tiers].sort((a, b) => b.minAmount - a.minAmount);
      const matchedTier = sortedTiers.find((t) => eligibleSubtotal >= t.minAmount);

      if (matchedTier) {
        discountAmount = (eligibleSubtotal * matchedTier.discountPercent) / 100;
      } else {
        const lowestTier = sortedTiers[sortedTiers.length - 1];
        const minReq = lowestTier ? lowestTier.minAmount : 100;
        return {
          isValid: false,
          reason: 'desconto_progressivo_minimo',
          discountAmount: 0,
          isFreeShipping: false,
          message: `Adicione produtos até R$ ${minReq.toFixed(2).replace('.', ',')} para ativar o desconto progressivo.`
        };
      }
      break;
    }
    default:
      discountAmount = (eligibleSubtotal * (coupon.discountValue || 0)) / 100;
  }

  // Return success result
  return {
    isValid: true,
    discountAmount: Math.round(discountAmount * 100) / 100,
    isFreeShipping,
    coupon,
    message: isFreeShipping
      ? `Cupom "${coupon.code}" aplicado! Frete Grátis ativado.`
      : `Cupom "${coupon.code}" aplicado com sucesso! Desconto de R$ ${discountAmount.toFixed(2).replace('.', ',')}.`
  };
}
