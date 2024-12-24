package main

import (
	"fmt"
	"image/png"
	"os"

	"github.com/wailsapp/wails/v3/pkg/application"
)

type GreetService struct{}

func (g *GreetService) Greet(name string) string {
	return "Hello " + name + "!"
}

func (g *GreetService) SelectTextureMap() string {
	fmt.Printf("SelectTextureMap called\n")
	dialog := application.OpenFileDialogWithOptions(&application.OpenFileDialogOptions{
		Title: "Select Texture Map",
		Filters: []application.FileFilter{
			{
				DisplayName: "Image Files",
				Pattern:     "*.png;",
			},
		},
	})

	res, err := dialog.PromptForSingleSelection()

	if err != nil {
		panic(err)
	}

	file, err := os.Open(res)

	if err != nil {
		panic(err)
	}

	img, err := png.Decode(file)

	if err != nil {
		panic(err)
	}

	return base64Image
}
