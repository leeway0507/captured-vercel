package filter

import (
	"context"
	"log"
	"product-server/ent"
	"product-server/ent/productinfo"
	"product-server/ent/size"
	"product-server/pkg/entities"
	"strings"
	"time"

	"github.com/hashicorp/golang-lru/v2/expirable"
)

var (
	cache = expirable.NewLRU[entities.Filter, entities.PageBook](5, nil, time.Second*100)
)

type ProductFilter struct {
	Session *ent.Client
	Limit   int
}

func (pf *ProductFilter) Filter(ctx context.Context, filter *entities.Filter, page int) entities.FilterResopnse {

	cachedPageBox, ok := cache.Get(*filter)

	if ok {
		return entities.FilterResopnse{
			Data:        cachedPageBox[page],
			CurrentPage: page,
			LastPage:    len(cachedPageBox),
			FromCahce:   true,
			Err:         nil,
		}
	}

	prod, err := pf.FilterData(ctx, filter)

	if err != nil {
		return entities.FilterResopnse{
			Data:        entities.CardArr{},
			CurrentPage: 1,
			LastPage:    0,
			FromCahce:   false,
			Err:         err,
		}
	}

	newPageBox, _ := pf.SplitData(prod)
	cache.Add(*filter, newPageBox)

	return entities.FilterResopnse{
		Data:        newPageBox[page],
		CurrentPage: page,
		LastPage:    len(newPageBox),
		FromCahce:   false,
		Err:         nil,
	}
}

func (pf *ProductFilter) FilterData(ctx context.Context, filter *entities.Filter) (entities.CardArr, error) {

	// Default
	productsQuery := pf.Session.ProductInfo.
		Query().
		Where(productinfo.Deploy(1), productinfo.HasSizesWith(size.Available(true)))

	// Category
	if filter.Category != nil && len(*filter.Category) > 0 {
		productsQuery = productsQuery.Where(productinfo.CategoryIn(*filter.Category))
	}

	// CategorySpec
	if filter.CategorySpec != nil && len(*filter.CategorySpec) > 0 {
		categorySpec := strings.Split(*filter.CategorySpec, ",")
		productsQuery = productsQuery.Where(productinfo.CategorySpecIn(categorySpec...))
	}

	// Brand
	if filter.Brand != nil && len(*filter.Brand) > 0 {
		brandArr := strings.Split(*filter.Brand, ",")
		productsQuery = productsQuery.Where(productinfo.BrandIn(brandArr...))
	}

	// Intl
	switch filter.Intl {
	case "해외배송":
		productsQuery = productsQuery.Where(productinfo.Intl(true))
	case "국내배송":
		productsQuery = productsQuery.Where(productinfo.Intl(false))
	default:

	}

	// Price
	if len(filter.Price) == 2 && filter.Price[1] > 0 {
		productsQuery = productsQuery.
			Where(productinfo.And(productinfo.PriceGTE(filter.Price[0]), productinfo.PriceLTE(filter.Price[1])))
	}

	// Size
	if filter.Size != nil && len(*filter.Size) > 0 {
		sizeArr := strings.Split(*filter.Size, ",")
		productsQuery = productsQuery.
			Where(productinfo.HasSizesWith(size.SizeIn(sizeArr...)))
	}

	// SortBy
	switch filter.SortBy {

	case "높은 가격 순":
		productsQuery = productsQuery.Order(productinfo.ByPriceAscCursor())
	case "낮은 가격 순":
		productsQuery = productsQuery.Order(productinfo.ByPriceDescCursor())
	default:
		productsQuery = productsQuery.Order(ent.Desc(productinfo.FieldID))

	}

	// Execute
	products, err := productsQuery.All(ctx)

	if err != nil {
		log.Fatalf("failed to query products: %v", err)
	}

	return products, err

}

func (pf *ProductFilter) SplitData(data entities.CardArr) (entities.PageBook, error) {
	lenData := len(data)
	q, r := lenData/pf.Limit, lenData%pf.Limit

	if r != 0 {
		q++
	}

	PageBook := make(map[int]entities.CardArr)

	for i := 0; i < q; i++ {
		start, end := i*pf.Limit, (i+1)*pf.Limit
		if i+1 == q {
			end = len(data)
		}
		PageBook[i+1] = data[start:end]
	}

	return PageBook, nil
}
