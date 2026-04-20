import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAutentisering } from '../../hooks/useAutentisering';
import { useArtikkel } from '../../hooks/useArtikkel';
import ArtikkelForm from './ArtikkelForm';
import { toast } from 'react-toastify';
import '../fellesturer/fellestur-form/FellesturForm.css';

//Oppretter en ny artikkel. Laget av Kay
export default function LeggTilArtikkel() {
    const { t } = useTranslation();
    const { token } = useAutentisering({ autoFetch: false });
    const { loading, opprettArtikkel } = useArtikkel({ token });
    const [slug, setSlug] = useState('');
    const [tittel, setTittel] = useState('');
    const [innhold, setInnhold] = useState('');

    const handleOpprett = async () => {
        if (!slug.trim() || !tittel.trim()) return;
        try {
            await opprettArtikkel({artikkel_slug: slug.trim(), artikkel_tittel: tittel.trim(), artikkel_innhold: innhold});
            toast.success(t('artikkel.opprettet'));
            setSlug('');
            setTittel('');
            setInnhold('');
        } catch {
            toast.error(t('artikkel.feil_opprettelse'));
        }
    };

    return (
        <div className="fellestur-form-container">
            <h2>{t("artikkel.legg_til_tittel")}</h2>

            <div className="input-container">
                <label className="input">{t("artikkel.slug")}
                    <input
                        type="text"
                        value={slug}
                        onChange={e => setSlug(e.target.value)}
                    />
                </label>
            </div>

            <ArtikkelForm
                tittel={tittel}
                onTittelChange={setTittel}
                innhold={innhold}
                onInnholdChange={setInnhold}
                onLagre={handleOpprett}
                loading={loading}
                buttonTekst={t("artikkel.opprett_knapp")}
            />
        </div>
    );
}