import { Marker, Polyline, Popup } from "react-leaflet";
import { useState } from "react";

//Ekstra fil for utheve Polyline når bruker holder over linjen. Laget av Kay
export function HoverPolyline({ punkter, children, standardVekt = 7, hoverVekt = 11,}) {
    const [vekt, setVekt] = useState(standardVekt);

    return (
        <>
            <Polyline
                positions={punkter}
                eventHandlers={{
                    mouseover: () => setVekt(hoverVekt),
                    mouseout: () => setVekt(standardVekt),
                }}
                pathOptions={{
                    color: "#0dbbcb",
                    weight: vekt,
                    opacity: 0.8,
                }}
                >
                {children}
                </Polyline>

        </>
    );
}