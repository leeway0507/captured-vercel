package routes

import (
	"backend/api/handlers"
	"backend/lib/currency"

	"github.com/gofiber/fiber/v2"
)

func Currency(app fiber.Router, currImpl *currency.Currency) {
	app.Get("/", handlers.GetCurrency(currImpl))
}
