package currency

import (
	"backend/lib/local_file"
	"encoding/json"
	"encoding/xml"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"os"
	"path"
	"regexp"
	"strconv"
	"strings"
	"time"
)

type CustomXMLItem struct {
	CurrSgn string  `xml:"currSgn"`
	Fxrt    float64 `xml:"fxrt"`
}

type CustomXMLItems struct {
	Item []CustomXMLItem `xml:"item"`
}

type CustomXMLBody struct {
	Items CustomXMLItems `xml:"items"`
}

type CustomXMLHeader struct {
	ResultCode string `xml:"resultCode"`
	ResultMsg  string `xml:"resultMsg"`
}

type CustomResponse struct {
	Header CustomXMLHeader `xml:"header"`
	Body   CustomXMLBody   `xml:"body"`
}

type BuyingJsonItems struct {
	CurUnit string `json:"cur_unit"`
	Tts     string `json:"tts"`
}

type BuyingResponse struct {
	Items []BuyingJsonItems
}

type CurrencyData struct {
	Update string
	Data   map[string]float64
}

type Currency struct {
	CustomCurrency CurrencyData
	BuyingCurrency CurrencyData
}

type PriceForm struct {
	CurrChar string
	CurrCode string
	Price    float64
}
type CurrencyInterface interface {
	GetPriceInfo(price string) *PriceForm
}

func NewCurrency() *Currency {
	c := &Currency{}
	c.GetCustomCurrency()
	c.GetBuyingCurrency()
	return c
}

var (
	today    = strings.Replace(time.Now().Format(time.DateOnly), "-", "", -1)
	currDict = map[string]string{
		"$": "USD",
		"€": "EUR",
		"¥": "JPY",
		"£": "GBP",
		"￡": "GBP",
		"₩": "KRW",
		"원": "KRW",
	}
)

func (c *Currency) GetCurrency() map[string]CurrencyData {
	return map[string]CurrencyData{
		"buying": c.BuyingCurrency,
		"custom": c.CustomCurrency,
	}
}

func (c *Currency) GetPriceInfo(price string) *PriceForm {
	pattern := "[$€¥£￡₩원]"
	var re *regexp.Regexp

	re = regexp.MustCompile(pattern)
	currChar := re.FindString(price)

	var curString string
	re = regexp.MustCompile("[^0-9,]")
	l := strings.Split(re.ReplaceAllString(strings.ReplaceAll(price, ".", ","), ""), ",")

	// len(l) == 1 ex) 80 or 8
	if len(l) > 1 && len(l[len(l)-1]) < 3 {
		f := strings.Join(l[:len(l)-1], "")
		curString = f + "." + l[len(l)-1]
	} else {
		curString = strings.Join(l, "")
	}
	currFloat, err := strconv.ParseFloat(curString, 64)
	if err != nil {
		return nil
	}

	return &PriceForm{
		CurrChar: currChar,
		CurrCode: currDict[currChar],
		Price:    currFloat,
	}
}

func (c *Currency) GetCustomCurrency() {
	data, err := c.LoadCurrency("custom")

	if err != nil {
		fmt.Print(err.Error())
	}

	// if err != nil || data.Update != today {
	// 	data, err := c.GetCustomCurrencyFromAPI()

	// 	if err != nil {
	// 		panic(err)
	// 	}

	// 	if err := c.SaveCurrency(*data, "custom"); err != nil {
	// 		panic(err)
	// 	}
	// 	c.CustomCurrency = *data
	// 	return
	// }

	c.CustomCurrency = *data

}

func (c *Currency) GetCustomCurrencyFromAPI() (*CurrencyData, error) {

	url, err := c.CustomReqUrl()
	if err != nil {
		return nil, err
	}

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	customData, err := c.extractCustomData(body)

	if err != nil {
		return nil, err
	}

	return customData, nil
}
func (c *Currency) CustomReqUrl() (string, error) {
	baseUrl := "http://apis.data.go.kr/1220000/retrieveTrifFxrtInfo/getRetrieveTrifFxrtInfo"
	reqestUrl, err := url.Parse(baseUrl)

	if err != nil {
		return "", err
	}

	params := url.Values{}
	params.Add("serviceKey", os.Getenv("CUSTOM_CURRENCY_API_KEY"))
	params.Add("aplyBgnDt", today)
	params.Add("weekFxrtTpcd", "2")
	reqestUrl.RawQuery = params.Encode()
	return reqestUrl.String(), nil
}

