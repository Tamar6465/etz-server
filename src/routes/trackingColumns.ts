import { Router, Request, Response } from 'express';
import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// אחזור כל עמודות נתוני המעקב
router.get('/', async (_req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT * FROM tracking_columns ORDER BY id');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// יצירת עמודת נתוני מעקב חדשה
router.post('/', async (req: Request, res: Response) => {
    try {
        const { name, type, description } = req.body;
        if (!name || !type) return res.status(400).json({ message: 'name and type are required' });
        const id = uuidv4();
        const result = await pool.query(
            `INSERT INTO tracking_columns (id, name, type, description)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [id, name, type, description]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// עדכון עמודת נתוני מעקב קיימת
router.put('/:id', async (req: Request, res: Response) => {
    try {
        const { name, type, description } = req.body;
        const result = await pool.query(
            `UPDATE tracking_columns SET name = $1, type = $2, description = $3 WHERE id = $4 RETURNING *`,
            [name, type, description, req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tracking column not found' });
        res.json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
});

// מחיקת עמודת נתוני מעקב
router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('DELETE FROM tracking_columns WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Tracking column not found' });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;