package texture

type Texture struct {
	VerticalTexture   uint8 `json:"verticalTexture"`
	HorizontalTexture uint8 `json:"horizontalTexture"`

	Slope uint8 `json:"slope"`
	Scale uint8 `json:"scale"`

	Start uint8 `json:"start"`
	End   uint8 `json:"end"`
}

func New(verticalTexture, horizontalTexture, slope, scale, start, end uint8) *Texture {
	return &Texture{
		VerticalTexture:   verticalTexture,
		HorizontalTexture: horizontalTexture,
		Slope:             slope,
		Scale:             scale,
		Start:             start,
		End:               end,
	}
}
