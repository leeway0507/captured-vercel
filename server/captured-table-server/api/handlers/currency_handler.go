package handlers

import (
	"backend/lib/currency"

	"github.com/gofiber/fiber/v2"
)

func GetCurrency(currImpl *currency.Currency) fiber.Handler {
	return func(c *fiber.Ctx) error {
		curr := currImpl.GetCurrency()

		return c.JSON(fiber.Map{"data": curr})
	}

}
