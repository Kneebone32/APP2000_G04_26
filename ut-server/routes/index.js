// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import hytterRoutes from './hytter.js';
import turRoutes from './tur.js';
import enumsRoutes from './enums.js';
import turmaalRoutes from './turmaal.js';
import metadataRoutes from './metadata.js';
import fellesturRoutes from './fellestur.js';
import brukerRoutes from './bruker.js';
import stiRoutes from "./sti.js";
import meldingerRoutes from './meldinger.js';
import varselRoutes from './varsel.js';
import anmeldelserRoutes from './anmeldelser.js';
import pamelding from './pamelding.js';

const router = express.Router();

router.use('/hytter', hytterRoutes);
router.use('/tur', turRoutes);
router.use('/enums', enumsRoutes);
router.use('/turmaal', turmaalRoutes);
router.use('/metadata', metadataRoutes);
router.use('/fellestur', fellesturRoutes);
router.use('/bruker', brukerRoutes);
router.use('/sti', stiRoutes);
router.use('/meldinger', meldingerRoutes);
router.use('/varsler', varselRoutes);
router.use('/anmeldelser', anmeldelserRoutes);
router.use('/pamelding', pamelding);

export default router;