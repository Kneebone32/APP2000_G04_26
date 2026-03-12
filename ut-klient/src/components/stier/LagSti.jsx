import { Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import Kart_basic, { turIcon } from "../kart/KartBasic";
import { hytteIcon, turmålIcon } from "../kart/KartBasic";

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

//Brukes til å hente punktkoordinater og tegne ruten på kartet. Laget av Kay. Kopiert fra en gammel versjon av LagTur
export default function KartLagSti({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12, hytter, turMål }) {
  return (
    <Kart_basic center={center} zoom={zoom}>
      <RuteKontroller 
        rutePunkter={rutePunkter} 
        setRutePunkter={setRutePunkter} 
      />

     {/*Hytter*/}
     {hytter && (
       hytter.map((hytte) => (
         <Marker 
           key={hytte.hytte_id}
           icon={hytteIcon}
           position={[hytte.breddegrad, hytte.lengdegrad]}
         />
       ))
     )} 

     {/*TurMål*/}
     {turMål && (
       turMål.map((mål) => (
         <Marker 
            key={mål.turmaal_id}
            position={[mål.breddegrad, mål.lengdegrad]}
            icon={turmålIcon}
         />
       ))
     )} 

      {rutePunkter.length > 0 && (
        <Marker 
          position={rutePunkter[0]}
          icon={turIcon}
        />
      )}
      
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