//KI har spesielt hjulpe meg å sette opp et fleksibel godkjenning system for de ulike varslene vi har. Jeg ønsket en funksjon som kunne godkjenne rolle, hytte, booking og annonse forespørsel (varsel_oppgave_behandle).
  KI hjalp meg å utvide funksjonen fra å godkjenne en rolle forespørsel til å være dynamisk nok til å godkjenne flere typer varsel


//opretter en forespørsel for en ny rolle, legger til en pending request i tabellen rolle_forespørsel og sender et varsel til varsel tabellen om at en bruker ønsker tilgang til ny rolle
CREATE OR REPLACE FUNCTION public.bruker_rolle_foresporsel_opprett(p_bruker_id integer, p_rolle_id integer, p_mottaker_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_foresporsel_id INTEGER;
    v_type_id INTEGER;

    v_bruker_navn TEXT;
    v_bruker_etternavn TEXT;
    v_bruker_epost TEXT;
    v_rolle_navn TEXT;
BEGIN
    IF EXISTS (
        SELECT 1
        FROM public.bruker_rolle_foresporsel
        WHERE bruker_id = p_bruker_id
          AND rolle_id = p_rolle_id
          AND status = 'pending'
    ) THEN
        RAISE EXCEPTION 'Det finnes allerede en pending rolleforespørsel for bruker % og rolle %',
            p_bruker_id, p_rolle_id;
    END IF;
    SELECT
        b.bruker_navn,
        b.bruker_etternavn,
        b.bruker_epost
    INTO
        v_bruker_navn,
        v_bruker_etternavn,
        v_bruker_epost
    FROM public.bruker b
    WHERE b.bruker_id = p_bruker_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Fant ikke bruker med id %', p_bruker_id;
    END IF;

    SELECT
        r.rolle_navn
    INTO
        v_rolle_navn
    FROM public.rolle r
    WHERE r.rolle_id = p_rolle_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Fant ikke rolle med id %', p_rolle_id;
    END IF;
    INSERT INTO public.bruker_rolle_foresporsel (
        bruker_id,
        rolle_id,
        status,
        opprettet_tidspunkt,
        behandlet_tidspunkt
    )
    VALUES (
        p_bruker_id,
        p_rolle_id,
        'pending',
        NOW(),
        NULL
    )
    RETURNING foresporsel_id INTO v_foresporsel_id;

    SELECT type_id
    INTO v_type_id
    FROM public.varsel_type
    WHERE type_navn = 'rolle_foresporsel';

    IF v_type_id IS NULL THEN
        RAISE EXCEPTION 'Fant ikke varsel_type med type_navn = rolle_foresporsel';
    END IF;

    INSERT INTO public.varsel (
        mottaker_id,
        avsender_id,
        type_id,
        tittel,
        innhold,
        status,
        opprettet_tidspunkt,
        referanse_type,
        referanse_id
    )
    VALUES (
        p_mottaker_id,
        p_bruker_id,
        v_type_id,
        'Ny rolleforespørsel',
        'Bruker ' || v_bruker_navn || ' ' || v_bruker_etternavn || ' [' || v_bruker_epost || '] har sendt en forespørsel om å bli ' || v_rolle_navn,
        'ulest',
        NOW(),
        'bruker_rolle_foresporsel',
        v_foresporsel_id
    );

    RETURN v_foresporsel_id;
END;
$function$


//Henter alle typer varsler en bruker har
CREATE OR REPLACE FUNCTION public.varsel_hent_alle(p_bruker_id integer)
 RETURNS TABLE(varsel_id integer, mottaker_id integer, mottaker_navn text, avsender_id integer, avsender_navn text, type_navn text, varsel_kategori varsel_kategori_enum, tittel text, innhold text, status varsel_status_enum, foresporsel_status foresporsel_status_enum, opprettet_tidspunkt timestamp without time zone, referanse_type text, referanse_id integer, relatert_id integer)
 LANGUAGE sql
AS $function$
    SELECT
        v.varsel_id,

        v.mottaker_id,
        (bm.bruker_navn || ' ' || bm.bruker_etternavn)::text AS mottaker_navn,

        v.avsender_id,
        CASE
            WHEN ba.bruker_id IS NOT NULL
                THEN (ba.bruker_navn || ' ' || ba.bruker_etternavn)::text
            ELSE NULL::text
        END AS avsender_navn,

        vt.type_navn,
        vt.varsel_kategori,

        v.tittel,
        v.innhold,
        v.status,

        CASE
            WHEN v.referanse_type = 'bruker_rolle_foresporsel'
                THEN brf.status::foresporsel_status_enum
            WHEN v.referanse_type = 'hytteeier_foresporsel'
                THEN hf.status::foresporsel_status_enum
            WHEN v.referanse_type = 'annonse_foresporsel'
                THEN af.status::foresporsel_status_enum
            WHEN v.referanse_type = 'hytteeier_booking'
                THEN hb.status::foresporsel_status_enum
            ELSE NULL::foresporsel_status_enum
        END AS foresporsel_status,

        v.opprettet_tidspunkt,
        v.referanse_type,
        v.referanse_id,

        CASE
            WHEN v.referanse_type = 'annonse_foresporsel'
                THEN af.annonse_id
            WHEN v.referanse_type = 'hytteeier_foresporsel'
                THEN hf.hytte_id
            WHEN v.referanse_type = 'hytteeier_booking'
                THEN hb.hytte_id
            WHEN v.referanse_type = 'bruker_rolle_foresporsel'
                THEN brf.rolle_id
            ELSE NULL::integer
        END AS relatert_id

    FROM public.varsel v
    JOIN public.varsel_type vt
        ON vt.type_id = v.type_id
    JOIN public.bruker bm
        ON bm.bruker_id = v.mottaker_id
    LEFT JOIN public.bruker ba
        ON ba.bruker_id = v.avsender_id

    LEFT JOIN public.bruker_rolle_foresporsel brf
        ON v.referanse_type = 'bruker_rolle_foresporsel'
       AND v.referanse_id = brf.foresporsel_id

    LEFT JOIN public.hytteeier_foresporsel hf
        ON v.referanse_type = 'hytteeier_foresporsel'
       AND v.referanse_id = hf.foresporsel_id

    LEFT JOIN public.annonse_foresporsel af
        ON v.referanse_type = 'annonse_foresporsel'
       AND v.referanse_id = af.foresporsel_id

    LEFT JOIN public.hytteeier_booking hb
        ON v.referanse_type = 'hytteeier_booking'
       AND v.referanse_id = hb.booking_id

    WHERE v.mottaker_id = p_bruker_id
    ORDER BY v.opprettet_tidspunkt DESC;
$function$



//setter et varsel til lest
CREATE OR REPLACE FUNCTION public.varsel_sett_lest(p_varsel_id integer, p_bruker_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_rows_updated INTEGER;
BEGIN
    UPDATE public.varsel
    SET status = 'lest'
    WHERE varsel_id = p_varsel_id
      AND mottaker_id = p_bruker_id
      AND status = 'ulest';

    GET DIAGNOSTICS v_rows_updated = ROW_COUNT;

    IF v_rows_updated = 0 THEN
        RETURN false;
    END IF;

    RETURN true;
END;
$function$



//Brukes til å godkjenne et varsel, om det er Rolle, hytte, booking eller annonse forespørsel kan den godkjenne alle
CREATE OR REPLACE FUNCTION public.varsel_oppgave_behandle(p_varsel_id integer, p_godkjent boolean)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_referanse_type TEXT;
    v_referanse_id INTEGER;
    v_varsel_status TEXT;

    v_bruker_id INTEGER;
    v_rolle_id INTEGER;
    v_foresporsel_status TEXT;

    v_hytte_foresporsel_status TEXT;
    v_annonse_foresporsel_status TEXT;
    v_hytteeier_booking_status TEXT;
BEGIN
    SELECT
        referanse_type,
        referanse_id,
        status::TEXT
    INTO
        v_referanse_type,
        v_referanse_id,
        v_varsel_status
    FROM public.varsel
    WHERE varsel_id = p_varsel_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Varsel med id % finnes ikke', p_varsel_id;
    END IF;

    IF v_referanse_type = 'bruker_rolle_foresporsel' THEN

        IF v_varsel_status = 'behandlet' THEN
            RAISE EXCEPTION 'Varsel % er allerede behandlet', p_varsel_id;
        END IF;

        SELECT
            bruker_id,
            rolle_id,
            status::TEXT
        INTO
            v_bruker_id,
            v_rolle_id,
            v_foresporsel_status
        FROM public.bruker_rolle_foresporsel
        WHERE foresporsel_id = v_referanse_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Rolleforespørsel med id % finnes ikke', v_referanse_id;
        END IF;

        IF v_foresporsel_status <> 'pending' THEN
            RAISE EXCEPTION 'Rolleforespørsel % er allerede behandlet', v_referanse_id;
        END IF;

        IF p_godkjent THEN
            UPDATE public.bruker_rolle_foresporsel
            SET
                status = 'godkjent',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;

            INSERT INTO public.bruker_rolle (bruker_id, rolle_id)
            SELECT v_bruker_id, v_rolle_id
            WHERE NOT EXISTS (
                SELECT 1
                FROM public.bruker_rolle
                WHERE bruker_id = v_bruker_id
                  AND rolle_id = v_rolle_id
            );
        ELSE
            UPDATE public.bruker_rolle_foresporsel
            SET
                status = 'avslatt',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;
        END IF;

        PERFORM public.varsel_info_opprett_for_rolleforesporsel(
            v_referanse_id,
            p_godkjent
        );

        UPDATE public.varsel
        SET status = 'behandlet'
        WHERE varsel_id = p_varsel_id;

    ELSIF v_referanse_type = 'hytteeier_foresporsel' THEN

        SELECT
            status::TEXT
        INTO
            v_hytte_foresporsel_status
        FROM public.hytteeier_foresporsel
        WHERE foresporsel_id = v_referanse_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Hytteeier-forespørsel med id % finnes ikke', v_referanse_id;
        END IF;

        IF p_godkjent THEN
            UPDATE public.hytteeier_foresporsel
            SET
                status = 'godkjent',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;
        ELSE
            UPDATE public.hytteeier_foresporsel
            SET
                status = 'avslatt',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;
        END IF;

        PERFORM public.varsel_info_opprett_for_hytteeier_foresporsel(
            v_referanse_id,
            p_godkjent
        );

        UPDATE public.varsel
        SET status = 'behandlet'
        WHERE varsel_id = p_varsel_id;

    ELSIF v_referanse_type = 'hytteeier_booking' THEN

        IF v_varsel_status = 'behandlet' THEN
            RAISE EXCEPTION 'Varsel % er allerede behandlet', p_varsel_id;
        END IF;

        SELECT
            status::TEXT
        INTO
            v_hytteeier_booking_status
        FROM public.hytteeier_booking
        WHERE booking_id = v_referanse_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Hytteeier-booking med id % finnes ikke', v_referanse_id;
        END IF;

        IF v_hytteeier_booking_status <> 'pending' THEN
            RAISE EXCEPTION 'Hytteeier-booking % er allerede behandlet', v_referanse_id;
        END IF;

        IF p_godkjent THEN
            UPDATE public.hytteeier_booking
            SET
                status = 'godkjent',
                behandlet_tidspunkt = NOW()
            WHERE booking_id = v_referanse_id;
        ELSE
            UPDATE public.hytteeier_booking
            SET
                status = 'avslatt',
                behandlet_tidspunkt = NOW()
            WHERE booking_id = v_referanse_id;
        END IF;

        UPDATE public.varsel
        SET status = 'behandlet'
        WHERE varsel_id = p_varsel_id;

    ELSIF v_referanse_type = 'annonse_foresporsel' THEN

        IF v_varsel_status = 'behandlet' THEN
            RAISE EXCEPTION 'Varsel % er allerede behandlet', p_varsel_id;
        END IF;

        SELECT
            status::TEXT
        INTO
            v_annonse_foresporsel_status
        FROM public.annonse_foresporsel
        WHERE foresporsel_id = v_referanse_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Annonseforespørsel med id % finnes ikke', v_referanse_id;
        END IF;

        IF v_annonse_foresporsel_status <> 'pending' THEN
            RAISE EXCEPTION 'Annonseforespørsel % er allerede behandlet', v_referanse_id;
        END IF;

        IF p_godkjent THEN
            UPDATE public.annonse_foresporsel
            SET
                status = 'godkjent',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;

            UPDATE public.annonse
            SET status = 'aktiv'
            WHERE annonse_id = (
                SELECT annonse_id
                FROM public.annonse_foresporsel
                WHERE foresporsel_id = v_referanse_id
            );
        ELSE
            UPDATE public.annonse_foresporsel
            SET
                status = 'avslatt',
                behandlet_tidspunkt = NOW()
            WHERE foresporsel_id = v_referanse_id;

            UPDATE public.annonse
            SET status = 'inaktiv'
            WHERE annonse_id = (
                SELECT annonse_id
                FROM public.annonse_foresporsel
                WHERE foresporsel_id = v_referanse_id
            );
        END IF;

        UPDATE public.varsel
        SET status = 'behandlet'
        WHERE varsel_id = p_varsel_id;

    ELSIF v_referanse_type = 'hytte_foresporsel' THEN
        RAISE EXCEPTION 'referanse_type % er ikke implementert ennå', v_referanse_type;

    ELSE
        RAISE EXCEPTION 'Ukjent referanse_type: %', v_referanse_type;
    END IF;
END;
$function$


//slett et varsel
CREATE OR REPLACE FUNCTION public.varsel_slett(p_varsel_id integer, p_bruker_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.varsel
        WHERE varsel_id = p_varsel_id
          AND mottaker_id = p_bruker_id
    ) THEN
        RAISE EXCEPTION 'Varsel finnes ikke eller tilhører ikke bruker';
    END IF;

    DELETE FROM public.varsel
    WHERE varsel_id = p_varsel_id;
END;
$function$

