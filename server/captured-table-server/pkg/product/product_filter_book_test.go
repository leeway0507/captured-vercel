package product

import (
	"backend/lib/testutil"
	"context"
	"log"
	"testing"
)

func Test_Product_Filter(t *testing.T) {
	session := testutil.MockDB(t)
	pf := NewProductBook()
	pf.Session = session
	pf.LimitPerPage = 100

	defer testutil.FinishAll(t, session)

	ctx := context.Background()
	testutil.LoadStoreDataForForeignKey(t, session, ctx)
	testutil.LoadMockProductData(t, session, ctx)

	t.Run("test_filter_stmt", func(t *testing.T) {
		f := FilterIndex{
			StoreName: &[]string{"test_store_first", "test_store_second"},
			Brand:     &[]string{"adidas_second"},
		}
		query, value := pf.FilterStmt(ctx, f)
		want := []interface{}{"test_store_first", "test_store_second", "adidas_second"}
		testutil.Equal(t, value, want)
		t.Log(query)

	})
	t.Run("test_filter", func(t *testing.T) {
		f := FilterIndex{
			StoreName: &[]string{"test_store_second"},
			Brand:     &[]string{"adidas_second"},
		}
		p, err := pf.SearchData(ctx, f)
		if err != nil {
			log.Fatal(err)
		}
		if len(*p) != 10 {
			log.Fatalf("Test_filterQuery_2 Error : %v", p)
		}
	})
	t.Run("test_sale_filter", func(t *testing.T) {
		f := FilterIndex{
			StoreName: &[]string{"test_store_second"},
			Brand:     &[]string{"adidas_second"},
			Sale:      true,
		}
		p, err := pf.SearchData(ctx, f)
		if err != nil {
			log.Fatal(err)
		}
		if len(*p) != 1 {
			log.Fatalf("Test_filterQuery_2 Error : %v", p)
		}
	})

	t.Run("test_sale_only_filter", func(t *testing.T) {
		f := FilterIndex{
			Sale: true,
		}
		p, err := pf.SearchData(ctx, f)
		if err != nil {
			log.Fatal(err)
		}
		if len(*p) != 5 {
			log.Fatalf("Test_filterQuery_2 Error : %v", p)
		}
	})

}
