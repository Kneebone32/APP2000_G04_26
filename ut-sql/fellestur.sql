//CRUD funkskjoner for fellestur

//Jeg brukte KI mest i funksjonen aktivitet_opprett. Denne ble ganske stor og måtte utvides flere ganger underveis i prosjektet. KI hjalp meg med å bygge opp strukturen og legge til ny funksjonalitet.
KI hjalp også med å få hjelpe funksjoner til å fungere, spesielt i forbindelse med varsling. Eksemplet på dette er hytteeier_foresporsel_opprett som er en funksjon som blir callet og sender et varsel til hyttene sine eiere

//KI ble også brukt en del for å få slette en fellestur til å fungere, jeg endte opp å krasje med mange nøkler og ble lei.


//opprett en fellestur

CREATE OR REPLACE FUNCTION public.aktivitet_opprett(p_aktivitet_tittel character varying, p_aktivitet_beskrivelse text, p_bruker_id integer, p_aktivitet_min_deltakere integer, p_aktivitet_maks_deltakere integer, p_turtype turtype_enum, p_vanskelighetsgrad vanskelighetsgrad_old, p_varighet varighet_enum, p_datoer jsonb, p_aktivitet_status aktivitet_status_enum, p_hytter jsonb, p_turmaal jsonb, p_stier jsonb, p_nye_stier jsonb, p_gpx jsonb, p_bilder jsonb, p_rute_lengde numeric, p_pris numeric DEFAULT NULL::numeric, p_rabatt_pris numeric DEFAULT NULL::numeric, p_rabatt_frist timestamp without time zone DEFAULT NULL::timestamp without time zone, p_avbestillingsfrist_dager integer DEFAULT NULL::integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_aktivitet_id integer;
    v_samtale_id integer;
    v_dato_status aktivitet_dato_status_enum;
    v_antall_datoer integer;

    v_sti_id integer;
    v_rekkefolge integer;

    v_ny_sti jsonb;

    v_fylke_id integer;0,,,,,,
    v_kommune_id integer;
    v_hytte_id integer;
BEGIN
    IF p_datoer IS NULL
       OR jsonb_typeof(p_datoer) <> 'array'
       OR jsonb_array_length(p_datoer) = 0 THEN
        RAISE EXCEPTION 'p_datoer må være et json-array med minst én dato';
    END IF;

    IF p_pris IS NOT NULL AND p_pris < 0 THEN
        RAISE EXCEPTION 'p_pris kan ikke være negativ';
    END IF;

    IF p_rabatt_pris IS NOT NULL AND p_rabatt_pris < 0 THEN
        RAISE EXCEPTION 'p_rabatt_pris kan ikke være negativ';
    END IF;

    IF p_rabatt_pris IS NOT NULL AND p_pris IS NULL THEN
        RAISE EXCEPTION 'Du kan ikke sette rabattpris uten ordinær pris';
    END IF;

    IF p_rabatt_pris IS NOT NULL AND p_rabatt_pris > p_pris THEN
        RAISE EXCEPTION 'p_rabatt_pris kan ikke være høyere enn p_pris';
    END IF;

    IF p_rabatt_pris IS NOT NULL AND p_rabatt_frist IS NULL THEN
        RAISE EXCEPTION 'p_rabatt_frist må settes når p_rabatt_pris brukes';
    END IF;

    IF p_avbestillingsfrist_dager IS NOT NULL AND p_avbestillingsfrist_dager < 0 THEN
        RAISE EXCEPTION 'p_avbestillingsfrist_dager kan ikke være negativ';
    END IF;

    v_antall_datoer := jsonb_array_length(p_datoer);

    IF v_antall_datoer = 1 THEN
        v_dato_status := 'valgt';
    ELSE
        v_dato_status := 'foreslatt';
    END IF;

    INSERT INTO public.aktivitet (
        aktivitet_tittel,
        aktivitet_beskrivelse,
        bruker_id,
        aktivitet_min_deltakere,
        aktivitet_maks_deltakere,
        turtype,
        vanskelighetsgrad,
        varighet,
        aktivitet_status,
        lengde,
        avbestillingsfrist_dager
    )
    VALUES (
        p_aktivitet_tittel,
        p_aktivitet_beskrivelse,
        p_bruker_id,
        p_aktivitet_min_deltakere,
        p_aktivitet_maks_deltakere,
        p_turtype,
        p_vanskelighetsgrad,
        p_varighet,
        p_aktivitet_status,
        p_rute_lengde,
        p_avbestillingsfrist_dager
    )
    RETURNING aktivitet_id INTO v_aktivitet_id;

    IF p_pris IS NOT NULL THEN
        INSERT INTO public.aktivitet_pris (
            aktivitet_id,
            pris,
            rabatt_pris,
            rabatt_frist
        )
        VALUES (
            v_aktivitet_id,
            p_pris,
            p_rabatt_pris,
            p_rabatt_frist
        );
    END IF;

    v_samtale_id := public.aktivitet_samtale_opprett(
        v_aktivitet_id,
        p_bruker_id,
        p_aktivitet_tittel
    );

    INSERT INTO public.aktivitet_dato (
        aktivitet_id,
        aktivitet_start_dato,
        aktivitet_slutt_dato,
        aktivitet_dato_status
    )
    SELECT
        v_aktivitet_id,
        (dato ->> 'aktivitet_start_dato')::timestamp,
        (dato ->> 'aktivitet_slutt_dato')::timestamp,
        v_dato_status
    FROM jsonb_array_elements(p_datoer) AS dato;

    IF p_hytter IS NOT NULL AND jsonb_typeof(p_hytter) = 'array' THEN
        INSERT INTO public.aktivitet_hytte (
            aktivitet_id,
            hytte_id,
            rekkefolge
        )
        SELECT
            v_aktivitet_id,
            elem::integer,
            ord::integer
        FROM jsonb_array_elements_text(p_hytter) WITH ORDINALITY AS t(elem, ord);

        FOR v_hytte_id IN
            SELECT elem::integer
            FROM jsonb_array_elements_text(p_hytter) AS t(elem)
        LOOP
            PERFORM public.hytteeier_foresporsel_opprett(
                v_hytte_id,
                v_aktivitet_id
            );
        END LOOP;
    END IF;

    IF p_turmaal IS NOT NULL AND jsonb_typeof(p_turmaal) = 'array' THEN
        INSERT INTO public.aktivitet_turmaal (
            aktivitet_id,
            turmaal_id,
            rekkefolge
        )
        SELECT
            v_aktivitet_id,
            elem::integer,
            ord::integer
        FROM jsonb_array_elements_text(p_turmaal) WITH ORDINALITY AS t(elem, ord);
    END IF;

    IF p_stier IS NOT NULL AND jsonb_typeof(p_stier) = 'array' THEN
        INSERT INTO public.aktivitet_sti (
            aktivitet_id,
            sti_id,
            rekkefolge,
            er_revers
        )
        SELECT
            v_aktivitet_id,
            (elem ->> 'sti_id')::integer,
            ord::integer,
            COALESCE((elem ->> 'er_revers')::boolean, false)
        FROM jsonb_array_elements(p_stier) WITH ORDINALITY AS t(elem, ord);
    END IF;

    SELECT COALESCE(MAX(as1.rekkefolge), 0)
    INTO v_rekkefolge
    FROM public.aktivitet_sti as1
    WHERE as1.aktivitet_id = v_aktivitet_id;

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

            INSERT INTO public.aktivitet_sti (
                aktivitet_id,
                sti_id,
                rekkefolge,
                er_revers
            )
            VALUES (
                v_aktivitet_id,
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

        INSERT INTO public.aktivitet_sti (
            aktivitet_id,
            sti_id,
            rekkefolge,
            er_revers
        )
        VALUES (
            v_aktivitet_id,
            v_sti_id,
            v_rekkefolge,
            false
        );
    END IF;

    IF p_bilder IS NOT NULL AND jsonb_typeof(p_bilder) = 'array' THEN
        INSERT INTO public.aktivitet_bilde (
            aktivitet_id,
            aktivitet_url,
            aktivitet_rekkefolge
        )
        SELECT
            v_aktivitet_id,
            elem,
            ord::integer
        FROM jsonb_array_elements_text(p_bilder) WITH ORDINALITY AS t(elem, ord);
    END IF;

    RETURN v_aktivitet_id;
END;
$function$



//Hent en fellestur
CREATE OR REPLACE FUNCTION public.aktivitet_hent()
 RETURNS TABLE(aktivitet jsonb)
 LANGUAGE sql
AS $function$
SELECT
  jsonb_build_object(
    'aktivitet_id', a.aktivitet_id,
    'aktivitet_tittel', a.aktivitet_tittel,
    'aktivitet_beskrivelse', a.aktivitet_beskrivelse,
    'aktivitet_status', a.aktivitet_status,
    'aktivitet_min_deltakere', a.aktivitet_min_deltakere,
    'aktivitet_maks_deltakere', a.aktivitet_maks_deltakere,
    'aktivitet_opprettet_dato', a.aktivitet_opprettet_dato,
    'turtype', a.turtype,
    'vanskelighetsgrad', a.vanskelighetsgrad,
    'varighet', a.varighet,
    'lengde', a.lengde,

    'pris', ap.pris,
    'rabatt_pris', ap.rabatt_pris,
    'rabatt_frist', ap.rabatt_frist,

    'oppretter', jsonb_build_object(
      'bruker_id', b.bruker_id,
      'bruker_navn', b.bruker_navn,
      'bruker_etternavn', b.bruker_etternavn
    ),

    'datoer', COALESCE(
  (
    SELECT jsonb_agg(
      jsonb_build_object(
        'aktivitet_dato_id', ad.aktivitet_dato_id,
        'aktivitet_start_dato', ad.aktivitet_start_dato,
        'aktivitet_slutt_dato', ad.aktivitet_slutt_dato,
        'aktivitet_dato_status', ad.aktivitet_dato_status,
        'er_last_for_pamelding', ad.er_last_for_pamelding
      )
      ORDER BY ad.aktivitet_start_dato
    )
    FROM aktivitet_dato ad
    WHERE ad.aktivitet_id = a.aktivitet_id
  ),
  '[]'::jsonb
),

    'hytter', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'hytte_id', h.hytte_id,
            'hytte_navn', h.hytte_navn,
            'hytte_breddegrad', h.hytte_breddegrad,
            'hytte_lengdegrad', h.hytte_lengdegrad,
            'hytte_moh', h.hytte_moh,
            'rekkefolge', ah.rekkefolge
          )
          ORDER BY ah.rekkefolge
        )
        FROM aktivitet_hytte ah
        JOIN hytte h ON h.hytte_id = ah.hytte_id
        WHERE ah.aktivitet_id = a.aktivitet_id
      ),
      '[]'::jsonb
    ),

    'turmaal', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'turmaal_id', tm.turmaal_id,
            'turmaal_navn', tm.turmaal_navn,
            'turmaal_breddegrad', tm.turmaal_breddegrad,
            'turmaal_lengdegrad', tm.turmaal_lengdegrad,
            'turmaal_moh', tm.turmaal_moh,
            'rekkefolge', atm.rekkefolge
          )
          ORDER BY atm.rekkefolge
        )
        FROM aktivitet_turmaal atm
        JOIN turmaal tm ON tm.turmaal_id = atm.turmaal_id
        WHERE atm.aktivitet_id = a.aktivitet_id
      ),
      '[]'::jsonb
    ),

    'stier', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'sti_id', s.sti_id,
            'sti_kilde', s.sti_kilde,
            'fylke_navn', f.fylke_navn,
            'kommune_navn', k.kommune_navn,
            'rekkefolge', ast.rekkefolge,
            'er_revers', ast.er_revers,
            'sti_punkter', COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'sti_id', sp.sti_id,
                    'breddegrad', sp.breddegrad,
                    'lengdegrad', sp.lengdegrad,
                    'moh', sp.moh,
                    'rekkefolge', sp.rekkefolge
                  )
                  ORDER BY sp.rekkefolge
                )
                FROM sti_punkt sp
                WHERE sp.sti_id = s.sti_id
              ),
              '[]'::jsonb
            )
          )
          ORDER BY ast.rekkefolge
        )
        FROM aktivitet_sti ast
        JOIN sti s ON s.sti_id = ast.sti_id
        LEFT JOIN fylke f ON f.fylke_id = s.fylke_id
        LEFT JOIN kommune k ON k.kommune_id = s.kommune_id
        WHERE ast.aktivitet_id = a.aktivitet_id
          AND s.sti_kilde = 'tegnet'
      ),
      '[]'::jsonb
    ),

    'gpx', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'sti_id', s.sti_id,
            'sti_kilde', s.sti_kilde,
            'fylke_navn', f.fylke_navn,
            'kommune_navn', k.kommune_navn,
            'rekkefolge', ast.rekkefolge,
            'er_revers', ast.er_revers,
            'sti_punkter', COALESCE(
              (
                SELECT jsonb_agg(
                  jsonb_build_object(
                    'sti_id', sp.sti_id,
                    'breddegrad', sp.breddegrad,
                    'lengdegrad', sp.lengdegrad,
                    'moh', sp.moh,
                    'rekkefolge', sp.rekkefolge
                  )
                  ORDER BY sp.rekkefolge
                )
                FROM sti_punkt sp
                WHERE sp.sti_id = s.sti_id
              ),
              '[]'::jsonb
            )
          )
          ORDER BY ast.rekkefolge
        )
        FROM aktivitet_sti ast
        JOIN sti s ON s.sti_id = ast.sti_id
        LEFT JOIN fylke f ON f.fylke_id = s.fylke_id
        LEFT JOIN kommune k ON k.kommune_id = s.kommune_id
        WHERE ast.aktivitet_id = a.aktivitet_id
          AND s.sti_kilde = 'gpx'
      ),
      '[]'::jsonb
    ),

    'bilder', COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'aktivitet_bilde_id', ab.aktivitet_bilde_id,
            'aktivitet_url', ab.aktivitet_url,
            'aktivitet_rekkefolge', ab.aktivitet_rekkefolge
          )
          ORDER BY ab.aktivitet_rekkefolge
        )
        FROM aktivitet_bilde ab
        WHERE ab.aktivitet_id = a.aktivitet_id
      ),
      '[]'::jsonb
    )
  ) AS aktivitet
