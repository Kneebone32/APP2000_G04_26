import express from 'express';
import hytterRoutes from './hytter.js';

const router = express.Router();

router.use('/hytter', hytterRoutes);

export default router;