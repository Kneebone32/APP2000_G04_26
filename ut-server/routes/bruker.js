// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

const JWT_SECRET = process.env.JWT_SECRET || 'hemmelig_nøkkel_endre_meg';
const SALT_ROUNDS = 10;

// Registrer ny bruker
router.post('/registrer', async (req, res) => {
  try {
    const { bruker_navn, bruker_etternavn, bruker_epost, bruker_passord } = req.body;
    const normalisertEpost = bruker_epost?.trim().toLowerCase();

    if (!bruker_navn || !bruker_etternavn || !normalisertEpost || !bruker_passord) {
      return res.status(400).json({ error: 'Alle felt må fylles ut' });
    }

    // Sjekk om e-post allerede er registrert
    const eksisterende = await pool.query(
      'SELECT bruker_id FROM bruker WHERE LOWER(bruker_epost) = $1',
      [normalisertEpost]
    );

    if (eksisterende.rows.length > 0) {
      return res.status(409).json({ error: 'E-postadressen er allerede registrert' });
    }

    // Hash passord
    const hashedPassord = await bcrypt.hash(bruker_passord, SALT_ROUNDS);

    const result = await pool.query(
      `INSERT INTO bruker (bruker_navn, bruker_etternavn, bruker_epost, bruker_passord)
       VALUES ($1, $2, $3, $4)
       RETURNING bruker_id, bruker_navn, bruker_etternavn, bruker_epost, bruker_joined`,
      [bruker_navn, bruker_etternavn, normalisertEpost, hashedPassord]
    );

    const bruker = result.rows[0];

    const token = jwt.sign(
      { bruker_id: bruker.bruker_id, bruker_epost: bruker.bruker_epost },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      bruker: {
        bruker_id: bruker.bruker_id,
        bruker_navn: bruker.bruker_navn,
        bruker_etternavn: bruker.bruker_etternavn,
        bruker_epost: bruker.bruker_epost,
        bruker_joined: bruker.bruker_joined
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke registrere bruker' });
  }
});

// Logg inn
router.post('/logginn', async (req, res) => {
  try {
    const { bruker_epost, bruker_passord } = req.body;
    const normalisertEpost = bruker_epost?.trim().toLowerCase();

    if (!normalisertEpost || !bruker_passord) {
      return res.status(400).json({ error: 'E-post og passord er påkrevd' });
    }

    const result = await pool.query(
      'SELECT * FROM bruker WHERE LOWER(bruker_epost) = $1',
      [normalisertEpost]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Ugyldig e-post eller passord' });
    }

    const bruker = result.rows[0];

    const passordMatch = await bcrypt.compare(bruker_passord, bruker.bruker_passord);
    if (!passordMatch) {
      return res.status(401).json({ error: 'Ugyldig e-post eller passord' });
    }

    const token = jwt.sign(
      { bruker_id: bruker.bruker_id, bruker_epost: bruker.bruker_epost },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      bruker: {
        bruker_id: bruker.bruker_id,
        bruker_navn: bruker.bruker_navn,
        bruker_etternavn: bruker.bruker_etternavn,
        bruker_epost: bruker.bruker_epost,
        bruker_joined: bruker.bruker_joined
      },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke logge inn' });
  }
});

// Hent innlogget brukers profil
router.get('/meg', auth, async (req, res) => {
  try {
    res.json({ bruker: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente bruker' });
  }
});

// Oppdater bruker_navn og bruker_etternavn for innlogget bruker
router.put('/oppdater', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { bruker_navn, bruker_etternavn } = req.body;

    if (!bruker_navn || !bruker_etternavn) {
      return res.status(400).json({ error: 'Navn og etternavn er påkrevd' });
    }

    await pool.query(
      'UPDATE bruker SET bruker_navn = $1, bruker_etternavn = $2 WHERE bruker_id = $3',
      [bruker_navn, bruker_etternavn, brukerId]
    );

    res.json({ message: 'Bruker oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere bruker' });
  }
});

// Bytt passord for innlogget bruker
router.put('/bytt-passord', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { gammelt_passord, nytt_passord } = req.body;

    if (!gammelt_passord || !nytt_passord) {
      return res.status(400).json({ error: 'Gammelt og nytt passord er påkrevd' });
    }

    const result = await pool.query('SELECT bruker_passord FROM bruker WHERE bruker_id = $1', [brukerId]);
    const passordMatch = await bcrypt.compare(gammelt_passord, result.rows[0].bruker_passord);

    if (!passordMatch) {
      return res.status(401).json({ error: 'Gammelt passord er feil' });
    }

    const hashedPassord = await bcrypt.hash(nytt_passord, SALT_ROUNDS);
    await pool.query('UPDATE bruker SET bruker_passord = $1 WHERE bruker_id = $2', [hashedPassord, brukerId]);

    res.json({ message: 'Passord oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke bytte passord' });
  }
});

// Bytt rolle for innlogget bruker
router.put('/bytt-rolle', auth, async (req, res) => {
  try {
    const brukerId = req.user.bruker_id;
    const { rolle_id, bruker_rolle } = req.body;

    if (!rolle_id || !bruker_rolle) {
      return res.status(400).json({ error: 'rolle_id og bruker_rolle er påkrevd' });
    }

    await pool.query(
      'UPDATE bruker SET rolle_id = $1, bruker_rolle = $2 WHERE bruker_id = $3',
      [rolle_id, bruker_rolle, brukerId]
    );

    res.json({ message: 'Rolle oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke bytte rolle' });
  }
});

export default router;