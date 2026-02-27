import { useState } from "react";
import { useFetchHytter } from "../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";

export default function SlettHytte({ onSuccess }) {
    const { t } = useTranslation();
    const { hytter, deleteHytte } = useFetchHytter(true);
    const [selectedId, setSelectedId] = useState(null);

    const handleSlettHytte = async () => {
        if (!selectedId) {
            alert(t("hytter.velg_hytte"));
            return;
        }

        const selectedHytte = hytter.find(h => h.hytte_id === parseInt(selectedId)); 

        if (window.confirm(t("hytter.bekreft_sletting", { navn: selectedHytte.navn }))) {
            try {
                await deleteHytte(selectedId);
                alert(t("hytter.slettet"));
                setSelectedId(null);

                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error('Error: ', err);
                alert(t("hytter.feil_sletting_melding"));
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredHytter = hytter.filter(hytte => 
        hytte.hytte_id?.toString().includes(searchTerm) ||
        hytte.navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div>
            <h2>{t("hytter.slett_tittel")}</h2>
            <div>
                <label htmlFor="hytte-search">{t("hytter.søk_og_velg")}:</label>
                    <input
                        type="text"
                        id="hytte-search"
                        list="hytter-list"
                        value={searchTerm}
                        maxLength={50}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            const matchedHytte = hytter.find(h => 
                                `ID: ${h.hytte_id} - ${h.navn}` === e.target.value ||
                                h.hytte_id?.toString() === e.target.value
                            );
                            if (matchedHytte) {
                                setSelectedId(matchedHytte.hytte_id.toString());
                            } else {
                                setSelectedId("");
                            }
                        }}
                        placeholder={t("hytter.søk_placeholder")}
                    />
                    <datalist id="hytter-list">
                        {filteredHytter.map((hytte) => (
                            <option key={hytte.hytte_id} value={`ID: ${hytte.hytte_id} - ${hytte.navn}`} />
                        ))}
                    </datalist>
            </div>
            <button onClick={handleSlettHytte} disabled={!selectedId}>
                {t("hytter.slett_knapp")}
            </button>
        </div>
    );
};