import express from 'express';
import hytterRoutes from './hytter.js';
import turruterRoutes from './turruter.js';

const router = express.Router();

router.use('/hytter', hytterRoutes);
router.use('/turruter', turruterRoutes);

export default router;