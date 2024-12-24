package importer

import (
	"fmt"
	"image"
	"os"
	"path/filepath"

	"changeme/pkg/folders"
)

type Importer struct {
}

type ImportOptions struct {
	ImportFolder string
	TextureMap   string
}

func New() *Importer {
	return &Importer{}
}

func (i *Importer) Import(options *ImportOptions) error {
	colormapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return fmt.Errorf("failed to open textures map file: %v", err)
	}
	defer colormapFile.Close()

	colormapImg, _, err := image.DecodeConfig(colormapFile)
	if err != nil {
		return fmt.Errorf("failed to decode colormap image: %v", err)
	}

	colormapWidth := colormapImg.Width
	colormapHeight := colormapImg.Height

	// Validate tiles path
	tileFiles, err := filepath.Glob(filepath.Join(options.TilesPath, "*.w2ter"))
	if err != nil || len(tileFiles) == 0 {
		return fmt.Errorf("failed to read tiles or no tiles found in the folder: %v", err)
	}

	// Extract tile resolution and count tiles
	var tileResolution int
	tileCount := len(tileFiles)

	_, err := folders.GetAppFolder("backup")
	if err != nil {
		return err
	}

	return nil
}
