package db

import (
	"context"
	"database/sql"
	"fmt"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

var testDB = "captured_filter_test"

func Test_CREATE_TABLE(t *testing.T) {
	dbUrl := fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		"root", "", "localhost", "3306", testDB)

	session, err := sql.Open("mysql", dbUrl)
	if err != nil {
		t.Fatal(err)
	}

	ctx := context.Background()

	t.Run("Test_stores_Table", func(t *testing.T) {
		err := CreateStoresTable(ctx, session)
		if err != nil {
			t.Fatal(err)
		}
		ok, err := tableExists(session, "stores")
		if err != nil {
			t.Fatal(err)
		}
		if !ok {
			t.Fatal("faile to create stores table")
		}
	})
	t.Run("Test_Product_Table", func(t *testing.T) {
		err := CreateProductsTable(ctx, session)
		if err != nil {
			t.Fatal(err)
		}
		ok, err := tableExists(session, "products")
		if err != nil {
			t.Fatal(err)
		}
		if ok {
			_, err = deleteTable(session, "products")
			if err != nil {
				t.Fatal(err)
			}
			_, err := deleteTable(session, "stores")
			if err != nil {
				t.Fatal(err)
			}

		} else {
			t.Fatal("faile to create products table")
		}
	})
}

const tableExistQueryRaw = `
SELECT EXISTS 
(SELECT 1 
	FROM information_schema.tables 
	WHERE table_schema = ? 
	AND table_name = ?
)
`

func tableExists(db *sql.DB, tableName string) (bool, error) {
	var exists bool
	err := db.QueryRow(tableExistQueryRaw,
		testDB, tableName).
		Scan(&exists)
	if err != nil {
		return false, err
	}
	return exists, nil
}

func deleteTable(db *sql.DB, tableName string) (bool, error) {
	_, err := db.Exec("DROP TABLE IF EXISTS " + tableName)
	if err != nil {
		return false, err
	}
	return true, nil
}
