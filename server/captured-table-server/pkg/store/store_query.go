package store

import (
	"backend/lib/db"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
)

const createStoreQueryRaw = `
INSERT INTO stores( 
	store_name,store_url,
	country,currency,
	tax_reduction,intl_shipping_fee,
	intl_free_shipping_min,domestic_shipping_fee,
	domestic_free_shipping_min,shipping_fee_cumulation,
	delivery_agency,broker_fee,
	ddp,updated_at,
	kor_store_name,tax_reduction_manually)
 VALUES (
	?,?,
	?,?,
	?,?,
	?,?,
	?,?,
	?,?,
	?,?,
	?,?
 )
 `

func CreateStores(ctx context.Context, session *sql.DB, stores *[]db.Store) error {
	// Prepare the statement
	stmt, err := session.Prepare(createStoreQueryRaw)
	if err != nil {
		return err
	}
	defer stmt.Close()

	// Insert multiple rows in a single transaction
	tx, err := session.Begin()
	if err != nil {
		return err
	}
	defer func() {
		if err != nil {
			err := tx.Rollback()
			if err != nil {
				fmt.Println("Transaction rolled back due to error:", err)
			}
			fmt.Println("Transaction rolled back due to error:", err)
		}
	}()

	for _, v := range *stores {
		// Marshal the ShippingFee struct to JSON
		intlShippingFeeJSON, err := json.Marshal(v.IntlShippingFee)
		if err != nil {
			return err
		}

		_, err = tx.Stmt(stmt).ExecContext(ctx,
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

	if err != nil {
		return err
	}
	// Commit the transaction
	err = tx.Commit()
	if err != nil {
		return err
	}

	fmt.Println("Insert successful!")
	return nil
}

const getStoresQueryRaw = `
SELECT 
	store_name,store_url,
	country,currency,
	tax_reduction,intl_shipping_fee,
	intl_free_shipping_min,domestic_shipping_fee,
	domestic_free_shipping_min,shipping_fee_cumulation,
	delivery_agency,broker_fee,
	ddp,updated_at,
	kor_store_name,tax_reduction_manually
 FROM 
	 stores 
 `

func GetStores(ctx context.Context, session *sql.DB) (*[]db.Store, error) {
	rows, err := session.QueryContext(ctx, getStoresQueryRaw)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	// An album slice to hold data from returned rows.
	var stores []db.Store
	var intlShippingFeeJSON []byte

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var s db.Store
		if err := rows.Scan(
			&s.StoreName, &s.StoreUrl,
			&s.Country, &s.Currency,
			&s.TaxReduction, &intlShippingFeeJSON,
			&s.IntlFreeShippingMin, &s.DomesticShippingFee,
			&s.DomesticFreeShippingMin, &s.ShippingFeeCumulation,
			&s.DeliveryAgency, &s.BrokerFee,
			&s.Ddp, &s.UpdatedAt,
			&s.KorStoreName, &s.TaxReductionManually,
		); err != nil {
			return nil, err
		}
		// Unmarshal JSON data into s.IntlShippingFee
		if err := json.Unmarshal(intlShippingFeeJSON, &s.IntlShippingFee); err != nil {
			return nil, err
		}
		stores = append(stores, s)
	}
	if err = rows.Err(); err != nil {
		return nil, err
	}
	return &stores, nil

}

const getStoreQueryRaw = `
SELECT 
	store_name,store_url,
	country,currency,
	tax_reduction,intl_shipping_fee,
	intl_free_shipping_min,domestic_shipping_fee,
	domestic_free_shipping_min,shipping_fee_cumulation,
	delivery_agency,broker_fee,
	ddp,updated_at,
	kor_store_name,tax_reduction_manually
 FROM 
	 stores 

WHERE store_name = ?
 `

func GetStore(ctx context.Context, session *sql.DB, store_name string) (*db.Store, error) {
	var s db.Store
	var intlShippingFeeJSON []byte

	err := session.QueryRowContext(ctx, getStoreQueryRaw, store_name).Scan(
		&s.StoreName, &s.StoreUrl,
		&s.Country, &s.Currency,
		&s.TaxReduction, &intlShippingFeeJSON,
		&s.IntlFreeShippingMin, &s.DomesticShippingFee,
		&s.DomesticFreeShippingMin, &s.ShippingFeeCumulation,
		&s.DeliveryAgency, &s.BrokerFee,
		&s.Ddp, &s.UpdatedAt,
		&s.KorStoreName, &s.TaxReductionManually,
	)
	if err != nil {
		return nil, err
	}
	// Unmarshal JSON data into s.IntlShippingFee
	if err := json.Unmarshal(intlShippingFeeJSON, &s.IntlShippingFee); err != nil {
		return nil, err
	}
	switch {
	case err == sql.ErrNoRows:
		return nil, err
	default:
		return &s, nil
	}
}
