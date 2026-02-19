// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import hytterRoutes from './hytter.js';
import turruterRoutes from './turruter.js';
import enumsRoutes from './enums.js';

const router = express.Router();

router.use('/hytter', hytterRoutes);
router.use('/turruter', turruterRoutes);
router.use('/enums', enumsRoutes);

export default router;