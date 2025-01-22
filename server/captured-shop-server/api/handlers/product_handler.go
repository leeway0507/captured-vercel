package handlers

import (
	"product-server/ent"
	"product-server/pkg/entities"
	"product-server/pkg/filter"
	"product-server/pkg/productMeta"
	"product-server/pkg/search"

	"context"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

type FilterParser struct {
	Page int `query:"page"`
}
type KeywordParser struct {
	Keyword string `query:"keyword"`
}

// Cards godoc
// @Summary      category
// @Accept       json
// @Produce      json
// @Param        page query int true "Page number"
// @Param        filter	body entities.Filter true "Filter Body"
// @Success      200  {array}   entities.CardArr
// @Failure      400  {int}  http.StatusBadRequest
// @Failure      404  {int}  http.NotFound
// @Failure      500  {int}  http.StatusInternalServerError
// @Router       /api/product/category [post]
func Cards(pf filter.ProductFilter) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var ctx = context.Background()

		// extract body
		var requestBody entities.Filter
		if err := c.BodyParser(&requestBody); err != nil {
			body := fmt.Sprintf("BodyParser Error!! \n err : %v", err)
			return HandlerErr(c, body)
		}
		// extract param
		page := new(FilterParser)
		if err := c.QueryParser(page); err != nil {
			return HandlerErr(c, err.Error())
		}

		// fmt.Printf("%+v\n", requestBody)
		// get filter result
		filterRes := pf.Filter(ctx, &requestBody, page.Page)
		if filterRes.Err != nil {
			body := fmt.Sprintf("ProductFilter.FilterData Error \n err : %v", filterRes.Err)
			return HandlerErr(c, body)

		}
		// fmt.Printf("current %v", filterRes.CurrentPage)
		return c.JSON(fiber.Map{
			"data":        filterRes.Data,
			"currentPage": filterRes.CurrentPage,
			"lastPage":    filterRes.LastPage,
		})

	}
}

func Card(session *ent.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()

		sku, err := c.ParamsInt("sku")
		if err != nil {
			body := fmt.Sprintf("No SKU  \n err : %v", err)
			return HandlerErr(c, body)

		}

		productSpec, err := productMeta.ProductMeta(ctx, session, sku)

		if ent.IsNotFound(err) {
			return c.JSON(fiber.Map{"body": nil})
		}

		if err != nil {
			body := fmt.Sprintf("query error  \n err : %v", err)
			return HandlerErr(c, body)

		}

		return c.JSON(productSpec)

	}
}

func Search(session *ent.Client) fiber.Handler {
	return func(c *fiber.Ctx) error {
		ctx := context.Background()
		// param
		parser := new(KeywordParser)
		if err := c.QueryParser(parser); err != nil {
			return HandlerErr(c, err.Error())
		}
		searchResult, err := search.Search(ctx, session, parser.Keyword)
		if err != nil {
			body := fmt.Sprintf("search error  \n err : %v", err)
			return HandlerErr(c, body)

		}
		return c.JSON(fiber.Map{"data": searchResult})
	}

}
