import { useState } from "react";
import { useMap, useMapEvents } from "react-leaflet";
import { FiNavigation } from "react-icons/fi";
import "./NavigasjonFinnPosisjon.css";

//Laget av Kay
//Spør bruker om tillatelse til å bruke posisjonen og deretter "flyr" brukeren til posisjonen.
export default function FlyTilPosisjon() {
  const map = useMap();
  const [erFunnet, setErFunnet] = useState(false);
  const [loading, setLoading] = useState(false);

  useMapEvents({
    //hvis koordinater er funnet
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
      setErFunnet(true);
      setLoading(false);
    },
    //error. kanskje sende melding til bruker?
    locationerror(){
      setLoading(false);
    },
    //hvis bruker drar på kartet
    dragstart() {
      setErFunnet(false);
    }
  });

  const handleLocate = (e) => {
    e.stopPropagation();
    setLoading(true);
    map.locate();
  };

  return (
    <div className="leaflet-bottom leaflet-right" style={{border: 'none', marginBottom: '90px'}}>
      <div className="leaflet-control leaflet-bar">
        <button className="posisjons-knapp" onClick={handleLocate} title="Bruk din posisjon">
            <FiNavigation 
            className={`pos-ikon ${loading ? 'puls-effekt' : ''}`}
            size={22}
            fill={erFunnet && !loading ? "#0a0a0a" : "none"}
            />
        </button>
      </div>
    </div>
  );
}