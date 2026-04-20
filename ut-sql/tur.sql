//KI har hjulpet meg å satte opp opprett tur

//opprett tur
CREATE OR REPLACE FUNCTION public.tur_opprett(p_tur_navn character varying, p_tur_beskrivelse text, p_bruker_id integer, p_turtype turtype_enum, p_vanskelighetsgrad vanskelighetsgrad_old, p_varighet varighet_enum, p_hytter jsonb, p_turmaal jsonb, p_stier jsonb, p_nye_stier jsonb, p_gpx jsonb, p_bilder jsonb, p_rute_lengde numeric)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_tur_id integer;
    v_sti_id integer;
    v_rekkefolge integer;
    v_ny_sti jsonb;
    v_fylke_id integer;
    v_kommune_id integer;
BEGIN
  INSERT INTO public.tur (
    tur_navn,
    tur_beskrivelse,
    bruker_id,
    turtype,
    vanskelighetsgrad,
    varighet,
    rute_lengde
)
VALUES (
    p_tur_navn,
    p_tur_beskrivelse,
    p_bruker_id,
    p_turtype,
    p_vanskelighetsgrad,
    p_varighet,
    p_rute_lengde
)
    RETURNING tur_id INTO v_tur_id;

    IF p_hytter IS NOT NULL AND jsonb_typeof(p_hytter) = 'array' THEN
        INSERT INTO public.tur_hytte (
            tur_id,
            hytte_id,
            rekkefolge
        )
        SELECT
            v_tur_id,
            elem::integer,
            ord::integer
        FROM jsonb_array_elements_text(p_hytter) WITH ORDINALITY AS t(elem, ord);
    END IF;

    IF p_turmaal IS NOT NULL AND jsonb_typeof(p_turmaal) = 'array' THEN
        INSERT INTO public.tur_turmaal (
            tur_id,
            turmaal_id,
            rekkefolge
        )
        SELECT
            v_tur_id,
            elem::integer,
            ord::integer
        FROM jsonb_array_elements_text(p_turmaal) WITH ORDINALITY AS t(elem, ord);
    END IF;

    IF p_stier IS NOT NULL AND jsonb_typeof(p_stier) = 'array' THEN
        INSERT INTO public.tur_sti (
            tur_id,
            sti_id,
            rekkefolge,
            er_revers
        )
        SELECT
            v_tur_id,
            (elem ->> 'sti_id')::integer,
            ord::integer,
            COALESCE((elem ->> 'er_revers')::boolean, false)
        FROM jsonb_array_elements(p_stier) WITH ORDINALITY AS t(elem, ord);
    END IF;

    SELECT COALESCE(MAX(rekkefolge), 0)
    INTO v_rekkefolge
    FROM public.tur_sti
    WHERE tur_id = v_tur_id;

    IF p_nye_stier IS NOT NULL AND jsonb_typeof(p_nye_stier) = 'array' THEN
        FOR v_ny_sti IN
            SELECT value
            FROM jsonb_array_elements(p_nye_stier)
        LOOP
            IF jsonb_typeof(v_ny_sti) <> 'array' OR jsonb_array_length(v_ny_sti) = 0 THEN
                RAISE EXCEPTION 'Hver verdi i p_nye_stier må være et json-array med minst ett punkt';
            END IF;

            v_fylke_id := NULL;
            v_kommune_id := NULL;

            INSERT INTO public.sti (
                fylke_id,
                kommune_id,
                sti_kilde
            )
            VALUES (
                v_fylke_id,
                v_kommune_id,
                'tegnet'
            )
            RETURNING sti_id INTO v_sti_id;

            INSERT INTO public.sti_punkt (
                sti_id,
                rekkefolge,
                breddegrad,
                lengdegrad,
                moh
            )
            SELECT
                v_sti_id,
                ord::integer,
                (punkt ->> 'breddegrad')::numeric,
                (punkt ->> 'lengdegrad')::numeric,
                NULLIF((punkt ->> 'moh'), '')::numeric
            FROM jsonb_array_elements(v_ny_sti) WITH ORDINALITY AS p(punkt, ord);

            v_rekkefolge := v_rekkefolge + 1;

            INSERT INTO public.tur_sti (
                tur_id,
                sti_id,
                rekkefolge,
                er_revers
            )
            VALUES (
                v_tur_id,
                v_sti_id,
                v_rekkefolge,
                false
            );
        END LOOP;
    END IF;

    IF p_gpx IS NOT NULL AND jsonb_typeof(p_gpx) = 'array' AND jsonb_array_length(p_gpx) > 0 THEN
        v_fylke_id := NULL;
        v_kommune_id := NULL;

        INSERT INTO public.sti (
            fylke_id,
            kommune_id,
            sti_kilde
        )
        VALUES (
            v_fylke_id,
            v_kommune_id,
            'gpx'
        )
        RETURNING sti_id INTO v_sti_id;

        INSERT INTO public.sti_punkt (
            sti_id,
            rekkefolge,
            breddegrad,
            lengdegrad,
            moh
        )
        SELECT
            v_sti_id,
            ord::integer,
            (punkt ->> 'breddegrad')::numeric,
            (punkt ->> 'lengdegrad')::numeric,
            NULLIF((punkt ->> 'moh'), '')::numeric
        FROM jsonb_array_elements(p_gpx) WITH ORDINALITY AS p(punkt, ord);

        v_rekkefolge := v_rekkefolge + 1;

        INSERT INTO public.tur_sti (
            tur_id,
            sti_id,
            rekkefolge,
            er_revers
        )
        VALUES (
            v_tur_id,
            v_sti_id,
            v_rekkefolge,
            false
        );
    END IF;

    IF p_bilder IS NOT NULL AND jsonb_typeof(p_bilder) = 'array' THEN
        INSERT INTO public.tur_bilde (
            tur_id,
            tur_url,
            tur_rekkefolge
        )
        SELECT
            v_tur_id,
            elem,
            ord::integer
        FROM jsonb_array_elements_text(p_bilder) WITH ORDINALITY AS t(elem, ord);
    END IF;

    RETURN v_tur_id;
