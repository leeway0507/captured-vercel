package main

import (
	"log"
	"product-server/api/routes"
	"product-server/db"

	_ "product-server/docs"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/swagger"
)

// @title CAPTURED BACKEND
// @version 1.0
// @description This is a sample swagger for Fiber
// @termsOfService http://swagger.io/terms/
// @contact.name API Support
// @contact.email fiber@swagger.io
// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html
// @host localhost:8080
// @BasePath /

func main() {
	// Conntec DB
	session := db.Session()
	defer session.Close()

	// Launch App
	app := fiber.New()
	app.Use(cors.New())

	app.Get("/", func(ctx *fiber.Ctx) error {
		return ctx.SendString("Hello, World 👋!")
	})
	app.Get("/docs/*", swagger.HandlerDefault) // default
	routes.ProductRouter(app.Group("/api/product"), session)
	log.Fatal(app.Listen(":8080"))
}
