import { useState } from "react";
import { useAutentisering } from "../../hooks/useAutentisering";
import { useFetchHytter } from "../../hooks/useFetchHytter";
import { useTranslation } from "react-i18next";

// Lar bruker søke opp en hytte og slette den etter bekreftelse. Laget av Olai.
export default function SlettHytte({onSuccess, hytter: hytter_prop}) {
    const { t } = useTranslation();
    const { token } = useAutentisering({ autoFetch: true });
    const { hytter: hytter_alle, deleteHytte } = useFetchHytter({ autoFetch: !hytter_prop, token });
    const hytter = hytter_prop ?? hytter_alle;
    const [selectedId, setSelectedId] = useState(null);
    

    // Sletter valgt hytte hvis bruker bekrefter i dialogen.
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

    // Filtrerer forslagene i datalisten basert på ID eller navn.
    const filteredHytter = hytter.filter(hytte => 
        hytte.id?.toString().includes(searchTerm) ||
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
                            // Matcher fritekst mot datalist-verdi og setter valgt hytte-ID.
                            setSearchTerm(e.target.value);
                            const matchedHytte = hytter.find(h => 
                                `ID: ${h.hytte_id} - ${h.navn}` === e.target.value ||
                                h.id?.toString() === e.target.value
                            );
                            if (matchedHytte) {
                                setSelectedId(matchedHytte.id.toString());
                            } else {
                                setSelectedId("");
                            }
                        }}
                        placeholder={t("hytter.søk_placeholder")}
                    />
                    <datalist id="hytter-list">
                        {filteredHytter.map((hytte) => (
                            <option key={hytte.hytte_id} value={`ID: ${hytte.id} - ${hytte.navn}`} />
                        ))}
                    </datalist>
            </div>
            <button onClick={handleSlettHytte} disabled={!selectedId}>
                {t("hytter.slett_knapp")}
            </button>
        </div>
    );
};