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
    if (filter.søkeord) {
      const søkeordLower = filter.søkeord.toLowerCase();
      if (!hytte.navn?.toLowerCase().includes(søkeordLower)) {
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
    //TODO: venter på testdata

    return true;
  });
}

//Filterfunksjon til Turer
export function filterTurer(turer, filter) {
  return turer.filter((tur) => {
    //Null check
    if (!tur.punkter || tur.punkter.length === 0) {
      return false;
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

//Filterfunksjon til Fellesturer
export function filterFellesturer(fellesturer, filter) {
  return fellesturer.filter((fellestur) => {
    //Null check
    if (!fellestur.koordinater) {
      return false;
    }

    //TODO
  });
}

//Filterfunksjon til TurMål
export function filterTurMål(turmål, filter) {
  return turmål.filter((mål) => {
    //Null check
    if (!mål.koordinater) {
      return false;
    }

    //TODO
  });
}
