import { useState, useRef, useEffect } from "react";

//Søker etter Turmål. Laget av Kay
export default function TurmålSøk({ turmål, onSelect, lagretNavn = "" }) {
    const [søk, setSøk] = useState(lagretNavn);
    const [visDropdown, setVisDropdown] = useState(false);
    const dropdownRef = useRef(null);


    const filterTurmål = turmål?.filter(turmål =>
        turmål.turmål_navn.toLowerCase().includes(søk.toLowerCase()) ||   //søk på turmål navn
        turmål.turmål_id.toString().includes(søk)                         //søk på ID
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
                Velg turmål
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
                    {filterTurmål.length > 0 ? (
                        filterTurmål.map((turmål) => (
                            <li
                                key={turmål.turmål_id}
                                onClick={() => {
                                    setSøk(turmål.turmål_navn);
                                    onSelect(turmål.turmål_id, turmål.turmål_navn, turmål);
                                    setVisDropdown(false);
                                }}
                            >
                                <span className="turmål-id">#{turmål.turmål_id}</span> {turmål.turmål_navn}
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