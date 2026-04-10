import { Polyline, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import Kart_basic, { hytteIcon, marker1, marker2,  marker3, marker4, marker5, marker6, turmålIcon} from "./KartBasic";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useTurmål } from "../../hooks/useTurmål";
import { erSammeKoordinat } from "../../utils/erGyldigKoordinat";
import { HoverPolyline } from "./HoverPolyline";
import { HoverMarker } from "./HoverMarker";
import { useStier } from "../../hooks/useStier";

//Hjelper Leaflet med å regne ut den faktiske størrelsen på Modal. Laget av AI
export function MapSizeInvalidator() {
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
function RuteKontroller({setRutePunkter, setPendingNyStiPunkter}) {
  useMapEvents({
    click(e) {
      const nyttPunkt = [e.latlng.lat, e.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      setPendingNyStiPunkter(prev => [...prev, nyttPunkt]);
    }
  });
  return null;
}

//Brukes til å hente punktkoordinater og tegne ruten på kartet. Laget av Kay. Denne ble alt for lang. Refactor hvis tid.
export default function KartLagTur({ rutePunkter, setRutePunkter, center = [59.4087, 9.0593], zoom = 12, setHytterITuren, setTurmålITuren, setStierITuren, setNyeStier}) {
  const { hytter } = useFetchHytter({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});
  const { stier } = useStier({autoFetch: true});
  

  const [forrigeObjekt, setForrigeObjekt] = useState(null);
  const [objektRekkefølge, setObjektRekkefølge] = useState([]);
  const [stierRekkefølge, setStierRekkefølge] = useState([]);
  const [pendingNyStiPunkter, setPendingNyStiPunkter] = useState([]);


  //Ser om det finnes en Sti mellom to punkter
  const finnRuteMellomPunkter = (objektA, objektB) => {
    const objektAKoord = [objektA.breddegrad, objektA.lengdegrad];
    const objektBKoord = [objektB.breddegrad, objektB.lengdegrad];

    for (const sti of stier) {
      if (!sti.punkter || sti.punkter.length < 2) continue;
      const stiPunkter = sti.punkter.map(p => [p.breddegrad, p.lengdegrad]);
      const stiStart = stiPunkter[0];
      const stiSlutt = stiPunkter[stiPunkter.length - 1];

      if (erSammeKoordinat(stiStart, objektAKoord) && erSammeKoordinat(stiSlutt, objektBKoord)) {
        return { punkter: stiPunkter, sti_id: sti.sti_id, er_revers: false };
      }

      if (erSammeKoordinat(stiStart, objektBKoord) && erSammeKoordinat(stiSlutt, objektAKoord)) {
        return { punkter: [...stiPunkter].reverse(), sti_id: sti.sti_id, er_revers: true };
      }
    }

    return null;
  };

  //Bygger opp turruten basert på objekter (hytter, stier og turmål). Laget av Kay med hjelp fra Stackoverflow og AI
  const byggRuteFraObjekter = (objekter, erstattStiData = null, startIdx = null) => {
    let nyeRutePunkter = [];
    let nyeStier = [];

    for (let i = 0; i < objekter.length - 1; i++) {
      const fra = objekter[i];
      const til = objekter[i + 1];

      if (erstattStiData && i === startIdx) {
        nyeRutePunkter.push(...erstattStiData.punkter);
        nyeStier.push({ sti_id: erstattStiData.sti_id, er_revers: erstattStiData.er_revers });
      } else {
        const stiData = finnRuteMellomPunkter(fra, til);
        if (stiData) {
          nyeRutePunkter.push(...stiData.punkter);
          nyeStier.push({ sti_id: stiData.sti_id, er_revers: stiData.er_revers });
        } else {
          nyeRutePunkter.push([fra.breddegrad, fra.lengdegrad]);
          nyeRutePunkter.push([til.breddegrad, til.lengdegrad]);
        }
      }
    }
    return { punkter: nyeRutePunkter, stier: nyeStier };
  };


  //håndterer klikk på stien og ser om det finnes en hytte/turmål på starten og slutten. Laget av Kay med hjelp fra Stackoverflow og AI
  const handleStiKlikk = (event, koordinater, sti) => {
    setPendingNyStiPunkter([]);
    const stiStart = sti.punkter.map(p => [p.breddegrad, p.lengdegrad])[0];
    const er_revers = !erSammeKoordinat(koordinater[0], stiStart);
    const stiData = { punkter: koordinater, sti_id: sti.sti_id, er_revers };

    const stiSlutt = koordinater[koordinater.length - 1];

    const startHytte = hytter?.find(h => erSammeKoordinat([h.breddegrad, h.lengdegrad], koordinater[0]));
    const startTurmål = turmål?.find(t => erSammeKoordinat([t.breddegrad, t.lengdegrad], koordinater[0]));
    const sluttHytte = hytter?.find(h => erSammeKoordinat([h.breddegrad, h.lengdegrad], stiSlutt));
    const sluttTurmål = turmål?.find(t => erSammeKoordinat([t.breddegrad, t.lengdegrad], stiSlutt));

    const startObjekt = startHytte || startTurmål;
    const sluttObjekt = sluttHytte || sluttTurmål;

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

      if (startIdx !== -1 && sluttIdx !== -1) {
        if (sluttIdx === startIdx + 1) {
          const resultat = byggRuteFraObjekter(objektRekkefølge, stiData, startIdx);
          setRutePunkter(resultat.punkter);
          setStierRekkefølge(resultat.stier);
          setStierITuren(resultat.stier);
          setForrigeObjekt(sluttObjekt);
          return;
        }

        if (startIdx === sluttIdx + 1) {
          const reversertStiData = { ...stiData, punkter: [...koordinater].reverse(), er_revers: !er_revers };
          const resultat = byggRuteFraObjekter(objektRekkefølge, reversertStiData, sluttIdx);
          setRutePunkter(resultat.punkter);
          setStierRekkefølge(resultat.stier);
          setStierITuren(resultat.stier);
          setForrigeObjekt(startObjekt);
          return;
        }
      }
    }

    setRutePunkter(koordinater);
    setHytterITuren([]);
    setTurmålITuren([]);
    setStierRekkefølge([{ sti_id: sti.sti_id, er_revers }]);
    setStierITuren([{ sti_id: sti.sti_id, er_revers }]);

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


  //Håndterer klikk på hytte og ser om det finnes en sti-kobling. Laget av Kay med hjelp fra Stackoverflow og AI
  const handleHytteKlikk = (event, hytte) => {
    setHytterITuren(prev => [...prev, hytte]);

    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(hytte);
      setObjektRekkefølge([hytte]);
      setStierRekkefølge([]);
      setStierITuren([]);
      setPendingNyStiPunkter([]);
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      return;
    }

    if (pendingNyStiPunkter.length > 0) {
      const nySti = [
        [forrigeObjekt.breddegrad, forrigeObjekt.lengdegrad],
        ...pendingNyStiPunkter,
        [hytte.breddegrad, hytte.lengdegrad]
      ];
      setNyeStier(prev => [...prev, nySti]);
      setPendingNyStiPunkter([]);
      const nyttPunkt = [hytte.breddegrad, hytte.lengdegrad];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    } else {
      const stiData = finnRuteMellomPunkter(forrigeObjekt, hytte);
      if (stiData) {
        setRutePunkter(prev => [...prev, ...stiData.punkter]);
        const oppdatertStier = [...stierRekkefølge, { sti_id: stiData.sti_id, er_revers: stiData.er_revers }];
        setStierRekkefølge(oppdatertStier);
        setStierITuren(oppdatertStier);
      } else {
        const nyttPunkt = [event.latlng.lat, event.latlng.lng];
        setRutePunkter(prev => [...prev, nyttPunkt]);
      }
    }

    setForrigeObjekt(hytte);
    setObjektRekkefølge(prev => [...prev, hytte]);
  };


  //Håndterer klikk på turmål og ser om det finnes en sti-kobling. Laget av Kay med hjelp fra Stackoverflow og AI
  const handleTurMålKlikk = (event, turmål) => {
    setTurmålITuren(prev => [...prev, turmål]);

    if (rutePunkter.length === 0 || !forrigeObjekt) {
      setForrigeObjekt(turmål);
      setObjektRekkefølge([turmål]);
      setStierRekkefølge([]);
      setStierITuren([]);
      setPendingNyStiPunkter([]);
      const nyttPunkt = [event.latlng.lat, event.latlng.lng];
      setRutePunkter(prev => [...prev, nyttPunkt]);
      return;
    }

    if (pendingNyStiPunkter.length > 0) {
      const nySti = [
        [forrigeObjekt.breddegrad, forrigeObjekt.lengdegrad],
        ...pendingNyStiPunkter,
        [turmål.breddegrad, turmål.lengdegrad]
      ];
      setNyeStier(prev => [...prev, nySti]);
      setPendingNyStiPunkter([]);
      const nyttPunkt = [turmål.breddegrad, turmål.lengdegrad];
      setRutePunkter(prev => [...prev, nyttPunkt]);
    } else {
      const stiData = finnRuteMellomPunkter(forrigeObjekt, turmål);
      if (stiData) {
        setRutePunkter(prev => [...prev, ...stiData.punkter]);
        const oppdatertStier = [...stierRekkefølge, { sti_id: stiData.sti_id, er_revers: stiData.er_revers }];
        setStierRekkefølge(oppdatertStier);
        setStierITuren(oppdatertStier);
      } else {
        const nyttPunkt = [event.latlng.lat, event.latlng.lng];
        setRutePunkter(prev => [...prev, nyttPunkt]);
      }
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
        setPendingNyStiPunkter={setPendingNyStiPunkter}
      />

      {/*Hytter*/}
      {hytter && (
        hytter.map((hytte) => {
          const idx = objektRekkefølge.findIndex(obj => obj.hytte_id === hytte.hytte_id);
          const ikon = idx !== -1 ? [marker1, marker2, marker3, marker4, marker5, marker6][idx] ?? hytteIcon : hytteIcon;
          return (
            <HoverMarker
              key={hytte.hytte_id}
              objekt={hytte}
              ikon={ikon}
              hoverFaktor={1.2}
              onKlikk={handleHytteKlikk}
            />
          );
        })
      )}

      {/*TurMål*/}
      {turmål && (
        turmål.map((mål) => {
          const idx = objektRekkefølge.findIndex(obj => obj.turmaal_id === mål.turmaal_id);
          const ikon = idx !== -1 ? [marker1, marker2, marker3, marker4, marker5, marker6][idx] ?? turmålIcon : turmålIcon;
          return (
            <HoverMarker
              key={mål.turmaal_id}
              objekt={mål}
              ikon={ikon}
              hoverFaktor={1.2}
              onKlikk={handleTurMålKlikk}
            />
          );
        })
      )}

      {/*Stier*/}
      {stier.length > 0 && (
        stier.map((sti, index) => (
        <HoverPolyline
          key={index}
          punkter={sti.punkter.map(punkt => [punkt.breddegrad, punkt.lengdegrad])}
          farge="#0fe407"
          standardVekt={4}
          hoverVekt={8}
          onKlikk={(event, koordinater) => handleStiKlikk(event, koordinater, sti)}
        />
        ))
      )}

      {/*Turruten*/}
      {rutePunkter.length > 1 && (
      <>
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
