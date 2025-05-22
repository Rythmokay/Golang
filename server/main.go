package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"

	"github.com/rythmokay/golang/server/config"
	"github.com/rythmokay/golang/server/database"
	"github.com/rythmokay/golang/server/handlers"
)

func init() {
	if err := database.Initialize(config.DBConnStr); err != nil {
		log.Fatal("❌ Error initializing database:", err)
	}

	// Run database migrations
	if err := database.RunMigrations(); err != nil {
		log.Fatal("❌ Error running migrations:", err)
	}
}

func main() {
	// Enable CORS for all origins in development
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"}, // Allow all origins in development
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"},
		AllowedHeaders:   []string{"Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"},
		ExposedHeaders:   []string{"Content-Length", "Content-Type"},
		MaxAge:           86400, // 24 hours for preflight cache
		AllowCredentials: false, // Must be false if AllowedOrigins is "*"
		Debug:            true,
	})

	// Create a new mux for our API
	mux := http.NewServeMux()
	mux.HandleFunc("/api/health", handlers.HealthCheck)
	mux.HandleFunc("/api/signup", handlers.SignupHandler)
	mux.HandleFunc("/api/login", handlers.LoginHandler)

	// Product routes
	mux.HandleFunc("/api/products/create", handlers.CreateProductHandler)
	mux.HandleFunc("/api/products/seller", handlers.GetSellerProductsHandler)
	mux.HandleFunc("/api/products/update", handlers.UpdateProductHandler)
	mux.HandleFunc("/api/products/delete", handlers.DeleteProductHandler)

	// Shop routes
	mux.HandleFunc("/api/shop/products", handlers.GetAllProductsHandler)
	mux.HandleFunc("/api/shop/categories", handlers.GetProductCategoriesHandler)

	// Cart routes
	mux.HandleFunc("/api/cart", handlers.GetCartItemsHandler)
	mux.HandleFunc("/api/cart/add", handlers.AddToCartHandler)
	mux.HandleFunc("/api/cart/update", handlers.UpdateCartItemHandler)

	// Profile routes
	mux.HandleFunc("/api/profile", handlers.GetProfile)
	mux.HandleFunc("/api/profile/update", handlers.UpdateProfile)

	// Order routes
	mux.HandleFunc("/api/checkout", handlers.CheckoutHandler)
	mux.HandleFunc("/api/orders/user", handlers.GetUserOrdersHandler)
	mux.HandleFunc("/api/orders/seller", handlers.GetSellerOrdersHandler)
	mux.HandleFunc("/api/orders/details", handlers.GetOrderDetailsHandler)
	mux.HandleFunc("/api/orders/seller-details", handlers.GetSellerOrderDetailsHandler)
	mux.HandleFunc("/api/orders/update-status", handlers.UpdateOrderStatusHandler)

	// Wrap the mux with CORS middleware
	handler := c.Handler(mux)

	log.Println("🚀 Server started at http://localhost" + config.ServerPort)
	if err := http.ListenAndServe(config.ServerPort, handler); err != nil {
		log.Fatal("❌ Server error:", err)
	}
}
