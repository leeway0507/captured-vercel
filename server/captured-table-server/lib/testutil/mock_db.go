package testutil

import (
	"backend/lib/db"
	"context"
	"database/sql"
	"fmt"
	"log"
	"testing"

	_ "github.com/mattn/go-sqlite3"
)

var testDB = "captured_filter_test"

func MockDB(t *testing.T) *sql.DB {
	dbUrl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		"root", "", "localhost", "3306", testDB)

	session, err := sql.Open("mysql", dbUrl)
	if err != nil {
		t.Fatal(err)
	}
	ctx := context.Background()

	DropAll(t, session)

	err = db.CreateStoresTable(ctx, session)
	if err != nil {
		t.Fatal(err)
	}
	err = db.CreateProductsTable(ctx, session)
	if err != nil {
		t.Fatal(err)
	}

	if err != nil {
		log.Fatal("Failed to session Schema Create")
	}
	return session
}

func DropAll(t *testing.T, db *sql.DB) {
	_, err := db.Exec("DROP TABLE IF EXISTS products")
	if err != nil {
		t.Fatalf(err.Error())
	}
	_, err = db.Exec("DROP TABLE IF EXISTS stores")
	if err != nil {
		t.Fatalf(err.Error())
	}
}

func FinishAll(t *testing.T, db *sql.DB) {
	DropAll(t, db)
	db.Close()
}
