package book

import (
	"backend/lib/db"
	"backend/lib/testutil"
	"context"
	"math"
	"testing"

	lru "github.com/hashicorp/golang-lru/v2"
)

var (
	pageLimit = 10
	b         = &Book[string, db.Product]{LimitPerPage: pageLimit}
)

func Test_book(t *testing.T) {
	session := testutil.MockDB(t)
	defer testutil.FinishAll(t, session)

	chapter, err := lru.New[string, Chapter[db.Product]](10)
	if err != nil {
		panic(err)
	}

	b.Session = session
	b.TOC = chapter

	ctx := context.Background()

	testutil.LoadStoreDataForForeignKey(t, session, ctx)
	testutil.LoadMockProductData(t, session, ctx)

	t.Run("Test_Bind_Page", func(t *testing.T) {
		d, err := testutil.GetProductsQuery(ctx, session)
		if err != nil {
			t.Fatal(err)
		}

		res, err := b.BindPage(*d)
		if err != nil {
			t.Fatal(err)
		}
		got := 0
		for range res {
			got++
		}
		f := float64(len(*d)) / float64(b.LimitPerPage)
		want := int(math.Ceil(f))
		if got != (want) {
			t.Fatalf("\n got : %v want :%v \n ", got, want)
		}
	})
	t.Run("Test_Create_Chapter", func(t *testing.T) {
		tempSearchData := func(ctx context.Context, index string) (*[]db.Product, error) {
			return testutil.GetProductsQuery(ctx, session)
		}
		filter := "x"

		_, err := b.CreateChapter(ctx, filter, tempSearchData)
		if err != nil {
			t.Fatal(err)
		}

		v := b.FindPage(ctx, filter, 1, tempSearchData)
		if len(v.Data) != b.LimitPerPage {
			t.Fatalf("Test_Filter Error : length of response data should be same as limit")
		}
	})

}
