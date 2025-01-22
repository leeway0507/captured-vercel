package apitest

import (
	"encoding/json"
	"io"
	"net/http"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/utils"
)

func IsSuccess[T any](t *testing.T, app *fiber.App, req *http.Request) map[string]T {
	res, err := app.Test(req)
	body, _ := io.ReadAll(res.Body)

	if res.StatusCode == 400 {
		t.Error(string(body), err)
	}

	utils.AssertEqual(t, 200, res.StatusCode, "Status code")

	var m map[string]T
	jsonErr := json.Unmarshal(body, &m)

	if jsonErr != nil {
		t.Error(string(body), jsonErr)
	}

	return m
}
