import { useState } from 'react';
import { useAutentisering } from '../hooks/useAutentisering';
import { useVarsler } from '../hooks/useVarsler';
import VarselListe from '../components/varsling/VarselListe';
import VarselDetaljer from '../components/varsling/VarselDetaljer';
import PageWrapper from '../components/PageWrapper';
import './Varsler.css';

//Varselside. Viser varsler og lar bruker behandle oppgaver. Laget av Kay
export default function Varsler() {
    const { token, erAutentisert } = useAutentisering({ autoFetch: true });
    const {
        varsler, valgtVarsel, setValgtVarsel, loading, error,
        hentVarsel, merkSomLest, slettVarsel, behandleOppgave
    } = useVarsler({ token, autoPoll: erAutentisert });
    
    const [valgtId, setValgtId] = useState(null);

    const handleVelgVarsel = async (varsel) => {
        setValgtId(varsel.varsel_id);
        setValgtVarsel(varsel);
        await hentVarsel(varsel.varsel_id);
        if (varsel.status === 'ulest') {
            await merkSomLest(varsel.varsel_id);
        }
    };

    return (
        <PageWrapper>
            <div className="varsler-side">
                <div className="varsler-layout">
                    <VarselListe
                        varsler={varsler}
                        valgtId={valgtId}
                        onVelg={handleVelgVarsel}
                    />
                    <div className="varsler-innhold">
                        <VarselDetaljer
                            varsel={valgtVarsel}
                            loading={loading}
                            error={error}
                            onBehandle={behandleOppgave}
                            onSlett={slettVarsel}
                        />
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}