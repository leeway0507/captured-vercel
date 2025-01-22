CREATE TABLE
    IF NOT EXISTS products (
        id INT NOT NULL AUTO_INCREMENT,
        brand VARCHAR(255) NOT NULL,
        product_name VARCHAR(255) NOT NULL,
        product_img_url VARCHAR(255) NOT NULL,
        product_url VARCHAR(255) NOT NULL,
        currency_code VARCHAR(255),
        retail_price DOUBLE NOT NULL,
        sale_price DOUBLE NOT NULL,
        kor_brand VARCHAR(255),
        kor_product_name VARCHAR(255),
        product_id VARCHAR(255) DEFAULT '-',
        gender VARCHAR(255),
        color VARCHAR(255),
        category VARCHAR(255),
        category_spec VARCHAR(255),
        store_name VARCHAR(255),
        made_in VARCHAR(255),
        is_sale BOOLEAN NOT NULL,
        sold_out BOOLEAN NOT NULL DEFAULT FALSE,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY product_product_name_product_url (product_name, product_url),
        KEY products_stores_product (store_name),
        CONSTRAINT products_stores_product FOREIGN KEY (store_name) REFERENCES stores (store_name) ON DELETE SET NULL
    );

CREATE TABLE
    stores (
        store_name VARCHAR(255) NOT NULL,
        store_url VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        currency VARCHAR(255) NOT NULL,
        tax_reduction DOUBLE NOT NULL,
        intl_shipping_fee JSON NOT NULL,
        intl_free_shipping_min VARCHAR(255) DEFAULT NULL,
        domestic_shipping_fee DOUBLE NOT NULL,
        domestic_free_shipping_min VARCHAR(255) DEFAULT NULL,
        shipping_fee_cumulation BOOLEAN NOT NULL,
        delivery_agency VARCHAR(255) NOT NULL,
        broker_fee BOOLEAN NOT NULL,
        ddp BOOLEAN NOT NULL,
        updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        kor_store_name VARCHAR(255) DEFAULT NULL,
        tax_reduction_manually BOOLEAN DEFAULT NULL,
        PRIMARY KEY (store_name)
    );