import { Polyline } from "react-leaflet";
import { useState } from "react";
import Kart_basic, { hytteIcon, marker1, marker2, marker3, marker4, marker5, marker6, turmålIcon } from "./KartBasic";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useTurmål } from "../../hooks/useTurmål";
import { midtpunkt } from "../../utils/geoUtils";
import { HoverMarker } from "./HoverMarker";
import { MapSizeInvalidator } from "./KartLagTur";

const markerIkoner = [marker1, marker2, marker3, marker4, marker5, marker6];

//Kart for å velge hytter og turmål for en fellestur. GPX vises kun som referanse. Laget av Kay
export default function KartLeggTilHytterTurmål({gpxKoords = [], hytterITuren, setHytterITuren, turmålITuren, setTurmålITuren}) {
  const { hytter } = useFetchHytter({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});
  const [valgRekkefølge, setValgRekkefølge] = useState([]);
  const gpxPolyline = gpxKoords.map(p => [p.breddegrad, p.lengdegrad]);
  const center = midtpunkt(gpxKoords) ?? [59.4087, 9.0593];


//Kopiert fra KartLagTur med små tilpasninger
  const hentIkon = (type, id, defaultIkon) => {
    const idx = valgRekkefølge.findIndex(v => v.type === type && v.id === id);
    return idx !== -1 ? (markerIkoner[idx] ?? defaultIkon) : defaultIkon;
  };

  //Kopiert fra KartLagTur med små tilpasninger
  const handleHytteKlikk = (_event, hytte) => {
    const finnes = hytterITuren.some(h => h.hytte_id === hytte.hytte_id);
    if (finnes) {
      setHytterITuren(prev => prev.filter(h => h.hytte_id !== hytte.hytte_id));
      setValgRekkefølge(prev => prev.filter(v => !(v.type === 'hytte' && v.id === hytte.hytte_id)));
    } else {
      setHytterITuren(prev => [...prev, hytte]);
      setValgRekkefølge(prev => [...prev, {type: 'hytte', id: hytte.hytte_id}]);
    }
  };

  //Kopiert fra KartLagTur med små tilpasninger
  const handleTurmålKlikk = (_event, mål) => {
    const finnes = turmålITuren.some(t => t.turmaal_id === mål.turmaal_id);
    if (finnes) {
      setTurmålITuren(prev => prev.filter(t => t.turmaal_id !== mål.turmaal_id));
      setValgRekkefølge(prev => prev.filter(v => !(v.type === 'turmål' && v.id === mål.turmaal_id)));
    } else {
      setTurmålITuren(prev => [...prev, mål]);
      setValgRekkefølge(prev => [...prev, {type: 'turmål', id: mål.turmaal_id}]);
    }
  };

  return (
    <Kart_basic center={center} zoom={12}>

      {/*Hytter*/}
      {hytter?.map((hytte) => (
        <HoverMarker
          key={hytte.hytte_id}
          objekt={hytte}
          ikon={hentIkon('hytte', hytte.hytte_id, hytteIcon)}
          hoverFaktor={1.2}
          onKlikk={handleHytteKlikk}
        />
      ))}

      {/*Turmål*/}
      {turmål?.map((mål) => (
        <HoverMarker
          key={mål.turmaal_id}
          objekt={mål}
          ikon={hentIkon('turmål', mål.turmaal_id, turmålIcon)}
          hoverFaktor={1.2}
          onKlikk={handleTurmålKlikk}
        />
      ))}

      {/*GPX-rute*/}
      {gpxPolyline.length > 1 && (
        <Polyline
          positions={gpxPolyline}
          pathOptions={{ color: '#2196F3', weight: 6, opacity: 0.8 }}
        />
      )}

      <MapSizeInvalidator />
    </Kart_basic>
  );
}
