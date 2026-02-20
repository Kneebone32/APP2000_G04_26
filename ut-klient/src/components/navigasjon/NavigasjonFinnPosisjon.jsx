import { useState, useRef, useEffect} from "react";
import { useMap, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import { FiNavigation } from "react-icons/fi";
import "./NavigasjonFinnPosisjon.css";

//Laget av Kay
//Spør bruker om tillatelse til å bruke posisjonen og deretter "flyr" brukeren til posisjonen.
export default function FlyTilPosisjon() {
  const map = useMap();
  const posisjonsKnappContainerRef = useRef(null);
  const [erFunnet, setErFunnet] = useState(false);
  const [loading, setLoading] = useState(false);

  //Forhindrer at knappetrykk faller igjennom til kartet. Takk stackoverflow.
  useEffect(() => {
    if (posisjonsKnappContainerRef.current) {
      L.DomEvent.disableClickPropagation(posisjonsKnappContainerRef.current);
      L.DomEvent.disableScrollPropagation(posisjonsKnappContainerRef.current);
    }
  }, []);


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
    <div className="leaflet-bottom leaflet-right" style={{border: 'none', marginBottom: '90px'}} ref={posisjonsKnappContainerRef}>
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