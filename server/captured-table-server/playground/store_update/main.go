package main

import (
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"backend/pkg/store"
	"context"
	"fmt"
)

func main() {
	envset.LoadEnv()
	session := db.Session()
	ctx := context.Background()
	// storeRow := db.Store{
	// 	StoreName:            "eraldo",
	// 	KorStoreName:         "에랄도",
	// 	StoreUrl:             "https://www.eraldo.com/us/",
	// 	Country:              "IT",
	// 	TaxReduction:         0,
	// 	TaxReductionManually: false,
	// 	Currency:             "USD",
	// 	IntlShippingFee: db.ShippingFee{
	// 		Light: 23,
	// 		Heavy: 23,
	// 		Shoes: 23,
	// 	},
	// 	ShippingFeeCumulation:   false,
	// 	IntlFreeShippingMin:     400,
	// 	DomesticShippingFee:     10,
	// 	DomesticFreeShippingMin: 0,
	// 	DeliveryAgency:          "DHL",
	// 	BrokerFee:               false,
	// 	Ddp:                     true,
	// 	UpdatedAt:               time.Now(),
	// }
	d, err := local_file.LoadJson[[]db.Store]("/Users/yangwoolee/repo/captured-filter/backend/playground/store_update/x.json")
	if err != nil {
		panic(err)
	}
	// err := store.CreateStores(ctx, session, &[]db.Store{storeRow})
	err = store.CreateStores(ctx, session, d)
	// err = store.CreateStores(ctx, session, d)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Store Inserting Success!!")

}
