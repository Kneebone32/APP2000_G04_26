import { useState } from 'react';
import { useAutentisering } from '../../hooks/useAutentisering';
import { useArtikkel } from '../../hooks/useArtikkel';
import ArtikkelSøk from './ArtikkelSøk';
import ArtikkelForm from './ArtikkelForm';
import { toast } from 'react-toastify';
import '../fellesturer/fellestur-form/FellesturForm.css';

//Redigerer en eksisterende artikkel. Laget av Kay
export default function RedigerArtikkel() {
    const { token } = useAutentisering({ autoFetch: false });
    const { artikler, loading, redigerArtikkel } = useArtikkel({ autoFetch: true, token });

    const [valgtSlug, setValgtSlug] = useState('');
    const [tittel, setTittel] = useState('');
    const [innhold, setInnhold] = useState('');

    const handleVelg = (slug) => {
        const artikkel = artikler.find(a => a.artikkel_slug === slug);
        if (!artikkel) { setValgtSlug(''); return; }
        setValgtSlug(slug);
        setTittel(artikkel.artikkel_tittel);
        setInnhold(artikkel.artikkel_innhold ?? '');
    };

    const handleLagre = async () => {
        if (!valgtSlug) return;
        try {
            await redigerArtikkel(valgtSlug, { artikkel_tittel: tittel, artikkel_innhold: innhold });
            toast.success('Artikkel lagret');
        } catch {
            toast.error('Kunne ikke lagre artikkelen');
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>Rediger artikkel</h2>

            <ArtikkelSøk
                artikler={artikler}
                onSelect={handleVelg}
                lagretTittel={artikler.find(a => a.artikkel_slug === valgtSlug)?.artikkel_tittel ?? ''}
            />

            {valgtSlug && (
                <ArtikkelForm
                    tittel={tittel}
                    onTittelChange={setTittel}
                    innhold={innhold}
                    onInnholdChange={setInnhold}
                    onLagre={handleLagre}
                    loading={loading}
                    buttonTekst="Lagre"
                />
            )}
        </div>
    );
}