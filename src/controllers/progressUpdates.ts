import { Request, Response } from 'express';
import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';

// הוספת עדכון התקדמות חדש עבור יעד
export async function createProgressUpdate(req: Request, res: Response) {
    try {
        const { content } = req.body;
        if (!content) return res.status(400).json({ message: 'Content is required' });
        const updateId = uuidv4();
        const result = await pool.query(
            `INSERT INTO progress_updates (id, goal_id, content, date)
             VALUES ($1, $2, $3, CURRENT_TIMESTAMP) RETURNING *`,
            [updateId, req.params.id, content]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(400).json({ error: (err as Error).message });
    }
}

// אחזור כל עדכוני ההתקדמות עבור יעד ספציפי
export async function getProgressUpdates(req: Request, res: Response) {
    try {
        const result = await pool.query(
            'SELECT * FROM progress_updates WHERE goal_id = $1 ORDER BY date DESC',
            [req.params.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
}