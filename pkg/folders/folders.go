package folders

import (
	"fmt"
	"io"
	"os"
	"path/filepath"
	"sync"
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

func CopyFolder(srcFolder, destFolder string) error {
	var wg sync.WaitGroup
	errChan := make(chan error, 1)

	if _, err := os.Stat(srcFolder); os.IsNotExist(err) {
		return fmt.Errorf("source folder does not exist: %v", err)
	}

	if _, err := os.Stat(destFolder); os.IsNotExist(err) {
		return fmt.Errorf("destination folder does not exist: %v", err)
	}

	err := filepath.Walk(srcFolder, func(srcPath string, info os.FileInfo, err error) error {
		if err != nil {
			return fmt.Errorf("error accessing file %s: %v", srcPath, err)
		}

		if info.IsDir() {
			return nil
		}

		relPath, err := filepath.Rel(srcFolder, srcPath)
		if err != nil {
			return fmt.Errorf("error calculating relative path: %v", err)
		}

		destPath := filepath.Join(destFolder, relPath)

		wg.Add(1)
		go func(srcPath, destPath string) {
			defer wg.Done()
			if copyErr := CopyFile(srcPath, destPath); copyErr != nil {
				select {
				case errChan <- copyErr:
				default:
				}
			}
		}(srcPath, destPath)

		return nil
	})

	if err != nil {
		return err
	}

	wg.Wait()
	close(errChan)

	if copyErr, ok := <-errChan; ok {
		return fmt.Errorf("file copy error: %v", copyErr)
	}

	return nil
}

func CopyFile(src, dst string) error {
	sourceFile, err := os.Open(src)
	if err != nil {
		return fmt.Errorf("failed to open source file: %v", err)
	}
	defer sourceFile.Close()

	destinationFile, err := os.Create(dst)
	if err != nil {
		return fmt.Errorf("failed to create destination file: %v", err)
	}
	defer destinationFile.Close()

	_, err = io.Copy(destinationFile, sourceFile)
	if err != nil {
		return fmt.Errorf("failed to copy file content: %v", err)
	}

	return nil
}

func IsEmpty(path string) (bool, error) {
	folder, err := os.Open(path)
	if err != nil {
		return false, err
	}
	defer folder.Close()

	_, err = folder.Readdirnames(1)
	if err == io.EOF {
		return true, nil
	}
	return false, err
}
