package routes

import (
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)

func ApiTest(t *testing.T, app *fiber.App, req *http.Request) map[string]any {
	res, err := app.Test(req)
	body, _ := io.ReadAll(res.Body)

	if res.StatusCode == 400 {
		t.Error(string(body), err)
	}

	utils.AssertEqual(t, 200, res.StatusCode, "Status code")
	var m map[string]any
	jsonErr := json.Unmarshal(body, &m)

	if jsonErr != nil {
		t.Error(jsonErr)
	}

	return m
}
