package pipe

import (
	customslice "backend/lib/custom_slice"
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"backend/pkg/product"
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"strings"
)

func NewUploader() *Uploader {
	envset.LoadEnv()
	dbUrl := db.DBUrl()
	client, err := sql.Open("mysql", dbUrl)

	if err != nil {
		log.Fatal(err)
	}

	store := &DB{Session: client}
	return &Uploader{store}
}

type Uploader struct {
	store ProductStore
}

type ProductStore interface {
	Upload(prods *[]db.Product) error
	SetSoldOut(brandName []string, storeName []string) error
}

func (u *Uploader) Run(storeName string, searchType string, fileName string) {
	data := u.loadFile(storeName, searchType, fileName)
	for i := range *data {
		(*data)[i].StoreName = storeName
	}
	brands := customslice.UniqueSliceElements[db.Product, string](*data, u.Selector)
	u.SetSoldOut(brands, []string{storeName})
	u.Upload(data)
	fmt.Printf("successfully Upload %s %s %s", storeName, searchType, fileName)
}

func (p *Uploader) loadFile(storeName string, searchType string, fileName string) *[]db.Product {
	pipeLinePath := os.Getenv("PIPELINE")
	if pipeLinePath == "" {
		log.Fatal("loadFile Error : Env Not Found")
	}
	path := filepath.Join(pipeLinePath, "data", "preprocess", storeName, searchType, fileName)
	data, err := local_file.LoadJson[[]db.Product](path)
	if err != nil {
		log.Fatalf("failed to load data %s", err)
	}
	return data
}

func (p *Uploader) SetSoldOut(brandName []string, storeName []string) {
	err := p.store.SetSoldOut(brandName, storeName)
	if err != nil {
		log.Fatal(err)
	}
}

func (p *Uploader) Upload(rawProducts *[]db.Product) {
	err := p.store.Upload(rawProducts)
	if err != nil {
		log.Fatal(err)
	}
}
func (p *Uploader) Selector(prod db.Product) string {
	return prod.Brand
}

// Uploader Interface : DB
// Uploader Interface : DB
// Uploader Interface : DB
type DB struct {
	Session *sql.DB
}

func (db *DB) Upload(prods *[]db.Product) error {
	ctx := context.Background()
	err := product.CreateProducts(ctx, db.Session, prods)
	if err != nil {
		return err
	}

	return nil
}

func (db *DB) SetSoldOut(brandName []string, storeName []string) error {
	ctx := context.Background()
	err := UpdateSoldOut(ctx, db.Session, brandName, storeName)
	if err != nil {
		return err
	}
	return nil
}

const updateSoldOutQueryRaw = `
UPDATE
    products
SET
    sold_out = true
`

func SoldOutStmt(brandName []string, storeName []string) (string, []interface{}) {
	var filterValues []interface{}
	var whereClauses []string

	if len(brandName) > 0 {
		placeholders := make([]string, len(brandName))
		for i, v := range brandName {
			placeholders[i] = "?"
			filterValues = append(filterValues, v)
		}
		whereClauses = append(whereClauses, "brand IN ("+strings.Join(placeholders, ",")+")")
	}

	if len(storeName) > 0 {
		placeholders := make([]string, len(storeName))
		for i, v := range storeName {
			placeholders[i] = "?"
			filterValues = append(filterValues, v)
		}
		whereClauses = append(whereClauses, "store_name IN ("+strings.Join(placeholders, ",")+")")
	}

	// Combine the WHERE clauses with AND
	whereClause := strings.Join(whereClauses, " AND ")

	// Build the final query
	query := updateSoldOutQueryRaw + ` WHERE ` + whereClause

	return query, filterValues
}

func UpdateSoldOut(ctx context.Context, session *sql.DB, brandName []string, storeName []string) error {
	query, values := SoldOutStmt(brandName, storeName)
	_, err := session.ExecContext(ctx, query, values...)
	return err
}
