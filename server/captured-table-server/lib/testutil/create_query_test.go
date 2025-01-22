package testutil

import (
	"backend/pkg/store"
	"context"
	"testing"
)

func Test_Create_query(t *testing.T) {
	session := MockDB(t)
	defer FinishAll(t, session)

	ctx := context.Background()
	LoadStoreDataForForeignKey(t, session, ctx)

	t.Run("test data foreign key", func(t *testing.T) {
		p, err := store.GetStores(ctx, session)
		if err != nil {
			t.Fatal(err)
		}
		t.Log(p)
	})
	t.Run("test load mock product data", func(t *testing.T) {

		LoadMockProductData(t, session, ctx)
		p, err := GetProductsQuery(ctx, session)
		if err != nil {
			t.Fatal(err)
		}
		t.Log(p)
	})

}
