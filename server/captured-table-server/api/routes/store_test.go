package routes

import (
	"backend/api/handlers"
	"backend/lib/db"
	"backend/lib/testutil"
	"backend/lib/testutil/apitest"
	"context"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func Test_Store_Router(t *testing.T) {
	app := fiber.New()
	session := testutil.MockDB(t)
	ctx := context.Background()
	testutil.LoadStoreDataForForeignKey(t, session, ctx)

	t.Run("Test_GetStores", func(t *testing.T) {
		app.Get("/test", handlers.GetStores(session))

		req := httptest.NewRequest("GET", "/test", nil)

		apitest.IsSuccess[[]db.Store](t, app, req)
	})
	t.Run("Test_GetStore", func(t *testing.T) {
		app.Get("/test/:storeName", handlers.GetStore(session))

		req := httptest.NewRequest("GET", "/test/test_store", nil)

		apitest.IsSuccess[db.Store](t, app, req)
	})
}
