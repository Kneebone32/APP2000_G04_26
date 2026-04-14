import ReactMarkdown from 'react-markdown';
import { useModal } from '../../hooks/useModal';
import Modal from '../../modal/Modal';
import './Artikkel.css';
import './modal/ArtikkelModal.css';
import '../fellesturer/fellestur-form/FellesturForm.css';

//Gjenbrukbart form til Artikkel. Laget av Kay
export default function ArtikkelForm({ tittel, onTittelChange, innhold, onInnholdChange, onLagre, loading, buttonTekst = 'Lagre' }) {
    const { isOpen, open, close } = useModal();
    return (
        <>
            <div className="input-container">
                <label className="input">Tittel
                    <input
                        type="text"
                        value={tittel}
                        onChange={e => onTittelChange(e.target.value)}
                    />
                </label>
            </div>

            <div className="input-container">
                <div className="artikkel-editor-faner">
                    <button type="button" onClick={open}>
                        Forhåndsvisning
                    </button>
                </div>

                <textarea
                    className="artikkel-textarea"
                    value={innhold}
                    onChange={e => onInnholdChange(e.target.value)}
                    placeholder="Skriv innhold i Markdown"
                    rows={20}
                />
            </div>

            <Modal show={isOpen} onClose={close} title={tittel} size="lg">
                <div className="artikkel-modal-innhold">
                    <ReactMarkdown>{innhold}</ReactMarkdown>
                </div>
            </Modal>

            <button className="artikkel-lagre-btn" onClick={onLagre} disabled={loading}>
                {loading ? `${buttonTekst}` : buttonTekst}
            </button>
        </>
    );
}