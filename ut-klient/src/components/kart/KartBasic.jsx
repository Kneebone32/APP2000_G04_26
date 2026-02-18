import PageWrapper from "../PageWrapper";
import {MapContainer, TileLayer, ZoomControl} from "react-leaflet";
import { Icon } from "leaflet";
import hytteMarker from "../../assets/kart/hytte.png";
import turStartMarker from "../../assets/kart/tur.png";
import "leaflet/dist/leaflet.css";
import "./KartBasic.css";

//kartikon for hytter
export const hytteIcon = new Icon({
    iconUrl: hytteMarker,
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for turstart
export const turIcon = new Icon({
    iconUrl: turStartMarker, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for turmål
export const turMålIcon = new Icon({
    iconUrl: null, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for fellestur fast startdato
export const fellesTurIcon = new Icon({
    iconUrl: null, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});

//kartikon for fellestur med fleksibel startdato
export const fellesTurIconFleksibel = new Icon({
    iconUrl: null, 
    iconSize: [42, 42],
    className: 'no-scale-marker'
});


//Basic kart som kan bli brukt i utforsker, til å legge til turer og for posisjonstjenester (Laget av Kay)
export default function Kart_basic({ center = [59.4087, 9.0593], zoom = 13, children }) {
    return(
        <div className="kart-wrapper">
            <MapContainer center={center} zoom={zoom} minZoom={5} zoomControl={false}>
                <TileLayer 
                    attribution='&copy; <a href="https://www.kartverket.no/">Kartverket</a>'
                    url="https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png"
                />
                <ZoomControl position="bottomright"/>
                {children}
            </MapContainer>
        </div>
    );
}