package product

import (
	"backend/lib/book"
	"backend/lib/db"
	"context"
	"database/sql"
	"fmt"
)

var (
	ProductBook = NewProductBook()
	SearchBook  = NewProductSearchtBook()
)

func ResetCache() {
	ProductBook.TOC.Purge()
	SearchBook.TOC.Purge()
}

func SearchProducts(
	session *sql.DB, p *SearchRequest, limit int,
) *book.Response[db.Product] {
	SearchBook.Session = session
	SearchBook.LimitPerPage = limit

	if p.Page == 0 {
		p.Page = 1
	}
	ctx := context.Background()
	return SearchBook.FindSearchResult(ctx, p.Query, p.Page)

}
func GetProducts(
	session *sql.DB, p *FilterRequest, limit int,
) *book.Response[db.Product] {
	ProductBook.Session = session
	ProductBook.LimitPerPage = limit

	if p.Page == 0 {
		p.Page = 1
	}
	ctx := context.Background()
	return ProductBook.FindProducts(ctx, p.Index, p.Page)

}

const createProductQueryRaw = `
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
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
ON DUPLICATE KEY UPDATE retail_price=?, sale_price=?, is_sale=?, sold_out=?, updated_at=?
`

func CreateProducts(ctx context.Context, session *sql.DB, products *[]db.Product) error {
	// Prepare the statement
	stmt, err := session.Prepare(createProductQueryRaw)
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

	for _, v := range *products {
		_, err = tx.Stmt(stmt).ExecContext(ctx,
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
			v.RetailPrice, v.SalePrice, v.IsSale, v.SoldOut, v.UpdatedAt, // <= Upsert Items
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

const getProductQueryRaw = `
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

 WHERE 
 id = ?
 LIMIT 1
 `

func GetProduct(ctx context.Context, session *sql.DB, id int) (*db.Product, error) {
	var i db.Product
	err := session.QueryRowContext(ctx, getProductQueryRaw, id).Scan(
		&i.ID, &i.Brand,
		&i.ProductName, &i.ProductImgUrl,
		&i.ProductUrl, &i.CurrencyCode,
		&i.RetailPrice, &i.SalePrice,
		&i.KorBrand, &i.KorProductName,
		&i.ProductID, &i.Gender,
		&i.Color, &i.Category,
		&i.CategorySpec, &i.StoreName,
		&i.MadeIn, &i.IsSale,
		&i.SoldOut, &i.UpdatedAt,
		&i.RegisterAt,
	)
	if err != nil {
		return nil, err
	}
	switch {
	case err == sql.ErrNoRows:
		return nil, err
	default:
		return &i, nil
	}
}
