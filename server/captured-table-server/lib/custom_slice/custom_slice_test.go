package customslice

import (
	"backend/lib/db"
	"backend/lib/envset"
	"backend/lib/local_file"
	"backend/lib/testutil"
	"os"
	"path/filepath"
	"testing"
)

func Test_Custom_Array(t *testing.T) {
	envset.Load(".env.dev")
	mockPath := os.Getenv("MOCK_DATA")
	var filePath = filepath.Join(mockPath, "db", "product_50.json")
	d, err := local_file.LoadJson[[]db.Product](filePath)
	if err != nil {
		t.Fatal("Product error")
	}
	t.Run("Test UniqueSliceElement", func(t *testing.T) {

		got := UniqueSliceElements[db.Product, string](*d, func(p db.Product) string {
			return p.Brand
		})
		want := []string{"adidas_first", "adidas_second", "adidas_third", "adidas"}
		testutil.Equal(t, got, want)

	})

}
