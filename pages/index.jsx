import Header from "@/components/shared/header";
import GoogleAutocompleteWrapper from "@/components/shared/autocomplete";
import AutoCompleteComponentFrom from "@/components/shared/autocompleteFrom";
import MultiSelectDropdownCategory from "@/components/shared/categoryDropdown";
import DirectionMap from "@/components/shared/routeDirectionMap";
import { useRouter } from "next/router";
import ShopListData from "@/components/shared/shoplist";

import React, { useEffect, useState, useRef } from "react";
import styles from "@/styles/home.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEnvelope, faLocationArrow, faMobile, faPhone, faPhoneAlt, faPrint, faSearch, faShop, faTag, faTimes } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, LoadScript, Marker, InfoWindow, OverlayView, Circle, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import { globalConfig } from "@/globalConfig";
import { getFrontendFilters, getStoresList, getStoresListNodeApi } from "@/functions/globalFunctions";

const Directions = () => {
  const libraries = ["places"];
  const router = useRouter();
  const containerStyle = {
    width: "100%",
    height: "78vh",
  };
  const hasFetchedData = useRef(false);

  const hasUpdateData = useRef(false);

  const mapRef = useRef(null);
  const mapRefDirection = useRef(null);

  const distance = [
    { label: "40 Miles", value: "40" },
    { label: "60 Miles", value: "60" },
    { label: "80 Miles", value: "80" },
    { label: "100 Miles", value: "100" },
  ];

  const selectedIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
  const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

  const [data, setData] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState({});
  const [search, setSearch] = useState("");
  const [toggle, setToggle] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [level, setLevel] = useState([]);
  const [check, setCheck] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedCat, setSelectedCat] = useState([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState("");
  const [mapCenter, setMapCenterVal] = useState({ lat: 30.0488997, lng: -95.2389115 });
  const [zoom, setZoom] = useState(5);
  const [selectedGoogleLocation, setSelectedGoogleLocation] = useState([]);
  const [newSelectedGoogleLocation, setNewSelectedGoogleLocation] = useState(null);
  const [radiusMeters, setRadiusMeters] = useState(0);
  const [currentState, setCurrentState] = useState("TX");
  const [currentSearch, setCurrentSearch] = useState("");
  const [distanceChange, setDistanceChange] = useState(false);
  const [directionBox, setDirectionBox] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [autoCompleteDefaultValue, setAutoCompleteDefaultValue] = useState("");
  const [directionsRouteMap, setDirectionsRouteMap] = useState(null);
  const [distanceRadiusValue, setDistanceRadiusValue] = useState(40);
  const [showDirectionsMap, setShowDirectionsMap] = useState(false);
  const [routeSteps, setRouteSteps] = useState(null);
  const [selectedStep, setSelectedStep] = useState(null);
  const [routeInfo, setRouteInfo] = useState(null);
  const [mapKey, setMapKey] = useState(Date.now());
  const [showMarker, setShowMarker] = useState(true);
  const [showViewBox, setShowViewBox] = useState(true);
  const [defaultSelectedCategory, setDefaultSelectedCategory] = useState(null);
  const [queryParameter, setQueryParameter] = useState(null);

  const [showFilter, setshowFilter] = useState(false);

  const [postUrl, setPostUrl] = useState("");

  const changePostUrl = (value) => {
    setPostUrl(value);
  };

  useEffect(() => {
    if (router.isReady) {
      setQueryParameter(router.query);
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!queryParameter) return;
    if (hasFetchedData.current) return;
    hasFetchedData.current = true;

    (async () => {
      let responseNode = await getStoresListNodeApi();
      if (responseNode) {
        if (responseNode.message != undefined && responseNode.message == "Job submitted, wait for completion.") {
          responseNode = await getStoresListNodeApi();
        }

        setData(responseNode.shopListResult);
        let category = responseNode.categories;
        let level = responseNode.levels;
        let levelSelected = selectedLevel;

        if (queryParameter?.showFilter !== undefined && queryParameter?.showFilter !== null && queryParameter?.showFilter == "false") {
          let showFilterVal = queryParameter?.showFilter;
          setCheck(false);
          await setDistanceChange(false);
          await setDistanceRadiusValue(null);
          setshowFilter(false);
        } else {
          setshowFilter(true);

          await setDistanceChange(true);
          await setDistanceRadiusValue(40);
          if (queryParameter?.level !== undefined && queryParameter?.level !== null) {
            levelSelected = queryParameter.level;
            let dataaa = level.filter((item) => item.name == levelSelected);
            if (dataaa.length > 0) {
              if (level != null) {
                setSelectedLevel(levelSelected);
              }
            }
          }
          if (queryParameter?.category !== undefined && queryParameter?.category !== null) {
            await setDefaultSelectedCategory(queryParameter?.category);
          }

          if (queryParameter?.provider !== undefined && queryParameter?.provider !== null) {
            let valPro = queryParameter?.provider;
            if (valPro == "false") {
              setCheck(false);
            }
          }
        }
        setCategories(category);
        setLevel(level);
      }
    })();
  }, [queryParameter]);

  useEffect(() => {
    debounceData();
  }, [toggle, data, selectedCat, selectedLevel, check, currentState, radiusMeters, showMarker]);

  const circleRef = useRef(null);
  const handleDropdownChangeDistance = async (radiusVal, newMapCenter = null) => {
    await setDistanceChange(true);
    let radiusValue = parseInt(radiusVal, 10); // Ensure it's a valid integer
    await setDistanceRadiusValue(radiusValue);

    let newZoom = undefined;
    if (radiusValue == 40) {
      newZoom = 9;
    } else if (radiusValue == 60) {
      newZoom = 8.5;
    } else if (radiusValue == 80) {
      newZoom = 8;
    } else if (radiusValue == 100) {
      newZoom = 7.5;
    }

    if (!isNaN(newZoom)) {
      if (newMapCenter == null) {
        newMapCenter = mapCenter;
      }

      mapRef.current.setZoom(newZoom); // Ensure `mapRef.current` is defined
      const radiusMeters = radiusValue * 1609.34;
      setRadiusMeters(radiusMeters);

      if (mapRef.current) {
        if (circleRef.current) {
          circleRef.current.setMap(null);
        }
        // Create a new circle
        circleRef.current = new window.google.maps.Circle({
          center: newMapCenter,
          radius: radiusMeters,
          map: mapRef.current,
          strokeColor: "#D1EE3B",
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: "#f1f194",
          fillOpacity: 0.2,
        });
      }
    } else {
      console.error("Invalid zoom value:", event.target.value);
    }
  };

  const getStateFromGoogleResponse = (data) => {
    if (!data?.address_components) return null;

    const stateComponent = data.address_components.find((component) => component.types.includes("administrative_area_level_1"));

    return stateComponent?.short_name || null; // stateComponent?.long_name ||
  };

  const getAddressFromGoogleResponse = (data) => {
    if (!data?.formatted_address) return null;
    return data?.formatted_address || null;
  };

  function getNearbyLocations(centerLat, centerLng, data, radiusMiles = 40) {
    const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters

    let _return = data.map((item, index) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lng);

      // Calculate precise distance
      let distance = getDistance(centerLat, centerLng, lat, lng);
      if (distance == 0) {
        distance = 0.01;
      }
      // if(distance <=radiusMeters){
      //     console.log("item...", item.title +" - "+ distance +" - "+ radiusMeters)
      // }else{
      //     console.log("Not found item...", item.title +" - "+ distance +" - "+ radiusMeters)
      // }
      return { ...item, distance }; // Add distance field
    });

    let resData = _return.filter((item) => item.distance <= radiusMeters && item.distance != -1); // Filter based on radius

    const resDataNew = resData.map((loc) => ({
      location: loc,
      score: loc.distance,
    }));

    resDataNew.sort((a, b) => a.score - b.score);
    let returnData = resDataNew.map((loc) => loc.location);
    return returnData;
  }

  // Haversine Formula to Calculate Distance (Meters)
  function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (deg) => deg * (Math.PI / 180);

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  }

  const handlePrint = () => {
    const printContent = document.querySelector(".printDiv").innerHTML;
    const printWindow = window.open("", "", "width=1000,height=800");

    printWindow.document.write(`
            <html>
                <head>
                    <title>Print</title>
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
                    <style>
                        @media print {
                            body { margin: 0; font-family: Arial, sans-serif;  padding-top:20px;}
                            .iconDiv{ display:none; }
                            h6{ border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; font-size:18px; margin-bottom:0px; }
                            line-height:20px; }
                            .pagination-controls{display:none;}
                            p {margin-bottom:5px;}
                            .btn-direction{display:none;} 
                    </style>
                </head>
                <body>
                    ${printContent}
                </body>
            </html>
        `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const handleMarker = (id) => {
    const location = locations.find((item) => item.id === id);
    setSelectedMarker(location);
    setSelectedMarkerId(id);
    // Center the map on the selected marker
    if (mapRef.current) {
      mapRef.current.panTo({ lat: location.lat, lng: location.lng });
    }
  };

  const openDirectionBox = () => {
    setDirectionBox(true);
    setShowModal(true);
  };

  const useDebounce = (callback, delay) => {
    const debounceRef = useRef(null);
    const debouncedFunction = (...args) => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      debounceRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    };
    return debouncedFunction;
  };

  const debounceData = useDebounce(async () => {
    if (hasUpdateData.current) return;
    hasUpdateData.current = false;

    let data = await applyFilters(undefined, false);
    // console.log("data List..", data);

    setFilteredData(data);

    let locations = data?.map((item) => {
      return {
        id: item.id,
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lng),
        name: item.title,
        description: item.description,
        email: item.email,
        phone: item.phone,
        level: item.special,
        state: item.state,
        street: item.street,
        city: item.city,
        country: item.country,
        zip: item.postal_code,
      };
    });
    setLocations(locations);
  }, 300);

  const debouncedSearch = useDebounce(() => {
    setToggle(!toggle);
  }, 300);

  const applyFilters = async (seletedState, addressSearch) => {
    if (seletedState == undefined && addressSearch == undefined) {
      hasUpdateData.current = true;
    }

    setSelectedMarker(null);
    setSelectedMarkerId("");

    if (seletedState == undefined || addressSearch == false) {
      seletedState = currentSearch;
      addressSearch = true;
    }
    let searchData = [...data];
    let searchLocation = false;

    // console.log("searchData", searchData);

    const searchResult = [];
    let scoredMatchesResult = [];

    const normalize = (str) => {
      if (str != undefined && str != null) {
        return str
          .toLowerCase()
          .replace(/,/g, "") // remove commas
          .replace(/\s+/g, " ") // collapse multiple spaces
          .trim();
      }
    };

    if (addressSearch == true && seletedState != null) {
      let addressToSearch = seletedState.replace("United States", "");
      addressToSearch = addressToSearch.replace("USA", "");

      let matchIndex = -1;
      searchData.map((loc, index) => {
        if (loc.full_address != undefined && loc.full_address != null && addressToSearch != undefined && addressToSearch != null) {
          if (normalize(loc.full_address) === normalize(addressToSearch)) {
            searchResult.push(loc);
            matchIndex = index;
            searchLocation = true;
          }
        }
      });

      if (matchIndex !== -1) {
        searchData.splice(matchIndex, 1);
      }

      let placeResultState = await getLatLong(seletedState, "state");
      let placeResultStateName = getStateFromGoogleResponse(placeResultState);

      const getMatchScore = async (loc, input, stateCode) => {
        if (input != null) {
          const normalized = normalize(input);
          let score = 0;

          if (normalize(loc.full_address) === normalized) {
            score += 10;
          }
          if (normalize(loc.full_address).includes(normalized)) score += 4;
          if (normalized.includes(normalize(loc.street))) score += 3;
          if (normalized.includes(normalize(loc.city))) score += 2;

          if (normalized.includes(normalize(loc.state))) score += 1;
          else {
            if (normalize(stateCode) == normalize(loc.state)) {
            }
          }

          if (normalized.includes(normalize(loc.postal_code)) && loc.postal_code > 0) score += 2;

          return score;
        }
      };

      const scoredMatches = searchData.map((loc) => ({
        location: loc,
        score: getMatchScore(loc, addressToSearch, placeResultStateName),
      }));

      // console.log("scoredMatches...", scoredMatches);
      // Sort by score descending
      scoredMatches.sort((a, b) => b.score - a.score);

      scoredMatches.map((loc, index) => {
        if (loc.score > 0 && loc.location.street != null && loc.location.state != null) {
          scoredMatchesResult.push(loc.location);
        }
      });

      if (scoredMatchesResult.length > 0) {
        searchData = scoredMatchesResult;
        searchLocation = true;
      }
    }

    let defaultCoordinates = true;
    if (seletedState != undefined && seletedState != "") {
      defaultCoordinates = false;
      let placeResult = await getLatLong(seletedState, "state");
      let stateSearch = getStateFromGoogleResponse(placeResult);

      searchData = searchData
        ?.map((item) => {
          let addressState = item.state;
          if (normalize(addressState) == normalize(stateSearch)) {
            return item;
          }
          return null;
        })
        .filter(Boolean);
    } else {
    }

    let returnData = searchData?.filter((item, index) => {
      let stringMatch = true;
      let category = true;
      if (selectedCat.length > 0 && item.categoryList != null && item.categoryList != undefined) {
        let itemCatNames = item.categoryList;
        //category = itemCatNames.includes(selectedCat);  //selectedCat.some(cat => cat.includes(itemCatNames));
        category = selectedCat.some((cat) => cat && itemCatNames.includes(cat));
      } else {
        category = true;
      }
      const level = item.special?.includes(selectedLevel);
      let preProv = "";
      if (check) {
        preProv = "true";
      } else {
        preProv = "false";
      }

      let pre = false;
      if (item.preferred_provider == preProv) {
        pre = true;
      }

      //const pre = (item.preferred_provider == (check ? 1 : 0))

      let _return = category && level && pre;

      return _return; // category && level && pre;
    });

    // console.warn("filter search", returnData)

    let tempLat = mapCenter.lat;
    let tempLng = mapCenter.lng;

    if (returnData.length > 0 && defaultCoordinates == false && (currentSearch != "" || addressSearch == true)) {
      setMapCenterVal({ lat: parseFloat(returnData[0].lat), lng: parseFloat(returnData[0].lng) });
      tempLat = returnData[0].lat;
      tempLng = returnData[0].lng;
    }

    if (seletedState != undefined && seletedState != "" && defaultCoordinates == false) {
      let resLatLong = await getLatLong(seletedState);
      if (resLatLong != null) {
        setMapCenterVal({ lat: parseFloat(resLatLong.lat), lng: parseFloat(resLatLong.lng) });
        tempLat = resLatLong.lat;
        tempLng = resLatLong.lng;
      }
    }

    console.log("tempLat - tempLng: ", tempLat + " - " + tempLng);

    if (distanceChange == true) {
      returnData = getNearbyLocations(tempLat, tempLng, returnData, distanceRadiusValue);
    }
    if (distanceChange) {
      handleDropdownChangeDistance(distanceRadiusValue, { lat: parseFloat(tempLat), lng: parseFloat(tempLng) });
    }
    const merged = [...searchResult, ...returnData];
    return merged;
  };

  const selectCategories = (categories) => {
    setSelectedCat(categories);
  };

  const handlePlaceSelect = async (place, inputValue) => {
    if (place != null) {
      let stateSearch = null;
      let address = null;
      let formatedAddress = null;
      let locationList = null;

      if (place.name != undefined && place.formatted_address == undefined) {
        address = place.name;
        formatedAddress = address;
        setCurrentSearch(address);
        locationList = await applyFilters(address, true);
        setFilteredData(locationList);
        let placeResult = await getLatLong(address, "state");
        stateSearch = getStateFromGoogleResponse(placeResult);
        setCurrentState(stateSearch);
        setSelectedGoogleLocation(placeResult);
      } else if (inputValue != undefined && inputValue != null) {
        address = inputValue;
        formatedAddress = address;
        setCurrentSearch(address);
        stateSearch = getStateFromGoogleResponse(place);
        setCurrentState(stateSearch);
        locationList = await applyFilters(address, true);
        setFilteredData(locationList);
        setSelectedGoogleLocation(place);
      } else {
        setSelectedGoogleLocation(place);
        stateSearch = getStateFromGoogleResponse(place);
        address = getAddressFromGoogleResponse(place);
        formatedAddress = place.formatted_address;
        setCurrentSearch(formatedAddress);
        setCurrentState(stateSearch);
        if (place?.address_components?.length > 0) {
          locationList = await applyFilters(address, true);
          setFilteredData(locationList);
        }
      }

      console.log("stateSearch...", stateSearch);

      if (locationList != null) {
        let locationsFilters = locationList?.map((item, index) => {
          return {
            id: item.id,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            name: item.title,
            description: item.description,
            email: item.email,
            phone: item.phone,
            level: item.special,
            state: item.state,
            street: item.street,
            city: item.city,
            country: item.country,
            zip: item.postal_code,
          };
        });

        setLocations(locationsFilters);
        setAutoCompleteDefaultValue(formatedAddress);
      }
    } else {
      setCurrentSearch("");
      debounceData();
    }
  };

  const handlePlaceSearchSelect = async (state, formatted_address) => {
    // if(state != null){

    //     let stateSearch = state.short_name;
    //     setCurrentState(stateSearch);
    //     let locationList = applyFilters(stateSearch, false);
    //     setFilteredData(locationList);
    //     let locationsFilters = locationList?.map((item, index) => {
    //         return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,  state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code }
    //     })
    //     setLocations(locationsFilters);
    //     setAutoCompleteDefaultValue(formatted_address);
    // }
    // else if(state == null && formatted_address != null){
    //     let stateCodeNew = getStateCode(formatted_address);
    //     if(stateCodeNew!=null){
    //         let stateSearch = stateCodeNew;
    //         setCurrentState(stateSearch);
    //         let locationList = applyFilters(stateSearch, false);
    //         setFilteredData(locationList);
    //         let locationsFilters = locationList?.map((item, index) => {
    //             return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,  state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code }
    //         })
    //         setLocations(locationsFilters);
    //         setAutoCompleteDefaultValue(formatted_address);
    //     }
    // }

    if (formatted_address != null) {
      setCurrentSearch(formatted_address);

      let placeResult = await getLatLong(formatted_address, "state");
      let stateSearch = getStateFromGoogleResponse(placeResult);
      setSelectedGoogleLocation(placeResult);
      setCurrentState(stateSearch);

      let locationList = await applyFilters(formatted_address, true);
      setFilteredData(locationList);

      if (locationList != null) {
        let locationsFilters = locationList?.map((item, index) => {
          return {
            id: item.id,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lng),
            name: item.title,
            description: item.description,
            email: item.email,
            phone: item.phone,
            level: item.special,
            state: item.state,
            street: item.street,
            city: item.city,
            country: item.country,
            zip: item.postal_code,
          };
        });

        setLocations(locationsFilters);
        setAutoCompleteDefaultValue(formatted_address);
      }
    } else {
      setCurrentSearch("");
      debounceData();
    }
  };

  const getLatLong = async (address, type = "latlng") => {
    const apiKey = globalConfig.googleKey;
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === "OK") {
        if (type == "latlng") {
          const location = data.results[0].geometry.location;
          return location;
        } else {
          return data.results[0];
        }
      } else {
        console.error("Geocoding error:", data.status);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  const getStateCode = (address) => {
    const parts = address.split(",").map((part) => part.trim());
    for (let part of parts) {
      if (/^[A-Z]{2}$/.test(part)) {
        return part;
      }
    }
    return null; // or return 'Unknown' if you prefer
  };

  const handlePlaceSelectFrom = (place) => {
    if (place != null) {
      setNewSelectedGoogleLocation(place);
      //setAutoCompleteDefaultValue(place.formatted_address);
    }
  };

  const handleHideDirection = () => {
    setShowDirectionsMap(false);
    setDirectionsRouteMap(null);
    setRouteSteps(null);
    setLocations([]);
    setNewSelectedGoogleLocation(null);
    setSelectedStep(null);
    setSelectedMarker(null);
    setSelectedMarkerId("");
    debouncedSearch();
  };

  const handleGetDirection = () => {
    let place = selectedGoogleLocation;
    if (newSelectedGoogleLocation != null) {
      place = newSelectedGoogleLocation;
    }

    if (place.length > 0 || Object.keys(place).length > 0) {
      if (place.geometry) {
        const Fromlat = place.geometry.location.lat();
        const Fromlng = place.geometry.location.lng();

        if (selectedMarker) {
          const origin = { lat: Fromlat, lng: Fromlng };
          const destination = { lat: selectedMarker.lat, lng: selectedMarker.lng };

          const directionsService = new google.maps.DirectionsService();
          directionsService.route(
            {
              origin,
              destination,
              travelMode: google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === google.maps.DirectionsStatus.OK) {
                setDirectionsRouteMap(result);
                setShowMarker(false);
                setShowViewBox(false);
                setShowModal(false);
                setShowDirectionsMap(true);
                if (circleRef.current) {
                  circleRef.current.setMap(null);
                }

                // Extract detailed step-by-step directions
                const route = result.routes[0];
                const leg = route.legs[0]; // First leg of the route
                const steps = leg.steps.map((step, index) => ({
                  instruction: step.instructions, // HTML-formatted instruction
                  distance: step.distance.text,
                  location: {
                    lat: step.start_location.lat(),
                    lng: step.start_location.lng(),
                  },
                }));

                setRouteInfo({
                  distance: leg.distance.text,
                  duration: leg.duration.text,
                });

                setRouteSteps(steps);

                const bounds = new window.google.maps.LatLngBounds();
                result.routes[0].legs.forEach((leg) => {
                  leg.steps.forEach((step) => {
                    bounds.extend(step.start_location);
                    bounds.extend(step.end_location);
                  });
                });

                if (mapRefDirection.current) {
                  mapRefDirection.current.fitBounds(bounds);
                }
              } else {
                setError("Could not fetch directions");
              }
            }
          );
        }
      } else {
        console.log("handlePlaceSelectFrom null");
      }
    }
  };

  const handleStepClick = (step) => {
    setSelectedStep(step);
    if (mapRefDirection.current) {
      mapRefDirection.current.panTo(step.location); // Move map to the step location
      //mapRef.current.setZoom(14); // Zoom in for better view
    }
  };

  const DirectionsTable = () => {
    return (
      <div className={`${styles.locationList} `}>
        <table className="distanceDetails">
          <tbody>
            {routeSteps.map((step, index) => {
              const cleanedInstruction = step.instruction.split("<div")[0]; // Extract before the <div>
              return (
                <tr key={index} onClick={() => handleStepClick(step)}>
                  <td className="firstColumn">{index + 1}</td>
                  <td dangerouslySetInnerHTML={{ __html: cleanedInstruction }}></td> {/* Apply cleaned instruction */}
                  <td className="lastColumn">{step.distance}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      {/* <Header text={'Store Locator'} /> */}
      <div className={`m-2`}>
        <LoadScript googleMapsApiKey={globalConfig.googleKey} libraries={libraries}>
          <div className={`${styles.filters} row g-3`}>
            <div className="col-12 col-md-6 col-lg-3">
              <label className="mb-2 fw-bold">Search Location</label>
              <div className="input-group">
                <GoogleAutocompleteWrapper onPlaceSelected={handlePlaceSelect} onPlaceClick={handlePlaceSearchSelect} changePostUrl={changePostUrl} />
                {/* <span className="input-group-text" id="basic-addon2"  ><FontAwesomeIcon icon={faSearch} /></span>  */}
              </div>
            </div>

            <div className="col-12 col-md-6 col-lg-3">
              <MultiSelectDropdownCategory options={categories} label={"Categories"} onChange={selectCategories} defaultSelected={defaultSelectedCategory} />
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label className="mb-2 fw-bold">Levels</label>
              <select className="form-select" onChange={(event) => setSelectedLevel(event.target.value)} value={selectedLevel}>
                <option value="">All Levels</option>
                {level?.map((item, i) => {
                  return (
                    <option key={"level_" + i} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
            </div>
            <div className="col-12 col-md-6 col-lg-2">
              <label className="mb-2 fw-bold">Distance</label>
              <select
                className="form-select"
                onChange={(event) => {
                  handleDropdownChangeDistance(event.target.value, mapCenter);
                }}
              >
                <option value="">---</option>
                {distance?.map((item, i) => {
                  let selected = i == 0 ? true : false;
                  return (
                    <option selected={selected} key={"dit_" + i} value={item.value}>
                      {item.label}
                    </option>
                  );
                })}
              </select>
            </div>

            {showFilter && (
              <>
                <div className={`col-12 col-md-6 col-lg-2 ${styles.statusToggle}`}>
                  <label className="mb-2 fw-bold">Preferred Provider</label>
                  <div className="form-check form-switch">
                    <input className="form-check-input" type="checkbox" onChange={(event) => setCheck(event.target.checked)} id="flexSwitchCheckChecked" checked={check} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className={`${styles.mapsArea} d-flex flex-column-reverse flex-lg-row `}>
            {showDirectionsMap && (
              <div className={`${styles.left}   w-lg-50`}>
                <div className="">
                  <div className="storeLocationsHeading">
                    STORE DIRECTION
                    <button
                      className="btn-close btnDirectionClose"
                      onClick={() => {
                        handleHideDirection();
                      }}
                    ></button>
                  </div>
                  <div className="locationSelected  "> {autoCompleteDefaultValue} </div>
                  <div className="distanceLine  ">
                    {" "}
                    {routeInfo.distance} About {routeInfo.duration}{" "}
                  </div>

                  <DirectionsTable />
                </div>
              </div>
            )}

            {showDirectionsMap == false && (
              <div className={`${styles.left}   w-lg-50`}>
                <div className="shopsHeader">
                  <div className="shopsNo">Number of shops: {filteredData?.length}</div>
                  {filteredData?.length > 0 && (
                    <button onClick={handlePrint} className="printButtonCustom">
                      <FontAwesomeIcon icon={faPrint} />
                    </button>
                  )}
                </div>

                <ShopListData filteredData={filteredData} currentStateSelected={currentState} selectMarker={handleMarker} showFilter={showFilter} openDirectionWindow={openDirectionBox} postUrl={postUrl} />
              </div>
            )}

            <div className={`${styles.right}  w-100 w-lg-50`}>
              {showDirectionsMap && (
                <>
                  <GoogleMap
                    key={mapKey}
                    mapContainerStyle={containerStyle}
                    center={mapCenter}
                    zoom={zoom}
                    onLoad={(map) => {
                      mapRefDirection.current = map;
                    }}
                  >
                    <DirectionMap directionsRouteMap={directionsRouteMap} containerStyle={containerStyle} selectedStep={selectedStep} mapCenter={mapCenter} />
                  </GoogleMap>
                </>
              )}

              {showDirectionsMap == false && (
                <GoogleMap
                  key={mapKey}
                  mapContainerStyle={containerStyle}
                  center={mapCenter}
                  zoom={zoom}
                  onLoad={(map) => {
                    mapRef.current = map;
                  }}
                >
                  {locations &&
                    locations?.map((location, index) => (
                      <Marker
                        key={index}
                        position={location}
                        onClick={() => handleMarker(location.id)}
                        icon={selectedMarkerId != "" && selectedMarkerId == location.id ? selectedIcon : defaultIcon}
                        animation={selectedMarkerId != "" && selectedMarkerId == location.id ? window.google.maps.Animation.BOUNCE : null}
                      ></Marker>
                    ))}

                  {selectedMarkerId != "" && (
                    <OverlayView position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                      <div className="custom-overlay">
                        <div className="head">
                          <h6>{selectedMarker.name}</h6>
                        </div>
                        <p className="pb-1">
                          {selectedMarker.street} <br />
                          {selectedMarker.city}, {selectedMarker.state}, {selectedMarker.zip}{" "}
                        </p>

                        <p>
                          <label>
                            <FontAwesomeIcon icon={faEnvelope} />
                          </label>
                          <span>{selectedMarker.email}</span>
                        </p>
                        <p>
                          <label>
                            <FontAwesomeIcon icon={faMobile} />
                          </label>
                          <span>{selectedMarker.phone}</span>
                        </p>
                        <p>{selectedMarker.level}</p>
                        <div className="buttonsDiv">
                          <button
                            className="close-btn"
                            onClick={() => {
                              setSelectedMarker(null);
                              setSelectedMarkerId("");
                            }}
                          >
                            Close
                          </button>
                        </div>
                        <div className="arrow-down"></div>
                      </div>
                    </OverlayView>
                  )}

                  {/* {showDirectionsMap && directionsRouteMap  && <DirectionsRenderer directions={directionsRouteMap}   />} */}

                  {/* {selectedStep && (
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
                                        )} */}

                  {/* Bootstrap Modal */}
                  {
                    <div className={`modal directionModal fade ${showModal ? "show d-block" : "d-none"}`} tabIndex="-1">
                      <div className="modal-dialog">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Get Directions</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                          </div>
                          <div className="modal-body">
                            <div className="mb-3">
                              <label className="form-label">From:</label>
                              <AutoCompleteComponentFrom defaultValue={autoCompleteDefaultValue} onPlaceSelected={handlePlaceSelectFrom} changePostUrl={changePostUrl} />

                              {/* <input 
                                                        type="text" 
                                                        className="form-control" 
                                                        value={""} 
                                                        onChange={(e) => setUserName(e.target.value)} 
                                                        placeholder="Enter your name" 
                                                    /> */}
                            </div>
                            <div className="mb-3">
                              <label className="form-label">To:</label>
                              {selectedMarker && <input type="text" className="form-control" value={selectedMarker.street + ", " + selectedMarker.city + ", " + selectedMarker.state + ", " + selectedMarker.zip} disabled="disabled" />}
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button type="button" className="btn btn-secondary directionBtn" onClick={handleGetDirection}>
                              {" "}
                              Get Direction
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </GoogleMap>
              )}
            </div>
          </div>
        </LoadScript>
      </div>
    </>
  );
};

export default Directions;
