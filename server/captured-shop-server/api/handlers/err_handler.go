package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
)

func HandlerErr(c *fiber.Ctx, body string) error {
	c.Status(http.StatusBadRequest)
	return c.JSON(fiber.Map{"body": body})
}
