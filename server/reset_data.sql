-- Reset data script
-- This script deletes all user and seller data without changing the schema

-- First, disable foreign key checks to avoid constraint errors
BEGIN;

-- Clear order_items table first (child table)
TRUNCATE TABLE order_items CASCADE;

-- Clear orders table
TRUNCATE TABLE orders CASCADE;

-- Clear cart_items table
TRUNCATE TABLE cart_items CASCADE;

-- Clear products table
TRUNCATE TABLE products CASCADE;

-- Clear users table last (parent table)
TRUNCATE TABLE users CASCADE;

COMMIT;

-- Re-enable foreign key checks
