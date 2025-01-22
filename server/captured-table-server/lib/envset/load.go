package envset

import (
	"fmt"
	"os"
)

func LoadEnv() {
	level := os.Getenv("ENVLEVEL")
	var env string

	switch level {
	case "production":
		env = ".env.production"
	case "local":
		env = ".env.local"
	case "local-rds":
		env = ".env.test"
	default:
		env = ".env.dev"
	}
	fmt.Printf("fiber Go Loading Eev : %v \n", env)

	Load(env)

}
