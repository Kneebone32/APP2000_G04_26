// Skrevet av AI

import { DATO_STATUS } from "../constants/konstanter";

// Henter neste gyldige dato for en fellestur (valgt dato prioriteres)
function hentNesteDato(fellestur) {
  const aktive = (fellestur.datoer ?? []).filter(
    (d) => d.aktivitet_dato_status !== DATO_STATUS.AVLYST
  );
  return aktive.find((d) => d.aktivitet_dato_status === DATO_STATUS.VALGT) ?? aktive[0];
}

// Filtrerer og sorterer fellesturer som ikke er avlyst og starter i fremtiden
export function hentKommendeFellesturer(fellesturer, antall = 3) {
  return fellesturer
    .filter((f) => {
      const dato = hentNesteDato(f);
      if (!dato) return false;
      return new Date(dato.aktivitet_start_dato) >= new Date();
    })
    .sort((a, b) => {
      const datoA = new Date(hentNesteDato(a).aktivitet_start_dato);
      const datoB = new Date(hentNesteDato(b).aktivitet_start_dato);
      return datoA - datoB;
    })
    .slice(0, antall);
}
