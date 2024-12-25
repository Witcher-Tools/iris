package response

type ErrorResponse struct {
	Code    string
	Message string
}

type Response struct {
	Success bool
	Data    any
	Error   *ErrorResponse
}

type Option func(*Response)

func New(options ...Option) *Response {
	resp := &Response{}
	for _, opt := range options {
		opt(resp)
	}
	return resp
}

func WithData(data interface{}) Option {
	return func(resp *Response) {
		resp.Success = true
		resp.Data = data
	}
}

func WithSuccess() Option {
	return func(resp *Response) {
		resp.Success = true
	}
}

func WithErrorCode(code string) Option {
	return func(resp *Response) {
		resp.Success = false

		if resp.Error == nil {
			resp.Error = &ErrorResponse{
				Code: code,
			}
			return
		}

		resp.Error.Code = code
	}
}
