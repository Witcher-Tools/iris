package importer

import (
	"fmt"
	"image"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"changeme/pkg/response"
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

func (i *Importer) Import(options *ImportOptions) *response.Response[bool] {
	colormapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return response.AsError[bool]("ERROR_OPEN_TEXTURE_MAP")
	}
	defer colormapFile.Close()

	colormapImg, _, err := image.DecodeConfig(colormapFile)
	if err != nil {
		return response.AsError[bool]("ERROR_DECODE_COLORMAP")
	}

	colormapWidth := colormapImg.Width
	colormapHeight := colormapImg.Height

	if colormapWidth != colormapHeight {
		return response.AsError[bool]("ERROR_NON_SQUARE_COLORMAP")
	}

	tileFiles, err := filepath.Glob(filepath.Join(options.ImportFolder, "*.w2ter"))
	if err != nil {
		return response.AsError[bool]("ERROR_READ_TILES")
	}
	if len(tileFiles) == 0 {
		return response.AsError[bool]("ERROR_NO_TILE_FILES")
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
			return response.AsError[bool]("ERROR_INVALID_TILE_RESOLUTION")
		}
	}

	if _, ok := resolutionStartAddress[tileResolution]; !ok {
		return response.AsError[bool]("ERROR_UNSUPPORTED_TILE_RESOLUTION")
	}

	mapGridSize := int(math.Sqrt(float64(tileCount)))
	mapGridResolution := mapGridSize * tileResolution

	if mapGridResolution != colormapWidth {
		return response.AsError[bool]("ERROR_COLORMAP_RESOLUTION_MISMATCH")
	}

	err = i.doBackup(options)
	if err != nil {
		return response.AsError[bool]("ERROR_BACKUP_FAILED")
	}

	return response.New(response.WithData(true))
}
