// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Henter alle samtaler for innlogget bruker
router.get('/samtaler', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query(
      'SELECT * FROM samtale_hent_for_bruker($1)',
      [brukerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente samtaler' });
  }
});

// Henter meldinger i en samtale (brukeren må være medlem)
router.get('/samtale/:samtaleId/meldinger', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { samtaleId } = req.params;
    const result = await pool.query(
      'SELECT * FROM samtale_meldinger_hent($1, $2)',
      [samtaleId, brukerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente meldinger' });
  }
});

// Finner eller oppretter en direktesamtale mellom innlogget bruker og en annen
router.post('/samtale/direkte', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { annen_bruker_id } = req.body;
    const result = await pool.query(
      'SELECT samtale_direkte_hent_eller_opprett($1, $2) AS samtale_id',
      [brukerId, annen_bruker_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette direktesamtale' });
  }
});

// Oppretter en ny gruppesamtale
router.post('/samtale', auth, async (req, res) => {
  try {
    const { bruker_ids, samtale_navn } = req.body;
    const result = await pool.query(
      'SELECT samtale_opprett($1, $2) AS samtale_id',
      [bruker_ids, samtale_navn ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette samtale' });
  }
});

// Sender en melding i en samtale
router.post('/melding', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { samtale_id, melding_tekst, bilde_url } = req.body;
    const result = await pool.query(
      `INSERT INTO melding (fra_bruker, samtale_id, melding_tekst, bilde_url)
       VALUES ($1, $2, $3, $4)
       RETURNING melding_id`,
      [brukerId, samtale_id, melding_tekst, bilde_url ?? null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke sende melding' });
  }
});


//TODO: forlat en gruppesamtale
//TODO: merk en melding som lest

export default router;
