export const consumptionTaxStd = 2_000_000;

export type ProductCatProps = {
  category: string
  categorySpec: string
  deliveryStd: 'Heavy' | 'Light' | 'Shoes'
  customRate: number
  consumptionTaxRate: number
};

export const productCat: ProductCatProps[] = [
  {
    category: 'etc',
    categorySpec: 'etc',
    deliveryStd: 'Heavy',
    customRate: 0.13,
    consumptionTaxRate: 0,
  },
  {
    category: 'shoes',
    categorySpec: 'sneakers',
    deliveryStd: 'Shoes',
    customRate: 0.13,
    consumptionTaxRate: 0,
  },
  {
    category: 'etc',
    categorySpec: 'bag',
    deliveryStd: 'Heavy',
    customRate: 0.07,
    consumptionTaxRate: 0.2,
  },
];
export const defaultProductType:ProductCatProps = {
  category: 'etc',
  categorySpec: 'etc',
  deliveryStd: 'Shoes',
  customRate: 0.13,
  consumptionTaxRate: 0,
};
