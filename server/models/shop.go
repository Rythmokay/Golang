package models

import "time"

type ProductWithSeller struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	Stock       int     `json:"stock"`
	Category    string  `json:"category"`
	ImageURL    string  `json:"image_url"`
	SellerName  string  `json:"seller_name"`
}

type CartItem struct {
	ID        int `json:"id"`
	UserID    int `json:"user_id"`
	ProductID int `json:"product_id"`
	Quantity  int `json:"quantity"`
}

type CartItemWithProduct struct {
	ID       int     `json:"id"`
	Quantity int     `json:"quantity"`
	Product  Product `json:"product"`
}

type Order struct {
	ID              int       `json:"id"`
	UserID          int       `json:"user_id"`
	TotalAmount     float64   `json:"total_amount"`
	Status          string    `json:"status"`
	ShippingAddress string    `json:"shipping_address"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
	Items           []OrderItem `json:"items"`
}

type OrderItem struct {
	ID          int     `json:"id"`
	OrderID     int     `json:"order_id"`
	ProductID   int     `json:"product_id"`
	Quantity    int     `json:"quantity"`
	PriceAtTime float64 `json:"price_at_time"`
	Product     Product `json:"product,omitempty"`
}
