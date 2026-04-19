//opprett en hytte
CREATE OR REPLACE FUNCTION public.hytte_opprett_hel(p_fylke_nummer text, p_kommune_nummer text, p_hytte_navn text, p_hytte_omrade text, p_hytte_beskrivelse text, p_hytte_sengeplasser integer, p_hytte_pris numeric, p_hytte_breddegrad numeric, p_hytte_lengdegrad numeric, p_hytte_betjeningsgrad betjeningsgrad_enum, p_hytte_moh numeric, p_informasjon_ids jsonb, p_bilder jsonb)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_fylke_id integer;
  v_kommune_id integer;
  v_hytte_id integer;
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
    RAISE EXCEPTION 'Fant ikke kommune for kommunenummer=% i fylke_nummer=%',
      p_kommune_nummer, p_fylke_nummer;
  END IF;

  INSERT INTO public.hytte (
    hytte_navn,
    hytte_omrade,
    hytte_beskrivelse,
    hytte_sengeplasser,
    hytte_pris,
    fylke_id,
    kommune_id,
    hytte_breddegrad,
    hytte_lengdegrad,
    hytte_moh,
    hytte_betjeningsgrad
  )
  VALUES (
    p_hytte_navn,
    p_hytte_omrade,
    p_hytte_beskrivelse,
    p_hytte_sengeplasser,
    p_hytte_pris,
    v_fylke_id,
    v_kommune_id,
    p_hytte_breddegrad,
    p_hytte_lengdegrad,
    p_hytte_moh,
    p_hytte_betjeningsgrad
  )
  RETURNING hytte_id INTO v_hytte_id;

  IF p_informasjon_ids IS NOT NULL THEN
    INSERT INTO public.hytte_informasjon (hytte_id, informasjon_id)
    SELECT v_hytte_id, value::integer
    FROM jsonb_array_elements_text(p_informasjon_ids);
  END IF;

  IF p_bilder IS NOT NULL THEN
    INSERT INTO public.hytte_bilde (
      hytte_id,
      hytte_url,
      hytte_rekkefolge
    )
    SELECT
      v_hytte_id,
      value,
      ROW_NUMBER() OVER ()
    FROM jsonb_array_elements_text(p_bilder);
  END IF;

  RETURN v_hytte_id;
END;
$function$


//Hent hytte eier
CREATE OR REPLACE FUNCTION public.hytte_hent_for_eier(p_bruker_id integer)
 RETURNS TABLE(hytte_id integer)
 LANGUAGE sql
AS $function$
    SELECT hytte_id
    FROM public.hytte_eier
    WHERE bruker_id = p_bruker_id;
$function$


//Hent hytte til bruk for kartet
CREATE OR REPLACE FUNCTION public.hytte_hent_kart()
 RETURNS TABLE(hytte_id integer, navn text, pris numeric, sengeplasser integer, betjeningsgrad betjeningsgrad_enum, breddegrad numeric, lengdegrad numeric, fylke_navn text, kommune_navn text, fasiliteter jsonb, hovedbilde_url text)
 LANGUAGE sql
 STABLE
AS $function$
SELECT
  h.hytte_id,
  h.hytte_navn::text AS navn,
  h.hytte_pris AS pris,
  h.hytte_sengeplasser,
  h.hytte_betjeningsgrad,
  h.hytte_breddegrad AS breddegrad,
  h.hytte_lengdegrad AS lengdegrad,

  f.fylke_navn::text AS fylke_navn,
  k.kommune_navn::text AS kommune_navn,

  COALESCE((
    SELECT jsonb_build_object(
      'kategori_navn', 'Fasilitet',
      'verdier', COALESCE(
        jsonb_agg(i.informasjon_navn ORDER BY i.informasjon_navn),
        '[]'::jsonb
      )
    )
    FROM public.hytte_informasjon hi
    JOIN public.informasjon i ON i.informasjon_id = hi.informasjon_id
    JOIN public.kategori ka ON ka.kategori_id = i.kategori_id
    WHERE hi.hytte_id = h.hytte_id
      AND ka.kategori_navn = 'Fasilitet'
  ), jsonb_build_object('kategori_navn','Fasilitet','verdier','[]'::jsonb)) AS fasiliteter,

  (
    SELECT hb.hytte_url
    FROM public.hytte_bilde hb
    WHERE hb.hytte_id = h.hytte_id
      AND hb.hytte_rekkefolge = 1
    ORDER BY hb.hyttebilde_id
    LIMIT 1
  ) AS hovedbilde_url

FROM public.hytte h
JOIN public.fylke f ON f.fylke_id = h.fylke_id
JOIN public.kommune k ON k.kommune_id = h.kommune_id
WHERE h.hytte_breddegrad IS NOT NULL
  AND h.hytte_lengdegrad IS NOT NULL;
$function$


//Hent hytte informasjon som brukes til hyttekort
CREATE OR REPLACE FUNCTION public.hytte_hent_kort(p_limit integer DEFAULT 100, p_offset integer DEFAULT 0)
 RETURNS TABLE(id integer, navn text, sengeplasser integer, fylke_navn text, kommune_navn text, pris numeric, hovedbilde_url text)
 LANGUAGE sql
AS $function$
SELECT
    h.hytte_id AS id,
    h.hytte_navn AS navn,
    h.hytte_sengeplasser AS sengeplasser,
    f.fylke_navn,
    k.kommune_navn,
    h.hytte_pris AS pris,

    hb.hytte_url AS hovedbilde_url

