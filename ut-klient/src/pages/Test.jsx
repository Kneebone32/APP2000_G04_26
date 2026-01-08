import { useState, useEffect } from "react";
import PageWrapper from "../components/PageWrapper";

//AI generated test. Way too much fluff for my teste. It's fine for this fullstack test.
export default function Test() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/test-db`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        setItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <PageWrapper title="Testside">
      <div className="mt-3">
        <h2>Database Test</h2>
        
        {loading && <p>Loading...</p>}
        
        {error && (
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        )}
        
        {!loading && !error && items.length === 0 && (
          <p>No items found in database.</p>
        )}
        
        {!loading && !error && items.length > 0 && (
          <ul className="list-group">
            {items.map((item, index) => (
              <li key={index} className="list-group-item">
                {JSON.stringify(item)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </PageWrapper>
  );
}