import { useState } from "react";

//Alle kartfilter til hytter. Laget av Kay
export default function KartFilterHytter({ filter, setFilter, handleCheckboxChange }) {
  const [hytterFilterUtvidet, setHytterFilterUtvidet] = useState(false);

  //Laget av AI
  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= filter.prisnivå[1]) {
      setFilter({ 
        ...filter, 
        prisnivå: [newMin, filter.prisnivå[1]] 
      });
    }
  };

  //Laget av AI
  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= filter.prisnivå[0]) {
      setFilter({ 
        ...filter, 
        prisnivå: [filter.prisnivå[0], newMax] 
      });
    }
  };

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() => setHytterFilterUtvidet(!hytterFilterUtvidet)}
      >
        {hytterFilterUtvidet ? "✕" : "☰"} Hytter
      </button>

      {hytterFilterUtvidet && (
        <>
          {/*Hytte - vis hytter*/}
          <div className="hytter-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visHytter}
                onChange={(e) =>
                  setFilter({ ...filter, visHytter: e.target.checked })
                }
              />{" "}
              Vis hytter
            </label>
          </div>

          {/*Hytte - søkefelt*/}
          <div className="filter-section">
            <label>Søk:</label>
            <input
              type="text"
              placeholder="Søk etter hytte"
              value={filter.søkeord}
              onChange={(e) =>
                setFilter({ ...filter, søkeord: e.target.value })
              }
            />
          </div>

          {/*Hytte - prisnivå*/}
          <div className="filter-section">
            <label>Prisnivå: {filter.prisnivå[0]} kr - {filter.prisnivå[1]} kr</label>
            <div className="range-slider-container">
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.prisnivå[0]}
                onChange={handleMinChange}
                className="range-slider range-slider-min"
              />
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.prisnivå[1]}
                onChange={handleMaxChange}
                className="range-slider range-slider-max"
              />
            </div>
          </div>

          {/*Hytte - betjeningsgrad*/}
          <div className="filter-section">
            <label>Betjeningsgrad:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Ubetjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Ubetjent")
                  }
                />{" "}
                Ubetjent
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Selvbetjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Selvbetjent")
                  }
                />{" "}
                Selvbetjent
              </label>
              
              <label>
                <input
                  type="checkbox"
                  checked={filter.betjeningsgrad.includes("Betjent")}
                  onChange={() =>
                    handleCheckboxChange("betjeningsgrad", "Betjent")
                  }
                />{" "}
                Betjent
              </label>
            </div>
          </div>

          {/*Hytte - fasiliteter*/}
          <div className="filter-section">
            <label className="filter-label-overskrift">Fasiliteter:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  //checked={filter.fasiliteter.includes("WIFI")}
                  //onChange={() =>
                  //  handleCheckboxChange("fasiliteter", "WIFI")
                  //}
                />{" "} WIFI
              </label>
            </div>
          </div>

        </>
      )}
    </div>
  );
}