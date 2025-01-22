package db

import (
	"time"
)

type Product struct {
	ID             int32     `json:"id,omitempty"`
	Brand          string    `json:"brand,omitempty"`
	ProductName    string    `json:"product_name,omitempty"`
	ProductImgUrl  string    `json:"product_img_url,omitempty"`
	ProductUrl     string    `json:"product_url,omitempty"`
	CurrencyCode   string    `json:"currency_code,omitempty"`
	RetailPrice    float64   `json:"retail_price,omitempty"`
	SalePrice      float64   `json:"sale_price,omitempty"`
	KorBrand       string    `json:"kor_brand,omitempty"`
	KorProductName string    `json:"kor_product_name,omitempty"`
	ProductID      string    `json:"product_id,omitempty"`
	Gender         string    `json:"gender,omitempty"`
	Color          string    `json:"color,omitempty"`
	Category       string    `json:"category,omitempty"`
	CategorySpec   string    `json:"category_spec,omitempty"`
	StoreName      string    `json:"store_name,omitempty"`
	MadeIn         string    `json:"made_in,omitempty"`
	IsSale         bool      `json:"is_sale,omitempty"`
	SoldOut        bool      `json:"sold_out,omitempty"`
	RegisterAt     time.Time `json:"register_at,omitempty"`
	UpdatedAt      time.Time `json:"updated_at,omitempty"`
}

type ShippingFee struct {
	Light float32
	Heavy float32
	Shoes float32
}

type Store struct {
	StoreName               string      `json:"store_name,omitempty"`
	StoreUrl                string      `json:"store_url,omitempty"`
	Country                 string      `json:"country,omitempty"`
	Currency                string      `json:"currency,omitempty"`
	TaxReduction            float64     `json:"tax_reduction,omitempty"`
	IntlShippingFee         ShippingFee `json:"intl_shipping_fee,omitempty"`
	IntlFreeShippingMin     float64     `json:"intl_free_shipping_min,omitempty"`
	DomesticShippingFee     float64     `json:"domestic_shipping_fee,omitempty"`
	DomesticFreeShippingMin float64     `json:"domestic_free_shipping_min,omitempty"`
	ShippingFeeCumulation   bool        `json:"shipping_fee_cumulation,omitempty"`
	DeliveryAgency          string      `json:"delivery_agency,omitempty"`
	BrokerFee               bool        `json:"broker_fee,omitempty"`
	Ddp                     bool        `json:"ddp,omitempty"`
	UpdatedAt               time.Time   `json:"updated_at,omitempty"`
	KorStoreName            string      `json:"kor_store_name,omitempty"`
	TaxReductionManually    bool        `json:"tax_reduction_manually"`
}
