package product

import (
	"backend/lib/book"
	"backend/lib/db"
	"context"

	lru "github.com/hashicorp/golang-lru/v2"
)

type SearchRequest struct {
	Page  int
	Query string
}

func NewProductSearchtBook() *ProductSearchBook {
	impl := &ProductSearchBook{}
	chapter, err := lru.New[string, book.Chapter[db.Product]](10)
	if err != nil {
		panic(err)
	}
	impl.TOC = chapter
	return impl
}

type ProductSearchBook struct {
	book.Book[string, db.Product]
}

func (ps *ProductSearchBook) FindSearchResult(
	ctx context.Context,
	query string,
	page int,
) *book.Response[db.Product] {
	return ps.FindPage(ctx, query, page, ps.SearchData)
}

const searchQueryRaw = `
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
 FROM products 
 WHERE 
	sold_out = false 
	AND
    MATCH(product_name, brand, product_id,store_name) AGAINST(? IN NATURAL LANGUAGE MODE)
`

func (ps *ProductSearchBook) SearchData(ctx context.Context, index string) (*[]db.Product, error) {
	rows, err := ps.Session.Query(searchQueryRaw, index)

	if err != nil {
		return nil, err
	}

	return db.ExtractProductsFromRows(rows)
}
