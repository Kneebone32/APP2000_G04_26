// Skrevet av Kristoffer med mindre annet er spesifisert

import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

const TILLATTE_TYPER = new Set(['tur', 'hytte', 'turmaal', 'artikkel']);

// Globalt søk på tvers av turer, hytter, turmål og artikler - Laget med hjelp av AI
router.get('/', async (req, res) => {
  const q = (req.query.q ?? '').trim();
  const typeFilter = req.query.type;
  const grensePerType = Math.min(Number(req.query.grense) || 5, 20);

  if (q.length < 2) return res.json([]);

  const aktiveTyper = typeFilter && TILLATTE_TYPER.has(typeFilter)
    ? [typeFilter]
    : [...TILLATTE_TYPER];

  const mønster = `%${q}%`;
  const deler = [];

  const sqlPerType = {
    tur: `
      (SELECT 'tur'::text AS type,
              tur_id::text AS id,
              tur_navn AS tittel,
              LEFT(COALESCE(tur_beskrivelse, ''), 140) AS utdrag,
              NULL::text AS slug
       FROM tur
       WHERE tur_navn ILIKE $1 OR tur_beskrivelse ILIKE $1
       LIMIT ${grensePerType})`,
    hytte: `
      (SELECT 'hytte'::text,
              hytte_id::text,
              hytte_navn,
              LEFT(COALESCE(hytte_beskrivelse, ''), 140),
              NULL::text
       FROM hytte
       WHERE hytte_navn ILIKE $1 OR hytte_beskrivelse ILIKE $1
       LIMIT ${grensePerType})`,
    turmaal: `
      (SELECT 'turmaal'::text,
              turmaal_id::text,
              turmaal_navn,
              LEFT(COALESCE(turmaal_beskrivelse, ''), 140),
              NULL::text
       FROM turmaal
       WHERE turmaal_navn ILIKE $1 OR turmaal_beskrivelse ILIKE $1
       LIMIT ${grensePerType})`,
    artikkel: `
      (SELECT 'artikkel'::text,
              artikkel_id::text,
              artikkel_tittel,
              LEFT(COALESCE(artikkel_innhold, ''), 140),
              artikkel_slug
       FROM artikkel
       WHERE artikkel_tittel ILIKE $1 OR artikkel_innhold ILIKE $1
       LIMIT ${grensePerType})`,
  };

  for (const t of aktiveTyper) deler.push(sqlPerType[t]);

  try {
    const result = await pool.query(deler.join(' UNION ALL '), [mønster]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Søk feilet' });
  }
});

export default router;
