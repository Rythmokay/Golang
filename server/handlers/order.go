package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
	"time"

	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/models"
)

// CheckoutHandler handles the checkout process
func CheckoutHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse the checkout request
	var checkoutReq models.CheckoutRequest
	if err := json.NewDecoder(r.Body).Decode(&checkoutReq); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Validate request data
	if checkoutReq.UserID == 0 || checkoutReq.ShippingAddress == "" || checkoutReq.ContactNumber == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	// Validate payment method
	if checkoutReq.PaymentMethod != "razorpay" && checkoutReq.PaymentMethod != "cod" {
		http.Error(w, "Invalid payment method", http.StatusBadRequest)
		return
	}

	// If payment method is razorpay, payment_id is required
	if checkoutReq.PaymentMethod == "razorpay" && checkoutReq.PaymentID == "" {
		http.Error(w, "Payment ID is required for Razorpay payments", http.StatusBadRequest)
		return
	}

	// Start a transaction
	tx, err := database.DB.Begin()
	if err != nil {
		log.Printf("Error starting transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer tx.Rollback() // Will be ignored if transaction is committed

	// Get cart items
	rows, err := tx.Query(`
		SELECT c.product_id, c.quantity, p.price, p.stock
		FROM cart_items c
		JOIN products p ON c.product_id = p.id
		WHERE c.user_id = $1
	`, checkoutReq.UserID)
	if err != nil {
		log.Printf("Error fetching cart items: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var cartItems []struct {
		ProductID int
		Quantity  int
		Price     float64
		Stock     int
	}

	totalAmount := 0.0
	for rows.Next() {
		var item struct {
			ProductID int
			Quantity  int
			Price     float64
			Stock     int
		}
		if err := rows.Scan(&item.ProductID, &item.Quantity, &item.Price, &item.Stock); err != nil {
			log.Printf("Error scanning cart item: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Check if product has enough stock
		if item.Stock < item.Quantity {
			http.Error(w, fmt.Sprintf("Product ID %d does not have enough stock", item.ProductID), http.StatusBadRequest)
			return
		}

		cartItems = append(cartItems, item)
		totalAmount += item.Price * float64(item.Quantity)
	}

	if len(cartItems) == 0 {
		http.Error(w, "Cart is empty", http.StatusBadRequest)
		return
	}

	// Create order
	now := time.Now()
	var orderID int

	// Determine order status based on payment method
	var orderStatus string
	if checkoutReq.PaymentMethod == "cod" {
		orderStatus = "pending"
	} else {
		orderStatus = "paid"
	}

	err = tx.QueryRow(`
		INSERT INTO orders (user_id, total_amount, status, payment_method, payment_id, shipping_address, contact_number, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
		RETURNING id
	`,
		checkoutReq.UserID,
		totalAmount,
		orderStatus,
		checkoutReq.PaymentMethod,
		checkoutReq.PaymentID,
		checkoutReq.ShippingAddress,
		checkoutReq.ContactNumber,
		now,
		now,
	).Scan(&orderID)

	if err != nil {
		log.Printf("Error creating order: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Create order items and update product stock
	for _, item := range cartItems {
		_, err = tx.Exec(`
			INSERT INTO order_items (order_id, product_id, quantity, price, created_at)
			VALUES ($1, $2, $3, $4, $5)
		`, orderID, item.ProductID, item.Quantity, item.Price, now)

		if err != nil {
			log.Printf("Error creating order item: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}

		// Update product stock
		_, err = tx.Exec(`
			UPDATE products
			SET stock = stock - $1
			WHERE id = $2
		`, item.Quantity, item.ProductID)

		if err != nil {
			log.Printf("Error updating product stock: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
	}

	// Clear the user's cart
	_, err = tx.Exec("DELETE FROM cart_items WHERE user_id = $1", checkoutReq.UserID)
	if err != nil {
		log.Printf("Error clearing cart: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Commit the transaction
	if err = tx.Commit(); err != nil {
		log.Printf("Error committing transaction: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := struct {
		Success bool `json:"success"`
		OrderID int  `json:"order_id"`
	}{
		Success: true,
		OrderID: orderID,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(response)
}

// GetUserOrdersHandler returns all orders for a user
func GetUserOrdersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get user ID from query parameter
	userIDStr := r.URL.Query().Get("user_id")
	if userIDStr == "" {
		log.Printf("No user_id provided in query parameters")
		http.Error(w, "User ID is required", http.StatusBadRequest)
		return
	}

	log.Printf("Fetching orders for user ID: %s", userIDStr)

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		log.Printf("Invalid user ID format: %s", userIDStr)
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Get orders
	log.Printf("Executing query for user ID: %d", userID)
	rows, err := database.DB.Query(`
		SELECT id, user_id, total_amount, status, payment_method, payment_id, shipping_address, contact_number, created_at, updated_at
		FROM orders
		WHERE user_id = $1
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		log.Printf("Error fetching orders: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []models.ExtendedOrder
	for rows.Next() {
		var order models.ExtendedOrder
		var paymentID sql.NullString
		err := rows.Scan(
			&order.ID,
			&order.UserID,
			&order.TotalAmount,
			&order.Status,
			&order.PaymentMethod,
			&paymentID,
			&order.ShippingAddress,
			&order.ContactNumber,
			&order.CreatedAt,
			&order.UpdatedAt,
		)
		if err != nil {
			log.Printf("Error scanning order: %v", err)
			continue
		}
		if paymentID.Valid {
			order.PaymentID = paymentID.String
		}
		orders = append(orders, order)
	}

	// Return orders
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

// GetOrderDetailsHandler returns details of a specific order
func GetOrderDetailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get order ID from query parameter
	orderIDStr := r.URL.Query().Get("order_id")
	if orderIDStr == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	// Get order details
	var order models.ExtendedOrder
	var paymentID sql.NullString
	err = database.DB.QueryRow(`
		SELECT id, user_id, total_amount, status, payment_method, payment_id, shipping_address, contact_number, created_at, updated_at
		FROM orders
		WHERE id = $1
	`, orderID).Scan(
		&order.ID,
		&order.UserID,
		&order.TotalAmount,
		&order.Status,
		&order.PaymentMethod,
		&paymentID,
		&order.ShippingAddress,
		&order.ContactNumber,
		&order.CreatedAt,
		&order.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}
	if err != nil {
		log.Printf("Error fetching order: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	if paymentID.Valid {
		order.PaymentID = paymentID.String
	}

	// Get order items with product details
	rows, err := database.DB.Query(`
		SELECT oi.id, oi.order_id, oi.product_id, p.seller_id, oi.quantity, oi.price, oi.created_at,
			   p.name, p.image_url
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = $1
	`, orderID)
	if err != nil {
		log.Printf("Error fetching order items: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orderItems []models.OrderItemWithDetails
	for rows.Next() {
		var item models.OrderItemWithDetails
		err := rows.Scan(
			&item.ID,
			&item.OrderID,
			&item.ProductID,
			&item.SellerID,
			&item.Quantity,
			&item.Price,
			&item.CreatedAt,
			&item.ProductName,
			&item.ProductImage,
		)
		if err != nil {
			log.Printf("Error scanning order item: %v", err)
			continue
		}
		orderItems = append(orderItems, item)
	}

	// Get user name
	var userName string
	err = database.DB.QueryRow("SELECT name FROM users WHERE id = $1", order.UserID).Scan(&userName)
	if err != nil && err != sql.ErrNoRows {
		log.Printf("Error fetching user name: %v", err)
	}

	// Return order with items
	orderWithItems := models.OrderWithItemDetails{
		Order:      order,
		OrderItems: orderItems,
		UserName:   userName,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orderWithItems)
}

// GetSellerOrdersHandler returns all orders for a seller
func GetSellerOrdersHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get seller ID from query parameter
	sellerIDStr := r.URL.Query().Get("seller_id")
	if sellerIDStr == "" {
		http.Error(w, "Seller ID is required", http.StatusBadRequest)
		return
	}

	sellerID, err := strconv.Atoi(sellerIDStr)
	if err != nil {
		http.Error(w, "Invalid seller ID", http.StatusBadRequest)
		return
	}

	// Get orders that contain items sold by this seller
	rows, err := database.DB.Query(`
		SELECT DISTINCT o.id, o.user_id, o.total_amount, o.status, o.payment_method, o.payment_id, 
		       o.shipping_address, o.contact_number, o.created_at, o.updated_at, u.name
		FROM orders o
		JOIN order_items oi ON o.id = oi.order_id
		JOIN products p ON oi.product_id = p.id
		JOIN users u ON o.user_id = u.id
		WHERE p.seller_id = $1
		ORDER BY o.created_at DESC
	`, sellerID)
	if err != nil {
		log.Printf("Error fetching seller orders: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orders []struct {
		models.ExtendedOrder
		UserName string `json:"user_name"`
	}

	for rows.Next() {
		var order struct {
			models.ExtendedOrder
			UserName string `json:"user_name"`
		}
		var paymentID sql.NullString
		err := rows.Scan(
			&order.ID,
			&order.UserID,
			&order.TotalAmount,
			&order.Status,
			&order.PaymentMethod,
			&paymentID,
			&order.ShippingAddress,
			&order.ContactNumber,
			&order.CreatedAt,
			&order.UpdatedAt,
			&order.UserName,
		)
		if err != nil {
			log.Printf("Error scanning order: %v", err)
			continue
		}
		if paymentID.Valid {
			order.PaymentID = paymentID.String
		}
		orders = append(orders, order)
	}

	// Return orders
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(orders)
}

// GetSellerOrderDetailsHandler gets the details of an order for a specific seller
func GetSellerOrderDetailsHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get order ID from query parameter
	orderIDStr := r.URL.Query().Get("order_id")
	if orderIDStr == "" {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	orderID, err := strconv.Atoi(orderIDStr)
	if err != nil {
		http.Error(w, "Invalid order ID", http.StatusBadRequest)
		return
	}

	// Get seller ID from query parameter
	sellerIDStr := r.URL.Query().Get("seller_id")
	if sellerIDStr == "" {
		http.Error(w, "Seller ID is required", http.StatusBadRequest)
		return
	}

	sellerID, err := strconv.Atoi(sellerIDStr)
	if err != nil {
		http.Error(w, "Invalid seller ID", http.StatusBadRequest)
		return
	}

	// Get order details
	var order models.ExtendedOrder
	var paymentID sql.NullString
	var userName string

	// First check if this seller has any items in this order
	var hasItems bool
	err = database.DB.QueryRow(`
		SELECT EXISTS(
			SELECT 1 FROM order_items oi
			JOIN products p ON oi.product_id = p.id
			WHERE oi.order_id = $1 AND p.seller_id = $2
		)
	`, orderID, sellerID).Scan(&hasItems)

	if err != nil {
		log.Printf("Error checking if seller has items in order: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if !hasItems {
		http.Error(w, "Order not found or does not contain products from this seller", http.StatusNotFound)
		return
	}

	// Get the order details
	err = database.DB.QueryRow(`
		SELECT o.id, o.user_id, o.total_amount, o.status, o.payment_method, o.payment_id, 
		       o.shipping_address, o.contact_number, o.created_at, o.updated_at, u.name
		FROM orders o
		JOIN users u ON o.user_id = u.id
		WHERE o.id = $1
	`, orderID).Scan(
		&order.ID,
		&order.UserID,
		&order.TotalAmount,
		&order.Status,
		&order.PaymentMethod,
		&paymentID,
		&order.ShippingAddress,
		&order.ContactNumber,
		&order.CreatedAt,
		&order.UpdatedAt,
		&userName,
	)

	if err == sql.ErrNoRows {
		http.Error(w, "Order not found", http.StatusNotFound)
		return
	}

	if err != nil {
		log.Printf("Error fetching order: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	if paymentID.Valid {
		order.PaymentID = paymentID.String
	}

	// Get only the order items that belong to this seller
	rows, err := database.DB.Query(`
		SELECT oi.id, oi.order_id, oi.product_id, p.seller_id, oi.quantity, oi.price, oi.created_at,
			   p.name, p.image_url
		FROM order_items oi
		JOIN products p ON oi.product_id = p.id
		WHERE oi.order_id = $1 AND p.seller_id = $2
	`, orderID, sellerID)

	if err != nil {
		log.Printf("Error fetching order items: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var orderItems []models.OrderItemWithDetails
	for rows.Next() {
		var item models.OrderItemWithDetails
		err := rows.Scan(
			&item.ID,
			&item.OrderID,
			&item.ProductID,
			&item.SellerID,
			&item.Quantity,
			&item.Price,
			&item.CreatedAt,
			&item.ProductName,
			&item.ProductImage,
		)
		if err != nil {
			log.Printf("Error scanning order item: %v", err)
			continue
		}
		orderItems = append(orderItems, item)
	}

	// Calculate seller's subtotal (only for their products)
	var sellerSubtotal float64
	for _, item := range orderItems {
		sellerSubtotal += item.Price * float64(item.Quantity)
	}

	// Return order details with only this seller's items
	response := struct {
		Order          models.ExtendedOrder          `json:"order"`
		Items          []models.OrderItemWithDetails `json:"items"`
		UserName       string                        `json:"user_name"`
		SellerSubtotal float64                       `json:"seller_subtotal"`
	}{
		Order:          order,
		Items:          orderItems,
		UserName:       userName,
		SellerSubtotal: sellerSubtotal,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// UpdateOrderStatusHandler updates the status of an order
func UpdateOrderStatusHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPut {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var request struct {
		OrderID int    `json:"order_id"`
		Status  string `json:"status"`
	}
	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		http.Error(w, "Invalid request format", http.StatusBadRequest)
		return
	}

	// Validate request data
	if request.OrderID == 0 {
		http.Error(w, "Order ID is required", http.StatusBadRequest)
		return
	}

	// Validate status
	validStatuses := []string{"pending", "paid", "processing", "shipped", "delivered", "cancelled"}
	isValidStatus := false
	for _, status := range validStatuses {
		if request.Status == status {
			isValidStatus = true
			break
		}
	}
	if !isValidStatus {
		http.Error(w, "Invalid status", http.StatusBadRequest)
		return
	}

	// Update order status
	_, err := database.DB.Exec(`
		UPDATE orders
		SET status = $1, updated_at = $2
		WHERE id = $3
	`, request.Status, time.Now(), request.OrderID)
	if err != nil {
		log.Printf("Error updating order status: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// Return success response
	response := struct {
		Success bool   `json:"success"`
		Message string `json:"message"`
	}{
		Success: true,
		Message: "Order status updated successfully",
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
