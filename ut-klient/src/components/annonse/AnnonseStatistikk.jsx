import { useState, useEffect } from "react";
import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import "./AnnonseStatistikk.css";

// Viser visnings og klikkstatistikk for alle annonser. Laget av Olai.
export default function AnnonseStatistikk() {
    const { annonser, loadingAnnonser, errorAnnonser, hentStatistikk } = useFetchAnnonser({ autoFetch: true });
    const [statistikk, setStatistikk] = useState({});
    const [loadingStats, setLoadingStats] = useState(false);

    // Henter statistikk for alle annonser når listen er lastet.
    useEffect(() => {
        if (annonser.length === 0) return;

        const hentAlleStats = async () => {
            setLoadingStats(true);
            const nyStatistikk = {};
            for (const annonse of annonser) {
                try {
                    const stats = await hentStatistikk(annonse.annonse_id);
                    nyStatistikk[annonse.annonse_id] = stats;
                } catch {
                    nyStatistikk[annonse.annonse_id] = { visninger: 0, klikk: 0 };
                }
            }
            setStatistikk(nyStatistikk);
            setLoadingStats(false);
        };

        hentAlleStats();
    }, [annonser]);

    if (loadingAnnonser || loadingStats) return <p>Laster statistikk...</p>;
    if (errorAnnonser) return <p className="AnnonseStatistikkFeil">{errorAnnonser}</p>;
    if (annonser.length === 0) return <p>Ingen annonser å vise statistikk for.</p>;

    return (
        <div>
            <h2>Annonsestatistikk</h2>
            <table className="AnnonseStatistikkTabell">
                <thead>
                    <tr>
                        <th>Tittel</th>
                        <th>Periode</th>
                        <th>Status</th>
                        <th>Visninger</th>
                        <th>Klikk</th>
                        <th>Klikkefrekvens</th>
                    </tr>
                </thead>
                <tbody>
                    {annonser.map(annonse => {
                        const stats = statistikk[annonse.annonse_id] || { visninger: 0, klikk: 0 };
                        const klikkefrekvens = stats.visninger > 0
                            ? ((stats.klikk / stats.visninger) * 100).toFixed(1)
                            : "0.0";
                        return (
                            <tr key={annonse.annonse_id}>
                                <td>{annonse.tittel}</td>
                                <td>
                                    {(annonse.start_dato || annonse.startDato)?.slice(0, 10) || "-"}
                                    {" → "}
                                    {(annonse.slutt_dato || annonse.sluttDato)?.slice(0, 10) || "-"}
                                </td>
                                <td>{annonse.status || "-"}</td>
                                <td>{stats.visninger}</td>
                                <td>{stats.klikk}</td>
                                <td>{klikkefrekvens}%</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
