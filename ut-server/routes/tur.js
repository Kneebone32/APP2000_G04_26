// Laget av Kristoffer og Sander

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// oppretter en ny tur
router.post('/', async (req, res) => {
  try {
    const {
      tur_navn,
      tur_beskrivelse,
      bruker_id,
      turtype,
      vanskelighetsgrad,
      varighet,
      hytter,
      turmaal,
      stier,
      nyeStier,
      gpx,
      bilder,
      ruteLengde
    } = req.body;

    const result = await pool.query(
      `SELECT public.tur_opprett(
        $1::character varying,
        $2::text,
        $3::integer,
        $4::turtype_enum,
        $5::vanskelighetsgrad_old,
        $6::varighet_enum,
        $7::jsonb,
        $8::jsonb,
        $9::jsonb,
        $10::jsonb,
        $11::jsonb,
        $12::jsonb,
        $13::numeric
      ) AS ny_tur_id`,
      [
        tur_navn,
        tur_beskrivelse,
        bruker_id,
        turtype,
        vanskelighetsgrad,
        varighet,
        hytter ? JSON.stringify(hytter) : '[]',
        turmaal ? JSON.stringify(turmaal) : '[]',
        stier ? JSON.stringify(stier) : '[]',
        nyeStier ? JSON.stringify(nyeStier) : '[]',
        gpx ? JSON.stringify(gpx) : '[]',
        bilder ? JSON.stringify(bilder) : '[]',
        ruteLengde ?? 0
      ]
    );

    const nyTurId = result.rows[0].ny_tur_id;

    res.status(201).json({
      tur_id: nyTurId,
      message: 'Tur opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette tur' });
  }
});



// Henter alle turer til kartet
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tur_hent_kart()');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Henter populære turer sortert etter kombinasjon av snittrating og antall anmeldelser - Laget av AI
router.get('/populaere', async (req, res) => {
  try {
    const grense = parseInt(req.query.grense) || 3;

    const [turer, ratings] = await Promise.all([
      pool.query('SELECT * FROM tur_hent_kart()'),
      pool.query(`
        SELECT tur_id,
               ROUND(AVG(rating)::numeric, 1) AS snittrating,
               COUNT(*)::integer              AS antall_anmeldelser
        FROM anmeldelse_tur
        GROUP BY tur_id
      `)
    ]);

    const ratingMap = Object.fromEntries(
      ratings.rows.map(r => [r.tur_id, r])
    );

    const resultat = turer.rows
      .map(t => ({
        ...t,
        snittrating: ratingMap[t.tur_id]?.snittrating ?? null,
        antall_anmeldelser: ratingMap[t.tur_id]?.antall_anmeldelser ?? 0
      }))
      .sort((a, b) => {
        const score = (t) => t.snittrating
          ? t.snittrating * (t.antall_anmeldelser / (t.antall_anmeldelser + 5))
          : -1;
        return score(b) - score(a);
      })
      .slice(0, grense);

    res.json(resultat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente populære turer' });
  }
});

// Henter tur med gitt id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'SELECT tur_hent($1) AS tur',
      [id]
    );

    if (!result.rows[0].tur) {
      return res.status(404).json({ error: 'Tur ikke funnet' });
    }

    res.json(result.rows[0].tur);
  } catch (err) {
    console.error(err);

    if (err.message.includes('finnes ikke')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Oppdaterer tur med gitt id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { tur_navn, tur_beskrivelse, turtype, vanskelighetsgrad, varighet } = req.body;

    const result = await pool.query(
      `UPDATE tur
       SET tur_navn = $1,
           tur_beskrivelse = $2,
           turtype = $3::turtype_enum,
           vanskelighetsgrad = $4::vanskelighetsgrad_old,
           varighet = $5::varighet_enum
       WHERE tur_id = $6
       RETURNING tur_id`,
      [tur_navn, tur_beskrivelse, turtype, vanskelighetsgrad, varighet, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Tur ikke funnet' });
    }

    res.json({ tur_id: id, message: 'Tur oppdatert' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere tur' });
  }
});

// Sletter tur med gitt id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT tur_slett($1)', [id]);

    res.json({
      tur_id: id,
      message: 'Tur slettet'
    });
  } catch (err) {
    console.error(err);

    if (err.message.includes('finnes ikke')) {
      return res.status(404).json({ error: err.message });
    }

    res.status(500).json({ error: 'Kunne ikke slette tur' });
  }
});





export default router;
