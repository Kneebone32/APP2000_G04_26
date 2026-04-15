import { useState } from 'react';
import { useAutentisering } from '../../hooks/useAutentisering';
import { useArtikkel } from '../../hooks/useArtikkel';
import { useModal } from '../../hooks/useModal';
import ArtikkelSøk from './ArtikkelSøk';
import ConfirmModal from '../ConfirmModal';
import { toast } from 'react-toastify';
import '../fellesturer/fellestur-form/FellesturForm.css';
import './Artikkel.css';

//Sletter en artikkel. Laget av Kay
export default function SlettArtikkel() {
    const { token } = useAutentisering({autoFetch: false});
    const { artikler, slettArtikkel } = useArtikkel({autoFetch: true, token});
    const { isOpen, open, close } = useModal();
    const [valgtId, setValgtId] = useState(null);

    const handleSlett = async () => {
        try {
            await slettArtikkel(valgtId);
            setValgtId(null);
            close();
            toast.success('Artikkel slettet');
        } catch {
            toast.error('Kunne ikke slette artikkelen');
        }
    };

    const valgtTittel = artikler.find(a => a.artikkel_id === valgtId)?.artikkel_tittel ?? '';

    return (
        <div className="fellestur-form-container">
            <h2>Slett artikkel</h2>

            <ArtikkelSøk
                artikler={artikler}
                onSelect={(id) => setValgtId(id)}
                lagretTittel={valgtTittel}
            />

            <div className="input-container">
                <button className="artikkel-lagre-btn" onClick={open} disabled={!valgtId}>
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
