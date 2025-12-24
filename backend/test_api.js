(async () => {
    const base = 'http://localhost:5001/api';
    try {
        console.log('Testing Authentication with new path...');
        const loginRes = await fetch(base + '/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@hygienix.in', password: 'Admin@123' })
        });
        const loginJson = await loginRes.json();
        if (!loginRes.ok) throw new Error(loginJson.error || 'Login failed');
        console.log('✅ Login successful. Token acquired.');

        const ordersRes = await fetch(base + '/orders/admin', {
            headers: { Authorization: `Bearer ${loginJson.token}` }
        });
        const ordersJson = await ordersRes.json();
        console.log('✅ Admin Orders fetch successful. Found:', ordersJson.length);
    } catch (err) {
        console.error('❌ Test failed:', err.message);
    }
})();
