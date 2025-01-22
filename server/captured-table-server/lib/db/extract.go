package db

import "database/sql"

func ExtractProductsFromRows(rows *sql.Rows) (*[]Product, error) {
	// An album slice to hold data from returned rows.
	var product []Product

	// Loop through rows, using Scan to assign column data to struct fields.
	for rows.Next() {
		var i Product
		if err := rows.Scan(
			&i.ID, &i.Brand,
			&i.ProductName, &i.ProductImgUrl,
			&i.ProductUrl, &i.CurrencyCode,
			&i.RetailPrice, &i.SalePrice,
			&i.KorBrand, &i.KorProductName,
			&i.ProductID, &i.Gender,
			&i.Color, &i.Category,
			&i.CategorySpec, &i.StoreName,
			&i.MadeIn, &i.IsSale,
			&i.SoldOut, &i.UpdatedAt,
			&i.RegisterAt,
		); err != nil {
			return &product, err
		}
		product = append(product, i)
	}
	if err := rows.Err(); err != nil {
		return &product, err
	}
	return &product, nil
}
