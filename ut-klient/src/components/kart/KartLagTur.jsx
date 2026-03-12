import { Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Kart_basic, { hytteIcon, markerA, markerB} from "./KartBasic";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { erSammeKoordinat } from "../../utils/erGyldigKoordinat";
import testSti from "../../../public/sti.json"
import { HoverPolyline } from "./HoverPolyline";
import { HoverMarker } from "./HoverMarker";

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
export default function KartLagTur({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12, hytterITuren, setHytterITuren}) {
  const { hytter } = useFetchHytter({autoFetch: true});
  //const { stier } = useStier({autoFetch: true})
  const [forrigeHytte, setForrigeHytte] = useState(null);
  const stier = testSti


  
/** 
  const finnRuteMellomHytter = (hytteA, hytteB) => {
    const hytteAKoord = [hytteA.breddegrad, hytteA.lengdegrad];
    const hytteBKoord = [hytteB.breddegrad, hytteB.lengdegrad];

    for (const sti of stier) {
      if (!sti.punkter || sti.punkter.length < 2) continue;

      const stiStart = sti.punkter[0];
      const stiSlutt = sti.punkter[sti.punkter.length - 1];

      //Sjekker om stien går fra A til B
      if (erSammeKoordinat(stiStart, hytteAKoord) && erSammeKoordinat(stiSlutt, hytteBKoord)) {
        return sti.punkter;
      }

      //Sjekker om stien må reverseres
      if (erSammeKoordinat(stiStart, hytteBKoord) && erSammeKoordinat(stiSlutt, hytteAKoord)) {
        return [...sti.punkter].reverse();
      }
    }

    return null;
  };
  */
  
    const finnRuteMellomHytter = (hytteA, hytteB) => {
      const hytteAKoord = [hytteA.breddegrad, hytteA.lengdegrad];
      const hytteBKoord = [hytteB.breddegrad, hytteB.lengdegrad];


      if (!stier || stier.length < 2) return;

      const stiStart = stier[0];
      const stiSlutt = stier[stier.length - 1];

      //Sjekker om stien går fra A til B
      if (erSammeKoordinat(stiStart, hytteAKoord) && erSammeKoordinat(stiSlutt, hytteBKoord)) {
        return stier;
      }

      //Sjekker om stien må reverseres
      if (erSammeKoordinat(stiStart, hytteBKoord) && erSammeKoordinat(stiSlutt, hytteAKoord)) {
        return [...stier].reverse();
      }
 

    return null;
  };
  
  //Håndterer klikk på stien. Skal forbedres.
  const handleStiKlikk = (event, koordinater) => {
    setRutePunkter(koordinater);
    setForrigeHytte(null);
  };


  //Håndterer klikk på hytter for å se om det finnes en Sti mellom hyttene
  const handleHytteKlikk = (event, hytte) => {
    setHytterITuren(prev => [...prev, hytte]); 

    if (rutePunkter.length === 0 || !forrigeHytte) {
      setForrigeHytte(hytte);
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      return;
    }


    const ruteKoordinater = finnRuteMellomHytter(forrigeHytte, hytte);
  
    if (ruteKoordinater) {
    setRutePunkter(prev => [...prev, ...ruteKoordinater]);
    } else {
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    }

    setForrigeHytte(hytte);
  };


  return (
    <>
    <Kart_basic center={center} zoom={zoom}>
      <RuteKontroller 
        rutePunkter={rutePunkter} 
        setRutePunkter={setRutePunkter} 
      />

      {rutePunkter.length > 0 && (
      <>
      <Marker 
        position={rutePunkter[0]}
        icon={markerA}
      />

      </>
      )}
      
      {/*Hytter*/}
      {hytter && (
        hytter.map((hytte) => (
          <HoverMarker 
            key={hytte.hytte_id}
            objekt={hytte}
            ikon={hytteIcon}
            hoverFaktor={1.2}
            onKlikk={handleHytteKlikk}
          />
        ))
      )}

      {/*Stier*/}
        <HoverPolyline 
          punkter={testSti}
          farge="#0fe407"
          onKlikk={handleStiKlikk}
        />

      {rutePunkter.length > 1 && (
      <>
        <Marker 
        position={rutePunkter[rutePunkter.length - 1]}
        icon={markerB}
        />
        <Polyline 
          positions={rutePunkter}
          pathOptions={{ 
            color: '#2196F3', 
            weight: 6,
            opacity: 0.8
          }}
        />
      </>
      )}
      <MapSizeInvalidator/>
    </Kart_basic>
    
    </>
  );
}