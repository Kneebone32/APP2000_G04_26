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

//Brukes til å hente punktkoordinater og tegne ruten på kartet. Laget av Kay. Denne ble alt for lang. Refactor hvis tid.
export default function KartLagTur({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12, setHytterITuren, setTurmålITuren}) {
  const { hytter } = useFetchHytter({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});

  //const { stier } = useStier({autoFetch: true})
  const [forrigeObjekt, setForrigeObjekt] = useState(null);
  const [objektRekkefølge, setObjektRekkefølge] = useState([]);


  

  //Ser om det finnes en Sti mellom to punkter
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

  //hjelpefunksjon for å bygge opp Turruten. Laget med hjelp fra Stackoverflow og AI
  const byggRuteFraObjekter = (objekter, erstattSti = null, startIdx = null, sluttIdx = null) => {
    let nyeRutePunkter = [];

    for (let i = 0; i < objekter.length - 1; i++) {
      const fra = objekter[i];
      const til = objekter[i + 1];

      if (erstattSti && i === startIdx) {
        nyeRutePunkter.push(...erstattSti);
      } else {
        const sti = finnRuteMellomPunkter(fra, til);
        if (sti) {
          nyeRutePunkter.push(...sti);
        } else {
          nyeRutePunkter.push([fra.breddegrad, fra.lengdegrad]);
          nyeRutePunkter.push([til.breddegrad, til.lengdegrad]);
        }
      }
    }
    return nyeRutePunkter;
  };


  //Håndterer klikk på stien og legger til hytter/turmål
  const handleStiKlikk = (event, koordinater) => {
    const stiStart = koordinater[0];
    const stiSlutt = koordinater[koordinater.length - 1];

    //finner startobjekt + sluttobjekt
    const startHytte = hytter?.find(h => 
      erSammeKoordinat([h.breddegrad, h.lengdegrad], stiStart)
    );
    const startTurmål = turmål?.find(t => 
      erSammeKoordinat([t.breddegrad, t.lengdegrad], stiStart)
    );
    const sluttHytte = hytter?.find(h => 
      erSammeKoordinat([h.breddegrad, h.lengdegrad], stiSlutt)
    );
    const sluttTurmål = turmål?.find(t => 
      erSammeKoordinat([t.breddegrad, t.lengdegrad], stiSlutt)
    );

    const startObjekt = startHytte || startTurmål;
    const sluttObjekt = sluttHytte || sluttTurmål;
    console.log(sluttObjekt)
    console.log(startObjekt)

    //sjekker om stien ikke er på starten av turruten
    if (startObjekt && sluttObjekt && objektRekkefølge.length > 1) {
      const startIdx = objektRekkefølge.findIndex(obj => {
        if (obj.hytte_id) return obj.hytte_id === startObjekt.hytte_id;
        if (obj.turmaal_id) return obj.turmaal_id === startObjekt.turmaal_id;
        return false;
      });

      const sluttIdx = objektRekkefølge.findIndex(obj => {
        if (obj.hytte_id) return obj.hytte_id === sluttObjekt.hytte_id;
        if (obj.turmaal_id) return obj.turmaal_id === sluttObjekt.turmaal_id;
        return false;
      });

      //Sjekker rekkefølge på Stien
      if (startIdx !== -1 && sluttIdx !== -1) {
        if (sluttIdx === startIdx + 1) {
          const nyeRutePunkter = byggRuteFraObjekter(objektRekkefølge, koordinater, startIdx);
          setRutePunkter(nyeRutePunkter);
          setForrigeObjekt(sluttObjekt);
          return;
        }

        if (startIdx === sluttIdx + 1) {
          const reverseKoordinater = [...koordinater].reverse();
          const nyeRutePunkter = byggRuteFraObjekter(objektRekkefølge, reverseKoordinater, sluttIdx);
          setRutePunkter(nyeRutePunkter);
          setForrigeObjekt(startObjekt);
          return;
        }
      }
    }

    setRutePunkter(koordinater);
    setHytterITuren([]);
    setTurmålITuren([]);
    const nyeObjekter = [];

    if (startObjekt) {
      nyeObjekter.push(startObjekt);
      if (startHytte) setHytterITuren([startHytte]);
      else setTurmålITuren([startTurmål]);
    }

    if (sluttObjekt && sluttObjekt !== startObjekt) {
      nyeObjekter.push(sluttObjekt);
      if (sluttHytte) setHytterITuren(prev => [...prev, sluttHytte]);
      else setTurmålITuren(prev => [...prev, sluttTurmål]);
      setForrigeObjekt(sluttObjekt);
    } else {
      setForrigeObjekt(null);
    }

    setObjektRekkefølge(nyeObjekter);
  };


  //Håndterer klikk på hytte
  const handleHytteKlikk = (event, hytte) => {
    setHytterITuren(prev => [...prev, hytte]); 
  
    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(hytte);
      setObjektRekkefølge([hytte]);
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
    setObjektRekkefølge(prev => [...prev, hytte]);
  };


  //Håndterer klikk på turmål
  const handleTurMålKlikk = (event, turmål) => {
    setTurmålITuren(prev => [...prev, turmål]); 

    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(turmål);
      setObjektRekkefølge([turmål]);
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
    setObjektRekkefølge(prev => [...prev, turmål]);
  };

  return (
    <>
    <Kart_basic center={center} zoom={zoom}>
      <RuteKontroller 
        rutePunkter={rutePunkter} 
        setRutePunkter={setRutePunkter} 
      />

      {/*Markør A*/}
      {rutePunkter.length > 0 && (
      <Marker 
        position={rutePunkter[0]}
        icon={markerA}
      />
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

      {/*Markør B + Hele turruten*/}
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