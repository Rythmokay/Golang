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
