package routes

import (
	"backend/api/handlers"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func StoreRouter(app fiber.Router, session *sql.DB) {

	app.Get("/", handlers.GetStores(session))
	app.Get("/:storeName", handlers.GetStore(session))

}
