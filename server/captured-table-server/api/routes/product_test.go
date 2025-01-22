package routes

import (
	"backend/api/handlers"
	"backend/lib/book"
	"backend/lib/db"
	"backend/lib/testutil"
	"backend/lib/testutil/apitest"
	"context"
	"database/sql"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func Test_Product_Router(t *testing.T) {
	app := fiber.New()
	session := testutil.MockDB(t)
	setMockProductData(t, session)

	t.Run("Test_GetProducts", func(t *testing.T) {
		app.Get("/getproducts", handlers.GetProducts(session))

		req := httptest.NewRequest("GET", "/getproducts", nil)

		apitest.IsSuccess[book.Response[db.Product]](t, app, req)
	})
	t.Run("Test_SearchProducts", func(t *testing.T) {
		app.Get("/test", handlers.SearchProducts(session))

		searchQuery1 := "b75806"
		searchQuery2 := "ie7002"
		searchQuery3 := "ie3438"
		req1 := httptest.NewRequest("GET", "/test?q="+searchQuery1, nil)
		req2 := httptest.NewRequest("GET", "/test?q="+searchQuery2, nil)
		req3 := httptest.NewRequest("GET", "/test?q="+searchQuery3, nil)

		res1 := apitest.IsSuccess[book.Response[db.Product]](t, app, req1)

		if res1["data"].Data[0].ProductID != searchQuery1 {
			t.Fatalf("got %v want %v", res1["data"].Data[0].ProductID, searchQuery1)
		}

		res2 := apitest.IsSuccess[book.Response[db.Product]](t, app, req2)
		if res2["data"].Data[0].ProductID != searchQuery2 {
			t.Fatalf("got %v want %v", res2["data"].Data[0].ProductID, searchQuery2)
		}

		res3 := apitest.IsSuccess[book.Response[db.Product]](t, app, req1)
		if res3["data"].Data[0].ProductID != searchQuery1 {
			t.Fatalf("got %v want %v", res3["data"].Data[0].ProductID, searchQuery1)
		}

		res4 := apitest.IsSuccess[book.Response[db.Product]](t, app, req1)
		if res4["data"].Data[0].ProductID != searchQuery1 {
			t.Fatalf("got %v want %v", res4["data"].Data[0].ProductID, searchQuery1)
		}

		res5 := apitest.IsSuccess[book.Response[db.Product]](t, app, req1)
		if res5["data"].Data[0].ProductID != searchQuery1 {
			t.Fatalf("got %v want %v", res5["data"].Data[0].ProductID, searchQuery1)
		}

		res6 := apitest.IsSuccess[book.Response[db.Product]](t, app, req2)
		if res6["data"].Data[0].ProductID != searchQuery2 {
			t.Fatalf("got %v want %v", res6["data"].Data[0].ProductID, searchQuery2)
		}

		res7 := apitest.IsSuccess[book.Response[db.Product]](t, app, req3)
		if res7["data"].Data[0].ProductID != searchQuery3 {
			t.Fatalf("got %v want %v", res7["data"].Data[0].ProductID, searchQuery3)
		}

		res8 := apitest.IsSuccess[book.Response[db.Product]](t, app, req3)
		if res8["data"].Data[0].ProductID != searchQuery3 {
			t.Fatalf("got %v want %v", res8["data"].Data[0].ProductID, searchQuery3)
		}

	})

	t.Run("Test_Get_SALE_Products", func(t *testing.T) {
		app.Get("/getproducts", handlers.GetProducts(session))

		req := httptest.NewRequest("GET", "/getproducts?sale=true", nil)

		apitest.IsSuccess[book.Response[db.Product]](t, app, req)
	})

	t.Run("Test_GetProduct", func(t *testing.T) {
		app.Get("/test/:id", handlers.GetProduct(session))

		req := httptest.NewRequest("GET", "/test/1", nil)

		apitest.IsSuccess[book.Response[db.Product]](t, app, req)
	})
}

func setMockProductData(t *testing.T, session *sql.DB) {
	ctx := context.Background()
	testutil.LoadStoreDataForForeignKey(t, session, ctx)
	testutil.LoadMockProductData(t, session, ctx)

}
