package filter

import (
	"context"
	"product-server/pkg/entities"
	"testing"
)

var (
	pf        = &ProductFilter{Limit: pageLimit}
	dbUrl     = "root:@tcp(localhost:3306)/captured_dev"
	pageLimit = 50
)

func TestFilter(t *testing.T) {
	var ctx = context.Background()
	brand := "patagonia"
	defaultFilter := entities.Filter{Brand: &brand}

	filterRes := pf.Filter(ctx, &defaultFilter, 1)

	t.Log(len(filterRes.Data))
}

func TestDefaultFilterData(t *testing.T) {
	var ctx = context.Background()
	defaultFilter := entities.Filter{}
	data, err := pf.FilterData(ctx, &defaultFilter)

	if err != nil {
		t.Errorf("Error occurred during filtering: %v", err)
		return
	}

	if len(data) > 0 {
		t.Logf("cardArr Len : %v", len(data))
	} else {
		t.Errorf("Expected %d data", pageLimit)
	}
}

func TestSplitData(t *testing.T) {
	var ctx = context.Background()
	defaultFilter := entities.Filter{}
	data, _ := pf.FilterData(ctx, &defaultFilter)

	pageBox, err := pf.SplitData(data)

	if err == nil {
		t.Logf("cardArr Len : %v", len(data))
		for key := range pageBox {
			t.Logf("pageBox Page : %v", (key))
		}
	}

}
