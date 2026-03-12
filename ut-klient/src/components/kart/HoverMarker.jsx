import { Marker, Polyline, Popup } from "react-leaflet";
import { useState, useMemo } from "react";
import L from 'leaflet';

//Ekstra fil for utheve Polyline når bruker holder over linjen. Laget av Kay
export function HoverMarker({ objekt, children, hoverFaktor = 1, onKlikk, ikon}) {
    const [hover, setHover] = useState(false);

    //lager ev hover-effekt når bruker holder over ikonet
    const {normalIkon, hoverIkon} = useMemo(() => {
        const normalStørrelse = ikon.options.iconSize;
        const normalAnchor = ikon.options.iconAnchor;
        
        const hoverStørrelse = [
            normalStørrelse[0] * hoverFaktor,
            normalStørrelse[1] * hoverFaktor
        ];
        const hoverAnchor = [
            normalAnchor[0] * hoverFaktor,
            normalAnchor[1] * hoverFaktor
        ];

        return {
            normalIkon: ikon,
            hoverIkon: L.icon({
                ...ikon.options,
                iconSize: hoverStørrelse,
                iconAnchor: hoverAnchor
            })
        };
    }, [ikon, hoverFaktor]);


    return (
        <>
            <Marker
                key={objekt.hytte_id}
                position={[objekt.breddegrad, objekt.lengdegrad]}
                icon={hover ? hoverIkon : normalIkon}
                eventHandlers={{
                    mouseover: () => setHover(true),
                    mouseout: () => setHover(false),
                    click: (e) => {
                        L.DomEvent.stopPropagation(e);
                        if(onKlikk) {
                            onKlikk(e, objekt);
                        }
                    }
                    
                }}
                >
                {children}
                </Marker>

        </>
    );
}