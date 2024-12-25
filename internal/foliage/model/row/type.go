package foliage

import (
	"changeme/internal/foliage/model/foliage"
)

type Row struct {
	ID     []byte
	Length []byte
	Data   []*foliage.Foliage
}
