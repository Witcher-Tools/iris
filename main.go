package main

import (
	"embed"
	_ "embed"
	"log"

	"changeme/internal/iris/service/importer"

	"github.com/wailsapp/wails/v3/pkg/application"
)

//go:embed frontend/dist
var assets embed.FS

func main() {
	app := application.New(application.Options{
		Name:        "Iris",
		Description: "RedKit texture map importer.",
		Services: []application.Service{
			application.NewService(&GreetService{}),
			application.NewService(&importer.Importer{}),
		},
		Assets: application.AssetOptions{
			Handler: application.AssetFileServerFS(assets),
		},
		Mac: application.MacOptions{
			ApplicationShouldTerminateAfterLastWindowClosed: true,
		},
	})

	_ = app.NewWebviewWindowWithOptions(application.WebviewWindowOptions{
		Title: "Iris",

		Mac: application.MacWindow{
			InvisibleTitleBarHeight: 50,
			Backdrop:                application.MacBackdropTranslucent,
			TitleBar:                application.MacTitleBarHiddenInset,
		},
		Windows: application.WindowsWindow{},

		MinWidth:      1430,
		MinHeight:     890,
		DisableResize: true,

		BackgroundColour: application.NewRGB(27, 38, 54),

		URL: "/",
	})

	err := app.Run()

	if err != nil {
		log.Fatal(err)
	}
}
