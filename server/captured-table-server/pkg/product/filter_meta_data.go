package product

import (
	"backend/lib/db"
	"backend/pkg/store"
	"context"
	"database/sql"
	"errors"
	"fmt"

	lru "github.com/hashicorp/golang-lru/v2"
)

type ProductFilterMeta struct {
	StoreName *[]db.Store `json:"storeName"`
	Brand     *[]string   `json:"brand"`
}

var (
	cache, _ = lru.New[string, *ProductFilterMeta](1)
)

func ResetFilterCache() {
	cache.Purge()
}

func GetFilterMeta(session *sql.DB) (*ProductFilterMeta, error) {
	cachedFilter, ok := cache.Get("filter")

	if ok {
		return cachedFilter, nil
	}

	ctx := context.Background()
	newFilter, err := CreateProductMetaValues(ctx, session)

	if err != nil {
		return nil, err
	}

	cache.Add("filter", newFilter)
	return newFilter, nil
}

func CreateProductMetaValues(ctx context.Context, session *sql.DB) (*ProductFilterMeta, error) {
	brand, err := ExtractBrandInfo(ctx, session)
	if err != nil {
		return nil, err
	}
	StoreName, err := ExtractStoreInfo(ctx, session)
	if err != nil {
		return nil, err
	}
	return &ProductFilterMeta{
		Brand:     &brand,
		StoreName: StoreName,
	}, nil
}

func ExtractDistinctValues(ctx context.Context, session *sql.DB, columnName string) ([]string, error) {
	quotedColumns := map[string]string{
		"store_name": "store_name",
		"brand":      "brand",
	}

	quoted, ok := quotedColumns[columnName]
	if !ok {
		return nil, errors.New("No column name in quotedColumns")
	}
	getDistinctiveValuesStmt := fmt.Sprintf("SELECT DISTINCT %s FROM products;", quoted)
	rows, err := session.QueryContext(ctx, getDistinctiveValuesStmt)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var results []string
	for rows.Next() {
		var r string
		if err := rows.Scan(&r); err != nil {
			return nil, err
		}
		results = append(results, r)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return results, nil
}
func ExtractBrandInfo(ctx context.Context, session *sql.DB) ([]string, error) {
	return ExtractDistinctValues(ctx, session, "brand")
}
func ExtractStoreInfo(ctx context.Context, session *sql.DB) (*[]db.Store, error) {
	allStores, err := store.GetStores(ctx, session)
	if err != nil {
		return nil, err
	}
	existingStoreNameArr, err := ExtractDistinctValues(ctx, session, "store_name")
	if err != nil {
		return nil, err
	}
	var filteredStores []db.Store
	for _, store := range *allStores {
		for _, storeName := range existingStoreNameArr {
			if store.StoreName == storeName {
				filteredStores = append(filteredStores, store)
			}
		}
	}
	return &filteredStores, nil
}