FROM aktivitet a
JOIN bruker b ON b.bruker_id = a.bruker_id
LEFT JOIN aktivitet_pris ap ON ap.aktivitet_id = a.aktivitet_id
ORDER BY a.aktivitet_id;
$function$



//oppdater en fellestur
CREATE OR REPLACE FUNCTION public.aktivitet_oppdater(p_aktivitet_id integer, p_aktivitet_tittel character varying DEFAULT NULL::character varying, p_aktivitet_beskrivelse text DEFAULT NULL::text, p_aktivitet_min_deltakere integer DEFAULT NULL::integer, p_aktivitet_maks_deltakere integer DEFAULT NULL::integer, p_vanskelighetsgrad vanskelighetsgrad_old DEFAULT NULL::vanskelighetsgrad_old, p_varighet varighet_enum DEFAULT NULL::varighet_enum, p_turtype turtype_enum DEFAULT NULL::turtype_enum, p_aktivitet_status aktivitet_status_enum DEFAULT NULL::aktivitet_status_enum, p_bilder jsonb DEFAULT NULL::jsonb)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.aktivitet
        WHERE aktivitet_id = p_aktivitet_id
    ) THEN
        RAISE EXCEPTION 'Fant ikke aktivitet med id %', p_aktivitet_id;
    END IF;

    UPDATE public.aktivitet
    SET
        aktivitet_tittel = COALESCE(p_aktivitet_tittel, aktivitet_tittel),
        aktivitet_beskrivelse = COALESCE(p_aktivitet_beskrivelse, aktivitet_beskrivelse),
        aktivitet_min_deltakere = COALESCE(p_aktivitet_min_deltakere, aktivitet_min_deltakere),
        aktivitet_maks_deltakere = COALESCE(p_aktivitet_maks_deltakere, aktivitet_maks_deltakere),
        vanskelighetsgrad = COALESCE(p_vanskelighetsgrad, vanskelighetsgrad),
        varighet = COALESCE(p_varighet, varighet),
        turtype = COALESCE(p_turtype, turtype),
        aktivitet_status = COALESCE(p_aktivitet_status, aktivitet_status)
    WHERE aktivitet_id = p_aktivitet_id;

    IF p_bilder IS NOT NULL THEN
        IF jsonb_typeof(p_bilder) <> 'array' THEN
            RAISE EXCEPTION 'p_bilder må være et json-array';
        END IF;

        DELETE FROM public.aktivitet_bilde
        WHERE aktivitet_id = p_aktivitet_id;

        INSERT INTO public.aktivitet_bilde (
            aktivitet_id,
            aktivitet_url,
            aktivitet_rekkefolge
        )
        SELECT
            p_aktivitet_id,
            elem,
            ord::integer
        FROM jsonb_array_elements_text(p_bilder) WITH ORDINALITY AS t(elem, ord);
    END IF;

    RETURN p_aktivitet_id;
END;
$function$


//Slett en fellestur
CREATE OR REPLACE FUNCTION public.aktivitet_slett(p_aktivitet_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM public.aktivitet
    WHERE aktivitet_id = p_aktivitet_id
  ) THEN
    RAISE EXCEPTION 'Aktivitet med aktivitet_id=% finnes ikke', p_aktivitet_id;
  END IF;


  DELETE FROM public.varsel
  WHERE referanse_type = 'hytteeier_foresporsel'
    AND referanse_id IN (
      SELECT foresporsel_id
      FROM public.hytteeier_foresporsel
      WHERE aktivitet_id = p_aktivitet_id
    );

  
  DELETE FROM public.hytteeier_foresporsel
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.gruppe_medlem
  WHERE samtale_id IN (
    SELECT samtale_id
    FROM public.samtale
    WHERE aktivitet_id = p_aktivitet_id
  );

  DELETE FROM public.samtale
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet_dato
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet_hytte
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet_turmaal
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet_sti
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet_bilde
  WHERE aktivitet_id = p_aktivitet_id;

  DELETE FROM public.aktivitet
  WHERE aktivitet_id = p_aktivitet_id;
END;
$function$

