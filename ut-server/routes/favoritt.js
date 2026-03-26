favoritt_tur_opprett(
  p_bruker_id integer,
  p_tur_id integer
)

favoritt_tur_slett(
  p_bruker_id integer,
  p_tur_id integer
)

favoritt_tur_hent_for_bruker(
  p_bruker_id integer
)



favoritt_hytte_opprett(
  p_bruker_id integer,
  p_hytte_id integer
)

favoritt_hytte_slett(
  p_bruker_id integer,
  p_hytte_id integer
)

favoritt_hytte_hent_for_bruker(
  p_bruker_id integer
)


favoritt_maal_opprett(
  p_bruker_id integer,
  p_turmaal_id integer
)


favoritt_maal_slett(
  p_bruker_id integer,
  p_turmaal_id integer
)

favoritt_maal_hent_for_bruker(
  p_bruker_id integer
)
