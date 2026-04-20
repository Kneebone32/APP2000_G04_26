import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useModal } from '../../../hooks/useModal';
import { useArtikkel } from '../../../hooks/useArtikkel';
import Modal from '../../../modal/Modal';
import './ArtikkelModal.css';

//Modal som viser en artikkel. Laget av Kay
export default function ArtikkelModal({slug, lenkeTekst, lenkeKlasseNavn, children, onOpen}) {
    const { isOpen, open, close } = useModal();
    const { loading, error, hentArtikkel } = useArtikkel();
    const [artikkel, setArtikkel] = useState(null);

    useEffect(() => {
        if (!isOpen) return;
        hentArtikkel(slug).then(data => {
            if (data) setArtikkel(data);
        });
    }, [isOpen, slug, hentArtikkel]);

    const handleOpen = () => {
        onOpen?.();
        open();
    };

    return (
        <>
            <button className={lenkeKlasseNavn} onClick={handleOpen}>
                {children ?? lenkeTekst}
            </button>

            <Modal show={isOpen} onClose={close} title={artikkel?.artikkel_tittel ?? ''} size="lg">
                <div className="artikkel-modal-innhold">
                    {loading && <p className="artikkel-modal-status">Laster</p>}
                    {error && <p className="artikkel-modal-status artikkel-modal-feil">Kunne ikke hente artikkelen</p>}
                    
                    {artikkel && !loading && (
                        <ReactMarkdown>{artikkel.artikkel_innhold ?? ''}</ReactMarkdown>
                    )}
                </div>
            </Modal>
        </>
    );
}