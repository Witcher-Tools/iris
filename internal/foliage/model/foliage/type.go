package foliage

import (
	"changeme/pkg/utils/binary"
)

type Foliage struct {
	X []byte
	Y []byte
	Z []byte

	Scale []byte
	Pitch []byte

	HZ []byte
}

func New(x, y, z, scale, pitch, hz float32) *Foliage {
	return &Foliage{
		X:     binary.ConvertFloatToRotatedBytes(x),
		Y:     binary.ConvertFloatToRotatedBytes(y),
		Z:     binary.ConvertFloatToRotatedBytes(z),
		Scale: binary.ConvertFloatToRotatedBytes(scale),
		Pitch: binary.ConvertFloatToRotatedBytes(pitch),
		HZ:    binary.ConvertFloatToRotatedBytes(hz),
	}
}