END;
$function$



//henter turer til kartet
CREATE OR REPLACE FUNCTION public.tur_hent_kart()
 RETURNS TABLE(tur_id integer, tur_navn text, tur_beskrivelse text, turtype turtype_enum, vanskelighetsgrad vanskelighetsgrad_old, varighet varighet_enum, stier jsonb, bilder jsonb)
 LANGUAGE sql
AS $function$
  SELECT
    t.tur_id,
    t.tur_navn,
    t.tur_beskrivelse,
    t.turtype,
    t.vanskelighetsgrad,
    t.varighet,

    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'sti_id', ts.sti_id,
            'rekkefolge', ts.rekkefolge,
            'er_revers', ts.er_revers,
            'fylke_navn', f.fylke_navn,
            'kommune_navn', k.kommune_navn,
            'punkter',
              COALESCE(
                (
                  SELECT jsonb_agg(
                    jsonb_build_object(
                      'lengdegrad', sp.lengdegrad,
                      'breddegrad', sp.breddegrad,
                      'moh', sp.moh,
                      'rekkefolge', sp.rekkefolge
                    )
                    ORDER BY
                      CASE 
                        WHEN ts.er_revers THEN -sp.rekkefolge 
                        ELSE sp.rekkefolge 
                      END
                  )
                  FROM sti_punkt sp
                  WHERE sp.sti_id = ts.sti_id
                ),
                '[]'::jsonb
              )
          )
          ORDER BY ts.rekkefolge
        )
        FROM tur_sti ts
        JOIN sti s ON s.sti_id = ts.sti_id
        LEFT JOIN fylke f ON f.fylke_id = s.fylke_id
        LEFT JOIN kommune k ON k.kommune_id = s.kommune_id
        WHERE ts.tur_id = t.tur_id
      ),
      '[]'::jsonb
    ) AS stier,

    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'tur_bilde_id', tb.tur_bilde_id,
            'tur_url', tb.tur_url,
            'tur_rekkefolge', tb.tur_rekkefolge
          )
          ORDER BY tb.tur_rekkefolge
        )
        FROM tur_bilde tb
        WHERE tb.tur_id = t.tur_id
      ),
      '[]'::jsonb
    ) AS bilder

  FROM tur t
  ORDER BY t.tur_id;
$function$




//henter informasjon til en tur
CREATE OR REPLACE FUNCTION public.tur_hent(p_tur_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_resultat jsonb;
BEGIN
  SELECT jsonb_build_object(
    'tur_id', t.tur_id,
    'tur_navn', t.tur_navn,
    'tur_beskrivelse', t.tur_beskrivelse,
    'turtype', t.turtype,
    'vanskelighetsgrad', t.vanskelighetsgrad,
    'varighet', t.varighet,
    'rute_lengde', t.rute_lengde,

    'hoyeste_punkt_moh', (
      SELECT MAX(sp.moh)
      FROM tur_sti ts
      JOIN sti_punkt sp ON sp.sti_id = ts.sti_id
      WHERE ts.tur_id = t.tur_id
    ),

    'hytter', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'hytte_id', h.hytte_id,
            'hytte_navn', h.hytte_navn,
            'rekkefolge', th.rekkefolge
          )
          ORDER BY th.rekkefolge
        )
        FROM tur_hytte th
        JOIN hytte h ON h.hytte_id = th.hytte_id
        WHERE th.tur_id = t.tur_id
      ),
      '[]'::jsonb
    ),

    'turmaal', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'turmaal_id', tm.turmaal_id,
            'turmaal_navn', tm.turmaal_navn,
            'rekkefolge', tt.rekkefolge
          )
          ORDER BY tt.rekkefolge
        )
        FROM tur_turmaal tt
        JOIN turmaal tm ON tm.turmaal_id = tt.turmaal_id
        WHERE tt.tur_id = t.tur_id
      ),
      '[]'::jsonb
    ),

    'stier', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'sti_id', ts.sti_id,
            'rekkefolge', ts.rekkefolge,
            'er_revers', ts.er_revers,
            'fylke_navn', f.fylke_navn,
            'kommune_navn', k.kommune_navn
          )
          ORDER BY ts.rekkefolge
        )
        FROM tur_sti ts
        JOIN sti s ON s.sti_id = ts.sti_id
        LEFT JOIN fylke f ON f.fylke_id = s.fylke_id
        LEFT JOIN kommune k ON k.kommune_id = s.kommune_id
        WHERE ts.tur_id = t.tur_id
      ),
      '[]'::jsonb
    ),

    'bilder', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'tur_bilde_id', tb.tur_bilde_id,
            'tur_url', tb.tur_url,
            'tur_rekkefolge', tb.tur_rekkefolge
          )
          ORDER BY tb.tur_rekkefolge
        )
        FROM tur_bilde tb
        WHERE tb.tur_id = t.tur_id
      ),
      '[]'::jsonb
    )
  )
  INTO v_resultat
  FROM tur t
  WHERE t.tur_id = p_tur_id;

  IF v_resultat IS NULL THEN
    RAISE EXCEPTION 'Tur med tur_id=% finnes ikke', p_tur_id;
  END IF;

  RETURN v_resultat;
END;
$function$


//Slett en tur
CREATE OR REPLACE FUNCTION public.tur_slett(p_tur_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM tur
  WHERE tur_id = p_tur_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Tur med tur_id=% finnes ikke', p_tur_id;
  END IF;
END;
$function$

