const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'hygienix.db');
const db = new sqlite3.Database(DB_PATH);

const ADMIN_PHONE = '9999999999';
const ADMIN_EMAIL = 'admin@hygienix.in';
const ADMIN_PASSWORD = 'admin123';
const ADMIN_NAME = 'Admin';

console.log('Creating admin user...\n');

bcrypt.hash(ADMIN_PASSWORD, 10).then(hash => {
    db.run(
        "INSERT OR REPLACE INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
        [ADMIN_NAME, ADMIN_EMAIL, hash, ADMIN_PHONE, 'admin'],
        function (err) {
            if (err) {
                console.error("Error creating admin:", err);
            } else {
                console.log("✅ Admin user created successfully!");
                console.log("   Email:", ADMIN_EMAIL);
                console.log("   Phone:", ADMIN_PHONE);
                console.log("   Password:", ADMIN_PASSWORD);
                console.log("   Role: admin");
                console.log("\nYou can now login at http://localhost:3000/login");
            }
            db.close();
        }
    );
});
