package main

import (
	"net/http"
)

type FileServer struct{}

func (f *FileServer) ServeHTTP(rw http.ResponseWriter, req *http.Request) {

}
