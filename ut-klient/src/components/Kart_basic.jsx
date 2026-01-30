import {MapContainer, TileLayer} from "react-leaflet";

//TODO: bruk denne som et grunnleggende kart
export default function kart_Basic(){
    return(
        <MapContainer center={[59.4087, 9.0593]} zoom={13}>
        

        </MapContainer>
    );
}