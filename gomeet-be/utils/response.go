package utils

import (
	"encoding/json"
	"net/http"
)

type successResponse struct {
	IsError  bool        `json:"isError"`
	Response interface{} `json:"response"`
}

func SuccessResponse(w http.ResponseWriter, resp interface{}) {
	json.NewEncoder(w).Encode(successResponse{
		IsError:  false,
		Response: resp,
	})
}

type errorResponse struct {
	IsError bool   `json:"isError"`
	Message string `json:"message"`
}

func ErrorResponse(w http.ResponseWriter, message string) {
	json.NewEncoder(w).Encode(errorResponse{
		IsError: true,
		Message: message,
	})
}
