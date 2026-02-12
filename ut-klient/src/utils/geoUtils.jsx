
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
  const utvalgteKoords = koords.filter((_, index) => index % 20 === 0); //Henter kun hvert 20. punkt
  
  const høyderPromises = utvalgteKoords.map(koord=> hentHøydeMåling(koord[0], koord[1]));
  const results = await Promise.all(høyderPromises);

  return results; 
};




