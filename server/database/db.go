package database

import (
	"database/sql"
	"log"
	"os"
	"time"

	_ "github.com/lib/pq"
)

var DB *sql.DB

// Initialize initializes the database connection and schema
func Initialize(connStr string) error {
	log.Println("Initializing database connection...")

	var err error
	DB, err = sql.Open("postgres", connStr)
	if err != nil {
		log.Printf("❌ Failed to open database connection: %v", err)
		return err
	}

	// Set connection pool settings
	DB.SetMaxOpenConns(25)
	DB.SetMaxIdleConns(5)
	DB.SetConnMaxLifetime(5 * time.Minute)

	if err := DB.Ping(); err != nil {
		log.Printf("❌ Failed to ping database: %v", err)
		return err
	}
	log.Println("✅ Connected to the database")

	// Read and execute schema.sql
	log.Println("Reading schema.sql file...")
	schemaSQL, err := os.ReadFile("schema.sql")
	if err != nil {
		log.Printf("❌ Failed to read schema.sql: %v", err)
		return err
	}

	log.Println("Executing database schema...")
	_, err = DB.Exec(string(schemaSQL))
	if err != nil {
		log.Printf("❌ Failed to execute schema: %v", err)
		return err
	}

	log.Println("✅ Database schema updated successfully")
	return nil
}

// RunMigrations applies database migrations to add new fields
func RunMigrations() error {
	log.Println("Running database migrations...")
	
	// Add address and phone_number columns to users table if they don't exist
	_, err := DB.Exec(`
		ALTER TABLE users ADD COLUMN IF NOT EXISTS address VARCHAR(255);
		ALTER TABLE users ADD COLUMN IF NOT EXISTS phone_number VARCHAR(20);
	`)
	
	if err != nil {
		log.Printf("❌ Failed to execute migrations: %v", err)
		return err
	}

	// Drop and recreate orders table to fix schema issues
	_, err = DB.Exec(`DROP TABLE IF EXISTS order_items CASCADE;`)
	if err != nil {
		log.Printf("❌ Failed to drop order_items table: %v", err)
		// Continue anyway, as the table might not exist
	}

	_, err = DB.Exec(`DROP TABLE IF EXISTS orders CASCADE;`)
	if err != nil {
		log.Printf("❌ Failed to drop orders table: %v", err)
		// Continue anyway, as the table might not exist
	}

	// Create orders table with correct schema
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS orders (
			id SERIAL PRIMARY KEY,
			user_id INTEGER NOT NULL REFERENCES users(id),
			total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
			status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
			payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('razorpay', 'cod')),
			payment_id VARCHAR(100),
			shipping_address TEXT NOT NULL,
			contact_number VARCHAR(20) NOT NULL,
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
			updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Printf("❌ Failed to create orders table: %v", err)
		return err
	}

	// Create order_items table if it doesn't exist
	_, err = DB.Exec(`
		CREATE TABLE IF NOT EXISTS order_items (
			id SERIAL PRIMARY KEY,
			order_id INTEGER NOT NULL REFERENCES orders(id),
			product_id INTEGER NOT NULL REFERENCES products(id),
			quantity INTEGER NOT NULL CHECK (quantity > 0),
			price DECIMAL(10,2) NOT NULL CHECK (price > 0),
			created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
		);
	`)
	if err != nil {
		log.Printf("❌ Failed to create order_items table: %v", err)
		return err
	}

	// Create indexes for better performance
	_, err = DB.Exec(`
		CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
		CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
		CREATE INDEX IF NOT EXISTS idx_order_items_product ON order_items(product_id);
	`)
	if err != nil {
		log.Printf("❌ Failed to create indexes: %v", err)
		return err
	}
	
	log.Println("✅ Database migrations completed successfully")
	return nil
}
