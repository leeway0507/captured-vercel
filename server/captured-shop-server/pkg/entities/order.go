package entities

import "time"

type SizeCheckForm struct {
	Form *[]string
	Sku  *[]int32
}

type PreOrder struct {
	OrderID     string
	AddressId   string
	Amount      int
	Arr         *[]OrderRows
	AccessToken string
}

type OrderRows struct {
	OrderID  string
	Sku      int
	Size     string
	Quantity int
}
type OrderHistoryReq struct {
	OrderID         string
	PaymentKey      string
	OrderedAt       time.Time
	OrderTotalPrice int
	PaymentMethod   string
	PaymentInfo     string
}
