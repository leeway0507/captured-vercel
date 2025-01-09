export type ResponseProps<T> = {
  status: number
  data: T
};
export type SearchResponseProps<T> = {
  data: T[]
  currentPage: number
  lastPage: number
  fromCahce: boolean
};
export type FilterResponseProps<T> = {
  data: T[]
  currentPage: number
  lastPage: number
  fromCahce: boolean
};

export type ProductProps = {
  id: number
  store_name: string
  brand: string
  product_name: string
  product_img_url: string
  product_url: string
  currency_code: string
  retail_price: number
  sale_price: number
  is_sale:boolean
  product_id?: string
  mande_in?: string
  kor_brand?: string
  kor_product_name?: string
  color?: string
  gender?: string
  category?: string
  category_spec?: string
  sold_out: boolean
  updated_at: string
};

export type IntlShippingFee = {
  Heavy: number
  Light: number
  Shoes: number
};

export type StoreProps = {
  store_name: string
  kor_store_name: string
  store_url: string
  country: string
  currency: string
  tax_reduction: number
  tax_reduction_manually: boolean
  intl_shipping_fee: IntlShippingFee
  intl_free_shipping_min: number
  domestic_shipping_fee: number
  domestic_free_shipping_min: number
  shipping_fee_cumulation: boolean
  delivery_agency: string
  broker_fee: boolean
  ddp: boolean
  updated_at: string
};

type CurrProps = {
  Update: string
  Data: { [key: string]: number }
};

export type CurrencyProps = {
  buying: CurrProps
  custom: CurrProps
};
