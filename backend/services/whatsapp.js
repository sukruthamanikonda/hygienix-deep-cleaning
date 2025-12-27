const axios = require('axios');

const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const adminNumber = process.env.ADMIN_WHATSAPP_NUMBER || '9535901059';

/**
 * Sends a WhatsApp message using Meta WhatsApp Cloud API (Admin Notification)
 * @param {Object} order - The order object containing full booking details
 */
const sendAdminWhatsApp = async (order) => {
    try {
        if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
            console.warn('WhatsApp Cloud API credentials missing in .env');
            return;
        }

        const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

        const messageBody = `New Hygienix order 🚀
Name: ${order.name || 'N/A'}
Phone: ${order.phone || 'N/A'}
Service: ${order.serviceType || 'N/A'}
Category: ${order.category || 'N/A'}
Date: ${order.date || 'N/A'}
Time: ${order.time || 'N/A'}
City: ${order.city || 'N/A'}
Address: ${order.address || 'N/A'}
Order ID: #${order.id}`;

        const data = {
            messaging_product: "whatsapp",
            to: adminNumber,
            type: "text",
            text: {
                body: messageBody
            }
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('WhatsApp API response:', response.data);
        console.log(`✅ Admin WhatsApp notification sent for Order #${order.id}`);
        return response.data;
    } catch (error) {
        console.error('Error sending admin WhatsApp:', error.response ? JSON.stringify(error.response.data) : error.message);
        // Do not crash the API if WhatsApp fails
    }
};

/**
 * Legacy/General WhatsApp function (adapted for consistency)
 */
const sendWhatsApp = async ({ to, body }) => {
    try {
        if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_TOKEN) {
            console.warn('WhatsApp Cloud API credentials missing in .env (sendWhatsApp)');
            return;
        }

        const url = `https://graph.facebook.com/v22.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

        // Remove 'whatsapp:' prefix if present and any other non-digit characters
        const cleanTo = to.toString().replace('whatsapp:', '').replace(/\D/g, '');

        const data = {
            messaging_product: "whatsapp",
            to: cleanTo,
            type: "text",
            text: { body }
        };

        const response = await axios.post(url, data, {
            headers: {
                'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (error) {
        console.error(`❌ Failed to send WhatsApp to ${to}:`, error.response ? JSON.stringify(error.response.data) : error.message);
    }
};

module.exports = { sendAdminWhatsApp, sendWhatsApp, adminNumber };
