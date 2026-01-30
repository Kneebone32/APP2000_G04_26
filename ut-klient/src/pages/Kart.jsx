import { Marker, Popup } from "react-leaflet";
import Kart_basic, { hytteIcon } from "../components/KartBasic";
import "../App.css";

//"Utforsker-kart" (Laget av Kay)
export default function Kart(){
  //simulere hytter
  const hytter_lokasjon = [
    {
      geocode: [59.4087, 9.0593],
      popUp: "Hytte 1"
    },
    {
      geocode: [59.403166255660764, 9.070148700479844],
      popUp: "Hytte 2"
    },
    {
      geocode: [59.4111911162318, 9.070644187330702],
      popUp: "Hytte 3"
    },
  ];


  return(
    <Kart_basic center={[59.4087, 9.0593]} zoom={13}>
      {hytter_lokasjon.map((hytte, index) => (
        <Marker key={index} position={hytte.geocode} icon={hytteIcon}>
          <Popup>{hytte.popUp}</Popup> 
        </Marker>
      ))}
    </Kart_basic>
  );
}