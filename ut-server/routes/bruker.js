// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const router = express.Router();

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
router.get('/meg', passport.authenticate('jwt', { session: false }), async (req, res) => {
  try {
    res.json({ bruker: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente bruker' });
  }
});

export default router;