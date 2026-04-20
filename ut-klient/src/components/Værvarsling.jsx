import { useState } from "react";
import { useVærvarsel } from "../hooks/useVærvarsel";
import "./Værvarsling.css";

//Funksjon som henter værvarsel for det neste døgnet fra Yr. Laget av Kay
export function VærvarslingDag({ latitude, longitude }) {
  const yrUrlDag = `https://www.yr.no/nb/innhold/${latitude},${longitude}/card.html?mode=light`;
  const [laster, setLaster] = useState(true);
  return (
    <div className="yr-widget-container">
      {laster && <p style={{ textAlign: "center", color: "#888" }}>Laster værvarsel</p>}
      <iframe
        src={yrUrlDag}
        width="100%"
        height="372px"
        style={{ border: "none", borderRadius: "8px" }}
        onLoad={() => setLaster(false)}
      ></iframe>
    </div>
  );
}

//Funksjon som henter værvarsel for den neste uken fra Yr. Laget av Kay
export function VærvarslingUke({ latitude, longitude }) {
  const [laster, setLaster] = useState(true);
  const yrUrlUke = `https://www.yr.no/nb/innhold/${latitude},${longitude}/table.html?mode=light`;

  return (
    <div className="yr-widget-container">
      {laster && <p style={{ textAlign: "center", color: "#888" }}>Laster værvarsel</p>}
      <iframe
        src={yrUrlUke}
        width="100%"
        height="372px"
        style={{ border: "none", borderRadius: "8px" }}
        onLoad={() => setLaster(false)}
      ></iframe>
    </div>
  );
}

//Funksjon som henter detaljert værvarsel på en spesifikk dato. Laget av Kay
export function VærvarselDagDetaljert({ lat, lon, dato }) {
  const datoString = dato.toISOString().split("T")[0];
  const datoTime = dato.getHours();

  const { data, loading } = useVærvarsel(lat, lon, datoString);
  if (!data || loading || !data.length > 0) return null;

  const nærmesteMatch = data.reduce((prev, curr) => {
    const currTime = new Date(curr.time).getHours();
    const prevTime = new Date(prev.time).getHours();

    return Math.abs(currTime - datoTime) < Math.abs(prevTime - datoTime) ? curr : prev;
  });

  const temperatur = nærmesteMatch.data.instant.details.air_temperature;
  const vind = nærmesteMatch.data.instant.details.wind_speed;

  const sammendrag = nærmesteMatch.data.next_1_hours || nærmesteMatch.data.next_6_hours || nærmesteMatch.data.next_12_hours;

  const symbol = sammendrag?.summary.symbol_code;
  const regn = sammendrag?.details.precipitation_amount || 0;

  return (
    <div className="værmelding-kort">
      <img
        src={`https://raw.githubusercontent.com/metno/weathericons/main/weather/svg/${symbol}.svg`}
        alt={symbol}
        style={{ width: "50px" }}
      />
      <div className="vær-detaljer">
        <div className="detalj-linje">
          <img src="/icons/thermometer.svg" alt="Temp" width="16" />
          <span>{temperatur}°C</span>
        </div>

        <div className="detalj-linje">
          <img src="/icons/umbrella.svg" alt="Nedbør" width="16" />
          <span> {regn} mm</span>
        </div>

        <div className="detalj-linje">
          <img src="/icons/wind.svg" alt="Vind" width="16" />
          <span> {vind} m/s</span>
        </div>
      </div>
    </div>
  );
}
