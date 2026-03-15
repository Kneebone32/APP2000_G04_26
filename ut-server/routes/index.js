// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import hytterRoutes from './hytter.js';
import turruterRoutes from './turruter.js';
import enumsRoutes from './enums.js';
import turmaalRoutes from './turmaal.js';
import metadataRoutes from './metadata.js';
import fellesturRoutes from './fellestur.js';
import brukerRoutes from './bruker.js';

const router = express.Router();

router.use('/hytter', hytterRoutes);
router.use('/turruter', turruterRoutes);
router.use('/enums', enumsRoutes);
router.use('/turmaal', turmaalRoutes);
router.use('/metadata', metadataRoutes);
router.use('/fellestur', fellesturRoutes);
router.use('/bruker', brukerRoutes);

export default router;