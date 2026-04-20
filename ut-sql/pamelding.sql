//KI måtte hjelpe meg en god del med funksjonen for å melde seg på en fellestur, spesielt i forbindelse til overlappende bindinger 
//, rabatt pris hvis tidlig nok påmelding og generelt holde strukturen siden funksjonen endte opp med å bli veldig stor.
  



//Melde seg på en fellestur som interessert eller bindende
CREATE OR REPLACE FUNCTION public.pamelding_opprett_eller_oppdater(p_bruker_id integer, p_aktivitet_dato_id integer, p_status text)
 RETURNS TABLE(bruker_id integer, aktivitet_dato_id integer, pamelding_status text)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_aktivitet_id integer;
    v_samtale_id integer;
    v_aktivitet_status aktivitet_status_enum;
    v_aktivitet_dato_status aktivitet_dato_status_enum;
    v_er_last_for_pamelding boolean;
    v_maks_deltakere integer;
    v_antall_bindende integer;
    v_pris_lagret numeric;
BEGIN
    IF p_status IS NULL OR p_status NOT IN ('interessert', 'bindende') THEN
        RAISE EXCEPTION 'Ugyldig status. Må være interessert eller bindende.'
            USING ERRCODE = 'P0001';
    END IF;

    SELECT
        ad.aktivitet_id,
        ad.aktivitet_dato_status,
        ad.er_last_for_pamelding,
        a.aktivitet_status,
        a.aktivitet_maks_deltakere
    INTO
        v_aktivitet_id,
        v_aktivitet_dato_status,
        v_er_last_for_pamelding,
        v_aktivitet_status,
        v_maks_deltakere
    FROM public.aktivitet_dato ad
    JOIN public.aktivitet a
      ON a.aktivitet_id = ad.aktivitet_id
    WHERE ad.aktivitet_dato_id = p_aktivitet_dato_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Aktivitetsdato % finnes ikke.', p_aktivitet_dato_id
            USING ERRCODE = 'P0001';
    END IF;

    IF v_aktivitet_status <> 'publisert' THEN
        RAISE EXCEPTION 'Påmelding er ikke tillatt fordi aktivitet har status %.', v_aktivitet_status
            USING ERRCODE = 'P0001';
    END IF;

    IF v_aktivitet_dato_status NOT IN ('foreslatt', 'valgt') THEN
        RAISE EXCEPTION 'Påmelding er ikke tillatt fordi aktivitetsdato har status %.', v_aktivitet_dato_status
            USING ERRCODE = 'P0001';
    END IF;

    IF v_er_last_for_pamelding THEN
        RAISE EXCEPTION 'Påmelding er låst for denne fellesturen.'
            USING ERRCODE = 'P0001';
    END IF;

    v_pris_lagret := NULL;

    IF p_status = 'bindende' THEN
        SELECT COUNT(*)
        INTO v_antall_bindende
        FROM public.pamelding p
        WHERE p.aktivitet_dato_id = p_aktivitet_dato_id
          AND p.pamelding_status = 'bindende'
          AND p.bruker_id <> p_bruker_id;

        IF v_maks_deltakere IS NOT NULL
           AND v_antall_bindende >= v_maks_deltakere THEN
            RAISE EXCEPTION 'Fellesturen er full. Maks deltakere er %.', v_maks_deltakere
                USING ERRCODE = 'P0001';
        END IF;

        IF EXISTS (
            SELECT 1
            FROM public.pamelding p
            JOIN public.aktivitet_dato eksisterende
              ON eksisterende.aktivitet_dato_id = p.aktivitet_dato_id
            JOIN public.aktivitet_dato ny
              ON ny.aktivitet_dato_id = p_aktivitet_dato_id
            WHERE p.bruker_id = p_bruker_id
              AND p.aktivitet_dato_id <> p_aktivitet_dato_id
              AND p.pamelding_status = 'bindende'
              AND eksisterende.aktivitet_start_dato < COALESCE(
                    ny.aktivitet_slutt_dato,
                    ny.aktivitet_start_dato + INTERVAL '1 day'
                  )
              AND COALESCE(
                    eksisterende.aktivitet_slutt_dato,
                    eksisterende.aktivitet_start_dato + INTERVAL '1 day'
                  ) > ny.aktivitet_start_dato
        ) THEN
            RAISE EXCEPTION 'Du har allerede en bindende påmelding som overlapper med denne datoen.'
                USING ERRCODE = '23505';
        END IF;

        SELECT
            CASE
                WHEN ap.rabatt_pris IS NOT NULL
                     AND ap.rabatt_frist IS NOT NULL
                     AND now() <= ap.rabatt_frist
                THEN ap.rabatt_pris
                ELSE ap.pris
            END
        INTO v_pris_lagret
        FROM public.aktivitet_pris ap
        WHERE ap.aktivitet_id = v_aktivitet_id;

        IF v_pris_lagret IS NULL THEN
            RAISE EXCEPTION 'Fant ingen pris for aktivitet %.', v_aktivitet_id
                USING ERRCODE = 'P0001';
        END IF;
    END IF;

    RETURN QUERY
    INSERT INTO public.pamelding AS p (
        bruker_id,
        aktivitet_dato_id,
        pamelding_status,
        pamelding_tidspunkt_pameldt,
        pris_lagret
    )
    VALUES (
        p_bruker_id,
        p_aktivitet_dato_id,
        p_status,
        now(),
        v_pris_lagret
    )
    ON CONFLICT ON CONSTRAINT uq_pamelding_bruker_aktivitet_dato
    DO UPDATE SET
        pamelding_status = EXCLUDED.pamelding_status,
        pamelding_tidspunkt_pameldt = now(),
        pris_lagret = CASE
    WHEN EXCLUDED.pamelding_status = 'bindende' THEN EXCLUDED.pris_lagret
    ELSE p.pris_lagret
