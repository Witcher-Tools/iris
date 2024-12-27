package binary

import (
	"encoding/binary"
	"math"
)

func ConvertFloatToBytes(value float32) []byte {
	b := make([]byte, 4)
	binary.LittleEndian.PutUint32(b, math.Float32bits(value))

	return b
}
