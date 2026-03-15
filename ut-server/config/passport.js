// Skrevet av Kristoffer med mindre annet er spesifisert

import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import pool from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'hemmelig_nøkkel_endre_meg';

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: JWT_SECRET
    },
    async (payload, done) => {
      try {
        const result = await pool.query(
          'SELECT bruker_id, bruker_navn, bruker_etternavn, bruker_epost, bruker_joined FROM bruker WHERE bruker_id = $1',
          [payload.bruker_id]
        );

        if (result.rows.length === 0) {
          return done(null, false);
        }

        return done(null, result.rows[0]);
      } catch (err) {
        return done(err, false);
      }
    }
  )
);

export default passport;