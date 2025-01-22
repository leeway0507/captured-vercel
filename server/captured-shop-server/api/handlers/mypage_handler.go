package handlers

import (
	"product-server/ent"
	"product-server/pkg/mypage"
	"context"

	"github.com/gofiber/fiber/v2"
)

func GetAddressByUserID(session *ent.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// param
		ctx := context.Background()
		userId := c.Query("userId")

		result, err := mypage.GetAddressByUserID(ctx, session, userId)

		if err != nil {
			return HandlerErr(c, err.Error())
		}

		return c.JSON(fiber.Map{"data": result})
	}

}

func GetAddressByAddressID(session *ent.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		// param
		ctx := context.Background()
		AddressId := c.Query("addressId")

		result, err := mypage.GetAddressByAddressID(ctx, session, AddressId)

		if err != nil {
			return HandlerErr(c, err.Error())
		}

		return c.JSON(fiber.Map{"data": result})
	}

}
