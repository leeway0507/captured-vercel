package db

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"entgo.io/ent/dialect"
	_ "github.com/go-sql-driver/mysql"
)

func Session() *sql.DB {
	// load Env File
	url := DBUrl()
	fmt.Println(url)
	client, err := sql.Open(dialect.MySQL, url)

	if err != nil {
		log.Fatalf("failed opening connection to mysql: %v", err)
		return nil
	}

	return client
}

func DBUrl() string {
	DB_USER_NAME := os.Getenv("DB_USER_NAME")
	DB_PASSWORD := os.Getenv("DB_PASSWORD")
	DB_HOST := os.Getenv("DB_HOST")
	DB_NAME := os.Getenv("DB_NAME")
	DB_PORT := os.Getenv("DB_PORT")

	value, DB_PORT_exist := os.LookupEnv("DB_PORT")
	if DB_PORT_exist {
		DB_PORT = value
	}

	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true",
		DB_USER_NAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
}
