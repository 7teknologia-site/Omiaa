import { Order } from '../types';

export interface InfinitePayCheckoutRequest {
  orderId: string;
  orderCode?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: {
    name: string;
    price: number;
    quantity: number;
  }[];
  total: number;
}

export interface InfinitePayCheckoutResult {
  success: boolean;
  url?: string;
  mode?: 'live' | 'simulation';
  errorMessage?: string;
}

/**
 * Creates an InfinitePay checkout session via backend endpoint /api/payments/infinitepay/create.
 */
export async function createInfinitePayCheckout(
  checkoutData: InfinitePayCheckoutRequest
): Promise<InfinitePayCheckoutResult> {
  try {
    const response = await fetch('/api/payments/infinitepay/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(checkoutData)
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error calling InfinitePay checkout API:', err);
    return {
      success: false,
      errorMessage: 'Falha ao comunicar com o servidor do InfinitePay.'
    };
  }
}

/**
 * Verifies an InfinitePay payment status via backend endpoint /api/payments/infinitepay/verify.
 */
export async function verifyInfinitePayPayment(
  orderNsu: string
): Promise<{ success: boolean; status?: string; order?: Order; errorMessage?: string }> {
  try {
    const response = await fetch('/api/payments/infinitepay/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_nsu: orderNsu })
    });

    const data = await response.json();
    return data;
  } catch (err: any) {
    console.error('Error verifying InfinitePay payment:', err);
    return {
      success: false,
      errorMessage: 'Erro ao consultar status da transação.'
    };
  }
}

/**
 * Fetches active payment gateway configuration from server.
 */
export async function getPaymentConfig(): Promise<{ gateway: string; infinitePayEnabled: boolean }> {
  try {
    const response = await fetch('/api/payments/config');
    if (!response.ok) return { gateway: 'infinitepay', infinitePayEnabled: true };
    return await response.json();
  } catch {
    return { gateway: 'infinitepay', infinitePayEnabled: true };
  }
}
