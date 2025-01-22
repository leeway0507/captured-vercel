package currency

import (
	"backend/lib/envset"
	"fmt"
	"io"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"
)

func TestCurrency(t *testing.T) {
	envset.Load(".env.dev")

	currencyImpl := Currency{
		CustomCurrency: CurrencyData{},
		BuyingCurrency: CurrencyData{},
	}

	t.Run("Test Get 'Custom Currency' From API Server", func(t *testing.T) {
		resp, err := currencyImpl.GetCustomCurrencyFromAPI()
		if err != nil {
			t.Fatalf(err.Error())
		}
		t.Log(resp)
	})
	t.Run("Test CustomReqUrl", func(t *testing.T) {
		reqUrl, err := currencyImpl.CustomReqUrl()
		if err != nil {
			t.Fatalf(err.Error())
		}
		urlObj, err := url.ParseRequestURI(reqUrl)
		if err != nil {
			t.Fatalf(err.Error())
		}
		x := urlObj.Query()
		want := strings.Replace(time.Now().Format(time.DateOnly), "-", "", -1)
		got := x["aplyBgnDt"][0]

		if got != want {
			t.Fatalf("\nCustomReqUrl Query String Error \n got : %s \n want : %s", got, want)
		}

	})
	t.Run("Test Extract 'Custom Currency' from custom Currency XML", func(t *testing.T) {
		xmlPath := "/Users/yangwoolee/repo/captured-filter/backend/lib/testutil/mock_data/currency/custom_response.xml"
		file, err := os.Open(xmlPath)
		if err != nil {
			t.Fatalf(err.Error())
		}

		b, err := io.ReadAll(file)
		if err != nil {
			t.Fatalf(err.Error())
		}

		customCurrency, xmlErr := currencyImpl.extractCustomData(b)

		if xmlErr != nil {
			t.Fatalf(xmlErr.Error())
		}

		got := customCurrency.Data
		_, exist := got["KRW"]
		if !exist {
			t.Fatal("failed to extract Custom Currency")
		}

	})
	t.Run("Test BuyingReqUrl", func(t *testing.T) {
		reqUrl, err := currencyImpl.BuyingReqUrl()
		if err != nil {
			t.Fatalf(err.Error())
		}
		urlObj, err := url.ParseRequestURI(reqUrl)
		if err != nil {
			t.Fatalf(err.Error())
		}
		x := urlObj.Query()
		want := strings.Replace(time.Now().Format(time.DateOnly), "-", "", -1)
		got := x["searchdate"][0]

		if got != want {
			t.Fatalf("\nBuyingReqUrl Query String Error \n got : %s \n want : %s", got, want)
		}

	})
	t.Run("Test GetBuyingCurrencyFromAPI", func(t *testing.T) {
		_, err := currencyImpl.GetBuyingCurrencyFromAPI()
		if err != nil {
			t.Fatalf(err.Error())
		}

	})

	t.Run("Test extractBuyingData", func(t *testing.T) {
		jsonPath := "/Users/yangwoolee/repo/captured-filter/backend/lib/testutil/mock_data/currency/buying_response.json"
		file, err := os.Open(jsonPath)
		if err != nil {
			t.Fatalf(err.Error())
		}

		b, err := io.ReadAll(file)
		if err != nil {
			t.Fatalf(err.Error())
		}

		buyingData, err := currencyImpl.extractBuyingData(b)
		if err != nil {
			t.Fatalf(err.Error())
		}

		got := *buyingData
		_, exist := got["KRW"]
		if !exist {
			t.Fatal("failed to extract Custom Currency")
		}

		t.Log(got)

	})

	t.Run("Test SaveCurrency", func(t *testing.T) {
		xmlPath := "/Users/yangwoolee/repo/captured-filter/backend/lib/testutil/mock_data/currency/custom_response.xml"
		file, err := os.Open(xmlPath)
		if err != nil {
			t.Fatalf(err.Error())
		}

		b, err := io.ReadAll(file)
		if err != nil {
			t.Fatalf(err.Error())
		}

		customCurrency, xmlErr := currencyImpl.extractCustomData(b)

		if xmlErr != nil {
			t.Fatalf(xmlErr.Error())
		}

		err = currencyImpl.SaveCurrency(*customCurrency, "custom")

		if err != nil {
			t.Fatalf(err.Error())
		}

	})

	t.Run("Test Load Currency", func(t *testing.T) {
		data, err := currencyImpl.LoadCurrency("custom")

		if err != nil {
			t.Fatalf(err.Error())
		}
		fmt.Println(data)
	})
	t.Run("Test Get Price Form", func(t *testing.T) {

		type TestForm struct {
			got  string
			want PriceForm
		}
		testFormArr := []TestForm{
			{
				got: "€40.33",
				want: PriceForm{
					CurrCode: "EUR",
					CurrChar: "€",
					Price:    40.33,
				},
			},
			{
				got: "$1,336.20",
				want: PriceForm{
					CurrCode: "USD",
					CurrChar: "$",
					Price:    1336.20,
				},
			},
		}

		for _, testForm := range testFormArr {
			priceForm := currencyImpl.GetPriceInfo(testForm.got)
			if priceForm.CurrCode != testForm.want.CurrCode {
				t.Errorf("CurrCode got '%s' origin '%s'",
					priceForm.CurrCode,
					testForm.want.CurrCode)
			}

			if priceForm.CurrChar != testForm.want.CurrChar {
				t.Errorf("CurrChar got '%s' origin '%s'",
					priceForm.CurrChar,
					testForm.want.CurrChar)
			}
			if priceForm.Price != testForm.want.Price {
				t.Errorf("Price got '%f'origin '%f'",
					priceForm.Price,
					testForm.want.Price)
			}
		}

	})

	t.Run("Test Get Currency", func(t *testing.T) {
		currencyImpl.GetCustomCurrency()
		got := currencyImpl.CustomCurrency.Data

		_, exist := got["KRW"]
		if !exist {
			t.Fatal("failed to extract Custom Currency")
		}

	})

	t.Run("Test Get Buying", func(t *testing.T) {
		currencyImpl.GetBuyingCurrency()
		got := currencyImpl.BuyingCurrency.Data

		_, exist := got["KRW"]
		if !exist {
			t.Fatal("failed to extract Buying Currency")
		}

	})

}
