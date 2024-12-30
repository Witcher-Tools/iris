package importer

import (
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"changeme/pkg/folders"
)

func (i *Importer) doBackup(options *ImportOptions) error {
	parts := strings.Split(options.ImportFolder, string(os.PathSeparator))

	level := parts[len(parts)-2]
	var mod string

	for i := len(parts) - 3; i >= 0; i-- {
		if parts[i] == "workspace" && i > 0 {
			mod = parts[i-1]
			break
		}
	}

	if mod == "" {
		return fmt.Errorf("could not determine mod name from path: %s", options.ImportFolder)
	}

	backupFolder, err := folders.GetAppFolder(filepath.Join(mod, level))
	if err != nil {
		return fmt.Errorf("failed to get app folder")
	}

	if isEmpty, err := folders.IsEmpty(backupFolder); err == nil && !isEmpty {
		return nil
	}

	err = folders.CopyFolder(options.ImportFolder, backupFolder)

	return nil
}
