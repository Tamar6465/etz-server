import { Express } from 'express';
import goalsRouter from './goals';
import trackingColumnsRouter from './trackingColumns';
import adminRouter from './admin';

export function setRoutes(app: Express) {
    app.use('/api/goals', goalsRouter);
    app.use('/api/tracking-columns', trackingColumnsRouter);
    app.use('/api/admin', adminRouter);
}