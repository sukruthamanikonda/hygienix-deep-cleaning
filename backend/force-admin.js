const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'hygienix.db');
const db = new sqlite3.Database(DB_PATH);

const PHONE = '9999999999';

console.log(`Forcing admin role for user with phone: ${PHONE}...`);

db.serialize(() => {
    // 1. Check if user exists
    db.get("SELECT * FROM users WHERE phone = ?", [PHONE], (err, row) => {
        if (err) {
            console.error("Error fetching user:", err);
            return;
        }

        if (!row) {
            console.log("❌ User NOT FOUND with this phone number.");
            console.log("   Creating the admin user now...");
            // Optionally create the user if missing, but for now just report it.
            // Let's create it to be safe.
            const bcrypt = require('bcryptjs');
            const hash = bcrypt.hashSync('admin123', 10); // Default password if we create it
            db.run("INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
                ['Admin', 'admin@hygienix.in', hash, PHONE, 'admin'],
                (err) => {
                    if (err) console.error("Error creating admin:", err);
                    else console.log("✅ Admin user CREATED. Password: 'admin123'");
                }
            );
        } else {
            console.log(`   Found user: ${row.name} (${row.email}) - Current Role: ${row.role}`);

            // 2. Update to admin
            db.run("UPDATE users SET role = 'admin' WHERE phone = ?", [PHONE], function (err) {
                if (err) {
                    console.error("Error updating role:", err);
                    return;
                }
                console.log("✅ SUCCESS: User role updated to 'admin'.");
            });
        }
    });
});

// Close later
setTimeout(() => db.close(), 2000);
