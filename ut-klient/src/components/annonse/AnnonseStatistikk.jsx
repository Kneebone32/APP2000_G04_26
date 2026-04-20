import { useFetchAnnonser } from "../../hooks/useFetchAnnonser";
import "./AnnonseStatistikk.css";

// Viser visnings og klikkstatistikk for alle annonser. Laget av Olai.
export default function AnnonseStatistikk() {
  const { annonser, loadingAnnonser, errorAnnonser } = useFetchAnnonser({ autoFetch: true });

  if (loadingAnnonser) return <p>Laster statistikk...</p>;
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
          {annonser.map((annonse) => {
            const visninger = annonse.visninger ?? 0;
            const klikk = annonse.klikk ?? 0;
            const klikkefrekvens = visninger > 0 ? ((klikk / visninger) * 100).toFixed(1) : "0.0";
            return (
              <tr key={annonse.annonse_id}>
                <td>{annonse.tittel}</td>
                <td>
                  {(annonse.start_dato || annonse.startDato)?.slice(0, 10) || "-"}
                  {" → "}
                  {(annonse.slutt_dato || annonse.sluttDato)?.slice(0, 10) || "-"}
                </td>
                <td>{annonse.status || "-"}</td>
                <td>{visninger}</td>
                <td>{klikk}</td>
                <td>{klikkefrekvens}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
