package product

import (
	"backend/lib/book"
	"backend/lib/db"
	"context"
	"strings"

	lru "github.com/hashicorp/golang-lru/v2"
)

type FilterRequest struct {
	Page  int
	Index FilterIndex
}
type FilterIndex struct {
	StoreName *[]string `json:"storeInfo"`
	Brand     *[]string `json:"brand"`
	Sale      bool      `json:"sale"`
}

func NewProductBook() *ProductFilterBook {
	impl := &ProductFilterBook{}

	chapter, err := lru.New[FilterIndex, book.Chapter[db.Product]](10)
	if err != nil {
		panic(err)
	}
	impl.TOC = chapter
	return impl
}

type ProductFilterBook struct {
	book.Book[FilterIndex, db.Product]
}

func (pf *ProductFilterBook) FindProducts(
	ctx context.Context,
	Index FilterIndex,
	page int,
) *book.Response[db.Product] {
	return pf.FindPage(ctx, Index, page, pf.SearchData)
}

func (pf *ProductFilterBook) SearchData(
	ctx context.Context, Index FilterIndex,
) (*[]db.Product, error) {
	query, values := pf.FilterStmt(ctx, Index)

	rows, err := pf.Session.QueryContext(ctx, query, values...)
	if err != nil {
		return nil, err
	}
	r, err := db.ExtractProductsFromRows(rows)
	if err != nil {
		return nil, err
	}
	return r, err

}

const filerBaseQueryRaw = `SELECT 
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

	WHERE sold_out = false
 `

func (pf *ProductFilterBook) FilterStmt(ctx context.Context, Index FilterIndex) (string, []interface{}) {
	var filterValues []interface{}
	var whereClauses []string
	const orderBy = "   ORDER BY product_id DESC" // intended spacing

	// Handle the IN operator for part_ids
	if Index.StoreName != nil {
		storeName := *Index.StoreName
		placeholders := make([]string, len(storeName))
		for i, name := range storeName {
			placeholders[i] = "?"
			filterValues = append(filterValues, name)
		}
		whereClauses = append(whereClauses, "store_name IN ("+strings.Join(placeholders, ",")+")")
	}
	if Index.Brand != nil {
		brand := *Index.Brand
		placeholders := make([]string, len(brand))
		for i, name := range brand {
			placeholders[i] = "?"
			filterValues = append(filterValues, name)

		}
		whereClauses = append(whereClauses, "brand IN ("+strings.Join(placeholders, ",")+")")
	}

	// Add other filters as before
	if Index.Sale {
		whereClauses = append(whereClauses, "is_sale = true")
	}

	// Combine the WHERE clauses with AND
	if len(whereClauses) > 0 {
		whereClause := strings.Join(whereClauses, " AND ")
		queryWhere := filerBaseQueryRaw + ` AND ` + whereClause
		queryRaw := queryWhere + orderBy
		return queryRaw, filterValues
	}
	queryRaw := filerBaseQueryRaw + orderBy
	return queryRaw, nil

	// Build the final query

}
