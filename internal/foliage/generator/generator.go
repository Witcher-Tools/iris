package generator

import (
	"math/rand"
)

type Generator struct {
	SeedsMap map[*PFoliage]uint32
}

type Options struct {
	TileSize  uint32
	TileCount uint32
	Foliage   []*PFoliage

	Seed *rand.Rand

	Steps uint16
}

type PFoliage struct {
	CollisionRadius uint32
	ShadeRadius     uint32

	SpreadRadius         uint32
	SpreadRadiusVariance uint32

	ScaleMin, ScaleMax float32

	GrowInShade bool
}

func (g *Generator) Generate(options Options) error {

	return nil
}
