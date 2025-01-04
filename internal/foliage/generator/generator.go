package generator

import (
	"math/rand"
)

const (
	Resolution         = 8192
	GenerationTileSize = 64
)

type Generator struct {
	SeedsMap       map[*FoliageSample]uint
	FoliageToSpawn []*FoliageSample

	TileSize       uint32
	TileCount      uint32
	FoliageSamples []*FoliageSample

	Seed *rand.Rand
}

type FloatCurve interface {
	GetValue(float32) float32
}

type FoliageSample struct {
	Steps        uint16
	SeedsPerStep uint32

	Density float32

	CollisionRadius uint32
	ShadeRadius     uint32

	SpreadRadius         uint32
	SpreadRadiusVariance uint32

	MaxAge     uint32
	MaxInitAge uint32

	ScaleMin, ScaleMax float32
	ScaleCurve         FloatCurve

	OverlapPriority uint8

	GrowInShade  bool
	SpawnInShade bool
}

func New() *Generator {
	return &Generator{
		SeedsMap: make(map[*FoliageSample]uint),
	}
}

func (g *Generator) Generate(options Options) error {

	return nil
}

func (g *Generator) init() {
	const generationArea = (Resolution * Resolution) / (GenerationTileSize * GenerationTileSize)

	for _, foliageSample := range g.FoliageSamples {
		seedsCount := foliageSample.Density * generationArea

		g.SeedsMap[foliageSample] = uint(seedsCount)
		if seedsCount > 0 {
			g.FoliageToSpawn = append(g.FoliageToSpawn, foliageSample)
		}
	}

	samplesLength := len(g.FoliageSamples)
	samplesToSpawn := len(g.FoliageSamples)
	sampleIndex := -1

	for samplesToSpawn > 0 {
		sampleIndex = (sampleIndex + 1) % samplesLength

		sample := g.FoliageSamples[sampleIndex]
		seedsToSpawn := g.SeedsMap[sample]

		seedsToSpawn--
		if seedsToSpawn == 0 {
			samplesToSpawn--
		}
	}
}
