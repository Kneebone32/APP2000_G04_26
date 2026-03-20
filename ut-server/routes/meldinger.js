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
      `SELECT DISTINCT ON (andre.bruker_id)
         andre.bruker_id,
         andre.bruker_navn || ' ' || andre.bruker_etternavn AS navn,
         m.innhold AS siste_melding,
         (SELECT COUNT(*) FROM melding ul
          WHERE ul.avsender_id = andre.bruker_id
            AND ul.mottaker_id = $1
            AND ul.lest = false
         )::int AS uleste
       FROM melding m
       JOIN bruker andre ON andre.bruker_id = CASE
         WHEN m.avsender_id = $1 THEN m.mottaker_id
         ELSE m.avsender_id
       END
       WHERE (m.avsender_id = $1 OR m.mottaker_id = $1)
         AND m.fellestur_id IS NULL
       ORDER BY andre.bruker_id, m.sendt_tid DESC`,
      [brukerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente samtaler' });
  }
});

// Henter privatmeldinger mellom innlogget bruker og en annen bruker
router.get('/pm/:mottakerId', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const mottakerId = req.params.mottakerId;
    const result = await pool.query(
      `SELECT m.melding_id AS id, m.avsender_id,
         b.bruker_navn || ' ' || b.bruker_etternavn AS avsender_navn,
         m.innhold, m.sendt_tid
       FROM melding m
       JOIN bruker b ON b.bruker_id = m.avsender_id
       WHERE m.fellestur_id IS NULL
         AND ((m.avsender_id = $1 AND m.mottaker_id = $2)
           OR (m.avsender_id = $2 AND m.mottaker_id = $1))
       ORDER BY m.sendt_tid ASC`,
      [brukerId, mottakerId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente meldinger' });
  }
});

// Sender en privatmelding
router.post('/pm', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { mottaker_id, innhold } = req.body;
    const result = await pool.query(
      `INSERT INTO melding (avsender_id, mottaker_id, innhold)
       VALUES ($1, $2, $3)
       RETURNING melding_id AS id`,
      [brukerId, mottaker_id, innhold]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke sende melding' });
  }
});

// Henter gruppemeldinger for en fellestur
router.get('/gruppe/:fellesturId', auth, async (req, res) => {
  try {
    const fellesturId = req.params.fellesturId;
    const result = await pool.query(
      `SELECT m.melding_id AS id, m.avsender_id,
         b.bruker_navn || ' ' || b.bruker_etternavn AS avsender_navn,
         m.innhold, m.sendt_tid
       FROM melding m
       JOIN bruker b ON b.bruker_id = m.avsender_id
       WHERE m.fellestur_id = $1
       ORDER BY m.sendt_tid ASC`,
      [fellesturId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente gruppemeldinger' });
  }
});

// Sender en gruppemelding
router.post('/gruppe', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { fellestur_id, innhold } = req.body;
    const result = await pool.query(
      `INSERT INTO melding (avsender_id, fellestur_id, innhold)
       VALUES ($1, $2, $3)
       RETURNING melding_id AS id`,
      [brukerId, fellestur_id, innhold]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke sende gruppemelding' });
  }
});

// Merker en melding som lest
router.patch('/:meldingId/lest', auth, async (req, res) => {
  try {
    await pool.query(
      'UPDATE melding SET lest = true WHERE melding_id = $1',
      [req.params.meldingId]
    );
    res.json({ message: 'Melding merket som lest' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke merke melding som lest' });
  }
});

export default router;
