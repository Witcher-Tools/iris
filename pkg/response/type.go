package response

type ErrorResponse struct {
	Code    string
	Message string
}

type Response[T any] struct {
	Data  T
	Error *ErrorResponse
}

type Option[T any] func(*Response[T])

func New[T any](options ...Option[T]) *Response[T] {
	resp := &Response[T]{}
	for _, opt := range options {
		opt(resp)
	}
	return resp
}

func WithData[T any](data T) Option[T] {
	return func(r *Response[T]) {
		r.Data = data
		r.Error = nil
	}
}

func WithErrorCode[T any](code string) Option[T] {
	return func(r *Response[T]) {
		r.Error = &ErrorResponse{
			Code: code,
		}
	}
}

func AsError[T any](code string) *Response[T] {
	return &Response[T]{
		Error: &ErrorResponse{
			Code: code,
		},
	}
}
