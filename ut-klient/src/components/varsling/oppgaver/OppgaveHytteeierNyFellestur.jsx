import {FORESPØRSEL_STATUS} from "../../../constants/konstanter";

//Håndterer hytteeier-varsler for ny fellestur. Laget av Kay
export default function OppgaveHytteeierNyFellestur({ varsel, loading, onBeslutning }) {
    const erBehandlet = varsel.status === 'behandlet';

    if (erBehandlet) {
        return (
            <div className="varsel-detaljer-behandlet">
                {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT ? 'Du bekreftet at du har plass' : 'Du meldte at du ikke har plass'}
                {varsel.foresporsel_status === FORESPØRSEL_STATUS.GODKJENT && (
                <button
                    className="varsel-knapp varsel-knapp-avvis"
                    onClick={() => onBeslutning(false, { melding: 'Avslått. hyttebestillinger vil ikke forekomme' })}
                    disabled={loading}
                    style={{margin: "1rem "}}
                >
                    Trekk bekreftelse
                </button>
                )}
            </div>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning(true, { melding: 'Bekreftet. Hyttebestillinger kan forekomme' })}
                disabled={loading}
            >
                Jeg har plass
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning(false, { melding: 'Avslått. Hyttebestillinger vil ikke forekomme' })}
                disabled={loading}
            >
                Jeg har ikke plass
            </button>
        </div>
    );
}