FROM public.hytte h
JOIN public.fylke f ON f.fylke_id = h.fylke_id
JOIN public.kommune k ON k.kommune_id = h.kommune_id

LEFT JOIN LATERAL (
    SELECT b.hytte_url
    FROM public.hytte_bilde b
    WHERE b.hytte_id = h.hytte_id
    ORDER BY (b.hytte_rekkefolge = 1) DESC,
             b.hytte_rekkefolge ASC
    LIMIT 1
) hb ON true

ORDER BY h.hytte_id
LIMIT p_limit OFFSET p_offset;
$function$


//Hent all hytte informasjon til detaljie siden for en spesifikk hytte
CREATE OR REPLACE FUNCTION public.hytte_hent_detalj(p_hytte_id integer)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT jsonb_build_object(
  'id', h.hytte_id,
  'navn', h.hytte_navn,
  'omrade', h.hytte_omrade,
  'beskrivelse', h.hytte_beskrivelse,
  'sengeplasser', h.hytte_sengeplasser,
  'pris', h.hytte_pris,
  'betjeningsgrad', h.hytte_betjeningsgrad,

  'fylke', f.fylke_navn,
  'kommune', k.kommune_navn,

  'koordinater', jsonb_build_object(
      'breddegrad', h.hytte_breddegrad,
      'lengdegrad', h.hytte_lengdegrad,
      'moh', h.hytte_moh
  ),

  'bilder', COALESCE((
      SELECT jsonb_agg(
          jsonb_build_object(
              'url', b.hytte_url,
              'rekkefolge', b.hytte_rekkefolge
          )
          ORDER BY b.hytte_rekkefolge
      )
      FROM hytte_bilde b
      WHERE b.hytte_id = h.hytte_id
  ), '[]'::jsonb),

  'kategorier', COALESCE((
      SELECT jsonb_agg(
          jsonb_build_object(
              'kategori_id', k2.kategori_id,
              'kategori', k2.kategori_navn,
              'items', info.items
          )
          ORDER BY k2.kategori_navn
      )
      FROM (
          SELECT
              i.kategori_id,
              jsonb_agg(
                  jsonb_build_object(
                      'id', i.informasjon_id,
                      'navn', i.informasjon_navn
                  )
                  ORDER BY i.informasjon_navn
              ) AS items
          FROM hytte_informasjon hi
          JOIN informasjon i ON i.informasjon_id = hi.informasjon_id
          WHERE hi.hytte_id = h.hytte_id
          GROUP BY i.kategori_id
      ) info
      JOIN kategori k2
        ON k2.kategori_id = info.kategori_id
  ), '[]'::jsonb)
)
FROM hytte h
LEFT JOIN fylke f ON f.fylke_id = h.fylke_id
LEFT JOIN kommune k ON k.kommune_id = h.kommune_id
WHERE h.hytte_id = p_hytte_id;
$function$


//oppdater en hytte sin informasjon
CREATE OR REPLACE FUNCTION public.hytte_oppdater(p_hytte_id integer, p_navn text, p_beskrivelse text, p_sengeplasser integer, p_pris numeric, p_fylke_nummer text, p_kommune_nummer text, p_breddegrad numeric, p_lengdegrad numeric, p_moh integer, p_betjeningsgrad betjeningsgrad_enum, p_informasjon_ids jsonb DEFAULT '[]'::jsonb, p_bilder jsonb DEFAULT '[]'::jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_fylke_id integer;
  v_kommune_id integer;
BEGIN

  SELECT fylke_id
  INTO v_fylke_id
  FROM fylke
  WHERE fylke_nummer = p_fylke_nummer;

  SELECT kommune_id
  INTO v_kommune_id
  FROM kommune
  WHERE kommune_nummer = p_kommune_nummer
    AND fylke_id = v_fylke_id;

  UPDATE hytte
  SET
    hytte_navn = p_navn,
    hytte_beskrivelse = p_beskrivelse,
    hytte_sengeplasser = p_sengeplasser,
    hytte_pris = p_pris,
    fylke_id = v_fylke_id,
    kommune_id = v_kommune_id,
    hytte_breddegrad = p_breddegrad,
    hytte_lengdegrad = p_lengdegrad,
    hytte_moh = p_moh,
    hytte_betjeningsgrad = p_betjeningsgrad
  WHERE hytte_id = p_hytte_id;

  DELETE FROM hytte_informasjon
  WHERE hytte_id = p_hytte_id;

  IF p_informasjon_ids IS NOT NULL THEN
    INSERT INTO hytte_informasjon (hytte_id, informasjon_id)
    SELECT p_hytte_id, value::integer
    FROM jsonb_array_elements_text(p_informasjon_ids);
  END IF;

  DELETE FROM hytte_bilde
  WHERE hytte_id = p_hytte_id;

  IF p_bilder IS NOT NULL AND jsonb_typeof(p_bilder) = 'array' THEN
    INSERT INTO hytte_bilde (
      hytte_id,
      hytte_url,
      hytte_rekkefolge
    )
    SELECT
      p_hytte_id,
      value,
      ROW_NUMBER() OVER ()
    FROM jsonb_array_elements_text(p_bilder);
  END IF;

END;
$function$


//slett en hytte
CREATE OR REPLACE FUNCTION public.hytte_slett(p_hytte_id integer)
 RETURNS void
 LANGUAGE sql
AS $function$
DELETE FROM public.hytte
WHERE hytte_id = p_hytte_id;
$function$
