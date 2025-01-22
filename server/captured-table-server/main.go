package main

import (
	"backend/api/routes"
	"backend/lib/currency"
	"backend/lib/db"
	"backend/lib/envset"
	"database/sql"
	"log"
	"os"

	_ "backend/docs"

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
	envset.LoadEnv()
	session := db.Session()
	defer session.Close()

	// Launch App
	app := fiber.New()
	app.Use(cors.New(cors.Config{
		AllowOrigins: os.Getenv("CORS_ALLOW_ORIGINS"),
		AllowHeaders: "Origin, Content-Type, Accept",
	}))
	setRoutes(app, session)

	log.Fatal(app.Listen(":8090"))
}

func setRoutes(app *fiber.App, session *sql.DB) {
	var currImpl = currency.NewCurrency()
	app.Get("/docs/*", swagger.HandlerDefault) // default
	routes.ProductRouter(app.Group("/api/product"), session)
	routes.StoreRouter(app.Group("/api/store"), session)
	routes.Currency(app.Group("api/currency"), currImpl)
}
