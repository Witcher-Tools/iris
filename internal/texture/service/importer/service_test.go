package importer

import (
	"testing"
)

func TestImporter_Import(t *testing.T) {
	type args struct {
		options *ImportOptions
	}
	tests := []struct {
		name string
		args args
		want string
	}{
		// TODO: Add test cases.
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			i := &Importer{}
			if got := i.Import(tt.args.options); got != tt.want {
				t.Errorf("Import() = %v, want %v", got, tt.want)
			}
		})
	}
}
