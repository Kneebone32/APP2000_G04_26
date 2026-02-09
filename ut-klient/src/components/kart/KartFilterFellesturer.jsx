import { useState } from "react";
import { useTranslation } from "react-i18next";

//Alle kartfilter til fellesturer. Laget av Kay
export default function KartFilterFellesturer({ filter, setFilter }) {
  const [fellesturerFilterUtvidet, setFellesturerFilterUtvidet] = useState(false);
  const { t } = useTranslation();

  return (
    <div className="kart-filter-section">
      <button
        className="filter-toggle-button"
        onClick={() =>
          setFellesturerFilterUtvidet(!fellesturerFilterUtvidet)
        }
      >
        {fellesturerFilterUtvidet ? "✕" : "☰"} {t("filter.fellesturer")}
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
              {t("filter.vis_fellesturer")}
            </label>
          </div>

          {/*Fellestur - vanskelighetsgrad?*/}
        </>
      )}
    </div>
  );
}