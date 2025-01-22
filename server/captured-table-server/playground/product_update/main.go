package main

import (
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"backend/pkg/product"
	"context"
	"database/sql"
	"log"
)

func main() {
	envset.LoadEnv()
	dbUrl := db.DBUrl()
	client, err := sql.Open("mysql", dbUrl)
	if err != nil {
		log.Fatal(err)
	}

	ctx := context.Background()

	d, err := local_file.LoadJson[[]db.Product]("/Users/yangwoolee/repo/captured-filter/backend/playground/product_update/x.json")
	if err != nil {
		panic(err)
	}

	err = product.CreateProducts(ctx, client, d)
	if err != nil {
		panic(err)
	}
}
