import { useState } from "react";

//Alle kartfilter til hytter. Laget av Kay
export default function KartFilterHytter({ filter, setFilter, handleCheckboxChange }) {
  const [hytterFilterUtvidet, setHytterFilterUtvidet] = useState(false);

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
  );
}