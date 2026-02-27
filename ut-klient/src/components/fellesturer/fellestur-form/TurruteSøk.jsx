import { useState, useRef, useEffect } from "react";

//Søker etter tur for å bruke som Fellestur. Laget av Kay
export default function TurruteSøk({ turer, onSelect, lagretNavn = "" }) {
    const [søk, setSøk] = useState(lagretNavn);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const filterTurer = turer?.filter(tur =>
        tur.turrute_navn.toLowerCase().includes(søk.toLowerCase()) ||   //søk på tur navn
        tur.turrute_id.toString().includes(søk)                         //søk på ID
    ) || [];

    //Lukker dropdown når bruker klikker på utsiden
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setVisDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="input-container søk" ref={dropdownRef}>
            <label className="input">
                Velg Turrute
                <input
                    type="text"
                    placeholder="Søk på navn eller ID"
                    value={søk}
                    onChange={(e) => {
                        setSøk(e.target.value);
                        setVisDropdown(true);
                        if (e.target.value === "") onSelect(0, "");
                    }}
                    onFocus={() => setVisDropdown(true)}
                    required
                />
            </label>

            {visDropdown && søk && (
                <ul className="søkeresultater">
                    {filterTurer.length > 0 ? (
                        filterTurer.map((tur) => (
                            <li
                                key={tur.turrute_id}
                                onClick={() => {
                                    setSøk(tur.turrute_navn);
                                    onSelect(tur.turrute_id, tur.turrute_navn);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="tur-id">#{tur.turrute_id}</span> {tur.turrute_navn}
                            </li>
                        ))
                    ) : (
                        <li className="ingen-resultater">Ingen resultater</li>
                    )}
                </ul>
            )}
        </div>
    );
}