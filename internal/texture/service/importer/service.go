package importer

import (
	"fmt"
	"image"
	"image/color"
	"image/png"
	"math"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"sync"

	"changeme/internal/texture/model/texture"
	"changeme/pkg/response"
)

var (
	resolutionStartAddress = map[int]int{
		256:  0x0002026B,
		512:  0x000802A5,
		1024: 0x00100000,
	}
)

type Importer struct{}

type ImportOptions struct {
	ImportFolder string
	TextureMap   string
	Textures     []texture.Texture
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

		if err != nil {
			return response.AsError[bool]("ERROR_INVALID_TILE_RESOLUTION")
		}
	}

	startAddress, ok := resolutionStartAddress[tileResolution]
	if !ok {
		return response.AsError[bool]("ERROR_UNSUPPORTED_TILE_RESOLUTION")
	}

	mapGridSize := int(math.Sqrt(float64(tileCount)))
	mapGridResolution := mapGridSize * tileResolution

	if mapGridResolution != colormapWidth {
		return response.AsError[bool]("ERROR_COLORMAP_RESOLUTION_MISMATCH")
	}

	// err = i.doBackup(options)
	// if err != nil {
	// 	return response.AsError[bool]("ERROR_BACKUP_FAILED")
	// }

	tiles, err := os.ReadDir(options.ImportFolder)
	if err != nil {
		return response.AsError[bool]("ERROR_READ_TILES")
	}

	textureMapFile, err := os.Open(options.TextureMap)
	if err != nil {
		return response.AsError[bool]("ERROR_OPEN_COLORMAP")
	}

	textureMap, err := png.Decode(textureMapFile)
	if err != nil {
		return response.AsError[bool]("ERROR_DECODE_COLORMAP")
	}

	var wg sync.WaitGroup
	errChan := make(chan error)

	for _, tile := range tiles {
		if tile.IsDir() {
			continue
		}

		tilePath := filepath.Join(options.ImportFolder, tile.Name())
		wg.Add(1)

		go func(colorImage image.Image) {
			defer wg.Done()

			tileTextureBytes := make([]byte, tileResolution*tileResolution*2)

			tileX, err := strconv.Atoi(strings.Split(filepath.Base(tilePath), "_")[1])
			tileY, err := strconv.Atoi(strings.Split(filepath.Base(tilePath), "_")[3])

			for x := 0; x < tileResolution; x++ {
				for y := 0; y < tileResolution; y++ {
					colorMapX := ((tileY * tileResolution) + x) * colorImage.Bounds().Max.X / mapGridResolution
					colorMapY := ((tileX * tileResolution) + y) * colorImage.Bounds().Max.Y / mapGridResolution
					c := colorImage.At(colorMapX, colorMapY)
					grey := color.GrayModel.Convert(c).(color.Gray).Y

					var foundTexture *texture.Texture
					for i := range options.Textures {
						if grey >= options.Textures[i].Start && grey <= options.Textures[i].End {
							foundTexture = &options.Textures[i]
							break
						}
					}

					if foundTexture != nil {
						offset := (y*tileResolution + x) * 2
						tileTextureBytes[offset], tileTextureBytes[offset+1] = foundTexture.ByteValue()
					}
				}
			}

			tileData, err := os.ReadFile(tilePath)
			if err != nil {
				select {
				case errChan <- fmt.Errorf("failed to read tile file %s: %w", tilePath, err):
				default:
				}
				return
			}

			copy(tileData[startAddress:startAddress+len(tileTextureBytes)], tileTextureBytes)

			err = os.WriteFile(tilePath, tileData, 0644)
			if err != nil {
				select {
				case errChan <- fmt.Errorf("failed to write tile file %s: %w", tilePath, err):
				default:
				}
				return
			}
		}(textureMap)
	}

	wg.Wait()
	close(errChan)

	if err := <-errChan; err != nil {
		return response.AsError[bool]("ERROR_WRITE_TILE")
	}

	for err := range errChan {
		fmt.Println("Error:", err)
	}

	return response.New(response.WithData(true))
}

func (i *Importer) writeTile() {
}
