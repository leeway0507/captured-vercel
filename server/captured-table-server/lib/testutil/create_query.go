package testutil

import (
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"context"
	"database/sql"
	"encoding/json"
	"os"
	"path/filepath"
	"testing"
)

func LoadStoreDataForForeignKey(t *testing.T, session *sql.DB, ctx context.Context) {
	// 순환참조 방지를 위해 그대로 작성
	envset.Load(".env.dev")
	mockPath := os.Getenv("MOCK_DATA")

	// store row 추가 foreign key 생성 목적
	var filePath = filepath.Join(mockPath, "db", "store.json")
	storeData, err := local_file.LoadJson[[]db.Store](filePath)
	if err != nil {
		t.Fatal(err)
	}

	err = CreateMockStoreRow(ctx, session, storeData)

	if err != nil {
		t.Fatalf("failed save data => LoadStoreDataForForeignKey : %s", err)
	}

}

const storeCreate = `
INSERT INTO
    stores ( 
		store_name,store_url,
		country,currency,
		tax_reduction,intl_shipping_fee,
		intl_free_shipping_min,domestic_shipping_fee,
		domestic_free_shipping_min,shipping_fee_cumulation,
		delivery_agency,broker_fee,
		ddp,updated_at,
		kor_store_name,tax_reduction_manually
	)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

func CreateMockStoreRow(ctx context.Context, session *sql.DB, s *[]db.Store) error {

	for _, v := range *s {
		// Marshal the ShippingFee struct to JSON
		intlShippingFeeJSON, err := json.Marshal(v.IntlShippingFee)
		if err != nil {
			return err
		}

		_, err = session.Exec(storeCreate,
			v.StoreName, v.StoreUrl,
			v.Country, v.Currency,
			v.TaxReduction, intlShippingFeeJSON,
			v.IntlFreeShippingMin, v.DomesticShippingFee,
			v.DomesticFreeShippingMin, v.ShippingFeeCumulation,
			v.DeliveryAgency, v.BrokerFee,
			v.Ddp, v.UpdatedAt,
			v.KorStoreName, v.TaxReductionManually,
		)
		if err != nil {
			return err
		}
	}
	return nil
}

func LoadMockProductData(t *testing.T, session *sql.DB, ctx context.Context) {
	// 순환참조 방지를 위해 그대로 작성
	envset.Load(".env.dev")
	mockPath := os.Getenv("MOCK_DATA")
	// store row 추가 foreign key 생성 목적
	var filePath = filepath.Join(mockPath, "db", "product_50.json")
	productData, err := local_file.LoadJson[[]db.Product](filePath)
	if err != nil {
		t.Fatal(err)
	}

	err = CreateMockProductRow(ctx, session, productData)
	if err != nil {
		t.Fatalf("failed : LoadMockProductData : %s", err)
	}

}

const createProduct = `
INSERT INTO
    products ( 
		brand, product_name, 
		product_img_url, product_url, 
		currency_code, retail_price, 
		sale_price, kor_brand, 
		kor_product_name, product_id, 
		gender, color, 
		category, category_spec, 
		store_name, made_in, 
		is_sale, sold_out,
		register_at
	)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`

func CreateMockProductRow(ctx context.Context, session *sql.DB, s *[]db.Product) error {

	for _, v := range *s {
		_, err := session.Exec(createProduct,
			v.Brand, v.ProductName,
			v.ProductImgUrl, v.ProductUrl,
			v.CurrencyCode, v.RetailPrice,
			v.SalePrice, v.KorBrand,
			v.KorProductName, v.ProductID,
			v.Gender, v.Color,
			v.Category, v.CategorySpec,
			v.StoreName, v.MadeIn,
			v.IsSale, v.SoldOut,
			v.RegisterAt,
		)
		if err != nil {
			return err
		}
	}
	return nil
}
