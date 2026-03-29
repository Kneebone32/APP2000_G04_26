import './VarselListe.css';

//viser alle varsler for innlogget bruker. Laget av Kay
export default function VarselListe({varsler, valgtId, onVelg}) {
    return (
        <div className="varsel-liste">
            <h3 className="varsel-liste-tittel">Varsler</h3>

            {varsler.length === 0 && (
                <p className="varsel-liste-tom">Ingen varsler</p>
            )}

            {/*liste over alle varsler*/}
            {varsler.map((varsel) => {
                const erValgt = varsel.varsel_id === valgtId;
                const erUlest = varsel.status === 'ulest';
                return (
                    <button
                        key={varsel.varsel_id}
                        className={`varsel-rad ${erValgt ? 'varsel-rad-aktiv' : ''} ${erUlest ? 'varsel-rad-ulest' : ''}`}
                        onClick={() => onVelg(varsel)}
                    >
                        <div className="varsel-rad-info">
                            <span className="varsel-tittel">{varsel.tittel}</span>
                            <span className="varsel-kategori">{varsel.varsel_kategori === 'oppgave' ? 'Oppgave' : 'Info'}</span>
                        </div>
                        {erUlest && <span className="varsel-ulest-indikator" />}
                    </button>
                );
            })}
        </div>
    );
}
