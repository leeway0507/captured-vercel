package routes

import (
	"backend/api/handlers"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func ProductRouter(app fiber.Router, session *sql.DB) {

	app.Get("/", handlers.GetProducts(session))
	app.Get("/filter-meta", handlers.GetFilterMeta(session))
	app.Get("/search", handlers.SearchProducts(session))
	app.Get("/reset-product-cache", handlers.ResetProductCache())
	app.Get("/:id", handlers.GetProduct(session))

}
