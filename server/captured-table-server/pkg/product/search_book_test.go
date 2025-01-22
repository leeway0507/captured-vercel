package product

import (
	"backend/lib/testutil"
	"context"
	"testing"
)

func Test_Search(t *testing.T) {
	session := testutil.MockDB(t)
	defer testutil.FinishAll(t, session)

	ps := NewProductSearchtBook()
	ps.Session = session
	ps.LimitPerPage = 100

	ctx := context.Background()

	testutil.LoadStoreDataForForeignKey(t, session, ctx)
	testutil.LoadMockProductData(t, session, ctx)

	t.Run("test cahce bug", func(t *testing.T) {
		v1 := "ig1376"
		v2 := "ie7002"
		v3 := "ie3438"
		v4 := "-"

		res1 := ps.FindSearchResult(ctx, v1, 1)
		if len(res1.Data) == 0 || res1.Data[0].ProductID != v1 {
			t.Fatalf("res1 error : %s", res1.Err)
		}
		res2 := ps.FindSearchResult(ctx, v2, 1)
		if len(res2.Data) == 0 || res2.Data[0].ProductID != v2 {
			t.Fatalf("res2 error : %s", res2.Err)
		}
		res3 := ps.FindSearchResult(ctx, v1, 1)
		if len(res3.Data) == 0 || res3.Data[0].ProductID != v1 {
			t.Fatalf("res3 error : %s", res3.Err)
		}
		res4 := ps.FindSearchResult(ctx, v1, 1)
		if len(res4.Data) == 0 || res4.Data[0].ProductID != v1 {
			t.Fatalf("res4 error : %s", res4.Err)
		}
		res5 := ps.FindSearchResult(ctx, v1, 1)
		if len(res5.Data) == 0 || res5.Data[0].ProductID != v1 {
			t.Fatalf("res5 error : %s", res5.Err)
		}
		res6 := ps.FindSearchResult(ctx, v2, 1)
		if len(res6.Data) == 0 || res6.Data[0].ProductID != v2 {
			t.Fatalf("res6 error : %s", res6.Err)
		}

		res7 := ps.FindSearchResult(ctx, v3, 1)
		if len(res7.Data) == 0 || res7.Data[0].ProductID != v3 {
			t.Fatalf("res7 error : %s", res7.Err)
		}
		res8 := ps.FindSearchResult(ctx, v4, 1)
		if len(res8.Data) != 0 {
			t.Fatalf("res8 error : %s", res8.Err)
		}
	})
}
