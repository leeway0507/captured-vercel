package product

import (
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"backend/lib/testutil"
	"context"
	"os"
	"path/filepath"
	"testing"

	_ "github.com/go-sql-driver/mysql"
)

func Test_PRODUCT_QUERY(t *testing.T) {
	client := testutil.MockDB(t)
	defer testutil.FinishAll(t, client)

	ctx := context.Background()
	testutil.LoadStoreDataForForeignKey(t, client, ctx)

	envset.Load(".env.dev")
	mockPath := os.Getenv("MOCK_DATA")

	t.Run("Test_CreateProducts", func(t *testing.T) {
		var filePath = filepath.Join(mockPath, "db", "product_50.json")
		d, err := local_file.LoadJson[[]db.Product](filePath)
		if err != nil {
			t.Fatal(err)
		}

		err = CreateProducts(ctx, client, d)
		if err != nil {
			t.Fatal(err)
		}
	})

	t.Run("Test_GetProducts", func(t *testing.T) {
		q, err := testutil.GetProductsQuery(ctx, client)
		if err != nil {
			t.Fatal(err)
		}
		if len(*q) == 0 {
			t.Fatal(err)
		}
	})

	t.Run("Test_a_GetProduct", func(t *testing.T) {
		id := 1
		q, err := GetProduct(ctx, client, id)
		if err != nil {
			t.Fatal(err)
		}
		if q.ID != 1 {
			t.Fatal(err)
		}
	})
	t.Run("test SearchProducts", func(t *testing.T) {
		// testutil.LoadMockProductData(t, client, ctx)
		v1 := &SearchRequest{Page: 1, Query: "b75806"}
		v2 := &SearchRequest{Page: 1, Query: "ie7002"}
		v3 := &SearchRequest{Page: 1, Query: "ie3438"}

		res1 := SearchProducts(client, v1, 100)
		if res1.Data[0].ProductID != v1.Query {
			t.Fatal(res1.Err)
		}
		res2 := SearchProducts(client, v2, 100)
		if res2.Data[0].ProductID != v2.Query {
			t.Fatal(res2.Err)
		}
		res3 := SearchProducts(client, v1, 100)
		if res3.Data[0].ProductID != v1.Query {
			t.Fatal(res3.Err)
		}
		res4 := SearchProducts(client, v1, 100)
		if res4.Data[0].ProductID != v1.Query {
			t.Fatal(res4.Err)
		}
		res5 := SearchProducts(client, v1, 100)
		if res5.Data[0].ProductID != v1.Query {
			t.Fatal(res5.Err)
		}
		res6 := SearchProducts(client, v2, 100)
		if res6.Data[0].ProductID != v2.Query {
			t.Fatal(res6.Err)
		}

		res7 := SearchProducts(client, v3, 100)
		if res7.Data[0].ProductID != v3.Query {
			t.Fatal(res7.Err)
		}
		res8 := SearchProducts(client, v3, 100)
		if res8.Data[0].ProductID != v3.Query {
			t.Fatal(res8.Err)
		}
	})

}
