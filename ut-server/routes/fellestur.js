import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });


// Legger til ny aktivitet
router.post('/', auth, async (req, res) => {
  const bruker_id = req.user.bruker_id;

  try {
    const {
      aktivitet_tittel,
      aktivitet_beskrivelse,
      aktivitet_min_deltakere,
      aktivitet_maks_deltakere,
      turtype,
      vanskelighetsgrad,
      varighet,
      datoer,
      aktivitet_status,
      hytter,
      turmaal,
      stier,
      nyeStier,
      gpx,
      bilder,
      ruteLengde
    } = req.body;

    const result = await pool.query(
      `SELECT public.aktivitet_opprett(
        $1::character varying,
        $2::text,
        $3::integer,
        $4::integer,
        $5::integer,
        $6::turtype_enum,
        $7::vanskelighetsgrad_old,
        $8::varighet_enum,
        $9::jsonb,
        $10::aktivitet_status_enum,
        $11::jsonb,
        $12::jsonb,
        $13::jsonb,
        $14::jsonb,
        $15::jsonb,
        $16::jsonb,
        $17::numeric
      ) AS ny_aktivitet_id`,
      [
        aktivitet_tittel,
        aktivitet_beskrivelse,
        bruker_id,
        aktivitet_min_deltakere,
        aktivitet_maks_deltakere,
        turtype,
        vanskelighetsgrad,
        varighet,
        datoer ? JSON.stringify(datoer) : '[]',
        aktivitet_status ?? 'utkast',
        hytter ? JSON.stringify(hytter) : '[]',
        turmaal ? JSON.stringify(turmaal) : '[]',
        stier ? JSON.stringify(stier) : '[]',
        nyeStier ? JSON.stringify(nyeStier) : '[]',
        gpx ? JSON.stringify(gpx) : '[]',
        bilder ? JSON.stringify(bilder) : '[]',
        ruteLengde ?? 0
      ]
    );

    const nyAktivitetId = result.rows[0].ny_aktivitet_id;

    res.status(201).json({
      aktivitet_id: nyAktivitetId,
      message: 'Aktivitet opprettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke opprette aktivitet' });
  }
});



// Henter alle aktiviteter
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM aktivitet_hent()');
    res.json(result.rows.map(row => row.aktivitet));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database connection failed' });
  }
});


// Sletter aktivitet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query('SELECT aktivitet_slett($1)', [id]);

    res.json({
      aktivitet_id: id,
      message: 'Aktivitet slettet'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke slette aktivitet' });
  }
});

export default router;
