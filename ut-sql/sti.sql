//opprett sti
CREATE OR REPLACE FUNCTION public.sti_opprett(p_fylke_nummer text, p_kommune_nummer text, p_punkter jsonb)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_fylke_id integer;
  v_kommune_id integer;
  v_sti_id integer;
BEGIN
  SELECT f.fylke_id
  INTO v_fylke_id
  FROM fylke f
  WHERE f.fylke_nummer = p_fylke_nummer;

  IF v_fylke_id IS NULL THEN
    RAISE EXCEPTION 'Fant ikke fylke med fylke_nummer=%', p_fylke_nummer;
  END IF;

  SELECT k.kommune_id
  INTO v_kommune_id
  FROM kommune k
  WHERE k.kommune_nummer = p_kommune_nummer
    AND k.fylke_id = v_fylke_id;

  IF v_kommune_id IS NULL THEN
    RAISE EXCEPTION 'Fant ikke kommune med kommune_nummer=% i fylke_nummer=%',
      p_kommune_nummer, p_fylke_nummer;
  END IF;

  INSERT INTO sti (fylke_id, kommune_id)
  VALUES (v_fylke_id, v_kommune_id)
  RETURNING sti_id INTO v_sti_id;

  INSERT INTO sti_punkt (
    sti_id,
    lengdegrad,
    breddegrad,
    moh,
    rekkefolge
  )
  SELECT
    v_sti_id,
    (punkt ->> 'lengdegrad')::numeric,
    (punkt ->> 'breddegrad')::numeric,
    NULLIF(punkt ->> 'moh', '')::integer,
    ord::integer
  FROM jsonb_array_elements(p_punkter) WITH ORDINALITY AS t(punkt, ord);

  RETURN v_sti_id;
END;
$function$


//Hent sti for kartet
CREATE OR REPLACE FUNCTION public.sti_hent_kart()
 RETURNS TABLE(sti_id integer, fylke_navn character varying, kommune_navn character varying, punkter jsonb)
 LANGUAGE sql
AS $function$
  SELECT
    s.sti_id,
    f.fylke_navn,
    k.kommune_navn,
    COALESCE(
      (
        SELECT jsonb_agg(
          jsonb_build_object(
            'lengdegrad', sp.lengdegrad,
            'breddegrad', sp.breddegrad,
            'moh', sp.moh,
            'rekkefolge', sp.rekkefolge
          )
          ORDER BY sp.rekkefolge
        )
        FROM sti_punkt sp
        WHERE sp.sti_id = s.sti_id
      ),
      '[]'::jsonb
    ) AS punkter
  FROM sti s
  JOIN fylke f ON f.fylke_id = s.fylke_id
  JOIN kommune k ON k.kommune_id = s.kommune_id
  ORDER BY s.sti_id;
$function$


//slett en sti
CREATE OR REPLACE FUNCTION public.sti_slett(p_sti_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM sti WHERE sti_id = p_sti_id
  ) THEN
    RAISE EXCEPTION 'Sti med sti_id=% finnes ikke', p_sti_id;
  END IF;

  DELETE FROM sti_punkt
  WHERE sti_id = p_sti_id;


  DELETE FROM sti
  WHERE sti_id = p_sti_id;

END;
$function$
