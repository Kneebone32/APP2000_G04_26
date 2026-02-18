import { useState } from "react";
import { Marker, Polyline, Popup, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import Kart_basic, {
  hytteIcon,
  turIcon,
} from "../components/kart/KartBasic";
import KartFilter from "../components/kart/KartFilter";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { filterHytter } from "../utils/filterUtforskerKart";
import { filterTurer } from "../utils/filterUtforskerKart";
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
  const { hytter, loadingHytter, errorHytter } = useFetchHytter(true);
  const { turer, loadingTurer, errorTurer } = useFetchTurer(true);
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [zoom, setZoom] = useState(13);

  //filter til hytter
  const filteredHytter = filterHytter(hytter, filter);
  const filteredTurer = filterTurer(turer, filter);
  


  if (loadingHytter) return <p>{t("kart.laster")}</p>;
  if (errorHytter) return <p>{t("kart.feil_lasting")}: {errorHytter}</p>;

  if (loadingTurer) return <p>{t("kart.laster")}</p>;
  if (errorTurer) return <p>{t("kart.feil_lasting")}: {errorTurer}</p>;

  const visMarker = zoom >= 8;
  console.log(filteredTurer);
  return (
    <div>
      <KartFilter onFilterChange={setFilter} />

      <Kart_basic center={[60.4852, 5.3235]} zoom={13}>
        <ZoomLevel onZoomChange={setZoom} />

        {/*Fellesturer*/}
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
              position={tur[0]}
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

        {/*Turer /////////////////////////////////////////////////////////////////////////*/}
        {visMarker && filter.visTurer &&
          filteredTurer.map((tur) => (
            <>
            <Polyline
              positions={tur.punkter}
              pathOptions={{
                color: "#0dbbcb",
                weight: 10,
                opacity: 0.8,
              }}
            />
            <Marker
              key={tur.turrute_id}
              position={tur.punkter[0]}
              icon={turIcon}
            >
              <Popup>
                <strong>{tur.turrute_navn}</strong>
                <br />
                Turtype: {tur.turtype}
                <br />
                Vanskelighetsgrad: {tur.vanskelighetsgrad}
                <br />
                Varighet: {tur.varighet}
              </Popup>
              </Marker>
            </>
          ))}
          

        {/*Hytter*/}
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
