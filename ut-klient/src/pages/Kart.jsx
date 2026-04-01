import { useState, Fragment } from "react";
import { Link } from "react-router-dom";
import { Marker, Popup, useMapEvents } from "react-leaflet";
import { useTranslation } from "react-i18next";
import Kart_basic, {hytteIcon, turIcon, turmålIcon} from "../components/kart/KartBasic";
import KartFilter from "../components/kart/KartFilter";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTurmål }  from "../hooks/useTurmål";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useFellestur } from "../hooks/useFellesturer";
import { filterHytter, filterTurMål, filterTurer, filterFellesturer } from "../utils/filterUtforskerKart";
import { HoverPolyline } from "../components/kart/HoverPolyline";
import { midtpunkt } from "../utils/geoUtils";
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
  const { fellesturer } = useFellestur({autoFetch: true});
  const { turmål } = useTurmål({autoFetch: true});
  const { t } = useTranslation();
  const [filter, setFilter] = useState({});
  const [zoom, setZoom] = useState(13);
  const [valgt, setValgt] = useState(null); 

  //toggle til stiene for en Tur/Fellestur
  const toggleValgt = (visTurID) => setValgt(gjeldende => gjeldende === visTurID ? null : visTurID);

  //filter til hytter
  const filteredHytter = filterHytter(hytter, filter);
  const filteredTurer = filterTurer(turer, filter);
  const filteredTurmål = filterTurMål(turmål, filter);
  const filteredFellesturer = filterFellesturer(fellesturer, filter);
  


  if (loadingHytter) return <p>{t("kart.laster")}</p>;
  if (errorHytter) return <p>{t("kart.feil_lasting")}: {errorHytter}</p>;

  if (loadingTurer) return <p>{t("kart.laster")}</p>;
  if (errorTurer) return <p>{t("kart.feil_lasting")}: {errorTurer}</p>;
  


  const visMarker = zoom >= 9;
  return (
    <div>
      <KartFilter onFilterChange={setFilter} fellesturer={fellesturer} />

      <Kart_basic center={[59.412533435582255, 9.067389041659744]} zoom={13}>
        <ZoomLevel onZoomChange={setZoom} />

        {/*Fellesturer*/}
         
        {visMarker && filter.visFellesturer  &&
          filteredFellesturer.map((fellestur) => {
            const key = `fellestur-${fellestur.aktivitet_id}`;
            return (
              <Fragment key={fellestur.aktivitet_id}>
                {valgt === key && fellestur.stier?.map((sti, index) => (
                  <HoverPolyline
                    key={index}
                    punkter={sti.sti_punkter.map(p => [p.breddegrad, p.lengdegrad])}
                  />
                ))}
                {midtpunkt(fellestur.stier?.[0]?.sti_punkter) && (
                  <Marker
                    position={midtpunkt(fellestur.stier[0].sti_punkter)}
                    icon={turIcon}
                    eventHandlers={{click: () => toggleValgt(key)}}
                  >
                    <Popup>
                      <strong>{fellestur.aktivitet_tittel}</strong>
                      <br />
                      {t("kart_detaljer.turtype")}{t(`enums.turtype.${fellestur.turtype}`)}
                      <br />
                      {t("kart_detaljer.vanskelighetsgrad")}{t(`enums.vanskelighetsgrad.${fellestur.vanskelighetsgrad}`)}
                      <br />
                      <Link to={`/fellesturer/${fellestur.aktivitet_id}`}>Se detaljer</Link>
                    </Popup>
                  </Marker>
                )}
              </Fragment>
            );
          })}
          
        

        {/*Turer /////////////////////////////////////////////////////////////////////////*/}
        {visMarker && filter.visTurer  &&
          filteredTurer.map((tur) => {
            const visTurID = `tur-${tur.tur_id}`;
            return (
              <Fragment key={tur.tur_id}>
                {valgt === visTurID && tur.stier?.map((sti, index) => (
                  <HoverPolyline
                    visTurID={sti.sti_id ?? index}
                    punkter={sti.punkter.map(p => [p.breddegrad, p.lengdegrad])}
                  />
                ))}
                {midtpunkt(tur.stier?.[0]?.punkter) && (
                  <Marker
                    position={midtpunkt(tur.stier[0].punkter)}
                    icon={turIcon}
                    eventHandlers={{ click: () => toggleValgt(visTurID) }}
                  >
                    <Popup>
                      <strong>{tur.tur_navn}</strong>
                      <br />
                      {t("kart_detaljer.turtype")}{t(`enums.turtype.${tur.turtype}`)}
                      <br />
                      {t("kart_detaljer.vanskelighetsgrad")}{t(`enums.vanskelighetsgrad.${tur.vanskelighetsgrad}`)}
                      <br />
                      <Link to={`/turer/${tur.tur_id}`}>Se detaljer</Link>
                    </Popup>
                  </Marker>
                )}
              </Fragment>
            );
          })}
          

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
                <br />
                <Link to={`/hytter/${hytte.hytte_id}`}>Se detaljer</Link>
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
                <h3>{mål.navn}</h3>
                <strong>Høyde: </strong> {mål.moh} moh.
                <br/>
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
