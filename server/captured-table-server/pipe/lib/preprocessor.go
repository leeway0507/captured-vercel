package pipe

import (
	"backend/lib/currency"
	"backend/lib/db"
	"backend/lib/local_file"
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

//loadJson => PreProcess =>saveTolocal => save To DB

type RawProduct struct {
	Brand          string `json:"brand,omitempty"`
	ProductName    string `json:"productName,omitempty"`
	ProductImgUrl  string `json:"productImgUrl,omitempty"`
	ProductUrl     string `json:"productUrl,omitempty"`
	CurrencyCode   string `json:"currencyCode,omitempty"`
	RetailPrice    string `json:"retailPrice,omitempty"`
	SalePrice      string `json:"salePrice,omitempty"`
	IsSale         bool   `json:"isSale,omitempty"`
	MadeIn         string `json:"made_in,omitempty"`
	KorBrand       string `json:"korBrand,omitempty"`
	KorProductName string `json:"korProductName,omitempty"`
	ProductID      string `json:"productId,omitempty"`
	Gender         string `json:"gender,omitempty"`
	Color          string `json:"color,omitempty"`
	Category       string `json:"category,omitempty"`
	CategorySpec   string `json:"categorySpec,omitempty"`
}

type PreProcessor struct {
	currency     currency.CurrencyInterface
	korBrandMeta *map[string]string
}

func NewPreProcessor() *PreProcessor {
	currency := currency.NewCurrency()
	korBrandMeta := LoadFile[map[string]string]("meta/brand.json")
	return &PreProcessor{currency, korBrandMeta}
}

func (p *PreProcessor) Run(storeName string, searchType string, fileName string) {
	path := filepath.Join("data", "inference", storeName, searchType, fileName)
	data := LoadFile[[]RawProduct](path)
	preprocessedData := p.Preprocess(data)
	p.Save(preprocessedData, storeName, searchType, fileName)
	fmt.Printf("successfully preprocess %s/%s/%s", storeName, searchType, fileName)
}

func (p *PreProcessor) Preprocess(rawProducts *[]RawProduct) []db.Product {
	prod := p.DropDuplicate(*rawProducts)
	var data []db.Product
	for _, rawProd := range prod {
		d := p.preprocess(rawProd)
		data = append(data, d)
	}
	return data

}

func (p *PreProcessor) preprocess(rawProd RawProduct) db.Product {
	retailPrice := p.currency.GetPriceInfo(rawProd.RetailPrice).Price
	salePrice := p.currency.GetPriceInfo(rawProd.SalePrice).Price
	korBrand := p.MapKorBrand(rawProd.Brand)

	return db.Product{
		Brand:          rawProd.Brand,
		ProductName:    rawProd.ProductName,
		ProductImgUrl:  rawProd.ProductImgUrl,
		ProductUrl:     rawProd.ProductUrl,
		CurrencyCode:   rawProd.CurrencyCode,
		RetailPrice:    retailPrice,
		SalePrice:      salePrice,
		IsSale:         rawProd.IsSale,
		KorBrand:       korBrand,
		KorProductName: rawProd.KorProductName,
		ProductID:      rawProd.ProductID,
		Gender:         rawProd.Gender,
		Color:          rawProd.Color,
		Category:       rawProd.Category,
		CategorySpec:   rawProd.CategorySpec,
		MadeIn:         rawProd.MadeIn,
		RegisterAt:     time.Now(),
		UpdatedAt:      time.Now(),
	}
}

func (p *PreProcessor) DropDuplicate(inputSlice []RawProduct) []RawProduct {
	uniqueMap := make(map[string]bool)
	var returnSlice []RawProduct

	for _, value := range inputSlice {
		uniqueCheck := value.ProductName + value.ProductUrl
		if _, ok := uniqueMap[uniqueCheck]; !ok {
			uniqueMap[uniqueCheck] = true
			returnSlice = append(returnSlice, value)
		}
	}

	return returnSlice
}
func (p *PreProcessor) MapKorBrand(brandName string) string {
	korName, found := (*p.korBrandMeta)[brandName]
	if !found {
		log.Fatalf("%s is not found in brand meta", brandName)
	}
	return korName
}

func (p *PreProcessor) Save(prod []db.Product, storeName string, searchType string, fileName string) {
	buffer := new(bytes.Buffer)
	encoder := json.NewEncoder(buffer)
	encoder.SetEscapeHTML(false)

	err := encoder.Encode(prod)
	if err != nil {
		log.Fatalf("Save Error : %s", err)
	}

	pipeLinePath := os.Getenv("PIPELINE")
	if pipeLinePath == "" {
		log.Fatalf("Save Error : Env Not Found")
	}
	filePath := filepath.Join(pipeLinePath, "data", "preprocess", storeName, searchType, fileName)
	err = local_file.SaveFile(buffer.Bytes(), filePath)
	if err != nil {
		log.Fatalf("Save Error : %s", err)
	}
}

func (p *PreProcessor) SaveBackup(prod []db.Product, storeName string, searchType string, fileName string) {
	b, err := json.Marshal(prod)
	if err != nil {
		log.Fatalf("Save Error : %s", err)
	}
	pipeLinePath := os.Getenv("PIPELINE")
	if pipeLinePath == "" {
		log.Fatalf("Save Error : Env Not Found")
	}
	filePath := filepath.Join(pipeLinePath, "data", "preprocess", storeName, searchType, fileName)
	err = local_file.SaveFile(b, filePath)
	if err != nil {
		log.Fatalf("Save Error : %s", err)

	}
}

func LoadFile[T any](filePath string) *T {
	pipeLinePath := os.Getenv("PIPELINE")
	if pipeLinePath == "" {
		log.Fatal("loadFile Error : Env Not Found")
	}
	path := filepath.Join(pipeLinePath, filePath)
	data, err := local_file.LoadJson[T](path)
	if err != nil {
		log.Fatalf("failed to load data %s", err)
	}
	return data
}
