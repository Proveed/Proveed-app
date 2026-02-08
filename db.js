const sqlite3 = require('sqlite3').verbose();

// Connect to the SQLite database
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Create tables
db.serialize(() => {
    // Create users table
    db.run(`CREATE TABLE IF NOT EXISTS users (`+
        `id INTEGER PRIMARY KEY AUTOINCREMENT,`+
        `username TEXT NOT NULL UNIQUE,`+
        `password TEXT NOT NULL,`+
        `email TEXT NOT NULL UNIQUE,`+
        `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`+
    `)`);
    
    // Create emprendedores table
    db.run(`CREATE TABLE IF NOT EXISTS emprendedores (`+
        `id INTEGER PRIMARY KEY AUTOINCREMENT,`+
        `name TEXT NOT NULL,`+
        `user_id INTEGER,`+
        `FOREIGN KEY (user_id) REFERENCES users(id),`+
        `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`+
    `)`);
    
    // Create proveedores table
    db.run(`CREATE TABLE IF NOT EXISTS proveedores (`+
        `id INTEGER PRIMARY KEY AUTOINCREMENT,`+
        `name TEXT NOT NULL,`+
        `contact_info TEXT,`+
        `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`+
    `)`);
    
    // Create provider_bank table
    db.run(`CREATE TABLE IF NOT EXISTS provider_bank (`+
        `id INTEGER PRIMARY KEY AUTOINCREMENT,`+
        `provider_id INTEGER,`+
        `bank_name TEXT NOT NULL,`+
        `account_number TEXT NOT NULL,`+
        `FOREIGN KEY (provider_id) REFERENCES proveedores(id),`+
        `created_at DATETIME DEFAULT CURRENT_TIMESTAMP`+
    `)`);
});

// Close the database connection
db.close((err) => {
    if (err) {
        console.error('Error closing the SQLite database:', err.message);
    } else {
        console.log('Closed the SQLite database connection.');
    }
});
