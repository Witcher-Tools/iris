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

func (t *Texture) ByteValue() (byte, byte) {
	value := (int(t.VerticalTexture) * 33) + (int(t.Slope-1) * 1024) + (int(t.Scale-1) * 8192) - (int(t.VerticalTexture) - int(t.HorizontalTexture))

	if value > 65535 {
		value = 65535
	}

	return byte(value & 0xFF), byte((value >> 8) & 0xFF)
}
