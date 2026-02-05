import { useState } from "react";

//Alle kartfilter til Turer.
export default function KartFilterTurer({ filter, setFilter, handleCheckboxChange }) {
  const [turerFilterUtvidet, setTurerFilterUtvidet] = useState(false);

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() =>
          setTurerFilterUtvidet(!turerFilterUtvidet)
        }
      >
        {turerFilterUtvidet ? "✕" : "☰"} Turer
      </button>

      {turerFilterUtvidet && (
        <>
          {/*Turer - vis turmål*/}
          <div className="turer-kart-toggle">
            <label>
              <input
                type="checkbox"
                checked={filter.visTurer}
                onChange={(e) =>
                  setFilter({ ...filter, visTurer: e.target.checked })
                }
              />{" "}
               Vis turer
            </label>
          </div>

          {/*Turer - vanskelighetsgrad - TODO*/}
          <div className="filter-section">
          <label>Vanskelighetsgrad:</label>
          <select
          //value={filters.vanskelighetsgrad}                                             TODO: venter på testdata
          //onChange={(e) => setFilters({...filters, vanskelighetsgrad: e.target.value})} TODO: venter på testdata
          >
          <option value="">Lett</option>
          <option value="5">Middels</option>
          <option value="10">Vanskelig</option>
          </select>
          </div>



          {/*Turer - Varighet - TODO: venter på testdata*/}
          {/*Turer - Turtype*/}
          <div className="filter-section">
            <label>Type:</label>
            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Fottur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Fottur")
                  }
                />{" "}
                Fottur
              </label>

              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Sykkeltur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Sykkeltur")
                  }
                />{" "}
                Sykkeltur
              </label>
              
              <label>
                <input
                  type="checkbox"
                  //checked={filter.turtype.includes("Skitur")}  TODO: venter på testdata
                  onChange={() =>
                    handleCheckboxChange("turtype", "Skitur")
                  }
                />{" "}
                Skitur
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
