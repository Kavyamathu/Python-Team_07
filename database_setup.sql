-- MySQL Workbench la itha run pannunga
-- Campus Resource Management System Database Setup

-- Create database
CREATE DATABASE IF NOT EXISTS campus_resource_db 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE campus_resource_db;

-- Show confirmation
SELECT 'Database campus_resource_db created successfully!' AS Status;

-- Optional: Create a dedicated user (recommended for production)
-- CREATE USER 'campus_admin'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON campus_resource_db.* TO 'campus_admin'@'localhost';
-- FLUSH PRIVILEGES;
