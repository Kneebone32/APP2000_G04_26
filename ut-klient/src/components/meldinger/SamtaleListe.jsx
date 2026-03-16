import './SamtaleListe.css';

//Liste over alle samtalene til bruker. Laget av Kay
export default function SamtaleListe({ samtaler, valgtId, onVelg }) {
    //variabler må oppdateres med samme formatet til DB
    return (
        <div className="samtale-liste">
            <h3 className="samtale-liste-tittel">Meldinger</h3>

            {samtaler.length === 0 && (
                <p className="samtale-liste-tom">Ingen samtaler</p>
            )}

            {/*liste over alle samtaler*/}
            {samtaler.map((samtale) => {
                const erValgt = samtale.bruker_id === valgtId;
                const harUlesteMeldinger = samtale.uleste > 0;
                return (
                    <button
                        key={samtale.bruker_id}
                        className={`samtale-rad ${erValgt ? 'samtale-rad-aktiv' : ''}`}
                        onClick={() => onVelg(samtale)}
                    >
                        <div className="samtale-rad-info">
                            <span className="samtale-navn">{samtale.navn}</span>
                            {samtale.siste_melding && (
                                <span className="samtale-forhåndsvisning">{samtale.siste_melding}</span>
                            )}
                        </div>
                        {harUlesteMeldinger && (
                            <span className="samtale-uleste">{samtale.uleste}</span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}
