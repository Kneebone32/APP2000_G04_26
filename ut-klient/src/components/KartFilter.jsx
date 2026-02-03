import { useState, useEffect } from "react";
import "./KartFilter.css";

//Håndterer alle kartfilter. Laget av Kay
export default function KartFilter({ onFilterChange }) {
  const [hytterFilterUtvidet, setHytterFilterUtvidet] = useState(false);
  const [fellesturerFilterUtvidet, setFellesturerFilterUtvidet] = useState(false);
  const [filter, setFilter] = useState({
    søkeord: "",
    betjeningsgrad: [],
    visHytter: true,
    visFellesturer: true
  });

  //Oppdaterer når filter endrer seg
  useEffect(() => {
    onFilterChange(filter);
  }, [filter, onFilterChange]);

  //håndterer checkbox-endringer. Laget av AI
  const handleCheckboxChange = (filterType, value) => {
    setFilter((prev) => ({
      ...prev,
      [filterType]: prev[filterType].includes(value)
        ? prev[filterType].filter((v) => v !== value)
        : [...prev[filterType], value],
    }));
  };

  //resetter alle filter
  const handleReset = () => {
    setFilter({
      søkeord: "",
      betjeningsgrad: [],
      visHytter: true,
      visFellesturer: true
    });
  };

  return (
    <div className="kart-filter-wrapper">
      {/*Filter til hytter*/}
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
          </>
        )}
      </div>

      {/*Filter til fellesturer*/}
      <div className="kart-filter-section">
        <button
          className="filter-toggle-button"
          onClick={() =>
            setFellesturerFilterUtvidet(!fellesturerFilterUtvidet)
          }
        >
          {fellesturerFilterUtvidet ? "✕" : "☰"} Fellesturer
        </button>

        {fellesturerFilterUtvidet && (
          <>
            {/*Fellestur - vis turer*/}
            <div className="fellesturer-kart-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={filter.visFellesturer}
                  onChange={(e) =>
                    setFilter({ ...filter, visFellesturer: e.target.checked })
                  }
                />
                Vis fellesturer
              </label>
            </div>

            {/*Fellestur - vanskelighetsgrad?*/}
          </>
        )}
      </div>

      {/*Reset filter*/}
      {(hytterFilterUtvidet || fellesturerFilterUtvidet) && (
        <button className="reset-button" onClick={handleReset}>
          Nullstill
        </button>
      )}
    </div>
  );
}
