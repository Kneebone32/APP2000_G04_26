import { useState } from 'react';
import { toast } from 'react-toastify';
import { PÅMELDING_STATUS } from '../../../constants/konstanter';
import './PåmeldingKnapper.css';

//Viser påmeldingsknapper basert på brukerens påmeldings-status. Laget av Kay
export default function PåmeldingKnapper({aktivitetDatoId, minPåmelding, ledigePlasser, antallInteresserteDeltakere, loading, meldPå, meldAv, registrerBildesamtykke, erLastForPamelding = false}) {

    const [visModal, setVisModal] = useState(false);
    
    const status = minPåmelding?.pamelding_status ?? null;
    const fullBooket = ledigePlasser !== null && ledigePlasser <= 0;
    

    if (!aktivitetDatoId) return <p className="påmelding-ingen-dato">Velg en dato for å melde deg på</p>;

    const handleMeldPå = async (nyStatus) => {
        try {
            await meldPå(aktivitetDatoId, nyStatus);
            toast.success(nyStatus === PÅMELDING_STATUS.BINDENDE ? 'Du er nå påmeldt!' : 'Du er markert som interessert!');
        } catch (err) {
            toast.error(err.message ?? 'Noe gikk galt. Prøv igjen.');
        }
    };

    const handleBindendeMeldPå = async (samtykker) => {
        setVisModal(false);
        if (!samtykker) await registrerBildesamtykke(aktivitetDatoId, false);
        await handleMeldPå(PÅMELDING_STATUS.BINDENDE);
    };

    const handleMeldAv = async () => {
        try {
            await meldAv(aktivitetDatoId);
            toast.success('Du er meldt av.');
        } catch {
            toast.error('Noe gikk galt. Prøv igjen.');
        }
    };

    return (
        <div className="påmelding-knapper">

            {ledigePlasser !== null && !erLastForPamelding && (
                <p className="ledige-plasser">
                    {ledigePlasser > 0 ? `${ledigePlasser} ledige plasser` : 'Fullt'}
                </p>
            )}
            {antallInteresserteDeltakere > 0 && (
                <p className="interesserte-deltakere">{antallInteresserteDeltakere} interessert</p>
            )}

            {/*Ingen påmelding eller avmeldt*/}
            {(status === null || status === PÅMELDING_STATUS.AVMELDT) && (
                <>
                    <button
                        className="påmelding-btn interessert"
                        onClick={() => handleMeldPå(PÅMELDING_STATUS.INTERESSERT)}
                        disabled={loading || fullBooket || erLastForPamelding}
                    >
                        Jeg er interessert
                    </button>
                    <button
                        className="påmelding-btn bindende"
                        onClick={() => setVisModal(true)}
                        disabled={fullBooket || erLastForPamelding}
                    >
                        Meld meg på
                    </button>
                </>
            )}

            {/*Interessert*/}
            {status === PÅMELDING_STATUS.INTERESSERT && (
                <>
                    <p className="påmelding-status interessert">Du er markert som interessert</p>
                    <button
                        className="påmelding-btn bindende"
                        onClick={() => setVisModal(true)}
                        disabled={fullBooket}
                    >
                        Meld meg på
                    </button>
                    <button
                        className="påmelding-btn avmeld"
                        onClick={handleMeldAv}
                        disabled={loading}
                    >
                        Fjern interesse
                    </button>
                </>
            )}

            {/*Bindende*/}
            {status === PÅMELDING_STATUS.BINDENDE && (
                <>
                    <p className="påmelding-status bindende">Du er påmeldt</p>
                    {!erLastForPamelding && (
                        <button
                            className="påmelding-btn avmeld"
                            onClick={handleMeldAv}
                            disabled={loading}
                        >
                            Meld meg av
                        </button>
                    )}
                </>
            )}

            {/*Fristilt*/}
            {status === PÅMELDING_STATUS.FRISTILT && (
                <>
                    <p className="påmelding-status fristilt">Du er fristilt fra denne turen</p>
                </>
            )}

            {/*Bildesamtykke-modal*/}
            {visModal && (
                <div className="samtykke-overlay" onClick={() => setVisModal(false)}>
                    <div className="samtykke-modal" onClick={(e) => e.stopPropagation()}>
                        <h3 className="samtykke-tittel">Bildesamtykke</h3>
                        <p className="samtykke-tekst">
                            Som deltaker på denne fellesturen kan bilder tatt underveis deles i gruppechatten for turen.
                            Vennligst velg om du samtykker til at bilder du er med på kan deles med de andre deltakerne i gruppechatten.
                        </p>
                        <div className="samtykke-knapper">
                            <button className="samtykke-btn bekreft" onClick={() => handleBindendeMeldPå(true)} disabled={loading}>
                                Jeg samtykker. Meld meg på
                            </button>

                            <button className="samtykke-btn uten-samtykke" onClick={() => handleBindendeMeldPå(false)} disabled={loading}>
                                Meld på uten samtykke
                            </button>

                            <button className="samtykke-btn avbryt" onClick={() => setVisModal(false)}>
                                Avbryt
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