END
    RETURNING
        p.bruker_id,
        p.aktivitet_dato_id,
        p.pamelding_status::text;

    IF p_status = 'bindende' AND v_maks_deltakere IS NOT NULL THEN
        SELECT COUNT(*)
        INTO v_antall_bindende
        FROM public.pamelding p
        WHERE p.aktivitet_dato_id = p_aktivitet_dato_id
          AND p.pamelding_status = 'bindende';

        IF v_antall_bindende >= v_maks_deltakere THEN
            PERFORM public.aktivitet_las_til_full_dato(p_aktivitet_dato_id);
        END IF;
    END IF;

    SELECT s.samtale_id
    INTO v_samtale_id
    FROM public.samtale s
    WHERE s.aktivitet_id = v_aktivitet_id;

    IF v_samtale_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1
            FROM public.gruppe_medlem gm
            WHERE gm.samtale_id = v_samtale_id
              AND gm.bruker_id = p_bruker_id
              AND gm.left_datetime IS NULL
        ) THEN
            PERFORM public.gruppe_medlem_legg_til(v_samtale_id, p_bruker_id);
        END IF;
    END IF;
END;
$function$



//Oppdater bilde samtykke til true eller false på en fellestur
CREATE OR REPLACE FUNCTION public.pamelding_sett_bilde_samtykke(p_bruker_id integer, p_aktivitet_dato_id integer, p_bilde_samtykke boolean)
 RETURNS TABLE(bruker_id integer, aktivitet_dato_id integer, bilde_samtykke boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    UPDATE pamelding p
    SET bilde_samtykke = p_bilde_samtykke
    WHERE p.bruker_id = p_bruker_id
      AND p.aktivitet_dato_id = p_aktivitet_dato_id
    RETURNING
        p.bruker_id,
        p.aktivitet_dato_id,
        p.bilde_samtykke;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Fant ingen påmelding for bruker % og dato %',
            p_bruker_id, p_aktivitet_dato_id;
    END IF;
END;
$function$


//Henter fellesturer som er markert som interessert eller bindende til en bruker
CREATE OR REPLACE FUNCTION public.fellestur_hent_mine(p_bruker_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_resultat jsonb;
BEGIN
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'aktivitet_id', a.aktivitet_id,
                'aktivitet_navn', a.aktivitet_tittel,
                'aktivitet_beskrivelse', a.aktivitet_beskrivelse,
                'pamelding_status', p.pamelding_status,
                'pamelding_dato_id', p.aktivitet_dato_id,
                'pamelding_start_dato', ad.aktivitet_start_dato,
                'pamelding_slutt_dato', ad.aktivitet_slutt_dato,
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
            )
            ORDER BY ad.aktivitet_start_dato
        ),
        '[]'::jsonb
    )
    INTO v_resultat
    FROM pamelding p
    JOIN aktivitet_dato ad
      ON ad.aktivitet_dato_id = p.aktivitet_dato_id
    JOIN aktivitet a
      ON a.aktivitet_id = ad.aktivitet_id
    WHERE p.bruker_id = p_bruker_id
      AND p.pamelding_status IN ('interessert', 'bindende');

    RETURN v_resultat;
END;
$function$



