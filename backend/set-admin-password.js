const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'hygienix.db');
const db = new sqlite3.Database(DB_PATH);

const PHONE = '9999999999';
const PASSWORD = 'admin123';

console.log('Setting password for admin user...\n');

db.serialize(() => {
    // Check if user exists
    db.get("SELECT * FROM users WHERE phone = ?", [PHONE], async (err, row) => {
        if (err) {
            console.error("Error:", err);
            db.close();
            return;
        }

        if (!row) {
            console.log("❌ User NOT FOUND with phone:", PHONE);
            console.log("Creating admin user now...\n");

            const hash = await bcrypt.hash(PASSWORD, 10);
            db.run(
                "INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)",
                ['Admin', 'admin@hygienix.in', hash, PHONE, 'admin'],
                function (err) {
                    if (err) {
                        console.error("Error creating user:", err);
                    } else {
                        console.log("✅ Admin user CREATED!");
                        console.log("   Phone:", PHONE);
                        console.log("   Password:", PASSWORD);
                        console.log("   Role: admin");
                    }
                    db.close();
                }
            );
        } else {
            console.log("✅ User found:", row.name);
            console.log("   Email:", row.email);
            console.log("   Phone:", row.phone);
            console.log("   Role:", row.role);
            console.log("\nUpdating password...\n");

            bcrypt.hash(PASSWORD, 10).then(hash => {
                db.run("UPDATE users SET password_hash = ?, role = 'admin' WHERE phone = ?", [hash, PHONE], function (err) {
                    if (err) {
                        console.error("Error updating password:", err);
                    } else {
                        console.log("✅ Password updated successfully!");
                        console.log("   New Password:", PASSWORD);
                        console.log("   Role: admin");
                    }
                    db.close();
                });
            });
        }
    });
});
