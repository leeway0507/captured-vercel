package local_file

import (
	"encoding/json"
	"io"
	"os"
	"path"
)

func LoadFile(currPath string) ([]byte, error) {
	f, err := os.Open(currPath)
	if err != nil {
		return nil, err
	}

	defer f.Close()

	raw, err := io.ReadAll(f)
	if err != nil {
		return nil, err
	}

	return raw, err

}

func LoadJson[T any](filePath string) (*T, error) {

	raw, err := LoadFile(filePath)
	if err != nil {
		return nil, err
	}

	var data T

	err = json.Unmarshal(raw, &data)
	if err != nil {
		return nil, err
	}
	return &data, nil
}

func MakeFolders(filePath string) error {
	dir := path.Dir(filePath)
	err := os.MkdirAll(dir, 0750)
	if err != nil {
		return err
	}
	return nil
}

func SaveFile(data []byte, filePath string) error {
	err := MakeFolders(filePath)
	if err != nil {
		return err
	}

	file, err := os.Create(filePath)
	if err != nil {
		return err
	}

	defer file.Close()

	_, err = file.Write(data)
	if err != nil {
		return err
	}
	return nil
}
