package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/models"
)

// CreateProductHandler handles the creation of a new product
func CreateProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the product data from request body
	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if product.Name == "" || product.Price <= 0 || product.Category == "" {
		http.Error(w, "Name, price, and category are required", http.StatusBadRequest)
		return
	}

	// Set timestamps
	now := time.Now()
	product.CreatedAt = now
	product.UpdatedAt = now

	// Insert the product into database
	query := `
		INSERT INTO products (seller_id, name, description, price, stock, category, image_url, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id`

	err := database.DB.QueryRow(
		query,
		product.SellerID,
		product.Name,
		product.Description,
		product.Price,
		product.Stock,
		product.Category,
		product.ImageURL,
		product.CreatedAt,
		product.UpdatedAt,
	).Scan(&product.ID)

	if err != nil {
		log.Printf("Error creating product: %v", err)
		http.Error(w, "Error creating product", http.StatusInternalServerError)
		return
	}

	// Return the created product
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(product)
}

// GetSellerProductsHandler handles fetching all products for a seller
func GetSellerProductsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("🔍 Received request to get seller products")
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check for authentication token
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		log.Printf("❌ Missing authorization header")
		w.WriteHeader(http.StatusUnauthorized)
		json.NewEncoder(w).Encode(map[string]string{"error": "Authentication required"})
		return
	}

	// Get seller ID from query parameter
	sellerIDStr := r.URL.Query().Get("seller_id")
	if sellerIDStr == "" {
		log.Printf("❌ Missing seller_id parameter")
		http.Error(w, "Seller ID is required", http.StatusBadRequest)
		return
	}

	sellerID, err := strconv.Atoi(sellerIDStr)
	if err != nil {
		log.Printf("❌ Invalid seller ID format: %s", sellerIDStr)
		http.Error(w, "Invalid seller ID", http.StatusBadRequest)
		return
	}
	
	// In a real application, you would verify the token and check if the user
	// has the seller role and is authorized to access these products
	// For now, we'll just log the request

	// Query products from database
	query := `
		SELECT id, seller_id, name, description, price, stock, category, image_url, created_at, updated_at
		FROM products
		WHERE seller_id = $1
		ORDER BY created_at DESC`

	rows, err := database.DB.Query(query, sellerID)
	if err != nil {
		log.Printf("Error querying products: %v", err)
		http.Error(w, "Error fetching products", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var products []models.Product
	for rows.Next() {
		var p models.Product
		err := rows.Scan(
			&p.ID,
			&p.SellerID,
			&p.Name,
			&p.Description,
			&p.Price,
			&p.Stock,
			&p.Category,
			&p.ImageURL,
			&p.CreatedAt,
			&p.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning product: %v", err)
			continue
		}
		products = append(products, p)
	}

	if err = rows.Err(); err != nil {
		log.Printf("Error iterating products: %v", err)
		http.Error(w, "Error fetching products", http.StatusInternalServerError)
		return
	}

	// Return the products
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(products)
}

// UpdateProductHandler handles updating a product
func UpdateProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the product data from request body
	var product models.Product
	if err := json.NewDecoder(r.Body).Decode(&product); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Validate required fields
	if product.ID == 0 || product.Name == "" || product.Price <= 0 || product.Category == "" {
		http.Error(w, "ID, name, price, and category are required", http.StatusBadRequest)
		return
	}

	// Update the product in database
	query := `
		UPDATE products
		SET name = $1, description = $2, price = $3, stock = $4, category = $5, image_url = $6, updated_at = $7
		WHERE id = $8 AND seller_id = $9
		RETURNING id`

	err := database.DB.QueryRow(
		query,
		product.Name,
		product.Description,
		product.Price,
		product.Stock,
		product.Category,
		product.ImageURL,
		time.Now(),
		product.ID,
		product.SellerID,
	).Scan(&product.ID)

	if err == sql.ErrNoRows {
		http.Error(w, "Product not found or unauthorized", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error updating product: %v", err)
		http.Error(w, "Error updating product", http.StatusInternalServerError)
		return
	}

	// Return the updated product
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(product)
}

// DeleteProductHandler handles deleting a product
func DeleteProductHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodDelete {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get product ID and seller ID from query parameters
	productIDStr := r.URL.Query().Get("product_id")
	sellerIDStr := r.URL.Query().Get("seller_id")

	if productIDStr == "" || sellerIDStr == "" {
		http.Error(w, "Product ID and seller ID are required", http.StatusBadRequest)
		return
	}

	productID, err := strconv.Atoi(productIDStr)
	if err != nil {
		http.Error(w, "Invalid product ID", http.StatusBadRequest)
		return
	}

	sellerID, err := strconv.Atoi(sellerIDStr)
	if err != nil {
		http.Error(w, "Invalid seller ID", http.StatusBadRequest)
		return
	}

	// Delete the product from database
	query := "DELETE FROM products WHERE id = $1 AND seller_id = $2"
	result, err := database.DB.Exec(query, productID, sellerID)
	if err != nil {
		log.Printf("Error deleting product: %v", err)
		http.Error(w, "Error deleting product", http.StatusInternalServerError)
		return
	}

	rowsAffected, err := result.RowsAffected()
	if err != nil {
		log.Printf("Error getting rows affected: %v", err)
		http.Error(w, "Error deleting product", http.StatusInternalServerError)
		return
	}

	if rowsAffected == 0 {
		http.Error(w, "Product not found or unauthorized", http.StatusNotFound)
		return
	}

	// Return success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"message": "Product deleted successfully"})
}
