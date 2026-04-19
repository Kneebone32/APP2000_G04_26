//oprett favoritt for hytte, tur og turmaal.

CREATE OR REPLACE FUNCTION public.favoritt_hytte_opprett(p_bruker_id integer, p_hytte_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO favoritt_hytte (bruker_id, hytte_id)
  VALUES (p_bruker_id, p_hytte_id)
  ON CONFLICT DO NOTHING;
END;
$function$


CREATE OR REPLACE FUNCTION public.favoritt_tur_opprett(p_bruker_id integer, p_tur_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO favoritt_tur (bruker_id, tur_id)
  VALUES (p_bruker_id, p_tur_id)
  ON CONFLICT DO NOTHING;
END;
$function$


CREATE OR REPLACE FUNCTION public.favoritt_maal_opprett(p_bruker_id integer, p_turmaal_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO favoritt_maal (bruker_id, turmaal_id)
  VALUES (p_bruker_id, p_turmaal_id)
  ON CONFLICT DO NOTHING;
END;
$function$


//Hent favoritt  hytte,tur og turmaal for en bruker
  
CREATE OR REPLACE FUNCTION public.favoritt_hytte_hent_for_bruker(p_bruker_id integer)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT COALESCE(
  jsonb_agg(
    jsonb_build_object(
      'hytte_id', h.hytte_id,
      'hytte_navn', h.hytte_navn
    )
  ),
  '[]'::jsonb
)
FROM favoritt_hytte fh
JOIN hytte h ON h.hytte_id = fh.hytte_id
WHERE fh.bruker_id = p_bruker_id;
$function$
  

CREATE OR REPLACE FUNCTION public.favoritt_tur_hent_for_bruker(p_bruker_id integer)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT COALESCE(
  jsonb_agg(
    jsonb_build_object(
      'tur_id', t.tur_id,
      'tur_navn', t.tur_navn
    )
  ),
  '[]'::jsonb
)
FROM favoritt_tur ft
JOIN tur t ON t.tur_id = ft.tur_id
WHERE ft.bruker_id = p_bruker_id;
$function$
  

CREATE OR REPLACE FUNCTION public.favoritt_maal_hent_for_bruker(p_bruker_id integer)
 RETURNS jsonb
 LANGUAGE sql
AS $function$
SELECT COALESCE(
  jsonb_agg(
    jsonb_build_object(
      'turmaal_id', tm.turmaal_id,
      'turmaal_navn', tm.turmaal_navn
    )
  ),
  '[]'::jsonb
)
FROM favoritt_maal fm
JOIN turmaal tm ON tm.turmaal_id = fm.turmaal_id
WHERE fm.bruker_id = p_bruker_id;
$function$


//Slett en favoritt for en bruker
  
CREATE OR REPLACE FUNCTION public.favoritt_hytte_slett(p_bruker_id integer, p_hytte_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM favoritt_hytte
  WHERE bruker_id = p_bruker_id AND hytte_id = p_hytte_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Favoritt hytte finnes ikke';
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.favoritt_tur_slett(p_bruker_id integer, p_tur_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM favoritt_tur
  WHERE bruker_id = p_bruker_id
    AND tur_id = p_tur_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Favoritt tur finnes ikke';
  END IF;
END;
$function$


CREATE OR REPLACE FUNCTION public.favoritt_maal_slett(p_bruker_id integer, p_turmaal_id integer)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM favoritt_maal
  WHERE bruker_id = p_bruker_id
    AND turmaal_id = p_turmaal_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Favoritt mål finnes ikke';
  END IF;
END;
$function$

