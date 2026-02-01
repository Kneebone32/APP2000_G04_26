import { useState, useEffect } from 'react';
import './KartFilter.css';

//Håndterer alle kartfilter. Laget av Kay
export default function KartFilter({onFilterChange}) {
    const [filter, setFilter] = useState({
        søkeord: "",
        betjeningsgrad: []
    });

  //Oppdaterer når filter endrer seg
    useEffect(() => {
        onFilterChange(filter);
    }, [filter, onFilterChange]);

    //håndterer checkbox-endringer. Laget av AI
    const handleCheckboxChange = (filterType, value) => {
        setFilter(prev => ({
            ...prev,
            [filterType]: prev[filterType].includes(value)
            ? prev[filterType].filter(v => v !== value)
            : [...prev[filterType], value]
        }));
    };

    //resetter alle filter
    const handleReset = () => {
        setFilter({
            søkeord: "",
            betjeningsgrad: [],
    });
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
          value={filter.søkeord}
          onChange={(e) => setFilter({...filter, søkeord: e.target.value})}
        />
      </div>

      {/*Hytte - betjeningsgrad*/}
        <div className="filter-section">
            <label>Betjeningsgrad:</label>
        <div className="checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={filter.betjeningsgrad.includes("Ubetjent")}
              onChange={() => handleCheckboxChange("betjeningsgrad", "Ubetjent")}
            /> Ubetjent
          </label>

          <label>
            <input
              type="checkbox"
              checked={filter.betjeningsgrad.includes("Selvbetjent")}
              onChange={() => handleCheckboxChange("betjeningsgrad", "Selvbetjent")}
            /> Selvbetjent
          </label>

          <label>
            <input
              type="checkbox"
              checked={filter.betjeningsgrad.includes("Betjent")}
              onChange={() => handleCheckboxChange("betjeningsgrad", "Betjent")}
            /> Betjent
          </label>

        </div>
      </div>
    
      <button className="reset-button" onClick={handleReset}>
        Nullstill søk
      </button>
    </div>
  );
}