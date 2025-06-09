import { globalConfig } from "@/globalConfig";
import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { loadGoogleMapsScript } from "@/functions/loadGoogleMapsScript";

const AutoCompleteComponent = ({ onPlaceSelected, onPlaceClick, changePostUrl }) => {
  const inputRef = useRef(null);
  const [stateCode, setStateCode] = useState("");
  const [googleLoaded, setGoogleLoaded] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [storedEvents, setStoredEvents] = useState([]);
  const [input, setInput] = useState("");
  const validUrls = ["http://localhost:5173"];

  useEffect(() => {
    function handleMessage(event) {
      if (!validUrls.includes(event.origin)) return;

      if (event.data.action === "updateMap") {
        setInputValue(event.data.value);
        setInput(event.data.value);
        changePostUrl?.(event.origin);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [changePostUrl]);

  useEffect(() => {
    if (googleLoaded && input && input != "") {
      setInputValue(input);
      clickButtonHandle();
    }
  }, [googleLoaded, input]);

  useEffect(() => {
    const apiKey = globalConfig.googleKey;
    loadGoogleMapsScript(apiKey)
      .then(() => {
        setGoogleLoaded(true);
      })
      .catch(console.error);
  }, []);

  const autocompleteRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place != null) {
        setInputValue(place.formatted_address);
        onPlaceSelected(place, place.formatted_address);
      }
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // If input is empty, trigger update with `null` or empty object
    if (value === "") {
      onPlaceSelected(null);
    }
  };

  const clickButtonHandle = () => {
    const service = new window.google.maps.places.AutocompleteService();
    service
      .getPlacePredictions({ input: inputValue })
      .then((predictions) => {
        if (predictions != undefined && predictions[0] != undefined) {
          const place = predictions[0];
          var place_id = predictions[0].place_id;
          var formatedAddress = predictions[0].description;
          getPlaceDetails(place_id, inputValue);
          setSuggestions(predictions || []);
          onPlaceSelected(place, place.formatted_address);
        } else {
          var formatedAddress = inputValue;
          onPlaceClick(null, formatedAddress);
        }
      })
      .catch((error) => {
        console.error("Autocomplete error:", error);
      });
  };

  const clickHandle = async (e) => {
    if (!googleLoaded || inputValue.length < 3) return;

    const service = new window.google.maps.places.AutocompleteService();
    service.getPlacePredictions({ input: inputValue, types: ["(regions)"] }, (predictions) => {
      console.log("predictions", predictions);
      if (predictions != undefined && predictions[0] != undefined) {
        var place_id = predictions[0].place_id;
        var formatedAddress = predictions[0].description;
        getPlaceDetails(place_id, inputValue);
        setSuggestions(predictions || []);
        console.log("predictions", predictions);
      } else {
        var formatedAddress = inputValue;
        onPlaceClick(null, formatedAddress);
        console.log("predictions else", predictions);
      }
    });
  };

  const getPlaceDetails = (placeId, formatedAddress) => {
    const service = new window.google.maps.places.PlacesService(document.createElement("div"));
    service.getDetails({ placeId }, (place) => {
      const state = place.address_components?.find((c) => c.types.includes("administrative_area_level_1"));
      console.log("state", state);
      if (state) {
        onPlaceClick(state, formatedAddress);
      }
    });
  };

  return (
    <>
      <Autocomplete
        value={inputValue}
        onLoad={(ref) => {
          autocompleteRef.current = ref;
        }}
        onPlaceChanged={handlePlaceSelect}
        className="autoCompleteDiv"
      >
        <input type="text" value={inputValue} className="form-control" placeholder="Enter a Location" onChange={handleChange} />
      </Autocomplete>
      <span className="input-group-text" id="basic-addon2" onClick={clickHandle}>
        <FontAwesomeIcon icon={faSearch} />
      </span>
    </>
  );
};

export default AutoCompleteComponent;
