package models

import (
	"time"
)

// ExtendedOrder represents an order placed by a user with additional fields for the checkout system
type ExtendedOrder struct {
	ID              int       `json:"id"`
	UserID          int       `json:"user_id"`
	TotalAmount     float64   `json:"total_amount"`
	Status          string    `json:"status"`
	PaymentMethod   string    `json:"payment_method"`
	PaymentID       string    `json:"payment_id,omitempty"`
	ShippingAddress string    `json:"shipping_address"`
	ContactNumber   string    `json:"contact_number"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

// ExtendedOrderItem represents an item in an order with additional fields for the checkout system
type ExtendedOrderItem struct {
	ID        int       `json:"id"`
	OrderID   int       `json:"order_id"`
	ProductID int       `json:"product_id"`
	SellerID  int       `json:"seller_id"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	CreatedAt time.Time `json:"created_at"`
}

// OrderWithItems represents an order with its items
type OrderWithItems struct {
	Order      ExtendedOrder       `json:"order"`
	OrderItems []ExtendedOrderItem `json:"order_items"`
}

// OrderItemWithDetails represents an order item with product details
type OrderItemWithDetails struct {
	ExtendedOrderItem
	ProductName  string `json:"product_name"`
	ProductImage string `json:"product_image"`
}

// OrderWithItemDetails represents an order with detailed item information
type OrderWithItemDetails struct {
	Order      ExtendedOrder          `json:"order"`
	OrderItems []OrderItemWithDetails `json:"order_items"`
	UserName   string                 `json:"user_name,omitempty"`
}

// CheckoutRequest represents the data needed for checkout
type CheckoutRequest struct {
	UserID          int     `json:"user_id"`
	PaymentMethod   string  `json:"payment_method"`
	ShippingAddress string  `json:"shipping_address"`
	ContactNumber   string  `json:"contact_number"`
	PaymentID       string  `json:"payment_id,omitempty"`
}

// PaymentResponse represents a response from the payment gateway
type PaymentResponse struct {
	PaymentID string `json:"payment_id"`
	OrderID   string `json:"order_id"`
	Status    string `json:"status"`
}
