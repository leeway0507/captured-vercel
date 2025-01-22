package order

import (
	"context"
	"fmt"
	"product-server/ent"
	"product-server/ent/size"
	"product-server/pkg/entities"
	"slices"
)

type SizeCheck struct {
	Session       *ent.Client
	SizeCheckForm entities.SizeCheckForm
}

func (s *SizeCheck) Validate(ctx context.Context) (map[string]bool, error) {

	skuSizeSlice, err := s.GetCurrentSkuSize(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to retrieve SKU sizes: %v", err)
	}

	responseForm := map[string]bool{}
	for _, r := range *s.SizeCheckForm.Form {
		if slices.Contains(skuSizeSlice, r) {
			responseForm[r] = true
		} else {
			responseForm[r] = false
		}

	}

	return responseForm, nil
}

func (s *SizeCheck) GetCurrentSkuSize(ctx context.Context) ([]string, error) {
	result, err := s.Session.Size.Query().Where(size.SkuIn(*s.SizeCheckForm.Sku...)).All(ctx)
	if err != nil {
		return nil, err // Returning the error directly
	}

	dropDuplicates := map[string]bool{}
	skuSizeSlice := []string{}
	for _, r := range result {
		if !r.Available {
			continue
		}
		skuSize := fmt.Sprintf("%v-%v", r.Sku, r.Size)
		if !dropDuplicates[skuSize] {
			dropDuplicates[skuSize] = true
			skuSizeSlice = append(skuSizeSlice, skuSize)
		}
	}

	return skuSizeSlice, nil // Returning nil for the error, indicating success
}
