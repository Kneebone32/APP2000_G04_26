import { useState, useEffect } from "react";

//Henter værvarsel på en spesifikk dato. Laget av Kay ut fra met.no dokumentasjon:
//https://api.met.no/weatherapi/locationforecast/2.0/documentation
export function useVærvarsel(lat, lon, dato) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const brukerAgent = "APP2000_G04_26";

    const fetchVærmelding = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://api.met.no/weatherapi/locationforecast/2.0/compact?lat=${lat}&lon=${lon}`, {
          headers: { "User-Agent": brukerAgent },
        });

        if (!response.ok) throw new Error(`Værvarsel feil: ${response.status}`);

        const json = await response.json();
        const værmeldingPåDato = json.properties.timeseries.filter((ts) => ts.time.startsWith(dato));

        setData(værmeldingPåDato);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lat && lon && dato) {
      fetchVærmelding();
    }
  }, [lat, lon, dato]);

  return { data, loading, error };
}
