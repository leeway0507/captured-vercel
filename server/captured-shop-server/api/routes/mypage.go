package routes

import (
	"product-server/api/handlers"
	"product-server/ent"

	"github.com/gofiber/fiber/v2"
)

func MypageRouter(app fiber.Router, session *ent.Client) {

	app.Get("/address", handlers.GetAddressByUserID(session))
	app.Get("/address-by-id", handlers.GetAddressByAddressID(session))
	// app.Post("/address", handlers.PostAddress(session))
	// app.Patch("/address", handlers.PatchAddress(session))
	// app.Delete("/address", handlers.DeleteAddress(session))

}
