import { useState } from "react";
import { Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import Kart_basic, {
  hytteIcon,
  turIcon,
} from "../components/kart/KartBasic";
import KartFilter from "../components/kart/KartFilter";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { filterHytter } from "../utils/filterUtforskerKart";
import { tur } from "../assets/tur";
import "../App.css";

//Hele filen laget av Kay med mindre annet er spesifisert
//Holder styr på zoom level
function ZoomLevel({onZoomChange}){
    const mapEvents = useMapEvents({
    zoomend: () => {
      onZoomChange(mapEvents.getZoom());
    },
  });
  return null;
}


//"Utforsker-kart" (Laget av Kay)
export default function Kart() {
  const { hytter, loading, error } = useFetchHytter(true);
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [zoom, setZoom] = useState(13);

  //filter til hytter
  const filteredHytter = filterHytter(hytter, filter);

  if (loading) return <p>{t("kart.laster")}</p>;
  if (error) return <p>{t("kart.feil_lasting")}: {error}</p>;

  const visMarker = zoom >= 8;

  return (
    <div>
      <KartFilter onFilterChange={setFilter} />

      <Kart_basic center={[66.351, 15.37]} zoom={13}>
        <ZoomLevel onZoomChange={setZoom} />
        {visMarker && filter.visFellesturer !== false && (
          <>
            <Polyline
              positions={tur}
              pathOptions={{
                color: "#0dbbcb",
                weight: 10,
                opacity: 0.8,
              }}
            />
            <Marker
              position={[59.40913199711592, 9.059338489488056]}
              icon={turIcon}
            >
              <Popup>
                <strong>{t("kart.tur_til_meny")}</strong>
                <br />
                {t("kart.varmdisk")}
              </Popup>
            </Marker>
          </>
        )}

        {visMarker && filter.visHytter &&
          filteredHytter.map((hytte) => (
            <Marker
              key={hytte.hytte_id}
              position={[hytte.hytte_breddegrad, hytte.hytte_lengdegrad]}
              icon={hytteIcon}
            >
              <Popup>
                <strong>{hytte.hytte_navn}</strong>
                <br />
                {t("felles.sengeplasser")}: {hytte.hytte_sengeplasser}
                <br />
                {hytte.hytte_betjeningsgrad}
              </Popup>
            </Marker>
          ))}
      </Kart_basic>
    </div>
  );
}
