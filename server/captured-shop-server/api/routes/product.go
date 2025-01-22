package routes

import (
	"os"
	"product-server/api/handlers"
	"product-server/ent"
	"product-server/pkg/filter"
	"strconv"

	"github.com/gofiber/fiber/v2"
)

func ProductRouter(app fiber.Router, session *ent.Client) {

	pageLimit, err := strconv.Atoi(os.Getenv("PAGE_LIMIT"))
	if err != nil {
		pageLimit = 48
	}

	pf := filter.ProductFilter{Session: session, Limit: pageLimit}

	app.Post("/category", handlers.Cards(pf))
	app.Get("/product/:sku", handlers.Card(session))
	app.Get("/search", handlers.Search(session))

}
