import { Response } from 'express';

export function handleError(res: Response, err: unknown, status = 500) {
    res.status(status).json({ error: (err as Error).message });
}