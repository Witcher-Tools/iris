package importer

import (
	"fmt"
	"image"
	"image/png"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"

	"changeme/pkg/folders"
	"changeme/pkg/response"
	"changeme/pkg/utils/encoder"

	"github.com/nfnt/resize"
	"github.com/wailsapp/wails/v3/pkg/application"
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

func (i *Importer) SelectTileFolder() *response.Response {
	dialog := application.OpenFileDialogWithOptions(&application.OpenFileDialogOptions{
		Title:                "Select tiles folder",
		CanChooseDirectories: true,
		CanChooseFiles:       false,
	})

	res, err := dialog.PromptForSingleSelection()

	if err != nil {
		return response.New(response.WithErrorCode("ERROR_OPEN_FOLDER"))
	}

	return response.New(response.WithData(struct {
		ImportFolder string
	}{
		ImportFolder: res,
	}))
}

func (i *Importer) SelectTextureMap() *response.Response {
	dialog := application.OpenFileDialogWithOptions(&application.OpenFileDialogOptions{
		Title: "Select texture map",
		Filters: []application.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.png;",
			},
		},
	})

	imagePath, err := dialog.PromptForSingleSelection()
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_OPEN_TEXTURE_MAP"))
	}

	file, err := os.Open(imagePath)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_OPEN_TEXTURE_MAP"))
	}

	decodedImage, err := png.Decode(file)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_DECODE_TEXTURE_MAP"))
	}

	bounds := decodedImage.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	if width != height {
		return response.New(response.WithErrorCode("ERROR_NON_SQUARE_IMAGE"))
	}

	if width < 256 || height < 256 {
		return response.New(response.WithErrorCode("ERROR_LOW_RESOLUTION_IMAGE"))
	}

	if width > 512 {
		decodedImage = resize.Resize(512, 512, decodedImage, resize.Lanczos3)
	}

	imageBase64, err := encoder.EncodeToBase64(decodedImage)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_ENCODE_TEXTURE_MAP"))
	}

	return response.New(response.WithData(struct {
		ImportTextureMap       string
		ImportTextureMapBase64 string
	}{
		ImportTextureMap:       imagePath,
		ImportTextureMapBase64: imageBase64,
	}))
}

func (i *Importer) Import(options *ImportOptions) *response.Response {
	colormapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_OPEN_TEXTURE_MAP"))
	}
	defer colormapFile.Close()

	colormapImg, _, err := image.DecodeConfig(colormapFile)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_DECODE_COLORMAP"))
	}

	colormapWidth := colormapImg.Width
	colormapHeight := colormapImg.Height

	if colormapWidth != colormapHeight {
		return response.New(response.WithErrorCode("ERROR_NON_SQUARE_COLORMAP"))
	}

	tileFiles, err := filepath.Glob(filepath.Join(options.ImportFolder, "*.w2ter"))
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_READ_TILES"))
	}
	if len(tileFiles) == 0 {
		return response.New(response.WithErrorCode("ERROR_NO_TILE_FILES"))
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
			return response.New(response.WithErrorCode("ERROR_INVALID_TILE_RESOLUTION"))
		}
	}

	if _, ok := resolutionStartAddress[tileResolution]; !ok {
		return response.New(response.WithErrorCode("ERROR_UNSUPPORTED_TILE_RESOLUTION"))
	}

	mapGridSize := int(math.Sqrt(float64(tileCount)))
	mapGridResolution := mapGridSize * tileResolution

	if mapGridResolution != colormapWidth {
		return response.New(response.WithErrorCode("ERROR_COLORMAP_RESOLUTION_MISMATCH"))
	}

	err = i.doBackup(options)
	if err != nil {
		return response.New(response.WithErrorCode("ERROR_BACKUP_FAILED"))
	}

	return response.New(response.WithSuccess())
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
