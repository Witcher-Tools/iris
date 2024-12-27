package importer

import (
	"image/png"
	"os"

	"changeme/pkg/response"
	"changeme/pkg/utils/encoder"

	"github.com/nfnt/resize"
	"github.com/wailsapp/wails/v3/pkg/application"
)

type SelectImportFolderResponse struct {
	ImportFolder string
}

type SelectImportTextureMapResponse struct {
	ImportTextureMap       string
	ImportTextureMapBase64 string
}

func (i *Importer) SelectImportFolder() *response.Response[SelectImportFolderResponse] {
	dialog := application.OpenFileDialogWithOptions(&application.OpenFileDialogOptions{
		Title: "Select tiles folder",

		CanChooseDirectories: true,
		CanChooseFiles:       false,
	})

	folder, err := dialog.PromptForSingleSelection()

	if err != nil {
		return response.AsError[SelectImportFolderResponse]("ERROR_OPEN_FOLDER")
	}

	return response.New(response.WithData(SelectImportFolderResponse{
		ImportFolder: folder,
	}))
}

func (i *Importer) SelectImportTextureMap() *response.Response[SelectImportTextureMapResponse] {
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
		return response.AsError[SelectImportTextureMapResponse]("ERROR_OPEN_TEXTURE_MAP")
	}

	file, err := os.Open(imagePath)
	if err != nil {
		return response.AsError[SelectImportTextureMapResponse]("ERROR_OPEN_TEXTURE_MAP")
	}

	decodedImage, err := png.Decode(file)
	if err != nil {
		return response.AsError[SelectImportTextureMapResponse]("ERROR_DECODE_TEXTURE_MAP")
	}

	bounds := decodedImage.Bounds()
	width := bounds.Dx()
	height := bounds.Dy()

	if width != height {
		return response.AsError[SelectImportTextureMapResponse]("ERROR_NON_SQUARE_IMAGE")
	}

	if width < 256 || height < 256 {
		return response.AsError[SelectImportTextureMapResponse]("ERROR_LOW_RESOLUTION_IMAGE")
	}

	if width > 512 {
		decodedImage = resize.Resize(512, 512, decodedImage, resize.Lanczos3)
	}

	imageBase64, err := encoder.EncodeToBase64(decodedImage)
	if err != nil {
		return response.AsError[SelectImportTextureMapResponse]("ERROR_ENCODE_TEXTURE_MAP")
	}

	return response.New(response.WithData(SelectImportTextureMapResponse{
		ImportTextureMap:       imagePath,
		ImportTextureMapBase64: imageBase64,
	}))
}
