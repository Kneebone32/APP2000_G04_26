//Håndterer hytteeier-varsler for ny fellestur. Laget av Kay
export default function OppgaveHytteeierNyFellestur({ varsel, loading, onBeslutning }) {
    const erBehandlet = varsel.status === 'behandlet' || varsel.status === 'godtatt' || varsel.status === 'avvist';
    //{varsel.status === 'godtatt' ? 'Du bekreftet at du har plass' : 'Du meldte at du ikke har plass'}

    if (erBehandlet) {
        return (
            <div className="varsel-detaljer-behandlet">
                <span>Er behandlet. HUSK: Legg til mer info her (avslått/godkjent)</span>
                <button
                    className="varsel-knapp varsel-knapp-avvis"
                    onClick={() => onBeslutning('avvist', { melding: 'Avslått – hyttebestillinger vil ikke forekomme' })}
                    disabled={loading}
                    style={{margin: "1rem "}}
                >
                    Trekk bekreftelse
                </button>
            </div>
        );
    }

    return (
        <div className="varsel-detaljer-handlinger">
            <button
                className="varsel-knapp varsel-knapp-godta"
                onClick={() => onBeslutning('godtatt', { melding: 'Bekreftet. Hyttebestillinger kan forekomme' })}
                disabled={loading}
            >
                Jeg har plass
            </button>
            <button
                className="varsel-knapp varsel-knapp-avvis"
                onClick={() => onBeslutning('avvist', { melding: 'Avslått. Hyttebestillinger vil ikke forekomme' })}
                disabled={loading}
            >
                Jeg har ikke plass
            </button>
        </div>
    );
}
