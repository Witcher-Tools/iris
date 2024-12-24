package importer

type Importer struct {
}

type ImportOptions struct {
	ImportFolder string
	TextureMap   string
}

func New() *Importer {
	return &Importer{}
}

func (i *Importer) Import(options *ImportOptions) error {

	return nil
}
