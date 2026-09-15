const express = require('express');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');
require('dotenv').config();

const router = express.Router();

// POST /api/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Логин и пароль обязательны' });
        }

        // SHA256 хэш
        const passwordHash = crypto.createHash('sha256').update(password).digest('hex');

        // Колонки в camelCase как в миграции
        const result = await db.query(
            'SELECT * FROM admins WHERE username = $1 AND "passwordHash" = $2 AND "isActive" = true',
            [username, passwordHash]
        );

        const admin = result.rows[0];

        if (!admin) {
            return res.status(401).json({ error: 'Неверный логин или пароль' });
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        await db.query('UPDATE admins SET "lastLogin" = now() WHERE id = $1', [admin.id]);

        res.json({
            success: true,
            token,
            admin: { id: admin.id, username: admin.username, role: admin.role }
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Ошибка сервера: ' + err.message });
    }
});

// GET /api/check-auth
router.get('/check-auth', (req, res) => {
    const auth = require('../middleware/auth');
    auth(req, res, () => {
        res.json({ valid: true, admin: req.admin });
    });
});

module.exports = router;