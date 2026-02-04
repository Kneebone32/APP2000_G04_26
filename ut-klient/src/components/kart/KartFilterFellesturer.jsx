import { useState } from "react";

//Alle kartfilter til fellesturer. Laget av Kay
export default function KartFilterFellesturer({ filter, setFilter }) {
  const [fellesturerFilterUtvidet, setFellesturerFilterUtvidet] = useState(false);

  return (
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
  );
}