package search

import (
	"context"
	"product-server/ent"
	"product-server/ent/productinfo"
	"product-server/ent/size"
)

func Search(ctx context.Context, session *ent.Client, keyword string) ([]*ent.ProductInfo, error) {

	product, err := session.ProductInfo.Query().
		Where(
			productinfo.SearchInfoContainsFold(keyword),
			productinfo.HasSizesWith(size.Available(true)),
		).
		All(ctx)

	if err != nil {
		return nil, err
	}

	return product, nil

}
