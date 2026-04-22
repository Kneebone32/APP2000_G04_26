/*
 Skrevet av Kristoffer med mindre annet er spesifisert
*/

import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import { useSok } from "../../hooks/useSok";
import ArtikkelModal from "../artikkel/modal/ArtikkelModal";
import "./Sokefelt.css";

const TYPE_ETIKETT = {
  tur: "Tur",
  hytte: "Hytte",
  turmaal: "Turmål",
  artikkel: "Artikkel",
};

function byggLenke(treff) {
  switch (treff.type) {
    case "tur":
      return `/turer/${treff.id}`;
    case "hytte":
      return `/hytter/${treff.id}`;
    case "turmaal":
      return `/kart`;
    default:
      return null;
  }
}

export default function Sokefelt({ onNavigate }) {
  const [q, setQ] = useState("");
  const [apen, setApen] = useState(false);
  const { resultater, loading, error } = useSok(q);
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickUtenfor = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setApen(false);
      }
    };
    document.addEventListener("mousedown", handleClickUtenfor);
    return () => document.removeEventListener("mousedown", handleClickUtenfor);
  }, []);

  const lukkOgNullstill = () => {
    setQ("");
    setApen(false);
    onNavigate?.();
  };

  const velgTreff = (treff) => {
    const lenke = byggLenke(treff);
    if (!lenke) return;
    lukkOgNullstill();
    navigate(lenke);
  };

  const gruppert = resultater.reduce((acc, treff) => {
    (acc[treff.type] ||= []).push(treff);
    return acc;
  }, {});

  const harTreff = resultater.length > 0;
  const visDropdown = apen && q.trim().length >= 2;

  return (
    <div className="sokefelt" ref={containerRef}>
      <div className="sokefelt-input-wrapper">
        <FaSearch className="sokefelt-ikon" aria-hidden="true" />
        <input
          type="search"
          className="sokefelt-input"
          placeholder="Søk..."
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setApen(true);
          }}
          onFocus={() => setApen(true)}
          aria-label="Globalt søk"
        />
      </div>

      {visDropdown && (
        <div className="sokefelt-dropdown" role="listbox">
          {loading && <div className="sokefelt-melding">Søker</div>}
          {error && <div className="sokefelt-melding sokefelt-feil">{error}</div>}
          {!loading && !error && !harTreff && <div className="sokefelt-melding">Ingen treff</div>}

          {harTreff &&
            Object.entries(gruppert).map(([type, treffListe]) => (
              <div key={type} className="sokefelt-gruppe">
                <div className="sokefelt-gruppe-tittel">{TYPE_ETIKETT[type] ?? type}</div>
                {treffListe.map((treff) => {
                  const innhold = (
                    <>
                      <div className="sokefelt-treff-tittel">{treff.tittel}</div>
                      {treff.utdrag && <div className="sokefelt-treff-utdrag">{treff.utdrag}</div>}
                    </>
                  );

                  if (treff.type === "artikkel" && treff.slug) {
                    return (
                      <ArtikkelModal
                        key={`${treff.type}-${treff.id}`}
                        slug={treff.slug}
                        lenkeKlasseNavn="sokefelt-treff"
                        onOpen={lukkOgNullstill}
                      >
                        {innhold}
                      </ArtikkelModal>
                    );
                  }

                  return (
                    <button
                      key={`${treff.type}-${treff.id}`}
                      type="button"
                      className="sokefelt-treff"
                      onClick={() => velgTreff(treff)}
                      role="option"
                    >
                      {innhold}
                    </button>
                  );
                })}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
