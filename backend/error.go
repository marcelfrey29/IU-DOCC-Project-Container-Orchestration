package main

import "fmt"

// Error if the requested item doesn't exist.
type NotFoundError struct {
	message string
}

func (e *NotFoundError) Error() string {
	return fmt.Sprintf("%s", e.message)
}

// Error if the requesting user doesn't have access to a Travel Guide.
type UnauthorizedError struct {
	message string
}

func (e *UnauthorizedError) Error() string {
	return fmt.Sprintf("%s", e.message)
}
