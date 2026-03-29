import { useEffect, useState } from 'react';
import { useAutentisering } from '../hooks/useAutentisering';
import { useMeldinger } from '../hooks/useMeldinger';
import SamtaleListe from '../components/meldinger/SamtaleListe';
import MeldingsBoks from '../components/meldinger/MeldingsBoks';
import PageWrapper from '../components/PageWrapper';
import './Meldinger.css';
import { toast } from 'react-toastify';

//Meldingsside. Viser meldinger og lar bruken chatte. Laget av Kay
export default function Meldinger() {
    const { bruker, token, erAutentisert } = useAutentisering({ autoFetch: true });
    const {
        meldinger, samtaler, loading, error,
        hentSamtaler, hentSamtale, sendMelding,
        startPoll, stopPoll
    } = useMeldinger({ token });

    const [valgtSamtale, setValgtSamtale] = useState(null);


    //Henter samtalelisten når siden lastes
    useEffect(() => {
        if (erAutentisert) hentSamtaler();
    }, [erAutentisert, hentSamtaler]);

    //Starter polling når en samtale velges
    useEffect(() => {
        if (!valgtSamtale) return;
        startPoll(() => hentSamtale(valgtSamtale.bruker_id));
        return () => stopPoll();
    }, [valgtSamtale, startPoll, stopPoll, hentSamtale]);

    const handleVelgSamtale = (samtale) => {
        stopPoll();
        setValgtSamtale(samtale);
    };

    const handleSend = async (innhold) => {
        toast("shit! Denne er ikke koblet til backend!")
        //await sendMelding(valgtSamtale.bruker_id, innhold);
        //await hentSamtale(valgtSamtale.bruker_id);
    };

    return (
        <PageWrapper>
        <div className="meldinger-side">
            
            <div className="meldinger-layout">
                <SamtaleListe
                    samtaler={samtaler}
                    valgtId={valgtSamtale?.bruker_id}
                    onVelg={handleVelgSamtale}
                />
                <div className="meldinger-chat">
                    {valgtSamtale ? (
                        <MeldingsBoks
                            tittel={valgtSamtale.navn}
                            meldinger={meldinger}
                            loading={loading}
                            error={error}
                            brukerId={bruker?.bruker_id}
                            onSend={handleSend}
                        />
                    ) : (
                        <div className="meldinger-ingen-valgt">
                            <p>Velg en samtale</p>
                        </div>
                    )}
                </div>
            </div>
            
        </div>
        </PageWrapper>
    );
}
