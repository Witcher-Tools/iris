package encoder

import (
	"bytes"
	"encoding/base64"
	"image"
	"image/png"
)

func EncodeToBase64(image image.Image) (string, error) {
	var buf bytes.Buffer
	err := png.Encode(&buf, image)
	if err != nil {
		return "", err
	}

	return base64.StdEncoding.EncodeToString(buf.Bytes()), nil
}
