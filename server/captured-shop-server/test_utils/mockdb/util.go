package mockdb

import (
	"encoding/json"
	"io"
	"os"
	"path/filepath"
	"product-server/ent"
	"testing"
)

func loadFile(t testing.TB, fileName string) []byte {
	currDir := "/Users/yangwoolee/repo/captured/main/product-server-golang/test_utils/mockdb"

	f, err := os.Open(filepath.Join(currDir, fileName))
	if err != nil {
		t.Error(err)

	}

	defer f.Close()

	raw, err := io.ReadAll(f)
	if err != nil {
		t.Error(err)
	}

	return raw

}

func ProdInfoCreateBulk(t testing.TB, session *ent.Client) []*ent.ProductInfoCreate {
	raw := loadFile(t, "product_info.json")

	var rows []ent.ProductInfo
	err := json.Unmarshal(raw, &rows)
	if err != nil {
		t.Error(err)
	}

	CreateBulk := []*ent.ProductInfoCreate{}
	for _, prodInfo := range rows {
		CreateBulk = append(CreateBulk, ProdInfoCreate(t, session, prodInfo))
	}
	return CreateBulk
}

func ProdInfoCreate(t testing.TB, session *ent.Client, prodInfo ent.ProductInfo) *ent.ProductInfoCreate {
	return session.ProductInfo.Create().
		SetID(prodInfo.ID).
		SetBrand(prodInfo.Brand).
		SetProductName(prodInfo.ProductName).
		SetProductID(prodInfo.ProductID).
		SetShippingFee(prodInfo.ShippingFee).
		SetPrice(prodInfo.Price).
		SetIntl(prodInfo.Intl).
		SetSearchInfo(prodInfo.SearchInfo).
		SetColor(prodInfo.Color).
		SetCategory(prodInfo.Category).
		SetCategorySpec(prodInfo.CategorySpec).
		SetImgType(prodInfo.ImgType).
		SetPriceDescCursor(prodInfo.PriceDescCursor).
		SetPriceAscCursor(prodInfo.PriceAscCursor).
		SetDeploy(prodInfo.Deploy).
		SetKorProductName(prodInfo.KorProductName).
		SetKorBrand(prodInfo.KorBrand)
}

func SizeCreateBulk(t testing.TB, session *ent.Client) []*ent.SizeCreate {
	raw := loadFile(t, "size.json")

	var rows []ent.Size
	err := json.Unmarshal(raw, &rows)
	if err != nil {
		t.Errorf("Error : %v", err)
	}

	CreateBulk := []*ent.SizeCreate{}
	for _, size := range rows {
		CreateBulk = append(CreateBulk, SizeCreate(t, session, size))
	}
	return CreateBulk

}
func SizeCreate(t testing.TB, session *ent.Client, size ent.Size) *ent.SizeCreate {
	return session.Size.Create().
		SetID(size.ID).
		SetSku(size.Sku).
		SetSize(size.Size).
		SetAvailable(size.Available).
		SetUpdatedAt(size.UpdatedAt)
}
