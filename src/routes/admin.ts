import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// דוגמה בסיסית - יוצר טוקן ייחודי ומחזיר קישור (לא שומר ב-DB, אפשר להרחיב)
router.post('/share-update-link/:goal_id', async (req: Request, res: Response) => {
    try {
        const { goal_id } = req.params;
        const token = uuidv4();
        // כאן אפשר לשמור את הטוקן והקישור ב-DB אם צריך
        const link = `${req.protocol}://${req.get('host')}/update-progress/${goal_id}?token=${token}`;
        res.json({ link, token });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

export default router;