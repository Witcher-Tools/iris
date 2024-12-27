package foliage

import (
	"changeme/internal/foliage/model/foliage"
)

type Row struct {
	FoliageAsset string
	FoliageID    []byte

	Length []byte
	Data   []*foliage.Foliage
}
