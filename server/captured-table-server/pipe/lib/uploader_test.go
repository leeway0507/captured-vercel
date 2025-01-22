package pipe

import (
	"backend/lib/envset"
	"backend/lib/testutil"
	"backend/pkg/product"
	"context"
	"testing"
)

var (
	fileName   = "upload-test.json"
	storeName  = "test_store"
	searchType = "list"
)

func Test_DB_Uploader(t *testing.T) {
	envset.Load(".env.dev")
	u := Uploader{}

	t.Run("Test_Load_Preprocess_File", func(t *testing.T) {

		d := u.loadFile(storeName, searchType, fileName)
		if len(*d) == 0 {
			t.Error("Test_Load_Preprocess_File Error")
		}
		t.Logf("%+v\n\n", (*d)[0])
	})
	t.Run("test soldOut stmt", func(t *testing.T) {
		brandName := []string{"adidas", "adidas_first"}
		storeName := []string{"test_store"}
		query, value := SoldOutStmt(brandName, storeName)

		want := []interface{}{"adidas", "adidas_first", "test_store"}
		testutil.Equal(t, value, want)
		t.Log(query)
	})
	t.Run("Test change all soldout", func(t *testing.T) {
		// settings
		session := testutil.MockDB(t)
		ctx := context.Background()
		testutil.LoadStoreDataForForeignKey(t, session, ctx)
		testutil.LoadMockProductData(t, session, ctx)
		DB_Uploader := &DB{Session: session}
		u.store = DB_Uploader

		// soldOut target
		brandName := []string{"adidas", "adidas_first"}
		storeName := []string{"test_store"}

		// set soldOut
		u.SetSoldOut(brandName, storeName)

		// check soldOut ok
		var soldOut []bool
		query, value := SoldOutStmt(brandName, storeName)
		rows, err := session.QueryContext(ctx, query, value...)
		if err != nil {
			t.Fatal(err)
		}

		for rows.Next() {
			var s bool
			if err := rows.Scan(&s); err != nil {
				t.Fatal(err)
			}
			soldOut = append(soldOut, s)
		}

		if err := rows.Err(); err != nil {
			t.Fatal(err)
		}

		for _, b := range soldOut {
			if b == false {
				t.Error(soldOut)
				t.Fatalf("SetSoldOut error : r should not include false ")
			}

		}

	})

	t.Run("Test_Upload_DB", func(t *testing.T) {
		session := testutil.MockDB(t)
		ctx := context.Background()

		testutil.LoadStoreDataForForeignKey(t, session, ctx)

		u.store = &DB{Session: session}

		data := u.loadFile(storeName, searchType, fileName)
		for i := range *data {
			(*data)[i].StoreName = storeName
		}

		u.Upload(data)

		q, err := product.GetProduct(ctx, session, 1)
		if err != nil {
			t.Fatal(err.Error())
		}
		t.Log(q)

	})

}
