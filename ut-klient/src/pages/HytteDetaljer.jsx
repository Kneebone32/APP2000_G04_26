import PageWrapper from "../components/PageWrapper";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HytteDetaljer() {
  const { hytteId } = useParams();
  const navigate = useNavigate();
  const [hytte, setHytte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHytte = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter/${hytteId}`);

        if (!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHytte(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHytte();
  }, [hytteId]);

  return (
    <PageWrapper title={hytte ? hytte.hytteNavn : "Hyttedetaljer"}>
      <div className="mt-3">
        <button 
          className="btn btn-secondary mb-3" 
          onClick={() => navigate("/hytter")}
        >
          Tilbake til hytter
        </button>

        {loading && <p>Laster hytteinformasjon...</p>}

        {error && (
          console.log(`Error: ${error}`)
        )}

        {!loading && !error && hytte && (
          <div>
            <h2>{hytte.hytteNavn}</h2>
            <p><strong>Antall rom:</strong> {hytte.antRom}</p>
            <p><strong>Lokasjon:</strong> {hytte.lokasjon}</p>
          </div>
        )}

        {!loading && !error && !hytte && <p>Hytte ikke funnet</p>}
      </div>
    </PageWrapper>
  );
}
