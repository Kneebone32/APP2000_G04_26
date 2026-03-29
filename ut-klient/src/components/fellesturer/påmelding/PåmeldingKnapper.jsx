import { toast } from 'react-toastify';
import { PÅMELDING_STATUS } from '../../../constants/konstanter';
import './PåmeldingKnapper.css';

//Viser påmeldingsknapper basert på brukerens påmeldings-status. Laget av Kay
export default function PåmeldingKnapper({aktivitetDatoId, minPåmelding, ledigePlasser, antallInteresserteDeltakere, loading, meldPå, meldAv}) {

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

            {ledigePlasser !== null && (
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
                        disabled={loading}
                    >
                        Jeg er interessert
                    </button>
                    <button
                        className="påmelding-btn bindende"
                        onClick={() => handleMeldPå(PÅMELDING_STATUS.BINDENDE)}
                        disabled={fullBooket}
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
                        onClick={() => handleMeldPå(PÅMELDING_STATUS.BINDENDE)}
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
                    <button
                        className="påmelding-btn avmeld"
                        onClick={handleMeldAv}
                        disabled={loading}
                    >
                        Meld meg av
                    </button>
                </>
            )}

            {/*Fristilt*/}
            {status === PÅMELDING_STATUS.FRISTILT && (
                <>
                    <p className="påmelding-status fristilt">Du er fristilt fra denne turen</p>
                    <button
                        className="påmelding-btn bindende"
                        onClick={() => handleMeldPå(PÅMELDING_STATUS.BINDENDE)}
                        disabled={fullBooket}
                    >
                        Meld meg på igjen
                    </button>
                </>
            )}
        </div>
    );
}
