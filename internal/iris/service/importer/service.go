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

func (i *Importer) Import(options *ImportOptions) string {
	colormapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return "failed to open textures map file"
	}
	defer colormapFile.Close()

	colormapImg, _, err := image.DecodeConfig(colormapFile)
	if err != nil {
		return "failed to decode colormap image"
	}

	colormapWidth := colormapImg.Width
	colormapHeight := colormapImg.Height

	if colormapWidth != colormapHeight {
		return "colormap image is not square"
	}

	tileFiles, err := filepath.Glob(filepath.Join(options.ImportFolder, "*.w2ter"))

	if err != nil {
		return "failed to read tiles or no tiles found in the folder"
	}
	if len(tileFiles) == 0 {
		return "tiles folder contains no tile files"
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
			return "invalid tile resolution in filename %s"
		}
	}

	if _, ok := resolutionStartAddress[tileResolution]; !ok {
		return "tile resolution not supported in filename %s"
	}

	mapGridSize := int(math.Sqrt(float64(tileCount)))
	mapGridResolution := mapGridSize * tileResolution

	if mapGridResolution != colormapWidth {
		return "colormap width does not match the map resolution"
	}

	err = i.doBackup(options)
	if err != nil {
		return "failed to backup tiles"
	}

	return ""
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
