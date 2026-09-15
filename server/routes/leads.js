const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

// POST /api/save-lead (публичный)
router.post('/save-lead', async (req, res) => {
    try {
        const d = req.body;

        if (!d.type || !d.phone) {
            return res.status(400).json({ error: 'Тип и телефон обязательны' });
        }

        const result = await db.query(
            `INSERT INTO leads 
             (type, name, company, phone, email, product, "productType", quantity, area, message, comment, status)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
             RETURNING id`,
            [
                d.type,
                d.name || '',
                d.company || '',
                d.phone,
                d.email || '',
                d.product || '',
                d.productType || '',
                d.quantity || '',
                d.area || '',
                d.message || '',
                d.comment || '',
                d.status || 'new'
            ]
        );

        console.log('✅ Заявка сохранена:', d.type, d.phone);
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Save lead error:', err);
        res.status(500).json({ error: 'Ошибка при сохранении: ' + err.message });
    }
});

// GET /api/leads (для админа)
router.get('/leads', auth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM leads ORDER BY "createDate" DESC');
        res.json(result.rows);
    } catch (err) {
        console.error('Get leads error:', err);
        res.status(500).json({ error: 'Ошибка при получении: ' + err.message });
    }
});

// GET /api/leads/stats
router.get('/leads/stats', auth, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) as total,
                COUNT(*) FILTER (WHERE "createDate"::date = CURRENT_DATE) as today,
                COUNT(*) FILTER (WHERE "createDate" >= NOW() - INTERVAL '7 days') as week,
                COUNT(*) FILTER (WHERE "createDate" >= NOW() - INTERVAL '30 days') as month,
                COUNT(*) FILTER (WHERE status = 'new') as new
            FROM leads
        `);
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Stats error:', err);
        res.status(500).json({ error: 'Ошибка: ' + err.message });
    }
});

// PUT /api/leads/:id — обновить статус
router.put('/leads/:id', auth, async (req, res) => {
    try {
        await db.query(
            'UPDATE leads SET status = $1, "processedAt" = NOW(), "updateDate" = NOW() WHERE id = $2',
            [req.body.status, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Update error:', err);
        res.status(500).json({ error: 'Ошибка: ' + err.message });
    }
});

// DELETE /api/leads/:id — удалить одну
router.delete('/leads/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM leads WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        console.error('Delete error:', err);
        res.status(500).json({ error: 'Ошибка: ' + err.message });
    }
});

module.exports = router;