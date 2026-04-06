import { useEffect, useState } from 'react';
import { useAutentisering } from '../hooks/useAutentisering';
import { useMeldinger } from '../hooks/useMeldinger';
import SamtaleListe from '../components/meldinger/SamtaleListe';
import MeldingsBoks from '../components/meldinger/MeldingsBoks';
import PageWrapper from '../components/PageWrapper';
import './Meldinger.css';


//Meldingsside. Viser meldinger og lar bruken chatte. Laget av Kay
export default function Meldinger() {
    const { bruker, token, erAutentisert } = useAutentisering({ autoFetch: true });
    const {
        meldinger, samtaler, loading, error,
        hentSamtaler, hentMeldinger, sendMelding,
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
        startPoll(() => hentMeldinger(valgtSamtale.samtale_id));
        return () => stopPoll();
    }, [valgtSamtale, startPoll, stopPoll, hentMeldinger]);

    const handleVelgSamtale = (samtale) => {
        stopPoll();
        setValgtSamtale(samtale);
    };

    const handleSend = async (meldingTekst) => {
        if (!valgtSamtale) return;
        await sendMelding(valgtSamtale.samtale_id, meldingTekst);
        await hentMeldinger(valgtSamtale.samtale_id);
    };

    return (
        <PageWrapper>
        <div className="meldinger-side">
            
            <div className="meldinger-layout">
                <SamtaleListe
                    samtaler={samtaler}
                    valgtId={valgtSamtale?.samtale_id}
                    onVelg={handleVelgSamtale}
                />
                <div className="meldinger-chat">
                    {valgtSamtale ? (
                        <MeldingsBoks
                            tittel={valgtSamtale.visningsnavn}
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
