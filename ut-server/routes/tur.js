import express from 'express';
import pool from '../config/db.js';

const router = express.Router();


// oppretter en ny tur
router.post('/', async (req, res) => {
  try {
    const {
      tur_navn,
      tur_beskrivelse,
      turtype,
      vanskelighetsgrad,
      varighet,
      hytter,
      turmaal,
      stier,
      bilder
    } = req.body;

    const result = await pool.query(
      `SELECT tur_opprett(
        $1, 
        $2, 
        $3::turtype_enum, 
        $4::vanskelighetsgrad_old, 
        $5::varighet_enum, 
        $6, 
        $7, 
        $8, 
        $9
      ) AS ny_tur_id`,
      [
        tur_navn,
        tur_beskrivelse,
        turtype,
        vanskelighetsgrad,
        varighet,
        hytter ? JSON.stringify(hytter) : null,
        turmaal ? JSON.stringify(turmaal) : null,
        stier ? JSON.stringify(stier) : null,
        bilder ? JSON.stringify(bilder) : null
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
