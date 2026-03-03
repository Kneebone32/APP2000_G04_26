import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMap, useMapEvents, Polyline, Marker } from 'react-leaflet';
import { useFetchTurer } from '../../hooks/useFetchTurer';
import { FiNavigation } from "react-icons/fi";    
import { navigasjonIcon } from "../kart/KartBasic"; 
import ConfirmModal from '../ConfirmModal'; 
import { useTranslation } from 'react-i18next';
import "./NavigasjonFinnPosisjon.css";

//funksjon for å navigere en turrute. Laget av Kay
export default function TurNavigasjon({ turId }) {
    const { t } = useTranslation();
    const redir = useNavigate();
    const map = useMap();
    const { turPunkter, fetchTurRute, loadingTurPunkter} = useFetchTurer(false);
    const [brukerPos, setBrukerPos] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const [visVelkomst, setVisVelkomst] = useState(true);


    const handleStartNavigasjon = () => {
        setVisVelkomst(false);
        setIsFollowing(true);
        toast.success(t("navigasjon.startet"));
    };


    useEffect(() => {
        if (turId) {
            fetchTurRute(turId);
        }
    }, [turId, fetchTurRute]);

    useEffect(() => {
        if (!loadingTurPunkter && turPunkter.length === 0) {
            toast.error(t("navigasjon.feil_turrute") + t("navigasjon.sendes_tilbake"))
            setTimeout(() => {
            redir(-1); 
            }, 5000);
        }
    }, [loadingTurPunkter, turPunkter.length, redir]);


    useMapEvents({
        locationfound(e) {
            setBrukerPos(e.latlng);
            if (isFollowing) {
                map.flyTo(e.latlng, map.getZoom());
            }
        },
        dragstart() {
            setIsFollowing(false);
        }
    });

    useEffect(() => {
        if (isFollowing) {
            map.locate({ watch: true, enableHighAccuracy: true });
        } else {
            map.stopLocate();
        }
    }, [isFollowing, map]);

    return (
        <> {turPunkter.length > 0 && (
            <>
            {/*Bruker Modal som en velkomstmelding*/}
            <ConfirmModal 
                show={visVelkomst} 
                onClose={() => setVisVelkomst(false)} 
                onConfirm={handleStartNavigasjon}
                tittel={t("navigasjon.modal_tittel")}
                melding={t("navigasjon.bekreft_start")}
                confirmTekst={t("navigasjon.start")}
                knappFarge="blå"
            />
            {!loadingTurPunkter && turPunkter.length > 0 && (
                <Polyline 
                    positions={turPunkter} 
                    pathOptions={{ color: '#ff00fb', weight: 5, opacity: 0.7 }} 
                />
            )}
            {brukerPos && (
                <Marker
                  position={brukerPos}
                  icon={navigasjonIcon}
                ></Marker>
            )}
            <div className="leaflet-bottom leaflet-right" style={{ marginBottom: '90px' }}>
                <div className="leaflet-control leaflet-bar">
                    <button 
                        className="posisjons-knapp"
                        title={!brukerPos ? t("navigasjon.bruk_posisjon") : t("navigasjon.sentrér")}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsFollowing(!isFollowing);
                        }}
                    >
                        <FiNavigation 
                            className={`pos-ikon ${isFollowing && !brukerPos ? 'puls-effekt' : ''}`}
                            size={22} 
                            fill={isFollowing && brukerPos ? "#0078ff" : "none"} 
                        />
                    </button>
                </div>
            </div>
            </>
            )}
        </>
    );
}