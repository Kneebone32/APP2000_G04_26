// I denne filen har vi funskjoner som oppretter, henter og sletter en annonse + funksjoner som registerer klikk og visning på en annonse.


//opprett en annonse

CREATE OR REPLACE FUNCTION public.annonse_opprett(p_bruker_id integer, p_mottaker_id integer, p_annonse_navn text, p_tittel text, p_beskrivelse text, p_bilde_url text, p_sokeord text[], p_start_dato date, p_slutt_dato date)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_annonse_id integer;
    v_ugyldige_sokeord text[];
BEGIN
    IF p_slutt_dato < p_start_dato THEN
        RAISE EXCEPTION 'slutt_dato kan ikke være før start_dato';
    END IF;

    SELECT ARRAY(
        SELECT so
        FROM unnest(p_sokeord) AS so
        WHERE NOT EXISTS (
            SELECT 1
            FROM annonse_sokeord s
            WHERE s.navn = so
        )
    )
    INTO v_ugyldige_sokeord;

    IF array_length(v_ugyldige_sokeord, 1) IS NOT NULL THEN
        RAISE EXCEPTION 'Ugyldige søkeord: %', array_to_string(v_ugyldige_sokeord, ', ');
    END IF;

    INSERT INTO annonse (
        bruker_id,
        annonse_navn,
        tittel,
        beskrivelse,
        bilde_url,
        start_dato,
        slutt_dato,
        status
    )
    VALUES (
        p_bruker_id,
        p_annonse_navn,
        p_tittel,
        p_beskrivelse,
        p_bilde_url,
        p_start_dato,
        p_slutt_dato,
        'inaktiv'
    )
    RETURNING annonse_id
    INTO v_annonse_id;

    INSERT INTO annonse_statistikk (
        annonse_id,
        visninger,
        klikk
    )
    VALUES (
        v_annonse_id,
        0,
        0
    );

    INSERT INTO annonse_sokeord_kobling (
        annonse_id,
        sokeord_id
    )
    SELECT
        v_annonse_id,
        s.sokeord_id
    FROM annonse_sokeord s
    WHERE s.navn = ANY(p_sokeord);

    PERFORM public.annonse_foresporsel_opprett(
        v_annonse_id,
        p_bruker_id,
        p_mottaker_id
    );

    RETURN v_annonse_id;
END;
$function$


// Hent alle annonser inkludert statistikk som visning og klikk

CREATE OR REPLACE FUNCTION public.annonse_hent_alle()
 RETURNS TABLE(annonse_id integer, bruker_id integer, annonse_navn text, tittel text, beskrivelse text, bilde_url text, sokeord text[], start_dato timestamp without time zone, slutt_dato timestamp without time zone, status annonse_status_enum, opprettet_dato timestamp without time zone, visninger integer, klikk integer)
 LANGUAGE sql
AS $function$
    SELECT
        a.annonse_id,
        a.bruker_id,
        a.annonse_navn,
        a.tittel,
        a.beskrivelse,
        a.bilde_url,

        COALESCE(
            ARRAY_AGG(DISTINCT s.navn) FILTER (WHERE s.navn IS NOT NULL),
            '{}'
        ) AS sokeord,

        a.start_dato,
        a.slutt_dato,
        a.status,
        a.opprettet_dato,

        COALESCE(st.visninger, 0) AS visninger,
        COALESCE(st.klikk, 0) AS klikk

    FROM annonse a
    LEFT JOIN annonse_statistikk st
        ON st.annonse_id = a.annonse_id
    LEFT JOIN annonse_sokeord_kobling ask
        ON ask.annonse_id = a.annonse_id
    LEFT JOIN annonse_sokeord s
        ON s.sokeord_id = ask.sokeord_id

    GROUP BY
        a.annonse_id,
        a.bruker_id,
        a.annonse_navn,
        a.tittel,
        a.beskrivelse,
        a.bilde_url,
        a.start_dato,
        a.slutt_dato,
        a.status,
        a.opprettet_dato,
        st.visninger,
        st.klikk

    ORDER BY a.opprettet_dato DESC;
$function$


// slett en annonse

CREATE OR REPLACE FUNCTION public.annonse_slett(p_annonse_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    DELETE FROM annonse
    WHERE annonse_id = p_annonse_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Annonse % finnes ikke.', p_annonse_id
            USING ERRCODE = 'P0001';
    END IF;
END;
$function$



// Registere visning på en annonse

CREATE OR REPLACE FUNCTION public.annonse_registrer_visning(p_annonse_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE annonse_statistikk
    SET visninger = visninger + 1
    WHERE annonse_id = p_annonse_id;
END;
$function$

// Registere klikk på en annonse

CREATE OR REPLACE FUNCTION public.annonse_registrer_klikk(p_annonse_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE annonse_statistikk
    SET klikk = klikk + 1
    WHERE annonse_id = p_annonse_id;
END;
$function$
