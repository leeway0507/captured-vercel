package handlers

import (
	"net/http"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/log"
)

func HandlerErr(c *fiber.Ctx, body string) error {
	c.Status(http.StatusBadRequest)
	log.Error(body)
	return c.JSON(fiber.Map{"body": body})
}
