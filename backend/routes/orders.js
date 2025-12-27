const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin, tryAuthenticateToken } = require('../middleware/auth');
const { sendAdminWhatsApp } = require('../services/whatsapp');

/* ---------------- GET USER ORDERS ---------------- */
router.get('/my', authenticateToken, (req, res) => {
    db.all(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [req.user.id],
        (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(rows.map(row => ({
                ...row,
                items: JSON.parse(row.items || '[]'),
            })));
        }
    );
});

/* ---------------- GET ALL ORDERS (ADMIN) ---------------- */
router.get('/admin', authenticateToken, isAdmin, (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(row => ({
            ...row,
            items: JSON.parse(row.items || '[]'),
        })));
    });
});

/* ---------------- CREATE ORDER ---------------- */
router.post('/', tryAuthenticateToken, (req, res) => {
    const {
        items,
        total,
        customer_name,
        customer_phone,
        customer_email,
        address,
        service_date,
        service_time, // extracted for notification
        city,         // extracted for notification
    } = req.body;

    const name = customer_name || 'Guest';
    const itemsStr = JSON.stringify(items || []);
    const firstItem = items && items.length > 0 ? items[0] : {};

    db.run(
        `INSERT INTO orders 
        (user_id, items, total, status, customer_name, customer_phone, address, service_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            req.user ? req.user.id : null,
            itemsStr,
            total,
            'pending',
            name,
            customer_phone,
            address,
            service_date,
        ],
        async function (err) {
            if (err) return res.status(500).json({ error: err.message });

            const orderId = this.lastID;

            const order = {
                id: orderId,
                name,
                phone: customer_phone,
                serviceType: firstItem.propertyType || 'Cleaning',
                category: firstItem.bhkCategory || 'General',
                date: service_date,
                time: service_time || firstItem.service_time || 'N/A',
                city: city || 'N/A',
                address,
            };

            /* ---------------- ADMIN NOTIFICATION ---------------- */
            db.run(
                'INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)',
                [
                    'order',
                    'New Booking',
                    `Order #${orderId} from ${name}`,
                    JSON.stringify({ orderId }),
                ]
            );

            /* ---------------- WHATSAPP NOTIFICATION ---------------- */
            // Send WhatsApp notification to Admin
            await sendAdminWhatsApp(order);

            res.status(201).json({ success: true, order });
        }
    );
});

/* ---------------- UPDATE ORDER STATUS (ADMIN) ---------------- */
router.patch('/:id/status', authenticateToken, isAdmin, (req, res) => {
    const { status } = req.body;

    if (!['completed', 'cancelled', 'accepted', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.run(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, req.params.id],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });

            res.json({ message: 'Status updated successfully' });
        }
    );
});

module.exports = router;
