import { Request, Response } from 'express';
import { pool } from '../db';
import { v4 as uuidv4 } from 'uuid';
import { handleError } from '../utils/handleError';

// אחזור כל היעדים ברמה העליונה (parent_id IS NULL)
export async function getTopLevelGoals(_req: Request, res: Response) {
    try {
        const result = await pool.query('SELECT * FROM goals WHERE parent_id IS NULL ORDER BY created_at');
        res.json(result.rows);
    } catch (err) {
        handleError(res, err);
    }
}

// אחזור יעד ספציפי וילדיו הישירים
export async function getGoalWithChildren(req: Request, res: Response) {
    try {
        const goalResult = await pool.query('SELECT * FROM goals WHERE id = $1', [req.params.id]);
        if (goalResult.rows.length === 0) return res.status(404).json({ message: 'Goal not found' });

        const childrenResult = await pool.query('SELECT * FROM goals WHERE parent_id = $1 ORDER BY created_at', [req.params.id]);
        res.json({
            goal: goalResult.rows[0],
            children: childrenResult.rows
        });
    } catch (err) {
        handleError(res, err);
    }
}

// יצירת יעד חדש
export async function createGoal(req: Request, res: Response) {
    try {
        const {
            title, description, parent_id, type, weight, target, current,
            goal_type, status, due_date, start_date
        } = req.body;
        const id = uuidv4();
        const result = await pool.query(
            `INSERT INTO goals (id, title, description, parent_id, type, weight, target, current, goal_type, status, due_date, start_date)
             VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) RETURNING *`,
            [id, title, description, parent_id, type, weight, target, current, goal_type, status, due_date, start_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        handleError(res, err, 400);
    }
}

// עדכון יעד
export async function updateGoal(req: Request, res: Response) {
    try {
        const fields = [
            'title', 'description', 'parent_id', 'type', 'weight', 'target', 'current',
            'goal_type', 'status', 'due_date', 'start_date'
        ];
        const updates = [];
        const values = [];
        let idx = 1;
        for (const field of fields) {
            if (req.body[field] !== undefined) {
                updates.push(`${field} = $${idx++}`);
                values.push(req.body[field]);
            }
        }
        if (updates.length === 0) return res.status(400).json({ message: 'No fields to update' });
        values.push(req.params.id);
        const result = await pool.query(
            `UPDATE goals SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = $${idx} RETURNING *`,
            values
        );
        if (result.rows.length === 0) return res.status(404).json({ message: 'Goal not found' });
        res.json(result.rows[0]);
    } catch (err) {
        handleError(res, err, 400);
    }
}

// מחיקת יעד
export async function deleteGoal(req: Request, res: Response) {
    try {
        const result = await pool.query('DELETE FROM goals WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rows.length === 0) return res.status(404).json({ message: 'Goal not found' });
        res.status(204).send();
    } catch (err) {
        handleError(res, err);
    }
}