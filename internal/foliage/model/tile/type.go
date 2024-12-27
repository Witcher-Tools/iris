package tile

import (
	foliage "changeme/internal/foliage/model/row"
)

type Tile struct {
	Foliage []foliage.Row

	Box []uint16
}
