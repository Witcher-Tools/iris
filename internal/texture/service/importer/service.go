package importer

import (
	"fmt"
	"image"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"changeme/pkg/folders"
)

var (
	resolutionStartAddress = map[int]int{
		256:  0x00000000,
		512:  0x00080000,
		1024: 0x00100000,
	}
)

type Importer struct{}

type ImportOptions struct {
	ImportFolder string
	TextureMap   string
}

func New() *Importer {
	return &Importer{}
}

type ErrorResponse struct {
	Code string
}

func (i *Importer) Import(options *ImportOptions) *ErrorResponse {
	colormapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return &ErrorResponse{Code: "ERROR_OPEN_TEXTURE_MAP"}
	}
	defer colormapFile.Close()

	colormapImg, _, err := image.DecodeConfig(colormapFile)
	if err != nil {
		return &ErrorResponse{Code: "ERROR_DECODE_COLORMAP"}
	}

	colormapWidth := colormapImg.Width
	colormapHeight := colormapImg.Height

	if colormapWidth != colormapHeight {
		return &ErrorResponse{Code: "ERROR_NON_SQUARE_COLORMAP"}
	}

	tileFiles, err := filepath.Glob(filepath.Join(options.ImportFolder, "*.w2ter"))
	if err != nil {
		return &ErrorResponse{Code: "ERROR_READ_TILES"}
	}
	if len(tileFiles) == 0 {
		return &ErrorResponse{Code: "ERROR_NO_TILE_FILES"}
	}

	var tileResolution int
	tileCount := len(tileFiles)

	baseName := filepath.Base(tileFiles[0])
	parts := strings.Split(baseName, "_")
	resPart := parts[len(parts)-1]

	if strings.HasPrefix(resPart, "res") {
		resPart := strings.TrimPrefix(resPart, "res")
		resPart = strings.TrimSuffix(resPart, ".w2ter")

		tileResolution, err = strconv.Atoi(resPart)

		fmt.Printf("Tile resolution: %d\n", resPart)

		if err != nil {
			return &ErrorResponse{Code: "ERROR_INVALID_TILE_RESOLUTION"}
		}
	}

	if _, ok := resolutionStartAddress[tileResolution]; !ok {
		return &ErrorResponse{Code: "ERROR_UNSUPPORTED_TILE_RESOLUTION"}
	}

	mapGridSize := int(math.Sqrt(float64(tileCount)))
	mapGridResolution := mapGridSize * tileResolution

	if mapGridResolution != colormapWidth {
		return &ErrorResponse{Code: "ERROR_COLORMAP_RESOLUTION_MISMATCH"}
	}

	err = i.doBackup(options)
	if err != nil {
		return &ErrorResponse{Code: "ERROR_BACKUP_FAILED"}
	}

	return nil
}

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

	err = folders.CopyFolder(options.ImportFolder, backupFolder)

	return nil
}
