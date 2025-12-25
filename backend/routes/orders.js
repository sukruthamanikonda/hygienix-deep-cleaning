const express = require('express');
const router = express.Router();
const db = require('../db');
const { authenticateToken, isAdmin, tryAuthenticateToken } = require('../middleware/auth');
const { sendWhatsApp, adminNumber } = require('../services/whatsapp');
const nodemailer = require('nodemailer');
const axios = require('axios');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || process.env.GMAIL_USER,
        pass: process.env.EMAIL_PASS || process.env.GMAIL_PASS,
    },
});

router.get('/my', authenticateToken, (req, res) => {
    db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(row => ({ ...row, items: JSON.parse(row.items || '[]') })));
    });
});

router.get('/admin', authenticateToken, isAdmin, (req, res) => {
    db.all('SELECT * FROM orders ORDER BY created_at DESC', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows.map(row => ({ ...row, items: JSON.parse(row.items || '[]') })));
    });
});

router.post('/', tryAuthenticateToken, (req, res) => {
    const { items, total, customer_name, customer_phone, customer_email, address, service_date } = req.body;
    const name = customer_name || 'Guest';
    const itemsStr = JSON.stringify(items || []);
    const firstItem = items && items.length > 0 ? items[0] : {};

    db.run(
        'INSERT INTO orders (user_id, items, total, status, customer_name, customer_phone, address, service_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [req.user ? req.user.id : null, itemsStr, total, 'pending', name, customer_phone, address, service_date],
        async function (err) {
            if (err) return res.status(500).json({ error: err.message });
            const orderId = this.lastID;

            const order = {
                id: orderId,
                name: name,
                phone: customer_phone,
                serviceType: firstItem.propertyType || 'Cleaning',
                category: firstItem.bhkCategory || 'General',
                date: service_date,
                address: address
            };

            db.run('INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)', ['order', 'New Booking', `Order #${orderId} from ${name}`, JSON.stringify({ orderId })]);

            const msg = `Booking #${orderId} confirmed for ${name}! Total: ₹${total}.`;
            // if (customer_phone) sendWhatsApp({ to: customer_phone, body: `Hi ${name}, ${msg}` });
            // if (adminNumber) sendWhatsApp({ to: adminNumber, body: `New Order #${orderId} from ${name}.` });

            // Trigger n8n Webhook
            try {
                await axios.post('http://localhost:5678/webhook-test/hygienix-new-order', {
                    name: order.name,
                    phone: order.phone,
                    service: order.serviceType,
                    category: order.category,
                    date: order.date,
                    address: order.address,
                    adminPhone: '+919535901059', // Using admin number from whatsapp.js or user's placeholder
                    customerPhone: order.phone
                });
            } catch (webhookErr) {
                console.error('Failed to trigger n8n webhook:', webhookErr.message);
                // We don't break the response if webhook fails
            }

            if (customer_email || process.env.ADMIN_EMAIL) {
                const adminEmail = process.env.ADMIN_EMAIL || 'admin@hygienix.in';
                if (customer_email) {
                    transporter.sendMail({
                        from: process.env.GMAIL_USER || process.env.EMAIL_USER,
                        to: customer_email,
                        subject: `Booking #${orderId} Confirmed`,
                        text: `Confirmed! Total: ₹${total}`
                    }).catch(e => console.error(e));
                }
                transporter.sendMail({
                    from: process.env.GMAIL_USER || process.env.EMAIL_USER,
                    to: adminEmail,
                    subject: `New Booking #${orderId}`,
                    text: `New order from ${name}. Total: ₹${total}`
                }).catch(e => console.error(e));
            }

            res.status(201).json({ success: true, order });
        }
    );
});

router.patch('/:id/status', authenticateToken, isAdmin, (req, res) => {
    const { status } = req.body;
    if (!['completed', 'cancelled', 'accepted', 'rejected', 'pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Order not found' });

        // Notify customer if completed
        if (status === 'completed') {
            db.get('SELECT customer_phone, customer_name FROM orders WHERE id = ?', [req.params.id], (err, row) => {
                if (row && row.customer_phone) {
                    // sendWhatsApp({ 
                    //     to: row.customer_phone, 
                    //     body: `Hi ${row.customer_name}, your order #${req.params.id} is marked as COMPLETED. Thank you for choosing Hygienix!` 
                    // });
                }
            });
        }

        res.json({ message: 'Status updated' });
    });
});

module.exports = router;

