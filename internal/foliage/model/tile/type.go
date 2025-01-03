package tile

import (
	"changeme/internal/foliage/model/row"
)

type Tile struct {
	Foliage []foliage.foliage

	Box []uint16
}
