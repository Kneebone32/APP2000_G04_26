
//Bruker kan få ny rolle
SELECT public.bruker_rolle_foresporsel_opprett(bruker_id, rolle_id, mottaker_id);

//Varsel kan godkjenne eller avslå oppgaver 
SELECT public.varsel_oppgave_behandle(varsel_id, true/false);

//Hent varselene til innlogget bruker
SELECT * FROM public.varsel_hent_alle($1);
