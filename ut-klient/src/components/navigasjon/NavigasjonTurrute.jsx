import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMap, useMapEvents, Polyline, Marker } from 'react-leaflet';
import { useFetchTurer } from '../../hooks/useFetchTurer';
import { FiNavigation } from "react-icons/fi";    
import { navigasjonIcon } from "../kart/KartBasic"; 
import ConfirmModal from '../ConfirmModal'; 
import "./NavigasjonFinnPosisjon.css";

//funksjon for å navigere en turrute. Laget av Kay
export default function TurNavigasjon({ turId }) {
    const redir = useNavigate();
    const map = useMap();
    const { turPunkter, fetchTurRute, loadingTurPunkter} = useFetchTurer(false);
    const [brukerPos, setBrukerPos] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);

    const [visVelkomst, setVisVelkomst] = useState(true);


    const handleStartNavigasjon = () => {
        setVisVelkomst(false);
        setIsFollowing(true);
        toast.success("Navigasjon startet!");
    };


    useEffect(() => {
        if (turId) {
            fetchTurRute(turId);
        }
    }, [turId, fetchTurRute]);

    useEffect(() => {
        if (!loadingTurPunkter && turPunkter.length === 0) {
            toast.error("Kunne ikke finne valgt turrute." + "Du blir sendt tilbake til forrige side")
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
                tittel="Ut på tur, aldri sur!"
                melding="Vil du starte navigasjonen?"
                confirmTekst="Start"
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
                        title={!brukerPos ? "Bruk posisjon" : "Sentrér"}
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