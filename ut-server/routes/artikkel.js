import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

// Opprett artikkel
router.post('/', auth, async (req, res) => {
  try {
    const {
      artikkel_slug,
      artikkel_tittel,
      artikkel_innhold
    } = req.body;

    const result = await pool.query(
      'SELECT public.artikkel_opprett($1, $2, $3) AS artikkel_id',
      [artikkel_slug, artikkel_tittel, artikkel_innhold]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);

    if (err.message.includes('slug')) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Kunne ikke opprette artikkel' });
  }
});


// Hent alle artikler
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM public.artikkel_hent_alle()'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente artikler' });
  }
});

// Hent én artikkel basert på ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM public.artikkel_hent($1)',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikkel ikke funnet' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente artikkel' });
  }
});

// Hent én artikkel basert på slug
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    const result = await pool.query(
      'SELECT * FROM public.artikkel_hent_slug($1)',
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Artikkel ikke funnet' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente artikkel' });
  }
});



// Oppdater artikkel
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    const {
      artikkel_slug,
      artikkel_tittel,
      artikkel_innhold
    } = req.body;

    await pool.query(
      'SELECT public.artikkel_oppdater($1, $2, $3, $4)',
      [id, artikkel_slug, artikkel_tittel, artikkel_innhold]
    );

    res.json({ message: 'Artikkel oppdatert' });
  } catch (err) {
    console.error(err);

    if (
      err.message.includes('finnes ikke') ||
      err.message.includes('slug')
    ) {
      return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Kunne ikke oppdatere artikkel' });
  }
});


// Slett artikkel
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      'SELECT public.artikkel_slett($1)',
      [id]
    );

    res.json({ message: 'Artikkel slettet' });
  } catch (err) {
    console.error(err);

    if (err.message.includes('finnes ikke')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Kunne ikke slette artikkel' });
  }
});

export default router;
