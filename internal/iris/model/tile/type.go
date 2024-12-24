package tile

type Tile struct {
	InFile  string
	OutFile string

	ColorMap []byte
}

func New(inFile string, outFile string, colorMap []byte) *Tile {
	return &Tile{
		InFile:  inFile,
		OutFile: outFile,

		ColorMap: colorMap,
	}
}
