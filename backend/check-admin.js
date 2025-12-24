const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'hygienix.db');
const db = new sqlite3.Database(DB_PATH);

console.log('Checking admin user in database...\n');

db.get('SELECT id, name, email, role FROM users WHERE email = ?', ['admin@hygienix.in'], (err, row) => {
    if (err) {
        console.error('Error:', err.message);
        db.close();
        return;
    }

    if (row) {
        console.log('✅ Admin user found:');
        console.log('   ID:', row.id);
        console.log('   Name:', row.name);
        console.log('   Email:', row.email);
        console.log('   Role:', row.role);
        console.log('\n' + (row.role === 'admin' ? '✅ Role is correctly set to "admin"' : '❌ Role is NOT "admin" - needs to be updated!'));
    } else {
        console.log('❌ Admin user NOT found in database');
        console.log('   You need to run the create-admin endpoint');
    }

    db.close();
});
