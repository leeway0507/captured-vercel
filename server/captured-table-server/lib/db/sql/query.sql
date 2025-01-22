-- name: GetProduct :many
SELECT
    *
FROM
    products;

-- name: UpdateSoldOut :exec
UPDATE
    products
SET
    sold_out = true
WHERE
    brand = $1
    AND store_name = $2;

-- name: CreateProduct :copyfrom
INSERT INTO
    products (
        brand,
        product_name,
        product_img_url,
        product_url,
        currency_code,
        retail_price,
        sale_price,
        kor_brand,
        kor_product_name,
        product_id,
        gender,
        color,
        category,
        category_spec,
        store_name,
        made_in,
        is_sale,
        sold_out
    )
VALUES
    (
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?,
        ?
    );


SELECT 
	id,brand,
	product_name,product_img_url,
	product_url,currency_code,
	retail_price,sale_price,
	kor_brand,kor_product_name,
	product_id,gender,
	color,category,
	category_spec,store_name,
	made_in,is_sale,
	sold_out, updated_at
 FROM products 
 WHERE 
    MATCH(product_name) AGAINST(? IN BOOLEAN MODE)