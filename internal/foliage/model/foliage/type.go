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
		X:     binary.ConvertFloatToBytes(x),
		Y:     binary.ConvertFloatToBytes(y),
		Z:     binary.ConvertFloatToBytes(z),
		Scale: binary.ConvertFloatToBytes(scale),
		Pitch: binary.ConvertFloatToBytes(pitch),
		HZ:    binary.ConvertFloatToBytes(hz),
	}
}
