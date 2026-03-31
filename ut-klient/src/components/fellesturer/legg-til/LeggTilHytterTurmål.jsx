import KartLeggTilHytterTurmål from "../../kart/KartLeggTilHytterTurmål";

//Velger hytter og turmål for en fellestur ved GPX opplastning. Laget av Kay
export default function LeggTilHytterTurmål({gpxKoords, hytterITuren, setHytterITuren, turmålITuren, setTurmålITuren, onLagre}) {
  return (
    <div>
      <div className="rute-kontroller">
        <div className="rute-kontroller-punkter">
          <div className="rute-kontroller-tur"><strong>Antall hytter:</strong> {hytterITuren.length}</div>
          <div className="rute-kontroller-tur"><strong>Antall turmål:</strong> {turmålITuren.length}</div>
        </div>
        <div className="rute-kontroller-knapp-container">
          <button
            onClick={() => { setHytterITuren([]); setTurmålITuren([]); }}
            className="rute-knapp rute-knapp-tøm"
          >
            Tøm valg
          </button>
          {(hytterITuren.length > 0 || turmålITuren.length > 0) && (
            <button onClick={onLagre} className="rute-knapp rute-knapp-log">
              Lagre valg
            </button>
          )}
        </div>
      </div>

      <KartLeggTilHytterTurmål
        gpxKoords={gpxKoords}
        hytterITuren={hytterITuren}
        setHytterITuren={setHytterITuren}
        turmålITuren={turmålITuren}
        setTurmålITuren={setTurmålITuren}
      />
    </div>
  );
}
