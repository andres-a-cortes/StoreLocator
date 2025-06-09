import { useRef, useEffect } from "react";

const GoogleAutocompleteWrapper2 = ({ onPlaceSelected, placeholder }) => {
    const inputRef = useRef(null);

    useEffect(() => {
        if (!window.google || !window.google.maps || !window.google.maps.places) return;
        
        const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
            types: ["geocode"],
        });

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (onPlaceSelected) onPlaceSelected(place);
        });
    }, []);

    return <input type="text" ref={inputRef} className="form-control" placeholder={placeholder} />;
};

export default GoogleAutocompleteWrapper2;
