import { Router } from 'express';
import folders from './folders';
import cars from './cars';

const router = Router();

// API routes
router.use('/folders', folders);
router.use('/cars', cars);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
