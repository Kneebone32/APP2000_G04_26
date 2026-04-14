import { FORESPØRSEL_STATUS } from '../../../constants/konstanter';

//Håndterer admin-varsler for annonseforespørsler. Laget av Kay
export default function OppgaveAnnonseForespørsel({varsel, loading, onBeslutning}) {
    const erBehandlet = varsel.status === 'behandlet';

    if (erBehandlet) {
        return (
            <div className="varsel-detaljer-behandlet">
                {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT
                    ? 'Annonsen ble godkjent'
                    : 'Annonsen ble avvist'}
            </div>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning(true, {melding: 'Annonse godkjent'})}
                disabled={loading}
            >
                Godkjenn
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning(false, {melding: 'Annonse avvist'})}
                disabled={loading}
            >
                Avvis
            </button>
        </div>
    );
}