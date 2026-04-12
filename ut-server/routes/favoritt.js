// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// --- Hytter ---

// Henter alle favoritthytter til en bruker
router.get('/hytter', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query('SELECT favoritt_hytte_hent_for_bruker($1) AS favoritter', [brukerId]);
    res.json(result.rows[0].favoritter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente favoritthytter' });
  }
});

// Legger til en hytte i favoritter
router.post('/hytter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    await pool.query('SELECT favoritt_hytte_opprett($1, $2)', [brukerId, hytteId]);
    res.status(201).json({ message: 'Favoritthytte lagt til' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til favoritthytte' });
  }
});

// Fjerner en hytte fra favoritter
router.delete('/hytter/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const hytteId = req.params.id;
    await pool.query('SELECT favoritt_hytte_slett($1, $2)', [brukerId, hytteId]);
    res.json({ message: 'Favoritthytte fjernet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke fjerne favoritthytte' });
  }
});

// --- Turer ---

// Henter alle favoritturer til en bruker
router.get('/turer', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query('SELECT favoritt_tur_hent_for_bruker($1) AS favoritter', [brukerId]);
    res.json(result.rows[0].favoritter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente favoritturer' });
  }
});

// Legger til en tur i favoritter
router.post('/turer/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turId = req.params.id;
    await pool.query('SELECT favoritt_tur_opprett($1, $2)', [brukerId, turId]);
    res.status(201).json({ message: 'Favorittur lagt til' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til favorittur' });
  }
});

// Fjerner en tur fra favoritter
router.delete('/turer/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turId = req.params.id;
    await pool.query('SELECT favoritt_tur_slett($1, $2)', [brukerId, turId]);
    res.json({ message: 'Favorittur fjernet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke fjerne favorittur' });
  }
});

// --- Turmål ---

// Henter alle favorittmål til en bruker
router.get('/maal', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const result = await pool.query('SELECT favoritt_maal_hent_for_bruker($1) AS favoritter', [brukerId]);
    res.json(result.rows[0].favoritter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente favorittmål' });
  }
});

// Legger til et turmål i favoritter
router.post('/maal/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turmaalId = req.params.id;
    await pool.query('SELECT favoritt_maal_opprett($1, $2)', [brukerId, turmaalId]);
    res.status(201).json({ message: 'Favorittmål lagt til' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke legge til favorittmål' });
  }
});

// Fjerner et turmål fra favoritter
router.delete('/maal/:id', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const turmaalId = req.params.id;
    await pool.query('SELECT favoritt_maal_slett($1, $2)', [brukerId, turmaalId]);
    res.json({ message: 'Favorittmål fjernet' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke fjerne favorittmål' });
  }
});

export default router;
