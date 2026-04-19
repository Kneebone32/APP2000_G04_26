
//Opprett artikkel
CREATE OR REPLACE FUNCTION public.artikkel_opprett(p_artikkel_slug text, p_artikkel_tittel text, p_artikkel_innhold text)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
    v_artikkel_id integer;
BEGIN
    IF p_artikkel_slug IS NULL OR trim(p_artikkel_slug) = '' THEN
        RAISE EXCEPTION 'artikkel_slug må fylles ut';
    END IF;

    IF p_artikkel_tittel IS NULL OR trim(p_artikkel_tittel) = '' THEN
        RAISE EXCEPTION 'artikkel_tittel må fylles ut';
    END IF;

    IF p_artikkel_innhold IS NULL OR trim(p_artikkel_innhold) = '' THEN
        RAISE EXCEPTION 'artikkel_innhold må fylles ut';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.artikkel
        WHERE artikkel_slug = p_artikkel_slug
    ) THEN
        RAISE EXCEPTION 'Det finnes allerede en artikkel med slug %', p_artikkel_slug;
    END IF;

    INSERT INTO public.artikkel (
        artikkel_slug,
        artikkel_tittel,
        artikkel_innhold
    )
    VALUES (
        trim(p_artikkel_slug),
        trim(p_artikkel_tittel),
        p_artikkel_innhold
    )
    RETURNING artikkel_id INTO v_artikkel_id;

    RETURN v_artikkel_id;
END;
$function$


//Hent alle artikler
CREATE OR REPLACE FUNCTION public.artikkel_hent_alle()
 RETURNS TABLE(artikkel_id integer, artikkel_slug text, artikkel_tittel text, artikkel_innhold text, opprettet_tidspunkt timestamp without time zone, oppdatert_tidspunkt timestamp without time zone)
 LANGUAGE sql
AS $function$
    SELECT
        a.artikkel_id,
        a.artikkel_slug,
        a.artikkel_tittel,
        a.artikkel_innhold,
        a.opprettet_tidspunkt,
        a.oppdatert_tidspunkt
    FROM public.artikkel a
    ORDER BY a.opprettet_tidspunkt DESC, a.artikkel_id DESC;
$function$


//Hent en spesifikk artikkel
CREATE OR REPLACE FUNCTION public.artikkel_hent(p_artikkel_id integer)
 RETURNS TABLE(artikkel_id integer, artikkel_slug text, artikkel_tittel text, artikkel_innhold text, opprettet_tidspunkt timestamp without time zone, oppdatert_tidspunkt timestamp without time zone)
 LANGUAGE sql
AS $function$
    SELECT
        a.artikkel_id,
        a.artikkel_slug,
        a.artikkel_tittel,
        a.artikkel_innhold,
        a.opprettet_tidspunkt,
        a.oppdatert_tidspunkt
    FROM public.artikkel a
    WHERE a.artikkel_id = p_artikkel_id;
$function$


//Hent en spesifikk slug
CREATE OR REPLACE FUNCTION public.artikkel_hent_slug(p_artikkel_slug text)
 RETURNS TABLE(artikkel_id integer, artikkel_slug text, artikkel_tittel text, artikkel_innhold text, opprettet_tidspunkt timestamp without time zone, oppdatert_tidspunkt timestamp without time zone)
 LANGUAGE sql
AS $function$
    SELECT
        a.artikkel_id,
        a.artikkel_slug,
        a.artikkel_tittel,
        a.artikkel_innhold,
        a.opprettet_tidspunkt,
        a.oppdatert_tidspunkt
    FROM public.artikkel a
    WHERE a.artikkel_slug = p_artikkel_slug;
$function$


//Oppdater en artikkel
CREATE OR REPLACE FUNCTION public.artikkel_oppdater(p_artikkel_id integer, p_artikkel_slug text, p_artikkel_tittel text, p_artikkel_innhold text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.artikkel
        WHERE artikkel_id = p_artikkel_id
    ) THEN
        RAISE EXCEPTION 'Artikkel med id % finnes ikke', p_artikkel_id;
    END IF;

    IF p_artikkel_slug IS NULL OR trim(p_artikkel_slug) = '' THEN
        RAISE EXCEPTION 'artikkel_slug må fylles ut';
    END IF;

    IF p_artikkel_tittel IS NULL OR trim(p_artikkel_tittel) = '' THEN
        RAISE EXCEPTION 'artikkel_tittel må fylles ut';
    END IF;

    IF p_artikkel_innhold IS NULL OR trim(p_artikkel_innhold) = '' THEN
        RAISE EXCEPTION 'artikkel_innhold må fylles ut';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM public.artikkel
        WHERE artikkel_slug = p_artikkel_slug
          AND artikkel_id <> p_artikkel_id
    ) THEN
        RAISE EXCEPTION 'Det finnes allerede en annen artikkel med slug %', p_artikkel_slug;
    END IF;

    UPDATE public.artikkel
    SET
        artikkel_slug = trim(p_artikkel_slug),
        artikkel_tittel = trim(p_artikkel_tittel),
        artikkel_innhold = p_artikkel_innhold,
        oppdatert_tidspunkt = NOW()
    WHERE artikkel_id = p_artikkel_id;
END;
$function$


//Slett en artikkel
CREATE OR REPLACE FUNCTION public.artikkel_slett(p_artikkel_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM public.artikkel
        WHERE artikkel_id = p_artikkel_id
    ) THEN
        RAISE EXCEPTION 'Artikkel med id % finnes ikke', p_artikkel_id;
    END IF;

    DELETE FROM public.artikkel
    WHERE artikkel_id = p_artikkel_id;
END;
$function$

