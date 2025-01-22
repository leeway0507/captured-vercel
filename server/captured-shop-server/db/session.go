package db

import (
	"fmt"
	"log"
	"os"
	"product-server/ent"

	"product-server/envset"

	"entgo.io/ent/dialect"
	_ "github.com/go-sql-driver/mysql"
)

func Session() *ent.Client {
	// load Env File

	client, err := ent.Open(dialect.MySQL, DBUrl())

	if err != nil {
		log.Fatalf("failed opening connection to mysql: %v", err)
		return nil
	}

	return client
}

func DBUrl() string {
	env := os.Getenv("ProductionLevel")

	switch env {
	case "production":
		env = ".env.production"
	case "local_test":
		env = ".env.local"
	default:
		env = ".env.dev"
	}

	fmt.Printf("fiber Go Loading Eev : %v \n", env)
	envset.Load(env)
	DB_USER_NAME := os.Getenv("DB_USER_NAME")
	DB_PASSWORD := os.Getenv("DB_PASSWORD")
	DB_HOST := os.Getenv("DB_HOST")
	DB_NAME := os.Getenv("DB_NAME")
	DB_PORT := "3306"
	value, DB_PORT_exist := os.LookupEnv("DB_PORT")
	if DB_PORT_exist {
		DB_PORT = value
	}

	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", DB_USER_NAME, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME)
}
