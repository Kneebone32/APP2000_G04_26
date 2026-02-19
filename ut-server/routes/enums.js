// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// Henter enum-verdier for en gitt type
router.get('/:type', async (req, res) => {
  try {
    const { type } = req.params;

    const result = await pool.query(
      `SELECT enumlabel FROM pg_enum 
      JOIN pg_type ON pg_enum.enumtypid = pg_type.oid 
      WHERE pg_type.typname = $1 
      ORDER BY enumsortorder`,
      [type]
    );

    const enums = result.rows.map(row => row.enumlabel);

    res.json(enums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente enum-verdier' });
  }
});

export default router;