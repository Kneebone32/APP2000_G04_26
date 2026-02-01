import { useState, useEffect } from 'react';
import './KartFilter.css';

//Håndterer alle kartfilter. Laget av Kay
export default function KartFilter({onFilterChange}) {
  const [søkeord, setSøkeord] = useState("");

  //Oppdaterer når filter endrer seg
  useEffect(() => {
    onFilterChange({søkeord});
  }, [søkeord, onFilterChange]);

  const handleReset = () => {
    setSøkeord("");
  };

  return (
    <div className="kart-filter-hytter">
      <h3>Hytter</h3>
      
      {/*Hytte - søkefelt*/}
      <div className="filter-section">
        <label>Søk:</label>
        <input
          type="text"
          placeholder="Søk etter hytte"
          value={søkeord}
          onChange={(e) => setSøkeord(e.target.value)}
        />
      </div>

      <button className="reset-button" onClick={handleReset}>
        Nullstill søk
      </button>
    </div>
  );
}