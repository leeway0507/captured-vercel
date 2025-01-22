package productMeta

import (
	"context"
	"product-server/ent"
	"product-server/ent/productinfo"
	"product-server/ent/size"
)

type ProductSpec struct {
	ent.ProductInfo
	Size []string `json:"size"`
}

func ProductMeta(ctx context.Context, session *ent.Client, sku int) (*ProductSpec, error) {

	product, err := session.ProductInfo.Query().
		Where(
			productinfo.ID(int32(sku)),
			productinfo.HasSizesWith(size.Available(true)),
		).
		Only(ctx)
	if err != nil {
		return nil, err
	}
	size, err := session.Size.Query().
		Where(
			size.SkuEQ(int32(sku)),
			size.AvailableEQ(true),
		).
		Select(size.FieldSize).
		Strings(ctx)
	if err != nil {
		return nil, err
	}

	return &ProductSpec{ProductInfo: *product, Size: size}, nil

}
