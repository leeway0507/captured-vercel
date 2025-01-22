package entities

type CreateAddressForm struct {
	SortBy       string
	Category     *[]string
	CategorySpec *[]string
	Brand        *[]string
	Intl         string
	Price        [2]int32
	Size         *[]string
}
