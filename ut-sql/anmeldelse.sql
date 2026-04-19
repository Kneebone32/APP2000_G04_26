// I denne filen ligger det funksjoner som vi bruker til å opprette, hente og slette anmeldelser for tur,hytte og turmaal. 



//oppretter anmeldelser for tur, hytte og turmaal

CREATE OR REPLACE FUNCTION public.anmeldelse_tur_opprett(p_bruker_id integer, p_tur_id integer, p_rating integer, p_anmeldelse text)
 RETURNS SETOF anmeldelse_tur
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO anmeldelse_tur (
        bruker_id,
        tur_id,
        rating,
        anmeldelse
    )
    VALUES (
        p_bruker_id,
        p_tur_id,
        p_rating,
        p_anmeldelse
    )
    RETURNING *;
END;
$function$


CREATE OR REPLACE FUNCTION public.anmeldelse_hytte_opprett(p_bruker_id integer, p_hytte_id integer, p_rating integer, p_anmeldelse text)
 RETURNS SETOF anmeldelse_hytte
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO anmeldelse_hytte (
        bruker_id,
        hytte_id,
        hytte_rating,
        hytte_anmeldelse
    )
    VALUES (
        p_bruker_id,
        p_hytte_id,
        p_rating,
        p_anmeldelse
    )
    RETURNING *;
END;
$function$


CREATE OR REPLACE FUNCTION public.anmeldelse_turmaal_opprett(p_bruker_id integer, p_turmaal_id integer, p_rating integer, p_anmeldelse text)
 RETURNS SETOF anmeldelse_turmaal
 LANGUAGE plpgsql
AS $function$
BEGIN
    RETURN QUERY
    INSERT INTO anmeldelse_turmaal (
        bruker_id,
        turmaal_id,
        turmaal_rating,
        turmaal_anmeldelse
    )
    VALUES (
        p_bruker_id,
        p_turmaal_id,
        p_rating,
        p_anmeldelse
    )
    RETURNING *;
END;
$function$




// Henter anmeldelse til en bruker for en spesifikk tur, hytte og turmaal

CREATE OR REPLACE FUNCTION public.anmeldelse_tur_hent_for_tur(p_tur_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_resultat jsonb;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'bruker_id', b.bruker_id,
        'bruker_navn', b.bruker_navn,
        'bruker_etternavn', b.bruker_etternavn,
        'tur_id', at.tur_id,
        'rating', at.rating,
        'anmeldelse', at.anmeldelse,
        'opprettet_tidspunkt', at.opprettet_tidspunkt
      )
      ORDER BY at.opprettet_tidspunkt DESC
    ),
    '[]'::jsonb
  )
  INTO v_resultat
  FROM anmeldelse_tur at
  JOIN bruker b ON b.bruker_id = at.bruker_id
  WHERE at.tur_id = p_tur_id;

  RETURN v_resultat;
END;
$function$

CREATE OR REPLACE FUNCTION public.anmeldelse_hytte_hent_for_hytte(p_hytte_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_resultat jsonb;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'bruker_id', b.bruker_id,
        'bruker_navn', b.bruker_navn,
        'bruker_etternavn', b.bruker_etternavn,
        'hytte_id', ah.hytte_id,
        'hytte_rating', ah.hytte_rating,
        'hytte_anmeldelse', ah.hytte_anmeldelse,
        'hytte_opprettet_tidspunkt', ah.hytte_opprettet_tidspunkt
      )
      ORDER BY ah.hytte_opprettet_tidspunkt DESC
    ),
    '[]'::jsonb
  )
  INTO v_resultat
  FROM anmeldelse_hytte ah
  JOIN bruker b ON b.bruker_id = ah.bruker_id
  WHERE ah.hytte_id = p_hytte_id;

  RETURN v_resultat;
END;
$function$


CREATE OR REPLACE FUNCTION public.anmeldelse_turmaal_hent_for_turmaal(p_turmaal_id integer)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_resultat jsonb;
BEGIN
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'bruker_id', b.bruker_id,
        'bruker_navn', b.bruker_navn,
        'bruker_etternavn', b.bruker_etternavn,
        'turmaal_id', at.turmaal_id,
        'turmaal_rating', at.turmaal_rating,
        'turmaal_anmeldelse', at.turmaal_anmeldelse,
        'turmaal_opprettet_tidspunkt', at.turmaal_opprettet_tidspunkt
      )
      ORDER BY at.turmaal_opprettet_tidspunkt DESC
    ),
    '[]'::jsonb
  )
  INTO v_resultat
  FROM anmeldelse_turmaal at
  JOIN bruker b ON b.bruker_id = at.bruker_id
  WHERE at.turmaal_id = p_turmaal_id;

  RETURN v_resultat;
END;
$function$



//Sletter en anmeldelse for tur, hytte og turmaal

CREATE OR REPLACE FUNCTION public.anmeldelse_tur_slett(p_bruker_id integer, p_tur_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM anmeldelse_tur
  WHERE bruker_id = p_bruker_id
    AND tur_id = p_tur_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Anmeldelse for bruker_id=% og tur_id=% finnes ikke', p_bruker_id, p_tur_id;
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.anmeldelse_hytte_slett(p_bruker_id integer, p_hytte_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM anmeldelse_hytte
  WHERE bruker_id = p_bruker_id
    AND hytte_id = p_hytte_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Anmeldelse for bruker_id=% og hytte_id=% finnes ikke', p_bruker_id, p_hytte_id;
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.anmeldelse_turmaal_slett(p_bruker_id integer, p_turmaal_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM anmeldelse_turmaal
  WHERE bruker_id = p_bruker_id
    AND turmaal_id = p_turmaal_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Anmeldelse for bruker_id=% og turmaal_id=% finnes ikke', p_bruker_id, p_turmaal_id;
  END IF;
END;
$function$
