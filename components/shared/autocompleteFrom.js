import { globalConfig } from "@/globalConfig";
import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const AutoCompleteComponentFrom = ({ defaultValue, onPlaceSelected }) => {
  const autocompleteRefFrom = useRef(null);
  const [inputValue, setInputValue] = useState("");

  const handlePlaceSelect = () => {
    if (autocompleteRefFrom.current) {
      const place = autocompleteRefFrom.current.getPlace();
      onPlaceSelected(place);
      setInputValue(place.formatted_address);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    console.log("value", value);
    // If input is empty, trigger update with `null` or empty object
    if (value === "") {
      onPlaceSelected(null);
    }
  };

  return (
    <Autocomplete onLoad={(ref) => (autocompleteRefFrom.current = ref)} onPlaceChanged={handlePlaceSelect} className=" ">
      <input type="text" className="form-control" placeholder="Enter a Location" onChange={handleChange} value={inputValue != "" ? inputValue : defaultValue} />
    </Autocomplete>
  );
};

export default AutoCompleteComponentFrom;
