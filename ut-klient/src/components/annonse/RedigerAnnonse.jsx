import { useState, useEffect } from "react";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import AnnonseForm from "./annonse-form/AnnonseForm";

// Lar bruker søke opp en annonse, hente eksisterende data og oppdatere den. Laget av Olai.
export default function RedigerAnnonse({ onSuccess }) {
    const { annonser, loadingAnnonser, errorAnnonser, hentAnnonseFraId, oppdaterAnnonse } = useFetchAnnonser({ autoFetch: true });

    const [searchTerm, setSearchTerm] = useState("");
    const [selectedId, setSelectedId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lagretData, setLagretData] = useState(null);

    // Filtrerer søkeresultat på annonse-ID eller tittel.
    const filteredAnnonser = annonser.filter(a =>
        a.annonse_id?.toString().includes(searchTerm) ||
        a.tittel?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!selectedId) {
            setLagretData(null);
            return;
        }

        // Henter valgt annonse og mapper API-format til feltene AnnonseForm forventer.
        const lastAnnonseData = async () => {
            try {
                setLoading(true);
                setError(null);

                const annonse = await hentAnnonseFraId(selectedId);

                setLagretData({
                    annonserNavn: annonse.annonser_navn || annonse.annonserNavn || "",
                    tittel: annonse.tittel || "",
                    beskrivelse: annonse.beskrivelse || annonse.tekst || "",
                    kategori: annonse.kategori || "",
                    bilder: annonse.bilder?.map(b => b.url || b) || (annonse.bildeUrl ? [annonse.bildeUrl] : []),
                    startDato: annonse.start_dato || annonse.startDato || "",
                    sluttDato: annonse.slutt_dato || annonse.sluttDato || "",
                    søkeord: annonse.søkeord || [],
                });
            } catch (err) {
                setError("Kunne ikke hente annonsedata");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        lastAnnonseData();
    }, [selectedId]);

    // Sender oppdatert annonse til backend med PUT og nullstiller skjema ved suksess.
    const handleOppdater = async (formData) => {
        try {
            setLoading(true);
            setError(null);

            await oppdaterAnnonse(selectedId, formData);

            alert("Annonse oppdatert");
            setLagretData(null);
            setSelectedId(null);
            setSearchTerm("");

            if (onSuccess) onSuccess();
        } catch (err) {
            console.error("Error: ", err);
            setError("Kunne ikke oppdatere annonsen");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Rediger annonse</h2>

            <div>
                <label htmlFor="annonse-search">Søk og velg annonse:</label>
                <input
                    type="text"
                    id="annonse-search"
                    list="annonser-rediger-list"
                    value={searchTerm}
                    maxLength={50}
                    onChange={(e) => {
                        // Velger annonse fra datalist og lagrer ID for videre henting/redigering.
                        setSearchTerm(e.target.value);
                        const matchedAnnonse = filteredAnnonser.find(
                            a => `ID: ${a.annonse_id} - ${a.tittel}` === e.target.value ||
                                a.annonse_id?.toString() === e.target.value
                        );
                        if (matchedAnnonse) {
                            setSelectedId(matchedAnnonse.annonse_id.toString());
                        } else {
                            setSelectedId(null);
                        }
                    }}
                    placeholder="Søk på tittel eller ID..."
                />
                <datalist id="annonser-rediger-list">
                    {filteredAnnonser.map((a) => (
                        <option key={a.annonse_id} value={`ID: ${a.annonse_id} - ${a.tittel}`} />
                    ))}
                </datalist>
            </div>

            {loadingAnnonser && <p>Laster annonser...</p>}
            {loading && <p>Laster annonsedata...</p>}
            {(error || errorAnnonser) && <p style={{ color: 'red' }}>{error || errorAnnonser}</p>}

            {selectedId && !loading && lagretData && (
                <AnnonseForm
                    key={selectedId}
                    lagretData={lagretData}
                    onSubmitAction={handleOppdater}
                    buttonTekst={loading ? "Lagrer..." : "Oppdater annonse"}
                />
            )}
        </div>
    );
}
