import { Marker, Polyline, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Kart_basic, { hytteIcon, markerA, markerB, turmålIcon} from "./KartBasic";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useTurmål } from "../../hooks/useTurmål";
import { erSammeKoordinat } from "../../utils/erGyldigKoordinat";
import stier from "../../assets/stier.json"
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
export default function KartLagTur({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12, hytterITuren, setHytterITuren, turmålITuren, setTurmålITuren}) {
  const { hytter } = useFetchHytter({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});

  //const { stier } = useStier({autoFetch: true})
  const [forrigeObjekt, setForrigeObjekt] = useState(null);


  

// Rename and generalize the function
  const finnRuteMellomPunkter = (objektA, objektB) => {
    const objektAKoord = [objektA.breddegrad, objektA.lengdegrad];
    const objektBKoord = [objektB.breddegrad, objektB.lengdegrad];

    for (const sti of stier) {
      if (!sti.punkter || sti.punkter.length < 2) continue;

      const stiStart = sti.punkter[0];
      const stiSlutt = sti.punkter[sti.punkter.length - 1];

      //Sjekker om stien går fra A til B
      if (erSammeKoordinat(stiStart, objektAKoord) && erSammeKoordinat(stiSlutt, objektBKoord)) {
        return sti.punkter;
      }

      //Sjekker om stien må reverseres
      if (erSammeKoordinat(stiStart, objektBKoord) && erSammeKoordinat(stiSlutt, objektAKoord)) {
        return [...sti.punkter].reverse();
      }
    }

    return null;
  };

  
  //Håndterer klikk på stien. Skal forbedres.
  const handleStiKlikk = (event, koordinater) => {
    setRutePunkter(koordinater);
    setForrigeObjekt(null);
  };


  //Håndterer klikk på hytte
  const handleHytteKlikk = (event, hytte) => {
    setHytterITuren(prev => [...prev, hytte]); 

    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(hytte);
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      return;
    }

    const ruteKoordinater = finnRuteMellomPunkter(forrigeObjekt, hytte);
  
    if (ruteKoordinater) {
      setRutePunkter(prev => [...prev, ...ruteKoordinater]);
    } else {
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    }

    setForrigeObjekt(hytte);
  };

  //Håndterer klikk på turmål
  const handleTurMålKlikk = (event, turmål) => {
    setTurmålITuren(prev => [...prev, turmål]); 

    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(turmål);
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      return;
    }

    const ruteKoordinater = finnRuteMellomPunkter(forrigeObjekt, turmål);
  
    if (ruteKoordinater) {
      setRutePunkter(prev => [...prev, ...ruteKoordinater]);
    } else {
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    }

    setForrigeObjekt(turmål);
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

      {/*TurMål*/}
      {turmål && (
        turmål.map((mål) => (
          <HoverMarker 
             key={mål.turmaal_id}
             objekt={mål}
             ikon={turmålIcon}
             hoverFaktor={1.2}
             onKlikk={handleTurMålKlikk}
          />
        ))
      )} 

      {/*Stier*/}
      {stier && (
        stier.map((sti) => (
        <HoverPolyline 
          punkter={sti.punkter}
          farge="#0fe407"
          standardVekt={4}
          hoverVekt={8}
          onKlikk={handleStiKlikk}
        />
        ))
      )}


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