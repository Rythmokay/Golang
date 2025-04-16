package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	_ "github.com/lib/pq"
	"golang.org/x/crypto/bcrypt"
)

const connStr = "postgresql://postgres:goosebumps@localhost:5432/ecommerce?sslmode=disable"

var db *sql.DB

// Initialize the DB connection
func init() {
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Fatal("❌ Error opening database:", err)
	}
	if err := db.Ping(); err != nil {
		log.Fatal("❌ Error pinging database:", err)
	}
	log.Println("✅ Connected to the database")
}

// User struct to handle requests/responses
type User struct {
	ID       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

// Signup endpoint: POST /signup
func signupHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var user User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	// Check if email already exists
	var existingID int
	err := db.QueryRow("SELECT id FROM users WHERE email = $1", user.Email).Scan(&existingID)
	if err != sql.ErrNoRows {
		http.Error(w, "Email already registered", http.StatusBadRequest)
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "Error hashing password", http.StatusInternalServerError)
		return
	}

	// Insert new user
	_, err = db.Exec("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
		user.Name, user.Email, string(hashedPassword))
	if err != nil {
		http.Error(w, "Error creating user", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
	fmt.Fprint(w, "✅ User registered successfully")
}

// Login endpoint: POST /login
func loginHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid JSON", http.StatusBadRequest)
		return
	}

	var stored User
	err := db.QueryRow("SELECT id, name, email, password FROM users WHERE email = $1", input.Email).
		Scan(&stored.ID, &stored.Name, &stored.Email, &stored.Password)

	if err == sql.ErrNoRows || bcrypt.CompareHashAndPassword([]byte(stored.Password), []byte(input.Password)) != nil {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	} else if err != nil {
		http.Error(w, "Database error", http.StatusInternalServerError)
		return
	}

	// Successful login
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "✅ Login successful",
		"userId":  stored.ID,
		"name":    stored.Name,
		"email":   stored.Email,
	})
}

// Serve static frontend from client/dist/
func serveFrontend(w http.ResponseWriter, r *http.Request) {
	buildPath := filepath.Join("..", "client", "dist")
	requestPath := filepath.Join(buildPath, r.URL.Path)

	// Serve static files if they exist
	if info, err := os.Stat(requestPath); err == nil && !info.IsDir() {
		http.ServeFile(w, r, requestPath)
		return
	}

	// Fallback to index.html for SPA routing
	http.ServeFile(w, r, filepath.Join(buildPath, "index.html"))
}

func main() {
	http.HandleFunc("/signup", signupHandler)
	http.HandleFunc("/login", loginHandler)
	http.HandleFunc("/", serveFrontend)

	log.Println("🚀 Server started at http://localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal("❌ Server error:", err)
	}
}
