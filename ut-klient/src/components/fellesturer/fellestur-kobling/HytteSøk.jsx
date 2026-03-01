import { useState, useRef, useEffect } from "react";

//Søker etter hytte for å bruke i Fellestur. Laget av Kay
export default function HytteSøk({ hytter, onSelect, lagretNavn = "" }) {
    const [søk, setSøk] = useState(lagretNavn);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const filterHytter = hytter?.filter(hytte =>
        hytte.hytte_navn.toLowerCase().includes(søk.toLowerCase()) ||   //søk på hytte navn
        hytte.hytte_id.toString().includes(søk)                         //søk på ID
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
                Velg Hytte
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

            {visDropdown && (
                <ul className="søkeresultater">
                    {filterHytter.length > 0 ? (
                        filterHytter.map((hytte) => (
                            <li
                                key={hytte.hytte_id}
                                onClick={() => {
                                    setSøk(hytte.hytte_navn);
                                    onSelect(hytte.hytte_id, hytte.hytte_navn, hytte);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="hytte-id">#{hytte.hytte_id}</span> {hytte.hytte_navn}
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