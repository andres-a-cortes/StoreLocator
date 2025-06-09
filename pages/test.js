import { useEffect, useState, useRef } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import AutoCompleteComponentFrom from '@/components/shared/autocompleteFrom'
const containerStyle = { width: "100%", height: "500px" };

import { globalConfig } from '@/globalConfig'
import { getFrontendFilters, getStoresList } from '@/functions/globalFunctions'

const StoreLocator = ({ locations, mapCenter, zoom, selectedMarkerId, selectedIcon, defaultIcon, handleMarker }) => {
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: globalConfig.googleKey,
        libraries: ["places"],
    });

    const [directions, setDirections] = useState(null);
    const [error, setError] = useState(null);
    const mapRef = useRef(null);
 
        
    const origin = { lat: 37.7749, lng: -122.4194 }; // Example starting point
    const destination = { lat: 34.0522, lng: -118.2437 }; // Example ending point


    useEffect(() => {
        if (!isLoaded || !origin || !destination) return;

        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);

                    // Extract distance & duration
                    const route = result.routes[0];
                    const leg = route.legs[0]; // First leg of the route

                    const steps = leg.steps.map((step, index) => ({
                        instruction: step.instructions, // HTML-formatted instruction
                        distance: step.distance.text,
                    }));
    
                    console.log("steps", steps);

                    console.log(`Distance: ${leg.distance.text}`);
                    console.log(`Duration: ${leg.duration.text}`);

                    
                } else {
                    setError("Could not fetch directions");
                }
            }
        );
    }, [isLoaded, origin, destination]);

    if (!isLoaded) return <div>Loading Maps...</div>;

    
    const handlePlaceSelectFrom = (place) => {
        console.log("handlePlaceSelectFrom", place)         
     };

     
    return (
        <> 
            <div className="m-2">

                <AutoCompleteComponentFrom onPlaceSelected={handlePlaceSelectFrom}  />
                <GoogleMap 
                    mapContainerStyle={containerStyle} 
                    center={mapCenter} 
                    zoom={zoom} 
                    onLoad={(map) => { mapRef.current = map; }} 
                > 
                    {locations && locations.map((location, index) => (
                        <Marker key={index} position={location} onClick={() => handleMarker(location.id)}
                            icon={selectedMarkerId !== "" && selectedMarkerId === location.id ? selectedIcon : defaultIcon}
                            animation={selectedMarkerId !== "" && selectedMarkerId === location.id ? window.google.maps.Animation.BOUNCE : null}
                        />
                    ))}

                    {directions && <DirectionsRenderer directions={directions} />}
                </GoogleMap>
            </div>
        </>
    );
};

export default StoreLocator;
