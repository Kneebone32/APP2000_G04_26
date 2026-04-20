import { Marker, useMapEvents, useMap } from "react-leaflet";
import { useEffect } from "react";
import Kart_basic, { hytteIcon } from "./KartBasic";

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

//Holder styr på klikk-punktet. Laget av Kay
function PunktKontroller({ setPunkt }) {
  useMapEvents({
    click(e) {
      const nyttPunkt = [e.latlng.lat, e.latlng.lng];
      setPunkt(nyttPunkt);
    },
  });
  return null;
}

//Brukes til å hente punktkoordinat til hytte eller turmål. Laget av Kay
export default function KartHentEttPunkt({ punkt, setPunkt, center = [59.4087, 9.0593], zoom = 12, markerIcon = hytteIcon }) {
  return (
    <Kart_basic center={center} zoom={zoom}>
      <PunktKontroller setPunkt={setPunkt} />

      {punkt && punkt.length === 2 && <Marker position={punkt} icon={markerIcon} />}
    </Kart_basic>
  );
}