//Henter statusen til brukere på en fellestur
CREATE OR REPLACE FUNCTION public.pamelding_hent_for_fellestur(p_bruker_id integer, p_aktivitet_id integer)
 RETURNS TABLE(bruker_id integer, aktivitet_dato_id integer, pamelding_status text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.bruker_id,
        p.aktivitet_dato_id,
        p.pamelding_status::text
    FROM pamelding p
    JOIN aktivitet_dato ad
      ON ad.aktivitet_dato_id = p.aktivitet_dato_id
    WHERE p.bruker_id = p_bruker_id
      AND ad.aktivitet_id = p_aktivitet_id
      AND p.pamelding_status IN ('interessert', 'bindende')
    LIMIT 1;
END;
$function$


//henter statusen til brukere på en fellestur dato
CREATE OR REPLACE FUNCTION public.pamelding_hent_for_dato(p_bruker_id integer, p_aktivitet_dato_id integer)
 RETURNS TABLE(bruker_id integer, aktivitet_dato_id integer, pamelding_status text)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        p.bruker_id,
        p.aktivitet_dato_id,
        p.pamelding_status::text
    FROM pamelding p
    WHERE p.bruker_id = p_bruker_id
      AND p.aktivitet_dato_id = p_aktivitet_dato_id
    LIMIT 1;
END;
$function$


//Henter deltakere for en fellestur på en spesifikk dato
CREATE OR REPLACE FUNCTION public.fellestur_hent_deltakere_per_dato(p_aktivitet_id integer)
 RETURNS TABLE(aktivitet_dato_id integer, aktivitet_start_dato timestamp without time zone, aktivitet_slutt_dato timestamp without time zone, bindende integer, interessert integer)
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    SELECT
        ad.aktivitet_dato_id,
        ad.aktivitet_start_dato,
        ad.aktivitet_slutt_dato,
        COUNT(*) FILTER (WHERE p.pamelding_status = 'bindende')::int AS bindende,
        COUNT(*) FILTER (WHERE p.pamelding_status = 'interessert')::int AS interessert
    FROM aktivitet_dato ad
    LEFT JOIN pamelding p
      ON p.aktivitet_dato_id = ad.aktivitet_dato_id
     AND p.pamelding_status IN ('bindende', 'interessert')
    WHERE ad.aktivitet_id = p_aktivitet_id
    GROUP BY
        ad.aktivitet_dato_id,
        ad.aktivitet_start_dato,
        ad.aktivitet_slutt_dato
    ORDER BY ad.aktivitet_start_dato;
END;
$function$



// Låser eller åpner påmelding for alle datoer i en aktivitet
CREATE OR REPLACE FUNCTION public.aktivitet_sett_pamelding_last(p_aktivitet_id integer, p_er_last boolean)
 RETURNS TABLE(aktivitet_dato_id integer, er_last_for_pamelding boolean)
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM aktivitet a
        WHERE a.aktivitet_id = p_aktivitet_id
    ) THEN
        RAISE EXCEPTION 'Aktivitet % finnes ikke.', p_aktivitet_id
            USING ERRCODE = 'P0001';
    END IF;

    RETURN QUERY
    UPDATE aktivitet_dato ad
    SET er_last_for_pamelding = p_er_last
    WHERE ad.aktivitet_id = p_aktivitet_id
    RETURNING
        ad.aktivitet_dato_id,
        ad.er_last_for_pamelding;
END;
$function$


//Velger en dato på en fellestur, setter alle andre mulige datoer til avlyst
CREATE OR REPLACE FUNCTION public.aktivitet_dato_velg_fast_dato(p_aktivitet_dato_id integer)
 RETURNS TABLE(aktivitet_dato_id integer, aktivitet_id integer, aktivitet_dato_status aktivitet_dato_status_enum)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_aktivitet_id integer;
BEGIN
    SELECT ad.aktivitet_id
    INTO v_aktivitet_id
    FROM aktivitet_dato ad
    WHERE ad.aktivitet_dato_id = p_aktivitet_dato_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Aktivitetsdato % finnes ikke.', p_aktivitet_dato_id;
    END IF;

    UPDATE aktivitet_dato ad
    SET aktivitet_dato_status = 'avlyst'
    WHERE ad.aktivitet_id = v_aktivitet_id
      AND ad.aktivitet_dato_id <> p_aktivitet_dato_id;

    RETURN QUERY
    UPDATE aktivitet_dato ad
    SET aktivitet_dato_status = 'valgt'
    WHERE ad.aktivitet_dato_id = p_aktivitet_dato_id
    RETURNING
        ad.aktivitet_dato_id,
        ad.aktivitet_id,
        ad.aktivitet_dato_status;
END;
$function$


//Setter en bruker sin status til avmeldt
CREATE OR REPLACE FUNCTION public.pamelding_avmeld(p_bruker_id integer, p_aktivitet_dato_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE pamelding
    SET pamelding_status = 'avmeldt'
    WHERE bruker_id = p_bruker_id
      AND aktivitet_dato_id = p_aktivitet_dato_id;
END;
$function$


