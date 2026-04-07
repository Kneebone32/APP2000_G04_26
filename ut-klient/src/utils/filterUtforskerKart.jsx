//Laget av Kay
//Filterfunksjon til hytter
export function filterHytter(hytter, filter) {
  return hytter.filter((hytte) => {
    //Null checks
    if (
      !hytte.breddegrad ||
      !hytte.lengdegrad ||
      !hytte.betjeningsgrad
    ) {
      return false;
    }

    //Søk filter
    if (filter.søkeordHytter) {

      const søk = filter.søkeordHytter.toLowerCase().trim();
      if (!hytte.navn?.toLowerCase().includes(søk) && 
          !hytte.fylke_navn?.toLowerCase().includes(søk) &&
          !hytte.kommune_navn?.toLowerCase().includes(søk)) {
            
        return false;
      }
    }

    //Betjeningsgrad filter
    if (filter.betjeningsgrad?.length > 0) {
      if (!filter.betjeningsgrad.includes(hytte.betjeningsgrad.toLowerCase())) {
        return false;
      }
    }

    //Prisnivå filter
    if (filter.prisnivå && hytte.pris) {
      const [minPris, maxPris] = filter.prisnivå;
      if (hytte.pris < minPris || hytte.pris > maxPris) {
        return false;
      }
    }

    //Fasiliteter filter
    if (filter.fasiliteter?.length > 0) {
      const harAlleValgteFasiliteter = 
          filter.fasiliteter.every((valgtFasilitet) =>                  //alle de valgte fasilitetene
          hytte.fasiliteter.verdier.some((hytteFasilitet) =>            //sjekker om hytten har de valgte fasilitetene
          hytteFasilitet.toLowerCase() === valgtFasilitet.navn.toLowerCase() //sammenligner på navnet
      ))

      if(!harAlleValgteFasiliteter) return false;
    }

    return true;
  });
}

//Filterfunksjon til Turer
export function filterTurer(turer, filter) {
  return turer.filter((tur) => {
    //Null check
    if (!tur.stier || tur.stier.length === 0) {
      return false;
    }

    //Søk filter
    if (filter.søkeordTurer) {
      const søk = filter.søkeordTurer.toLowerCase().trim();
      if (!tur.tur_navn?.toLowerCase().includes(søk) &&         
          !tur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søk) &&
          !tur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søk)) {
        return false;
      }
    }

    //
    if (filter.turtype?.length > 0) {
      if (!filter.turtype.includes(tur.turtype)) {
        return false;
      }
    }

    if (filter.vanskelighetsgrad?.length > 0) {
      if (!filter.vanskelighetsgrad.includes(tur.vanskelighetsgrad)) {
        return false;
      }
    }

    if (filter.varighet?.length > 0) {
      if (!filter.varighet.includes(tur.varighet)) {
        return false;
      }
    }

    return true;
  });
}

//Returnerer ISO-ukenummer (1-53) for en dato. Laget av https://weeknumber.com/how-to/javascript + litt AI
export const isoUke = (dato) => {
  const d = new Date(dato);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const vinterSolverv = new Date(d.getFullYear(), 0, 4);
  return 1 + Math.round(((d - vinterSolverv) / 86400000 - 3 + ((vinterSolverv.getDay() + 6) % 7)) / 7);
};

//Filterfunksjon til Fellesturer
export function filterFellesturer(fellesturer, filter) {
  return fellesturer.filter((fellestur) => {
    
    //Søk filter
    if (filter.søkeordFellesturer) {
      const søk = filter.søkeordFellesturer.toLowerCase().trim();

      if (!fellestur.aktivitet_tittel?.toLowerCase().includes(søk) && 
          !fellestur.stier?.[0]?.fylke_navn?.toLowerCase().includes(søk) &&
          !fellestur.stier?.[0]?.kommune_navn?.toLowerCase().includes(søk)
        ) {

        return false;
      }
    }

    //ukenummer. basert på startdato
    if (filter.uke) {
      const harDatoIUke = fellestur.datoer?.some(
        (dato) => isoUke(dato.aktivitet_start_dato) === filter.uke
      );
      if (!harDatoIUke) return false;
    }

    return true;
  });
}

//Filterfunksjon til TurMål
export function filterTurMål(turmål) {
  return turmål.filter((mål) => {
    //Null check
    if (!mål.breddegrad && mål.lengdegrad) {
      return false;
    }

    return true;
  });
}
