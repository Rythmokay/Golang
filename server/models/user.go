package models

// User represents a user in the system
type User struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Password    string `json:"password"`
	Role        string `json:"role"`
	Address     string `json:"address"`
	PhoneNumber string `json:"phone_number"`
}
