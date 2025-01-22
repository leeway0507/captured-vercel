package local_file

import (
	"log"
	"os"
	"path/filepath"
	"testing"
)

func TestLoadFile(t *testing.T) {
	currPath, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}
	t.Run("Test Load File", func(t *testing.T) {
		_, err = LoadFile(filepath.Join(currPath, "test.json"))
		if err != nil {
			log.Fatal(err)
		}
	})

	t.Run("Test Load Json", func(t *testing.T) {
		type Data struct {
			Hello string `json:"hello"`
		}

		data, err := LoadJson[Data]("test.json")

		if err != nil {
			t.Fatal("Fail to load")
		}

		if data.Hello != "world" {
			t.Fatalf("Failed to load Json")
		}
	})
}
