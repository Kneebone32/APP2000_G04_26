import { Polyline, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import Kart_basic from "./KartBasic";

//Hjelper Leaflet med å regne ut den faktiske størrelsen på Modal. Laget av AI
function MapSizeInvalidator() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 400);
    return () => clearTimeout(timer);
  }, [map]);
  
  return null;
}


//Holder styr på rutepunktene. Laget av Kay
function RuteKontroller({setRutePunkter}) {
  useMapEvents({
    click(e) {
      const nyttPunkt = [e.latlng.lat, e.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    }
  });
  return null;
}

//Brukes til å hente punktkoordinater og tegne ruten på kartet. Laget av Kay
export default function KartLagTur({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12 }) {
  return (
    <Kart_basic center={center} zoom={zoom}>
      <RuteKontroller 
        rutePunkter={rutePunkter} 
        setRutePunkter={setRutePunkter} 
      />
      
      {rutePunkter.length > 1 && (
        <Polyline 
          positions={rutePunkter}
          pathOptions={{ 
            color: '#2196F3', 
            weight: 6,
            opacity: 0.8
          }}
        />
      )}
    </Kart_basic>
  );
}