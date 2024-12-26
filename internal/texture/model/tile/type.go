package tile

type Tile struct {
	InFile   string
	ColorMap [][]byte
}

func New(inFile string, colorMap [][]byte) *Tile {
	return &Tile{
		InFile:   inFile,
		ColorMap: colorMap,
	}
}
