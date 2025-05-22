package handlers

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/models"
)

// GetAllProductsHandler returns all available products for the shop, with optional category filter
func GetAllProductsHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetAllProductsHandler called with method: %s from %s", r.Method, r.RemoteAddr)

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Check if category filter is provided
	category := r.URL.Query().Get("category")
	
	var rows *sql.Rows
	var err error
	
	// Get products with optional category filter
	log.Println("Querying database for products...")
	
	if category != "" && category != "all" {
		log.Printf("Filtering by category: %s", category)
		rows, err = database.DB.Query(`
			SELECT 
				p.id, 
				p.name, 
				p.description, 
				p.price, 
				p.stock, 
				p.category, 
				p.image_url, 
				COALESCE(u.name, 'Unknown Seller') as seller_name
			FROM products p
			LEFT JOIN users u ON p.seller_id = u.id
			WHERE p.category = $1
			ORDER BY p.created_at DESC
		`, category)
	} else {
		log.Println("No category filter or 'all' selected, returning all products")
		rows, err = database.DB.Query(`
			SELECT 
				p.id, 
				p.name, 
				p.description, 
				p.price, 
				p.stock, 
				p.category, 
				p.image_url, 
				COALESCE(u.name, 'Unknown Seller') as seller_name
			FROM products p
			LEFT JOIN users u ON p.seller_id = u.id
			ORDER BY p.created_at DESC
		`)
	}

	if err != nil {
		log.Printf("Error fetching products: %v", err)
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	log.Println("Successfully executed query")
	defer rows.Close()

	var products []models.ProductWithSeller
	for rows.Next() {
		var p models.ProductWithSeller
		err := rows.Scan(
			&p.ID,
			&p.Name,
			&p.Description,
			&p.Price,
			&p.Stock,
			&p.Category,
			&p.ImageURL,
			&p.SellerName,
		)
		if err != nil {
			log.Printf("Error scanning product: %v", err)
			continue
		}
		log.Printf("Found product: ID=%d, Name=%s, Seller=%s", p.ID, p.Name, p.SellerName)
		products = append(products, p)
	}

	// Check for any errors during iteration
	if err = rows.Err(); err != nil {
		log.Printf("Error iterating over products: %v", err)
		http.Error(w, "Error reading products", http.StatusInternalServerError)
		return
	}

	// Always return an array, even if empty
	if products == nil {
		products = make([]models.ProductWithSeller, 0)
	}

	response := struct {
		Success  bool                      `json:"success"`
		Products []models.ProductWithSeller `json:"products"`
	}{
		Success:  true,
		Products: products,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response to JSON: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
	log.Printf("Successfully returned %d products", len(products))
}

// AddToCartHandler handles adding items to cart
func AddToCartHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var cartItem models.CartItem
	if err := json.NewDecoder(r.Body).Decode(&cartItem); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Check if product exists and has enough stock
	var currentStock int
	err := database.DB.QueryRow("SELECT stock FROM products WHERE id = $1", cartItem.ProductID).Scan(&currentStock)
	if err == sql.ErrNoRows {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error checking product stock: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if currentStock < cartItem.Quantity {
		http.Error(w, "Not enough stock", http.StatusBadRequest)
		return
	}

	// Add to cart or update quantity
	_, err = database.DB.Exec(`
		INSERT INTO cart_items (user_id, product_id, quantity)
		VALUES ($1, $2, $3)
		ON CONFLICT (user_id, product_id)
		DO UPDATE SET quantity = cart_items.quantity + $3
	`, cartItem.UserID, cartItem.ProductID, cartItem.Quantity)

	if err != nil {
		log.Printf("Error adding to cart: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Added to cart"})
}

// GetCartItemsHandler returns all cart items for a user
func GetCartItemsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	userID := r.URL.Query().Get("user_id")
	if userID == "" {
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	rows, err := database.DB.Query(`
		SELECT c.id, c.quantity, p.id, p.name, p.price, p.image_url
		FROM cart_items c
		JOIN products p ON c.product_id = p.id
		WHERE c.user_id = $1
	`, userID)
	if err != nil {
		log.Printf("Error fetching cart items: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cartItems []models.CartItemWithProduct
	for rows.Next() {
		var item models.CartItemWithProduct
		err := rows.Scan(&item.ID, &item.Quantity, &item.Product.ID,
			&item.Product.Name, &item.Product.Price, &item.Product.ImageURL)
		if err != nil {
			log.Printf("Error scanning cart item: %v", err)
			continue
		}
		cartItems = append(cartItems, item)
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(cartItems)
}

// GetProductCategoriesHandler returns all unique product categories
func GetProductCategoriesHandler(w http.ResponseWriter, r *http.Request) {
	log.Printf("GetProductCategoriesHandler called with method: %s from %s", r.Method, r.RemoteAddr)

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "*")

	// Handle preflight request
	if r.Method == http.MethodOptions {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get all unique categories
	log.Println("Querying database for unique product categories...")

	rows, err := database.DB.Query(`
		SELECT DISTINCT category 
		FROM products 
		WHERE category IS NOT NULL AND category != ''
		ORDER BY category ASC
	`)

	if err != nil {
		log.Printf("Error fetching categories: %v", err)
		http.Error(w, "Failed to fetch categories", http.StatusInternalServerError)
		return
	}

	log.Println("Successfully executed query")
	defer rows.Close()

	var categories []string
	for rows.Next() {
		var category string
		err := rows.Scan(&category)
		if err != nil {
			log.Printf("Error scanning category: %v", err)
			continue
		}
		categories = append(categories, category)
	}

	// Check for any errors during iteration
	if err = rows.Err(); err != nil {
		log.Printf("Error iterating over categories: %v", err)
		http.Error(w, "Error reading categories", http.StatusInternalServerError)
		return
	}

	// Always return an array, even if empty
	if categories == nil {
		categories = make([]string, 0)
	}

	response := struct {
		Success    bool     `json:"success"`
		Categories []string `json:"categories"`
	}{
		Success:    true,
		Categories: categories,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(response); err != nil {
		log.Printf("Error encoding response to JSON: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
	log.Printf("Successfully returned %d categories", len(categories))
}

// UpdateCartItemHandler updates the quantity of a cart item
func UpdateCartItemHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var cartItem models.CartItem
	if err := json.NewDecoder(r.Body).Decode(&cartItem); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if cartItem.Quantity <= 0 {
		// Delete the item if quantity is 0 or negative
		_, err := database.DB.Exec("DELETE FROM cart_items WHERE id = $1", cartItem.ID)
		if err != nil {
			log.Printf("Error deleting cart item: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	} else {
		// Update the quantity
		_, err := database.DB.Exec("UPDATE cart_items SET quantity = $1 WHERE id = $2",
			cartItem.Quantity, cartItem.ID)
		if err != nil {
			log.Printf("Error updating cart item: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"message": "Cart updated"})
}
