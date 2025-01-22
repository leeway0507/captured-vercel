package routes

import (
	"product-server/api/handlers"
	"product-server/db"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
)

func Test_Mypage(t *testing.T) {
	app := fiber.New()
	session := db.Session()
	t.Run("Test GetAddress", func(t *testing.T) {
		app.Get("/test", handlers.GetAddressByUserID(session))
		testId := "6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc"
		req := httptest.NewRequest("GET", "/test?userId="+testId, nil)
		ApiTest(t, app, req)
	})
	t.Run("Test GetAddressById", func(t *testing.T) {
		app.Get("/test", handlers.GetAddressByAddressID(session))
		testId := "UA-6x8w1PfgbrODnDE2F0ZrCE0frvBVLAITJgPVLlXHyYc-0"
		req := httptest.NewRequest("GET", "/test?addressId="+testId, nil)
		ApiTest(t, app, req)
	})
}
