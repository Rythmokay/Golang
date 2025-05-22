package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"

	"github.com/rythmokay/golang/server/config"
	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/models"
)

// SignupHandler handles user registration
func SignupHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("📝 Received signup request")
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		json.NewEncoder(w).Encode(map[string]string{"error": "Method not allowed"})
		return
	}

	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid request format"})
		return
	}

	// Validate required fields
	if strings.TrimSpace(user.Name) == "" || strings.TrimSpace(user.Email) == "" || user.Password == "" || user.Role == "" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "All fields are required"})
		return
	}

	// Validate role
	if user.Role != "seller" && user.Role != "customer" {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid role. Must be 'seller' or 'customer'"})
		return
	}

	// Validate password length
	if len(user.Password) < config.MinPasswordLength {
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Password must be at least 6 characters"})
		return
	}

	// Check if email already exists
	var existingID int
	log.Printf("📧 Checking if email exists: %s", user.Email)
	err := database.DB.QueryRow("SELECT id FROM users WHERE email = $1", user.Email).Scan(&existingID)

	if err != nil && err != sql.ErrNoRows {
		log.Printf("❌ Database error checking email: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
		return
	}

	if err == nil {
		log.Printf("❌ Email already exists")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(map[string]string{"error": "Email already registered"})
		return
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.Password), bcrypt.DefaultCost)
	if err != nil {
		log.Printf("Error hashing password: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error processing password"})
		return
	}

	// Insert new user and get the ID
	var userID int
	log.Printf("👤 Creating new user with name: %s, email: %s, role: %s", user.Name, user.Email, user.Role)

	err = database.DB.QueryRow(
		"INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id",
		user.Name, user.Email, string(hashedPassword), user.Role,
	).Scan(&userID)

	if err != nil {
		log.Printf("❌ Error creating user: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Error creating user"})
		return
	}

	log.Printf("✅ User created successfully with ID: %d", userID)

	// Return success response
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "User registered successfully",
		"id":      userID,
		"name":    user.Name,
		"email":   user.Email,
		"role":    user.Role,
	})
}

// LoginHandler handles user login
func LoginHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("🔑 Received login request")
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var input models.User
	if err := json.NewDecoder(r.Body).Decode(&input); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Check for empty fields
	if input.Email == "" || input.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	var stored models.User
	err := database.DB.QueryRow("SELECT id, name, email, password, role FROM users WHERE email = $1", input.Email).
		Scan(&stored.ID, &stored.Name, &stored.Email, &stored.Password, &stored.Role)

	// Handle no user found case
	if err == sql.ErrNoRows {
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}

	// Handle database errors
	if err != nil {
		log.Printf("Database error: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		json.NewEncoder(w).Encode(map[string]string{"error": "Internal server error"})
		return
	}

	// Compare password
	log.Printf("🔐 Comparing password for user: %s", input.Email)
	if err := bcrypt.CompareHashAndPassword([]byte(stored.Password), []byte(input.Password)); err != nil {
		log.Printf("❌ Invalid password for user: %s", input.Email)
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Invalid email or password"})
		return
	}
	log.Printf("✅ Password correct for user: %s", input.Email)

	// Generate a simple token (in a real app, use JWT or other secure token)
	token := "auth-token-" + stored.Email // Simple token for demo purposes

	// Log successful login with role information
	log.Printf("✅ Login successful for user: %s with role: %s", stored.Email, stored.Role)

	// Successful login
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Login successful",
		"id":      stored.ID,
		"name":    stored.Name,
		"email":   stored.Email,
		"role":    stored.Role,
		"token":   token,
	})
}
