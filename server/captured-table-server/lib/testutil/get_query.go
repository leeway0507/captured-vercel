package testutil

import (
	"backend/lib/db"
	"context"
	"database/sql"
)

const getProductsQueryRaw = `
SELECT 
	id,brand,
	product_name,product_img_url,
	product_url,currency_code,
	retail_price,sale_price,
	kor_brand,kor_product_name,
	product_id,gender,
	color,category,
	category_spec,store_name,
	made_in,is_sale,
	sold_out, updated_at,
	register_at
 FROM 
 products 
 `

func GetProductsQuery(ctx context.Context, session *sql.DB) (*[]db.Product, error) {
	rows, err := session.QueryContext(ctx, getProductsQueryRaw)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return db.ExtractProductsFromRows(rows)
}
