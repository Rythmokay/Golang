package config

const (
	// DBConnStr is the database connection string
	DBConnStr = "postgresql://postgres:goosebumps@localhost:5432/ecommerce?sslmode=disable"
	// MinPasswordLength is the minimum required password length
	MinPasswordLength = 6
	// ServerPort is the port the server will listen on
	ServerPort = ":8081"
	// AllowedOrigin is the allowed CORS origin
	AllowedOrigin = "http://localhost:5173"
)
