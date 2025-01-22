package db

import (
	"context"
	"testing"
)

func TestSession(t *testing.T) {
	client := Session()
	ctx := context.Background()
	r, _ := client.ProductInfo.Query().First(ctx)

	if r == nil {
		t.Log("failed to load DB")
	}

}
