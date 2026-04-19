//oppretter eller henter en eksiterende samtale mellom to brukere.
CREATE OR REPLACE FUNCTION public.samtale_direkte_hent_eller_opprett(p_bruker1_id integer, p_bruker2_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_samtale_id INTEGER;
BEGIN
    IF p_bruker1_id = p_bruker2_id THEN
        RAISE EXCEPTION 'En direkte samtale må ha to forskjellige brukere.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM bruker WHERE bruker_id = p_bruker1_id) THEN
        RAISE EXCEPTION 'Bruker % finnes ikke.', p_bruker1_id;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM bruker WHERE bruker_id = p_bruker2_id) THEN
        RAISE EXCEPTION 'Bruker % finnes ikke.', p_bruker2_id;
    END IF;

    SELECT s.samtale_id
    INTO v_samtale_id
    FROM samtale s
    JOIN gruppe_medlem gm
      ON gm.samtale_id = s.samtale_id
     AND gm.left_datetime IS NULL
    WHERE s.samtale_navn IS NULL
    GROUP BY s.samtale_id
    HAVING COUNT(*) = 2
       AND COUNT(*) FILTER (WHERE gm.bruker_id IN (p_bruker1_id, p_bruker2_id)) = 2
    LIMIT 1;

    IF v_samtale_id IS NOT NULL THEN
        RETURN v_samtale_id;
    END IF;

    RETURN Samtale_opprett(ARRAY[p_bruker1_id, p_bruker2_id], NULL);
END;
$function$


  //Henter meldinger for en samtale
CREATE OR REPLACE FUNCTION public.samtale_meldinger_hent(p_samtale_id integer, p_bruker_id integer)
 RETURNS TABLE(melding_id integer, fra_bruker integer, avsender_navn text, melding_tekst text, bilde_url text, sendt_datetime timestamp without time zone)
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_joined TIMESTAMP;
    v_left TIMESTAMP;
BEGIN
    SELECT joined_datetime, left_datetime
    INTO v_joined, v_left
    FROM gruppe_medlem
    WHERE samtale_id = p_samtale_id
      AND bruker_id = p_bruker_id
    ORDER BY joined_datetime DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Bruker % er ikke medlem i samtale %.', p_bruker_id, p_samtale_id;
    END IF;

    RETURN QUERY
    SELECT
        m.melding_id,
        m.fra_bruker,
        (b.bruker_navn || ' ' || b.bruker_etternavn)::text AS avsender_navn,
        m.melding_tekst::text,
        m.bilde_url::text,
        m.sendt_datetime
    FROM melding m
    JOIN bruker b
      ON b.bruker_id = m.fra_bruker
    WHERE m.samtale_id = p_samtale_id
      AND m.sendt_datetime >= v_joined
      AND (
            v_left IS NULL
            OR m.sendt_datetime <= v_left
          )
    ORDER BY m.sendt_datetime ASC, m.melding_id ASC;
END;
$function$


//forlater en gruppe samtale
CREATE OR REPLACE FUNCTION public.samtale_forlat(p_samtale_id integer, p_bruker_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_aktiv_samtale BOOLEAN;
    v_antall_aktive BIGINT;
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM samtale
        WHERE samtale_id = p_samtale_id
    ) THEN
        RAISE EXCEPTION 'Samtale % finnes ikke.', p_samtale_id;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM gruppe_medlem
        WHERE samtale_id = p_samtale_id
          AND bruker_id = p_bruker_id
          AND left_datetime IS NULL
    ) THEN
        RAISE EXCEPTION 'Bruker % er ikke aktiv i samtale %.', p_bruker_id, p_samtale_id;
    END IF;

    SELECT COUNT(*)
    INTO v_antall_aktive
    FROM gruppe_medlem
    WHERE samtale_id = p_samtale_id
      AND left_datetime IS NULL;

    IF v_antall_aktive < 3 THEN
        RAISE EXCEPTION 'Bruker kan ikke forlate en direkte samtale.';
    END IF;

    UPDATE gruppe_medlem
    SET left_datetime = NOW()
    WHERE gruppe_medlem_id = (
        SELECT gruppe_medlem_id
        FROM gruppe_medlem
        WHERE samtale_id = p_samtale_id
          AND bruker_id = p_bruker_id
          AND left_datetime IS NULL
        ORDER BY joined_datetime DESC
        LIMIT 1
    );

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Kunne ikke forlate samtalen.';
    END IF;
END;
$function$


//Oppdater en melding til lest
CREATE OR REPLACE FUNCTION public.samtale_sett_lest(p_samtale_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE public.melding
    SET er_lest = true
    WHERE samtale_id = p_samtale_id
      AND er_lest = false;
END;
$function$