func (c *Currency) extractCustomData(body []byte) (*CurrencyData, error) {
	var customXML CustomResponse
	err := xml.Unmarshal(body, &customXML)

	if err != nil {
		return nil, err
	}

	currencyData := make(map[string]float64)
	for _, item := range customXML.Body.Items.Item {
		currencyData[item.CurrSgn] = item.Fxrt
	}
	result := CurrencyData{Update: today, Data: currencyData}

	return &result, nil
}

func (c *Currency) GetBuyingCurrency() {
	data, err := c.LoadCurrency("buying")

	if err != nil {
		fmt.Print(err.Error())
	}

	// if err != nil || data.Update != today {
	// 	data, err := c.GetBuyingCurrencyFromAPI()

	// 	if err != nil {
	// 		log.Fatalf("GetBuyingCurrencyFromAPI error: %s", err)
	// 	}

	// 	if err := c.SaveCurrency(*data, "buying"); err != nil {
	// 		log.Fatalf("SaveCurrency error: %s", err)
	// 	}
	// 	c.BuyingCurrency = *data

	// 	return
	// }

	c.BuyingCurrency = *data

}

func (c *Currency) GetBuyingCurrencyFromAPI() (*CurrencyData, error) {
	url, err := c.BuyingReqUrl()
	if err != nil {
		return nil, err
	}
	for i := 0; i < 5; i++ {
		oldDate := time.Now().AddDate(0, 0, -(i - 1)).Format(time.DateOnly)
		oldDate = strings.Replace(oldDate, "-", "", -1)

		reqDate := time.Now().AddDate(0, 0, -i).Format(time.DateOnly)
		reqDate = strings.Replace(reqDate, "-", "", -1)

		url = strings.Replace(url, oldDate, reqDate, -1)

		CurrencyData, err := c.getBuyingCurrencyFromAPI(url)
		if err != nil {
			return nil, err
		}
		// 수집체크
		var d = *CurrencyData
		_, ok := d.Data["KRW"]

		if ok {
			return CurrencyData, nil
		}

	}
	return &CurrencyData{}, nil

}
func (c *Currency) getBuyingCurrencyFromAPI(url string) (*CurrencyData, error) {

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}

	defer resp.Body.Close()

	// Read the response body
	body, err := io.ReadAll(resp.Body)

	if err != nil {
		return nil, err
	}

	customData, err := c.extractBuyingData(body)

	if err != nil {
		return nil, err
	}

	return &CurrencyData{Update: today, Data: *customData}, nil

}

func (c *Currency) BuyingReqUrl() (string, error) {
	baseUrl := "https://www.koreaexim.go.kr/site/program/financial/exchangeJSON"
	reqestUrl, err := url.Parse(baseUrl)

	if err != nil {
		return "", err
	}

	params := url.Values{}
	params.Add("authkey", os.Getenv("BUYING_CURRENCY_API_KEY"))
	params.Add("searchdate", today)
	params.Add("data", "AP01")

	reqestUrl.RawQuery = params.Encode()
	return reqestUrl.String(), nil

}

func (c *Currency) extractBuyingData(body []byte) (*map[string]float64, error) {
	var rawData []BuyingJsonItems
	err := json.Unmarshal(body, &rawData)
	if err != nil {
		return nil, err
	}

	currencyData := make(map[string]float64)
	for _, item := range rawData {
		c := strings.Replace(item.Tts, ",", "", -1)
		floatC, err := strconv.ParseFloat(c, 64)

		if err != nil {
			return nil, err
		}
		if item.CurUnit == "JPY(100)" {
			currencyData["JPY"] = floatC
			continue
		}

		currencyData[item.CurUnit] = floatC
	}

	return &currencyData, nil
}

func (c *Currency) LoadCurrency(fileName string) (*CurrencyData, error) {

	rootDir := os.Getenv("BASE_DIR")
	if rootDir == "" {
		return nil, fmt.Errorf("LoadCurrency : Env Not Loaded")
	}
	filePath := path.Join(rootDir, "lib", "currency", "data", fileName+".json")
	data, err := local_file.LoadJson[CurrencyData](filePath)

	if err != nil {
		return nil, err
	}

	return data, err
}

func (c *Currency) SaveCurrency(data CurrencyData, fileName string) error {
	jsonData, err := json.MarshalIndent(data, "", "    ")
	if err != nil {
		return err
	}
	rootDir := os.Getenv("BASE_DIR")
	if rootDir == "" {
		return fmt.Errorf("SaveCurrency : Env Not Loaded")
	}
	filePath := path.Join(rootDir, "lib", "currency", "data", fileName+".json")

	err = local_file.SaveFile(jsonData, filePath)
	if err != nil {
		return err
	}

	fmt.Printf("successfully save %s \n path: %s", fileName, filePath)

	return nil
}
