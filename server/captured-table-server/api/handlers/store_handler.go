package handlers

import (
	"backend/pkg/store"
	"context"
	"database/sql"

	"github.com/gofiber/fiber/v2"
)

func GetStores(session *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// param
		ctx := context.Background()

		result, err := store.GetStores(ctx, session)

		if err != nil {
			return HandlerErr(c, err.Error())
		}

		return c.JSON(fiber.Map{"data": result})
	}

}

func GetStore(session *sql.DB) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// param
		ctx := context.Background()
		storeName := c.Params("storeName")

		result, err := store.GetStore(ctx, session, storeName)

		if err != nil {
			return HandlerErr(c, err.Error())
		}

		return c.JSON(fiber.Map{"data": result})
	}

}
