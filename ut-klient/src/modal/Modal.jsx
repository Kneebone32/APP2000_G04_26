import "./Modal.css";
import { useEffect } from "react";

//Hele filen laget av Kay med mindre annet er spesifisert
export default function Modal({show, onClose, title, children, size = "md"}) {

    //Hjelper Leaflet med å regne ut den faktiske størrelsen på Modal. Laget av AI
    useEffect(() => {
        if (show) {
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 400);
        }
    }, [show]);

    if (!show) return null;

    return (
        <>
            {/*Backdrop til Modal*/}
            <div 
                className="custom-modal-backdrop" 
                onClick={onClose}
            ></div>

            {/*Selve Modal*/}
            <div className="custom-modal-container" onClick={onClose}>
                <div className={`custom-modal-dialog custom-modal-${size}`} 
                onClick={(e) => e.stopPropagation()}
                >
                
                    <div className="custom-modal-content">
                        <div className="custom-modal-header">
                            <h5 className="custom-modal-title">{title}</h5>
                            <button 
                                type="button" 
                                className="custom-modal-close" 
                                onClick={onClose}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>
                        
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}