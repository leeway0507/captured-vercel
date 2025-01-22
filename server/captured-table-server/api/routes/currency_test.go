package routes

import (
	"backend/api/handlers"
	"backend/lib/currency"
	"backend/lib/envset"
	"backend/lib/testutil/apitest"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func TEST_Get_Currency(t *testing.T) {
	app := fiber.New()
	envset.Load(".env.dev")
	currImple := currency.NewCurrency()

	t.Run("Test_GetProducts", func(t *testing.T) {
		app.Get("/test", handlers.GetCurrency(currImple))

		req := httptest.NewRequest("GET", "/test", nil)

		apitest.IsSuccess[map[string]currency.CurrencyData](t, app, req)
	})
}
