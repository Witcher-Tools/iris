package importer

import (
	"encoding/json"
	"os"
	"path/filepath"

	"changeme/internal/texture/model/texture"
	"changeme/pkg/folders"
	"changeme/pkg/response"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type Preset struct {
	Textures []*texture.Texture `json:"textures"`
}

func (i *Importer) LoadPreset() *response.Response[Preset] {
	dialog := application.OpenFileDialogWithOptions(&application.OpenFileDialogOptions{
		Title: "Select preset file",

		CanChooseDirectories: false,
		CanChooseFiles:       true,

		Filters: []application.FileFilter{
			{
				DisplayName: "Ranges preset",
				Pattern:     "*.json;",
			},
		},
	})

	presetPath, err := dialog.PromptForSingleSelection()
	if err != nil {
		return response.AsError[Preset]("ERROR_OPEN_PRESET")
	}

	jsonData, err := os.ReadFile(presetPath)
	if err != nil {
		return response.AsError[Preset]("ERROR_READ_PRESET")
	}

	var textures Preset
	err = json.Unmarshal(jsonData, &textures)

	return response.New(response.WithData(textures))
}

func (i *Importer) SavePreset(textures []*texture.Texture, name string) *response.Response[bool] {
	presetFolder, err := folders.GetAppFolder("presets")
	if err != nil {
		return response.AsError[bool]("ERROR_GET_PRESET_FOLDER")
	}

	presetPath := filepath.Join(presetFolder, name+".json")

	preset := Preset{
		Textures: textures,
	}

	jsonData, err := json.Marshal(preset)
	if err != nil {
		return response.AsError[bool]("ERROR_MARSHAL_PRESET")
	}

	err = os.WriteFile(presetPath, jsonData, 0644)
	if err != nil {
		return response.AsError[bool]("ERROR_WRITE_PRESET")
	}

	return response.New(response.WithData(true))
}
