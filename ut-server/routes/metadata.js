// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Henter alle kategorier av informasjon
router.get('/kategorier', async (req, res) => {
    try {
      const result = await pool.query('SELECT informasjon_hent_struktur()');
      res.json(result.rows[0].informasjon_hent_struktur);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Kunne ikke hente kategorier' });
    }
});

export default router;