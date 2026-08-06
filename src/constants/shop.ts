import { FilterState, ShippingOption } from '../types';

export const DEFAULT_FILTERS: FilterState = {
  category: 'todos',
  searchQuery: '',
  minPrice: 0,
  maxPrice: 500,
  sortBy: 'popular',
  onlyInStock: false
};

export const FREE_SHIPPING_THRESHOLD = 250.0;
export const DEFAULT_SHIPPING_BASE_COST = 22.9;

export const SHIPPING_OPTIONS: ShippingOption[] = [
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
    price: 14.90
  },
  {
    id: 'jadlog',
    name: 'Jadlog Express (Transportadora)',
    carrier: 'Jadlog',
    days: '2 a 3 dias úteis',
    price: 18.90
  }
];

export const MOCK_PIX_PAYLOAD = '00020126580014BR.GOV.BCB.PIX0136omiaa-alquimia-pix-489215204000053039865802BR5925OMIAA ALQUIMIA ANCESTRAL6009SAO PAULO62070503***6304C102';

export const VALID_COUPONS: Record<string, number> = {
  ALQUIMIA10: 10,
  OMIAA10: 10,
  LUNAR15: 15,
  PRIMEIRACOMPRA: 15
};
