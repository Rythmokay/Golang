package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/models"
)

// GetProfile handles fetching user profile information
func GetProfile(w http.ResponseWriter, r *http.Request) {
	log.Printf("📝 Received profile fetch request")
	w.Header().Set("Content-Type", "application/json")

	if r.Method != http.MethodGet {
		log.Printf("❌ Method not allowed: %s", r.Method)
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user ID from query parameter
	userIDStr := r.URL.Query().Get("user_id")
	log.Printf("📝 Fetching profile for user ID: %s", userIDStr)

	if userIDStr == "" {
		log.Printf("❌ User ID is required")
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Printf("❌ Invalid user ID: %v", err)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Query user from database
	var user models.User
	query := `
		SELECT id, name, email, role, COALESCE(address, '') as address, COALESCE(phone_number, '') as phone_number
		FROM users
		WHERE id = $1
	`
	log.Printf("📝 Executing query: %s with ID: %d", query, userID)

	err = database.DB.QueryRow(query, userID).Scan(&user.ID, &user.Name, &user.Email, &user.Role, &user.Address, &user.PhoneNumber)

	if err != nil {
		log.Printf("❌ Error fetching user profile: %v", err)
		http.Error(w, "Error fetching profile", http.StatusInternalServerError)
		return
	}

	log.Printf("✅ Successfully fetched profile for user ID: %d", userID)

	// Return user profile
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

// UpdateProfile handles updating user profile information
func UpdateProfile(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the user data from request body
	var user models.User
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Update user in database - only update name, address, and phone number (not email)
	_, err := database.DB.Exec(`
		UPDATE users
		SET name = $1, address = $2, phone_number = $3
		WHERE id = $4
	`, user.Name, user.Address, user.PhoneNumber, user.ID)

	if err != nil {
		log.Printf("Error updating user profile: %v", err)
		http.Error(w, "Error updating profile", http.StatusInternalServerError)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Profile updated successfully"})
}
