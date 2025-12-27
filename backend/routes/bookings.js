const express = require('express');
const router = express.Router();
const db = require('../db');
const { sendAdminWhatsApp, sendWhatsApp } = require('../services/whatsapp');

router.post('/', (req, res) => {
    const { items, total, name, phone, address, date, time, city } = req.body;
    const itemsStr = JSON.stringify(items || []);
    const finalName = name || req.body.customerName || 'Guest';
    const finalPhone = phone || req.body.customerPhone;
    const finalDate = date || req.body.service_date;
    const finalTime = time || req.body.service_time || 'N/A';
    const finalCity = city || 'N/A';
    const firstItem = items && items.length > 0 ? items[0] : {};

    db.run(
        'INSERT INTO orders (customer_name, customer_phone, address, service_date, items, total, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [finalName, finalPhone, address, finalDate, itemsStr, total || 0, 'pending'],
        async function (err) {
            if (err) return res.status(500).json({ error: err.message });
            const orderId = this.lastID;

            db.run('INSERT INTO notifications (type, title, message, meta) VALUES (?, ?, ?, ?)', ['order', 'New Booking', `Legacy Booking #${orderId} from ${finalName}`, JSON.stringify({ orderId })]);

            const orderForWhatsApp = {
                id: orderId,
                name: finalName,
                phone: finalPhone,
                serviceType: firstItem.propertyType || 'Cleaning',
                category: firstItem.bhkCategory || 'General',
                date: finalDate,
                time: finalTime,
                city: finalCity,
                address: address
            };

            // Customer confirmation (legacy)
            sendWhatsApp({ to: finalPhone, body: `Hi ${finalName}, your booking is received!` });

            // Admin notification (new detailed)
            await sendAdminWhatsApp(orderForWhatsApp);

            res.status(201).json({ id: orderId, message: 'Booking created', success: true });
        }
    );
});

module.exports = router;
