import { useState } from 'react';
import { useAutentisering } from '../../hooks/useAutentisering';
import { useArtikkel } from '../../hooks/useArtikkel';
import { useModal } from '../../hooks/useModal';
import ArtikkelSøk from './ArtikkelSøk';
import ConfirmModal from '../ConfirmModal';
import { toast } from 'react-toastify';
import '../fellesturer/fellestur-form/FellesturForm.css';

// Sletter en artikkel. Laget av Kay
export default function SlettArtikkel() {
    const { token } = useAutentisering({autoFetch: false});
    const { artikler, loading, slettArtikkel } = useArtikkel({autoFetch: true, token});
    const { isOpen, open, close } = useModal();
    const [valgtSlug, setValgtSlug] = useState('');


    const handleSlett = async () => {
        try {
            await slettArtikkel(valgtSlug);
            setValgtSlug('');
            close();
            toast.success('Artikkel slettet');
        } catch {
            toast.error('Kunne ikke slette artikkelen');
        }
    };

    const valgtTittel = artikler.find(a => a.artikkel_slug === valgtSlug)?.artikkel_tittel ?? '';

    return (
        <div className="fellestur-form-container">
            <h2>Slett artikkel</h2>

            <ArtikkelSøk
                artikler={artikler}
                onSelect={(slug) => setValgtSlug(slug)}
                lagretTittel={valgtTittel}
            />

            <div className="input-container">
                <button className="lagre-btn" onClick={open} disabled={!valgtSlug || loading}>
                    Slett artikkel
                </button>
            </div>

            <ConfirmModal
                show={isOpen}
                onClose={close}
                onConfirm={handleSlett}
                tittel="slett artikkel"
                melding={`Er du sikker på at du vil slette "${valgtTittel}"?`}
                confirmText="Slett"
            />
        </div>
    );
}
