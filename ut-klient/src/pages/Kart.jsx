import { useState, Fragment } from "react";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import Kart_basic, {hytteIcon, turIcon, turmålIcon} from "../components/kart/KartBasic";
import KartFilter from "../components/kart/KartFilter";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTurmål }  from "../hooks/useTurmål";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { filterHytter, filterTurMål, filterTurer } from "../utils/filterUtforskerKart";
import { HoverPolyline } from "../components/kart/HoverPolyline";
import { tur } from "../assets/tur";
import "./Kart.css";
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
  const { hytter, loadingHytter, errorHytter } = useFetchHytter({autoFetch: true});
  const { turer, loadingTurer, errorTurer } = useFetchTurer({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [zoom, setZoom] = useState(13);

  //filter til hytter
  const filteredHytter = filterHytter(hytter, filter);
  const filteredTurer = filterTurer(turer, filter);
  const filteredTurmål = filterTurMål(turmål, filter);
  


  if (loadingHytter) return <p>{t("kart.laster")}</p>;
  if (errorHytter) return <p>{t("kart.feil_lasting")}: {errorHytter}</p>;

  if (loadingTurer) return <p>{t("kart.laster")}</p>;
  if (errorTurer) return <p>{t("kart.feil_lasting")}: {errorTurer}</p>;


  const visMarker = zoom >= 9;
  return (
    <div>
      <KartFilter onFilterChange={setFilter} />

      <Kart_basic center={[59.41020666063333, 9.069621134032557]} zoom={13}>
        <ZoomLevel onZoomChange={setZoom} />

        {/*Fellesturer*/}
        {visMarker && filter.visFellesturer !== false && (
          <>
            <HoverPolyline 
            key={tur.turrute_id} 
            punkter={tur} 
            >
            <Popup>
                <strong>{t("kart.tur_til_meny")}</strong>
                <br />
                {t("kart.varmdisk")}
              </Popup>
            </HoverPolyline>
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
            <Fragment key={tur.turrute_id}>
            <HoverPolyline 
            punkter={tur.punkter}
            >
              <Popup>
                    <strong>{tur.turrute_navn}</strong>
                    <br />
                    {t("kart_detaljer.turtype")}{t(`enums.turtype.${tur.turtype}`)}
                    <br />
                    {t("kart_detaljer.vanskelighetsgrad")}{t(`enums.vanskelighetsgrad.${tur.vanskelighetsgrad}`)}
                </Popup>
            </HoverPolyline>
            
            <Marker
                key={tur.turrute_id}
                position={tur.punkter[0]}
                icon={turIcon}
            >
              <Popup>
                    <strong>{tur.turrute_navn}</strong>
                    <br />
                    {t("kart_detaljer.turtype")}{t(`enums.turtype.${tur.turtype}`)}
                    <br />
                    {t("kart_detaljer.vanskelighetsgrad")}{t(`enums.vanskelighetsgrad.${tur.vanskelighetsgrad}`)}
                </Popup>
            </Marker>
            </Fragment>
            </>
          ))}
          

        {/*Hytter*/}
        {visMarker && filter.visHytter &&
          filteredHytter.map((hytte) => (
            <Marker
              key={hytte.hytte_id}
              position={[hytte.breddegrad, hytte.lengdegrad]}
              icon={hytteIcon}
            >
              <Popup>
                <strong>{hytte.navn}</strong>
                <br />
                {t("felles.sengeplasser")}: {hytte.sengeplasser}
                <br />
                {t(`enums.betjeningsgrad.${hytte.betjeningsgrad}`)}
              </Popup>
            </Marker>
          ))}
 
        {/*Turmål*/}
        {visMarker && filter.visTurmål &&
          filteredTurmål.map((mål) => (
            <Marker
              key={mål.turmaal_id}
              position={[mål.breddegrad, mål.lengdegrad]}
              icon={turmålIcon}
            >
              <Popup maxWidth={260} minWidth={260}>
                <strong>{mål.navn}</strong>
                  <img
                    className="popup-bilde"
                    src={`${mål.hovedbilde_url}?w=200&h=200&fit=fit`} 
                  />
              </Popup>
            </Marker>
          ))}
      </Kart_basic>
    </div>
  );
}
