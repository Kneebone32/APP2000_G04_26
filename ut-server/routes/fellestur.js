import express from 'express';
import passport from 'passport';
import pool from '../config/db.js';

const router = express.Router();
const auth = passport.authenticate('jwt', { session: false });

//Henter fellesturer som innlogget bruker har opprettet
router.get('/mine', auth, async (req, res) => {
  const bruker_id = req.user.bruker_id;
  try {
    const result = await pool.query(
      `SELECT aktivitet FROM aktivitet_hent() WHERE (aktivitet->'oppretter'->>'bruker_id')::int = $1::int`,
      [bruker_id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aktivitet ikke funnet' });

    res.json(result.rows.map(row => row.aktivitet));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente aktivitet' });
  }
});

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
      ruteLengde,
      pris,
      rabatt_pris,
      rabatt_frist,
      avbestillingsfrist_dager
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
        $17::numeric,
        $18::numeric,
        $19::numeric,
        $20::timestamp,
        $21::integer
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
        ruteLengde ?? 0,
        pris ?? null,
        rabatt_pris ?? null,
        rabatt_frist ?? null,
        avbestillingsfrist_dager ?? null
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


// Oppdaterer aktivitet
router.put('/:id', async (req, res) => {

  try {
    const { id } = req.params;

    const {
      aktivitet_tittel,
      aktivitet_beskrivelse,
      aktivitet_min_deltakere,
      aktivitet_maks_deltakere,
      vanskelighetsgrad,
      varighet,
      turtype,
      aktivitet_status,
      bilder
    } = req.body;

    const result = await pool.query(
      `SELECT public.aktivitet_oppdater(
        $1::integer,
        $2::character varying,
        $3::text,
        $4::integer,
        $5::integer,
        $6::vanskelighetsgrad_old,
        $7::varighet_enum,
        $8::turtype_enum,
        $9::aktivitet_status_enum,
        $10::jsonb
      ) AS aktivitet_id`,
      [
        id,
        aktivitet_tittel ?? null,
        aktivitet_beskrivelse ?? null,
        aktivitet_min_deltakere ?? null,
        aktivitet_maks_deltakere ?? null,
        vanskelighetsgrad ?? null,
        varighet ?? null,
        turtype ?? null,
        aktivitet_status ?? null,
        bilder ? JSON.stringify(bilder) : null
      ]
    );

    const aktivitetId = result.rows[0].aktivitet_id;

    res.status(200).json({
      aktivitet_id: aktivitetId,
      message: 'Aktivitet oppdatert'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere aktivitet' });
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

// Henter én aktivitet basert på ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT aktivitet FROM aktivitet_hent() WHERE (aktivitet->>'aktivitet_id')::int = $1`,
      [id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Aktivitet ikke funnet' });
    res.json(result.rows[0].aktivitet);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke hente aktivitet' });
  }
});




//TODO: Lås fellestur (ingen flere påmeldinger. Enten via Turleder eller når ant. påmeldte = maks deltakere)
// Lås / åpne påmelding for en aktivitetsdato
router.patch('/dato/:aktivitet_dato_id/pamelding-last', auth, async (req, res) => {
  try {
    const aktivitet_dato_id = req.params.aktivitet_dato_id;
    const { er_last } = req.body;

    const result = await pool.query(
      `SELECT *
       FROM public.aktivitet_dato_sett_pamelding_last($1, $2)`,
      [aktivitet_dato_id, er_last]
    );

    res.json({
      message: er_last ? 'Påmelding låst' : 'Påmelding åpnet',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke oppdatere lås for påmelding' });
  }
});

//TODO: Lås dato på fellestur (går fra fleksibel til fast startdato på valgt dato)
// Velg fast dato for aktivitet
router.patch('/dato/:aktivitet_dato_id/velg-fast', auth, async (req, res) => {
  try {
    const aktivitet_dato_id = req.params.aktivitet_dato_id;

    const result = await pool.query(
      `SELECT *
       FROM public.aktivitet_dato_velg_fast_dato($1)`,
      [aktivitet_dato_id]
    );

    res.json({
      message: 'Fast dato valgt',
      data: result.rows[0]
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Kunne ikke velge fast dato' });
  }
});

export default router;
