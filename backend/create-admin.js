require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'hygienix.db');
const db = new sqlite3.Database(DB_PATH);

const adminEmail = 'admin@hygienix.in';
const adminPassword = 'Admin@123';

async function seedAdmin() {
    console.log('Seeding admin user...');

    try {
        const hash = await bcrypt.hash(adminPassword, 10);

        db.get('SELECT id FROM users WHERE email = ?', [adminEmail], (err, row) => {
            if (err) {
                console.error('Error checking for existing admin:', err.message);
                process.exit(1);
            }

            if (row) {
                console.log('Admin user already exists. Updating password...');
                db.run('UPDATE users SET password_hash = ?, role = ? WHERE email = ?', [hash, 'admin', adminEmail], (updateErr) => {
                    if (updateErr) console.error('Update failed:', updateErr.message);
                    else console.log('✅ Admin credentials updated successfully.');
                    db.close();
                });
            } else {
                console.log('Creating new admin user...');
                db.run(
                    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
                    ['Administrator', adminEmail, hash, 'admin'],
                    (insertErr) => {
                        if (insertErr) console.error('Insert failed:', insertErr.message);
                        else console.log('✅ Admin user created successfully.');
                        db.close();
                    }
                );
            }
        });
    } catch (err) {
        console.error('Hashing failed:', err.message);
        process.exit(1);
    }
}

seedAdmin();
