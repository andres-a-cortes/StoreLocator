import { globalConfig } from '@/globalConfig'
import React, { useState, useRef, useEffect } from "react";
import { GoogleMap, DirectionsRenderer, OverlayView } from "@react-google-maps/api";



const DirectionMap = ({ directionsRouteMap,containerStyle ,  selectedStep, mapCenter  }) => {
    
    const mapRef = useRef(null);
    const [zoom, setZoom] = useState(7); 
    const [mapKey, setMapKey] = useState(Date.now()); 
    
    useEffect(() => {
        console.log("directionsRouteMap", directionsRouteMap);
    }, [directionsRouteMap]);
 
    return (
        <>
            {directionsRouteMap && directionsRouteMap.routes && (
                <DirectionsRenderer directions={directionsRouteMap} />
            )}

            {selectedStep && (
              
                <OverlayView
                        position={selectedStep.location}
                        mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} 
                        onCloseClick={() => setSelectedStep(null)}
                    >
                        <div className="direction-overlay custom-overlay">
                            <div className='innerDiv'>
                                <button class="btn-close btnDirectionClose" onClick={() => setSelectedStep(null)} ></button>
                                <p dangerouslySetInnerHTML={{ __html: selectedStep.instruction.split('<div')[0] }}></p>                                                            
                            </div>
                            <div className="arrow-down"></div>
                        </div>
                    </OverlayView>  

            )}
        </>

    );
};

export default DirectionMap;

