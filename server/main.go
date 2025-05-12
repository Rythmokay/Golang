package main

import (
	"log"
	"net/http"

	"github.com/rs/cors"

	"github.com/rythmokay/golang/config"
	"github.com/rythmokay/golang/database"
	"github.com/rythmokay/golang/handlers"
)

func init() {
	if err := database.Initialize(config.DBConnStr); err != nil {
		log.Fatal("❌ Error initializing database:", err)
	}
}

func main() {
	// Enable CORS for all origins in development
	c := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},  // Allow all origins
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"*"},  // Allow all headers
		ExposedHeaders: []string{"Content-Length"},
		AllowCredentials: false,  // Must be false if AllowedOrigins is "*"
		Debug:           true,
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

	// Cart routes
	mux.HandleFunc("/api/cart", handlers.GetCartItemsHandler)
	mux.HandleFunc("/api/cart/add", handlers.AddToCartHandler)
	mux.HandleFunc("/api/cart/update", handlers.UpdateCartItemHandler)

	// Wrap the mux with CORS middleware
	handler := c.Handler(mux)

	log.Println("🚀 Server started at http://localhost" + config.ServerPort)
	if err := http.ListenAndServe(config.ServerPort, handler); err != nil {
		log.Fatal("❌ Server error:", err)
	}
}
