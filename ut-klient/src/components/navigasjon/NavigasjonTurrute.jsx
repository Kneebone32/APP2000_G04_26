import { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useMap, useMapEvents, Polyline, Marker } from 'react-leaflet';
import { useFetchTurer } from '../../hooks/useFetchTurer';
import { useFellestur } from '../../hooks/useFellesturer';
import { FiNavigation } from "react-icons/fi";
import { navigasjonIcon, marker1 } from "../kart/KartBasic";
import ConfirmModal from '../ConfirmModal';
import { useTranslation } from 'react-i18next';
import { erSammeKoordinat } from '../../utils/erGyldigKoordinat';
import "./NavigasjonFinnPosisjon.css";


//funksjon for å navigere en turrute eller fellestur. Laget av Kay
export default function TurNavigasjon({turId, fellesturId}) {
    const { t } = useTranslation();
    const redir = useNavigate();
    const map = useMap();

    const { turer, loadingTurer } = useFetchTurer({ autoFetch: !!turId });
    const { fellestur, loadingFellesturer } = useFellestur({ hentTurID: fellesturId ?? null });

    const [brukerPos, setBrukerPos] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [visVelkomst, setVisVelkomst] = useState(true);
    const ruteFerdig = useRef(false);
    const harHentet = useRef(false);

    const loading = turId ? loadingTurer : loadingFellesturer;

    //finner riktig tur og flater ut punktene i stier
    const turPunkter = useMemo(() => {
        if (turId) {
            const tur = turer.find(t => t.tur_id === Number(turId));
            if (!tur?.stier) return [];
            return tur.stier.flatMap(sti =>
                (sti.punkter || []).map(p => [p.breddegrad, p.lengdegrad])
            );
        }
        if (fellesturId && fellestur?.stier) {
            return fellestur.stier.flatMap(sti =>
                (sti.sti_punkter || []).map(p => [p.breddegrad, p.lengdegrad])
            );
        }
        return [];
    }, [turId, fellesturId, turer, fellestur]);

    const handleStartNavigasjon = () => {
        setVisVelkomst(false);
        setIsFollowing(true);
        toast.success(t("navigasjon.startet"));
    };

    //liten fix for å unngå at bruker blir sendt tilbake for tidlig. liker ikke denne, finn en annen løsning hvis tid.
    useEffect(() => {
        if (loading) harHentet.current = true;
    }, [loading]);

    //Redirect hvis ingen punkter etter lasting
    useEffect(() => {
        if (harHentet.current && !loading && turPunkter.length === 0) {
            toast.error(t("navigasjon.feil_turrute") + t("navigasjon.sendes_tilbake"));
            setTimeout(() => redir(-1), 5000);
        }
    }, [loading, turPunkter.length, redir, t]);

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

    //Sjekker om brukeren har nådd siste punkt
    useEffect(() => {
        if (!brukerPos || turPunkter.length === 0 || ruteFerdig.current) return;
        const sistePunkt = turPunkter[turPunkter.length - 1];
        if (erSammeKoordinat([brukerPos.lat, brukerPos.lng], sistePunkt, 0.05)) {
            ruteFerdig.current = true;
            toast.success("Du er fremme!");
            map.stopLocate();
            setTimeout(() => setIsFollowing(false), 0);
        }
    }, [brukerPos, turPunkter, map]);

    useEffect(() => {
        map.locate({ watch: true, enableHighAccuracy: true });
        return () => map.stopLocate();
    }, [map]);

    return (
        <>{turPunkter.length > 0 && (
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
                <Polyline
                    positions={turPunkter}
                    pathOptions={{ color: '#105dd2', weight: 5, opacity: 0.7 }}
                />
                {brukerPos && (
                    <Marker position={brukerPos} icon={navigasjonIcon} />
                )}
                <Marker position={turPunkter[0]} icon={marker1} />
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
        )}</>
    );
}
