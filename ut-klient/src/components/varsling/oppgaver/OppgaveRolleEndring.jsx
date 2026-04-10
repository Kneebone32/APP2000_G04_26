import {FORESPØRSEL_STATUS} from "../../../constants/konstanter";

//Håndterer rollebytte i varslingssystemet. Laget av Kay
export default function OppgaveRolleEndring({varsel, loading, onBeslutning}) {
    const erBehandlet = varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT || varsel.foresporsel_status === FORESPØRSEL_STATUS.AVSLÅTT;

    if (erBehandlet) {
        return (
            <p className="varsel-detaljer-behandlet">
               {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? 'Du godtok denne forespørselen' : 'Du avslo denne forespørselen'}
            </p>
        );
    }

    return (
        <>
        {varsel && !loading && (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning('godtatt', { melding: 'Rolleendring godtatt' })}
                disabled={loading}
            >
                Godta rolleendring
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning('avvist', { melding: 'Rolleendring avvist' })}
                disabled={loading}
            >
                Avvis
            </button>
        </div>
        )}
        </>
    );
}
