import { globalConfig } from "@/globalConfig";
import React, { useState, useRef, useEffect } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";

const MultiSelectDropdownCategory = ({ options, label, onChange, defaultSelected }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionsName, setSelectedOptionsName] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (defaultSelected != null) {
      let dataaa = options.filter((item) => item.name == defaultSelected);
      if (dataaa.length > 0) {
        let updatedSelection = [];
        let updatedSelectionName = [];

        updatedSelection.push(dataaa[0].id);
        updatedSelectionName.push(dataaa[0].name);

        setSelectedOptions(updatedSelection);
        setSelectedOptionsName(updatedSelectionName);
        onChange(updatedSelectionName);
      }
      console.log("dataaa", dataaa);
    }
  }, [defaultSelected]);

  const handleSelection = (value) => {
    let updatedSelection = [...selectedOptions];
    let updatedSelectionName = [...selectedOptionsName];
    if (updatedSelection.includes(value.id)) {
      updatedSelection = updatedSelection.filter((item) => item !== value.id);
      updatedSelectionName = updatedSelectionName.filter((item) => item !== value.name);
    } else {
      updatedSelection.push(value.id);
      updatedSelectionName.push(value.name);
    }
    setSelectedOptions(updatedSelection);
    setSelectedOptionsName(updatedSelectionName);
    onChange(updatedSelectionName);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="" ref={dropdownRef}>
      <label className="mb-2 fw-bold">{label}</label>
      <div className="form-select" onClick={() => setIsOpen(!isOpen)}>
        {selectedOptionsName.length > 0 ? selectedOptionsName.join(", ") : "All Categories"}
      </div>
      {isOpen && (
        <div className="dropdown-menu show categoryDropdown">
          {options.map((item, i) => (
            <label key={i} className="dropdown-item">
              <input type="checkbox" checked={selectedOptions.includes(item.id)} onChange={() => handleSelection(item)} />
              {item.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdownCategory;
