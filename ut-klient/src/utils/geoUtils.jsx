
//Regner ut distansen mellom to punkter på en sfære med "Haversine formula".
//Standardkode fra internett. Ikke laget av oss
export const getDistanceBetweenPoints = (lat1, lon1, lat2, lon2) => {
  const R = 6371; //Jordens radius i km
  
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);

  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c; //Returnerer distansen mellom de to punktene i KM
};

//regner ut den totale lengden av ruten i KM. Laget av Kay
export const regnUtTotalLengde = (ruteKoords) => {
    if (!ruteKoords || ruteKoords.length < 2) return 0;

      let totalKm = 0;

      for (let i = 0; i < ruteKoords.length - 1; i++) {
        const [lat1, lon1] = ruteKoords[i];
        const [lat2, lon2] = ruteKoords[i + 1];

        totalKm += getDistanceBetweenPoints(lat1, lon1, lat2, lon2);
      }

    return totalKm;
};


//Henter høydemåling fra ett punkt. Laget av Kay
export const hentHøydeMåling = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://ws.geonorge.no/hoydedata/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4326`
    );
    
    if (!response.ok){ 
      throw new Error("Kunne ikke hente høydemåling");
    }

    const data = await response.json();
    return data.punkter[0].z; 

  } catch (error) {
    console.error(error);
    return null;
  }
};

//Henter høydemåling for ruter. Returerer en arr. Laget av Kay
export const hentHøydeProfil = async (koords) => {
  const antall = Math.min(50, koords.length);

  //hvis koords er større enn 50 vil kun 50 punkter bli sendt inn.
  //har prøvd å spre de punktene vi må droppe på best mulig måte.
  const utvalgteKoords = Array.from({length: antall}, (_, index) =>
    koords[Math.round(index * (koords.length - 1) / (antall - 1))]
  );

  const data = await hentHøydedataFraPunkter(utvalgteKoords);
  return data;
};


//Bygger punkter med moh for lagring av Stier
//Punkter som ikke ble samplet får moh: null
export const byggPunkterMedMoh = async (koords) => {
  const høydeData = await hentHøydeProfil(koords);
  if (!høydeData) return koords.map(p => ({breddegrad: p[0], lengdegrad: p[1], moh: null}));

  const antall = Math.min(50, koords.length);
  const sampledIndices = Array.from({length: antall}, (_, i) =>
    Math.round(i * (koords.length - 1) / (antall - 1))
  );

  const mohByIndex = {};
  sampledIndices.forEach((koordIdx, høydeIdx) => {
    mohByIndex[koordIdx] = høydeData[høydeIdx]?.z ?? null;
  });

  return koords.map((p, i) => ({
    breddegrad: p[0],
    lengdegrad: p[1],
    moh: parseInt(mohByIndex[i]) ?? null
  }));
};


//Henter all høydedata fra ett punkt. Laget av Kay
export const hentFullHøydeData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://ws.geonorge.no/hoydedata/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4326`
    );
    
    if (!response.ok){ 
      throw new Error("Kunne ikke hente høydedata");
    }

    const data = await response.json();
    return data.punkter[0];

  } catch (error) {
    console.error(error);
    return null;
  }
};

//Henter kommune og fylke ut fra ett punkt. Laget av Kay
export const hentKommuneData = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://ws.geonorge.no/kommuneinfo/v1/punkt?nord=${lat}&ost=${lon}&koordsys=4326`
    );
    
    if (!response.ok){ 
      throw new Error("Kunne ikke hente kommuneinfo");
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error(error);
    return null;
  }
};


export const hentHøydedataFraPunkter = async (punkter) => {
  const lonLat = punkter.map(p => [p[1], p[0]]);
  try {
    const response = await fetch(
      `https://ws.geonorge.no/hoydedata/v1/punkt?koordsys=4258&punkter=${encodeURIComponent(JSON.stringify(lonLat))}&geojson=false`
    );
    
    if (!response.ok){ 
      throw new Error("Kunne ikke hente høydedata");
    }

    const data = await response.json();
    return data.punkter;

  } catch (error) {
    console.error(error);
    return null;
  }
};






