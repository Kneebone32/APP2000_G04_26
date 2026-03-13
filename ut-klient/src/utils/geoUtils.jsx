
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

  const punkter = JSON.stringify(utvalgteKoords.map(([lat, lon]) => [lon, lat]));
  const data = await hentHøydedataFraPunkter(punkter);

  return data ? data.map(koord => koord.z) : [];
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
  try {
    const response = await fetch(
      `https://ws.geonorge.no/hoydedata/v1/punkt?koordsys=4258&nord=0&ost=0&punkter=${punkter}&geojson=false`
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






