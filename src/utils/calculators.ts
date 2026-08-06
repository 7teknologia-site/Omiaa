import { CartItem, Coupon } from '../types';

export const calculateCartSubtotal = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
};

export const calculateCartItemCount = (cart: CartItem[]): number => {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
};

export const calculateDiscount = (subtotal: number, coupon: Coupon | null): number => {
  if (!coupon) return 0;
  return (subtotal * coupon.discountPercent) / 100;
};

export const calculateShippingFee = (
  subtotal: number,
  threshold: number,
  baseCost: number
): number => {
  if (subtotal >= threshold || subtotal === 0) return 0;
  return baseCost;
};
