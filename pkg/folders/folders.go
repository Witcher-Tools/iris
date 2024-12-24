package folders

import (
	"fmt"
	"os"
	"path/filepath"
)

func GetAppFolder(folderName string) (string, error) {
	execPath, err := os.Executable()
	if err != nil {
		return "", err
	}

	appFolder := filepath.Dir(execPath)
	folder := filepath.Join(appFolder, folderName)

	if _, err := os.Stat(folder); os.IsNotExist(err) {
		if err = os.MkdirAll(folder, os.ModePerm); err != nil {
			return "", fmt.Errorf("failed to create %s folder: %v", folderName, err)
		}
	}

	return folder, nil
}
