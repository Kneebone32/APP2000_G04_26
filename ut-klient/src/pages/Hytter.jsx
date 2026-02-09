import PageWrapper from "../components/PageWrapper";
import HytteKort from "../components/HytteKort";
import { useState, useEffect } from "react";
import './Hytter.css';

export default function Hytter() {
  const [hytter, setHytter]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

    useEffect(() => {
    const fetchHytter = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/hytter`);

        if(!response.ok) {
          setError(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setHytter(data);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHytter();
  }, []);
  
  
  return (
    <PageWrapper title="Hytter">
      <div className="mt-3">

        {loading && <p>Laster hytter...</p>}

        {error && (
          console.log(`Error: ${error}`)
        )}

        {!loading && !error && hytter.length === 0 && (
          <p>Ingen hytter funnet.</p>
        )}

        {!loading && !error && hytter.length > 0 && (
          <div className="HyttekortContainer">
            {hytter.map((hytte) =>(
              <HytteKort
                key={hytte.hytte_id}
                hytteId={hytte.hytte_id}
                hytteNavn={hytte.navn}
                sengeplasser={hytte.sengeplasser}
                bildeUrl={hytte.hyttebilde_url}
                />
            ))}
      </div>
        )}
      </div>
    </PageWrapper>
  )
}