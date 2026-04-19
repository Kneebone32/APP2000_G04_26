//Funksjon som blir brukt til å oppdatere bruker. opprettelse, logg inn etc blir det brukt sql i rutene i stedet.


//oppdater bruker
CREATE OR REPLACE FUNCTION public.bruker_oppdater(p_bruker_id integer, p_bruker_navn text, p_bruker_etternavn text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE bruker
  SET
    bruker_navn = p_bruker_navn,
    bruker_etternavn = p_bruker_etternavn
  WHERE bruker_id = p_bruker_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Bruker med bruker_id=% finnes ikke', p_bruker_id;
  END IF;
END;
$function$
