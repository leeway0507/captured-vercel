package routes

import (
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"product-server/api/handlers"
	"product-server/db"
	_ "product-server/docs"
	"product-server/pkg/entities"
	"product-server/pkg/filter"
	"testing"

	"github.com/gofiber/fiber/v2"
	_ "github.com/mattn/go-sqlite3"
)

func Test_Product(t *testing.T) {
	app := fiber.New()
	session := db.Session()

	t.Run("Test_Cards_Handler", func(t *testing.T) {
		// setting
		pf := filter.ProductFilter{Session: session, Limit: 50}

		// Route
		app.Post("/test", handlers.Cards(pf))

		//Request
		brand := "patagonia"
		filter := entities.Filter{Brand: &brand}
		jsonBody, err := json.Marshal(filter)
		if err != nil {
			t.Error("Error : Json Body ")
		}
		req := httptest.NewRequest("POST", "/test?page=1", bytes.NewBuffer(jsonBody))
		req.Header.Set("Content-Type", "application/json")

		// result
		ApiTest(t, app, req)
	})
	t.Run("Test_Card_Handler", func(t *testing.T) {
		app.Get("/test/:sku", handlers.Card(session))

		req := httptest.NewRequest("GET", "/test/2", nil)

		// result
		body := ApiTest(t, app, req)
		if (body["data"]) != nil {
			t.Error("sku 2 must be nil")
		}

	})
	t.Run("Test_Search_Handler", func(t *testing.T) {
		app.Get("/search", handlers.Search(session))

		req := httptest.NewRequest("GET", "/search?keyword=아디다스", nil)

		// result
		ApiTest(t, app, req)

	})

}
