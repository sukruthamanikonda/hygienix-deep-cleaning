const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const crypto = require('crypto');

const router = express.Router();
const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// ============================================
// CUSTOMER AUTH ENDPOINTS
// ============================================

// Customer Signup
router.post('/customer/signup', async (req, res) => {
    const { name, email, password, confirmPassword, phone } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email and password required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ error: 'Passwords do not match' });
    }

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hash, phone || null, 'customer'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) {
                        return res.status(409).json({ error: 'Email already registered' });
                    }
                    return res.status(500).json({ error: 'Registration failed' });
                }
                const user = { id: this.lastID, name, email, phone, role: 'customer' };
                const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
                res.status(201).json({ user, token });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Customer Login
router.post('/customer/login', (req, res) => {
    const { identifier, password } = req.body; // identifier can be email or phone

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Phone and password required' });
    }

    db.get('SELECT * FROM users WHERE (email = ? OR phone = ?) AND role = ?',
        [identifier, identifier, 'customer'],
        async (err, row) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            if (!row) return res.status(401).json({ error: 'Invalid credentials' });

            const ok = await bcrypt.compare(password, row.password_hash);
            if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

            const user = { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone };
            const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
            res.json({ user, token });
        }
    );
});

// Customer Forgot Password (DEACTIVATED)
router.post(['/customer/forgot-password', '/forgot'], (req, res) => {
    res.json({ message: 'Email service is disabled. Please contact admin on WhatsApp to reset your password.' });
});

// ============================================
// ADMIN AUTH ENDPOINTS
// ============================================

// Admin Login
router.post('/admin/login', (req, res) => {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
        return res.status(400).json({ error: 'Email/Phone and password required' });
    }

    db.get('SELECT * FROM users WHERE (email = ? OR phone = ?) AND role = ?',
        [identifier, identifier, 'admin'],
        async (err, row) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            if (!row) return res.status(401).json({ error: 'Invalid admin credentials' });

            const ok = await bcrypt.compare(password, row.password_hash);
            if (!ok) return res.status(401).json({ error: 'Invalid admin credentials' });

            const user = { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone };
            const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
            res.json({ user, token });
        }
    );
});

// ============================================
// LEGACY & UTILITY
// ============================================

router.post(['/signup', '/register'], async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

    try {
        const hash = await bcrypt.hash(password, 10);
        db.run(
            'INSERT INTO users (name, email, password_hash, phone, role) VALUES (?, ?, ?, ?, ?)',
            [name, email, hash, phone || null, 'customer'],
            function (err) {
                if (err) {
                    if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'Email already registered' });
                    return res.status(500).json({ error: 'Registration failed' });
                }
                const user = { id: this.lastID, name, email, role: 'customer' };
                const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
                res.status(201).json({ user, token });
            }
        );
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/send-otp', (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ error: 'Phone number required' });
    console.log(`[MOCK] OTP sent to ${phone}: 123456`);
    res.json({ message: 'OTP sent successfully' });
});

router.post('/login-otp', (req, res) => {
    const { phone, otp } = req.body;
    if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP required' });
    if (otp !== '123456') return res.status(401).json({ error: 'Invalid OTP' });

    db.get('SELECT * FROM users WHERE phone = ?', [phone], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) {
            const tempEmail = `${phone}@hygienix.in`;
            db.run('INSERT INTO users (name, email, phone, role) VALUES (?, ?, ?, ?)',
                ['Guest Customer', tempEmail, phone, 'customer'],
                function (err) {
                    if (err) return res.status(500).json({ error: 'Login failed' });
                    const user = { id: this.lastID, name: 'Guest Customer', role: 'customer', phone };
                    const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
                    return res.json({ user, token });
                }
            );
        } else {
            const user = { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone };
            const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
            res.json({ user, token });
        }
    });
});

router.post(['/login', '/customer/login'], (req, res) => {
    const { identifier, password, email } = req.body;
    const loginId = identifier || email;

    if (!loginId || !password) return res.status(400).json({ error: 'Email/Phone and password required' });

    db.get('SELECT * FROM users WHERE email = ? OR phone = ?', [loginId, loginId], async (err, row) => {
        if (err) return res.status(500).json({ error: 'Server error' });
        if (!row) return res.status(401).json({ error: 'Invalid credentials' });

        const ok = await bcrypt.compare(password, row.password_hash);
        if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

        const user = { id: row.id, name: row.name, email: row.email, role: row.role, phone: row.phone };
        const token = jwt.sign(user, SECRET, { expiresIn: '7d' });
        res.json({ user, token });
    });
});

router.get('/set-password/:phone/:password', async (req, res) => {
    const { phone, password } = req.params;
    try {
        const hash = await bcrypt.hash(password, 10);
        db.run("UPDATE users SET password_hash = ? WHERE phone = ?", [hash, phone], function (err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
            res.json({ message: `Password updated for ${phone}.` });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/promote/:phone', (req, res) => {
    const { phone } = req.params;
    db.run("UPDATE users SET role = 'admin' WHERE phone = ?", [phone], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'User not found' });
        res.json({ message: `User with phone ${phone} promoted to admin.` });
    });
});

module.exports = router;
