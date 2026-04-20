//opprett turmaal
CREATE OR REPLACE FUNCTION public.turmaal_opprett_hel(p_fylke_nummer text, p_kommune_nummer text, p_turmaal_navn character varying, p_turmaal_breddegrad numeric, p_turmaal_lengdegrad numeric, p_turmaal_moh integer DEFAULT NULL::integer, p_turmaal_beskrivelse text DEFAULT NULL::text, p_informasjon_id integer DEFAULT NULL::integer, p_bilder jsonb DEFAULT '[]'::jsonb)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_fylke_id integer;
  v_kommune_id integer;
  v_turmaal_id integer;
BEGIN

  SELECT fylke_id
  INTO v_fylke_id
  FROM public.fylke
  WHERE fylke_nummer = p_fylke_nummer;

  IF v_fylke_id IS NULL THEN
    RAISE EXCEPTION 'Fant ikke fylke for fylke_nummer=%', p_fylke_nummer;
  END IF;

  SELECT kommune_id
  INTO v_kommune_id
  FROM public.kommune
  WHERE kommune_nummer = p_kommune_nummer
    AND fylke_id = v_fylke_id;

  IF v_kommune_id IS NULL THEN
    RAISE EXCEPTION
      'Fant ikke kommune for kommunenummer=% i fylke_nummer=%',
      p_kommune_nummer, p_fylke_nummer;
  END IF;

  INSERT INTO public.turmaal (
    fylke_id,
    kommune_id,
    turmaal_navn,
    turmaal_breddegrad,
    turmaal_lengdegrad,
    turmaal_moh,
    turmaal_beskrivelse
  )
  VALUES (
    v_fylke_id,
    v_kommune_id,
    p_turmaal_navn,
    p_turmaal_breddegrad,
    p_turmaal_lengdegrad,
    p_turmaal_moh,
    p_turmaal_beskrivelse
  )
  RETURNING turmaal_id INTO v_turmaal_id;

  IF p_informasjon_id IS NOT NULL THEN
    INSERT INTO public.turmaal_informasjon (turmaal_id, informasjon_id)
    VALUES (v_turmaal_id, p_informasjon_id);
  END IF;

  IF p_bilder IS NOT NULL AND jsonb_typeof(p_bilder) = 'array' THEN
    INSERT INTO public.turmaal_bilde (
      turmaal_id,
      turmaal_url,
      turmaal_rekkefolge
    )
    SELECT
      v_turmaal_id,
      value,
      ROW_NUMBER() OVER ()
    FROM jsonb_array_elements_text(p_bilder);
  END IF;

  RETURN v_turmaal_id;

END;
$function$


//Hent turmaal til kart
CREATE OR REPLACE FUNCTION public.turmaal_hent_kart()
 RETURNS TABLE(turmaal_id integer, navn text, fylke_navn text, kommune_navn text, breddegrad numeric, lengdegrad numeric, moh integer, type_sted text, hovedbilde_url text)
 LANGUAGE sql
 STABLE
AS $function$
SELECT
  t.turmaal_id,
  t.turmaal_navn::text AS navn,
  f.fylke_navn::text AS fylke_navn,
  k.kommune_navn::text AS kommune_navn,
  t.turmaal_breddegrad AS breddegrad,
  t.turmaal_lengdegrad AS lengdegrad,
  t.turmaal_moh AS moh,

  (
    SELECT i.informasjon_navn::text
    FROM public.turmaal_informasjon ti
    JOIN public.informasjon i ON i.informasjon_id = ti.informasjon_id
    JOIN public.kategori ka ON ka.kategori_id = i.kategori_id
    WHERE ti.turmaal_id = t.turmaal_id
      AND ka.kategori_navn = 'Type sted'
    ORDER BY i.informasjon_navn
    LIMIT 1
  ) AS type_sted,

  (
    SELECT tb.turmaal_url
    FROM public.turmaal_bilde tb
    WHERE tb.turmaal_id = t.turmaal_id
      AND tb.turmaal_rekkefolge = 1
    ORDER BY tb.turmaalbilde_id
    LIMIT 1
  ) AS hovedbilde_url

FROM public.turmaal t
JOIN public.fylke f ON f.fylke_id = t.fylke_id
JOIN public.kommune k ON k.kommune_id = t.kommune_id
WHERE t.turmaal_breddegrad IS NOT NULL
  AND t.turmaal_lengdegrad IS NOT NULL
ORDER BY t.turmaal_navn;
$function$




//Slett et turmaal
CREATE OR REPLACE FUNCTION public.turmaal_slett(p_turmaal_id integer)
 RETURNS boolean
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_deleted integer;
BEGIN
  DELETE FROM public.turmaal
  WHERE turmaal_id = p_turmaal_id;

  GET DIAGNOSTICS v_deleted = ROW_COUNT;

  RETURN v_deleted > 0;
END;
$function$
