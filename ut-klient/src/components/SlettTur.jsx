import { useState } from "react";
import { useFetchTurer } from "../hooks/useFetchTurer";
import { useTranslation } from "react-i18next";

export default function SlettTur({ onSuccess }) {
    const { t } = useTranslation();
    const { turer, deleteTur } = useFetchTurer(true);
    const [selectedId, setSelectedId] = useState(null);

    const handleSlettTur = async () => {
        if (!selectedId) {
            alert(t("tur.velg_tur"));
            return;
        }

        const selectedTur = turer.find(t => t.turrute_id === parseInt(selectedId)); 

        if (window.confirm(t("tur.bekreft_sletting", { navn: selectedTur.turrute_navn }))) {
            try {
                await deleteTur(selectedId);
                alert(t("tur.tur_slettet"));
                setSelectedId(null);

                if (onSuccess) {
                    onSuccess();
                }
            } catch (err) {
                console.error('Error: ', err);
                alert(t("tur.feil_sletting_melding"));
            }
        }
    };

    const [searchTerm, setSearchTerm] = useState("");

    const filteredTurer = turer.filter(tur => 
        tur.turrute_id?.toString().includes(searchTerm) ||
        tur.turrute_navn?.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div>
            <h2>{t("tur.slett_tittel")}</h2>
            <div>
                <label htmlFor="tur-search">{t("tur.søk_og_velg")}:</label>
                    <input
                        type="text"
                        id="tur-search"
                        list="turer-list"
                        value={searchTerm}
                        maxLength={50}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            const matchedTur = filteredTurer.find(t => 
                                `ID: ${t.turrute_id} - ${t.turrute_navn}` === e.target.value ||
                                t.turrute_id?.toString() === e.target.value
                            );
                            if (matchedTur) {
                                setSelectedId(matchedTur.turrute_id.toString());
                            } else {
                                setSelectedId("");
                            }
                        }}
                        placeholder={t("tur.søk_placeholder")}
                    />
                    <datalist id="turer-list">
                        {filteredTurer.map((tur) => (
                            <option key={tur.turrute_id} value={`ID: ${tur.turrute_id} - ${tur.turrute_navn}`} />
                        ))}
                    </datalist>
            </div>
            <button onClick={handleSlettTur} disabled={!selectedId}>
                {t("tur.slett_knapp")}
            </button>
        </div>
    );
};