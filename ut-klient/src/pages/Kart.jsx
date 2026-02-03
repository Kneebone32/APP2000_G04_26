import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import Kart_basic, { hytteIcon } from "../components/KartBasic";
import KartFilter from "../components/KartFilter";
import { useFetchHytter } from "../hooks/useFetchHytter";
import "../App.css";

//"Utforsker-kart" (Laget av Kay)
export default function Kart(){
  const { hytter, loading, error } = useFetchHytter(true);
  const [filter, setFilter] = useState({});

  //filter til hytter
  const filteredHytter = hytter.filter(hytte => {
    
    //fjerner hytter baset på null-check
    if (!hytte.koordinater || hytte.koordinater === null ||
        !hytte.betjeningsgrad || hytte.betjeningsgrad === null
    ) {
      return false;
    }

    //hyttefilter - søk
    if (filter.søkeord && 
        !hytte.navn?.toLowerCase().includes(filter.søkeord.toLowerCase())) {
      return false;
    }

    //hyttefilter - betjeningsgrad
    if (filter.betjeningsgrad?.length > 0 && 
        !filter.betjeningsgrad.includes(hytte.betjeningsgrad)) {
      return false;
        }

    //hyttefilter - prisnivå
    //hyttefilter - fasiliteter

    return true;
  });
  
  if (loading) return <p>Laster kart</p>;
  if (error) return <p>Feil ved lasting: {error}</p>;

  return(
    <div>
      <KartFilter onFilterChange={setFilter} />
      
      <Kart_basic center={[59.4087, 9.0593]} zoom={12}>
        {filteredHytter.map((hytte) => (
          <Marker 
            key={hytte.hytte_id} 
            position={hytte.koordinater} 
            icon={hytteIcon}
          >
            <Popup>
              <strong>{hytte.navn}</strong><br/>
              Sengeplasser: {hytte.sengeplasser}<br/>
              {hytte.betjeningsgrad}
            </Popup> 
          </Marker>
        ))}
      </Kart_basic>
    </div>
  );
}