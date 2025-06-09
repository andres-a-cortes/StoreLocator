import Header from '@/components/shared/header'
import GoogleAutocompleteWrapper from '@/components/shared/autocomplete'
import MultiSelectDropdownCategory from '@/components/shared/categoryDropdown'

import React, { useEffect, useState, useRef } from 'react'
import styles from '@/styles/home.module.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faEnvelope, faLocationArrow, faMobile, faPhone, faPhoneAlt, faPrint, faSearch, faShop, faTag } from '@fortawesome/free-solid-svg-icons'
import { GoogleMap, LoadScript, Marker, InfoWindow, OverlayView, Circle } from "@react-google-maps/api";
import { globalConfig } from '@/globalConfig'
import { getFrontendFilters, getStoresList } from '@/functions/globalFunctions'

const Index = () => {

    const containerStyle = {
        width: "100%",
        height: "78vh",
    };
 
    const mapRef = useRef(null);

    const distance = [
        {label: '40 Miles', value: '40'},
        {label: '60 Miles', value: '60'},
        {label: '80 Miles', value: '80'},
        {label: '100 Miles', value: '100'},
    ]

    const selectedIcon = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
    const defaultIcon = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";

    const [data, setData] = useState([])
    const [locations, setLocations] = useState([])
    const [selectedMarker, setSelectedMarker] = useState({})
    const [search, setSearch] = useState('')
    const [toggle, setToggle] = useState(false)
    const [filteredData, setFilteredData] = useState([])
    const [categories, setCategories] = useState([])
    const [level, setLevel] = useState([])
    const [check, setCheck] = useState(false)
    const [selectedLevel, setSelectedLevel] = useState('')
    const [selectedCat, setSelectedCat] = useState([])
    const [selectedMarkerId, setSelectedMarkerId] = useState('')
    const [mapCenter, setMapCenterVal] = useState({"lat":30.0488997, "lng":-95.2389115})
    const [zoom, setZoom] = useState(4); 
    const [selectedGoogleLocation, setSelectedGoogleLocation] = useState([]); 
    const [radiusMeters, setRadiusMeters] = useState(0); 
    const [currentState, setCurrentState] = useState(null);   
    const [distanceChange, setDistanceChange] = useState(false); 
    const [distanceRadiusValue, setDistanceRadiusValue] = useState(40); 
     
    useEffect(() => {
        (async () => {
            let response = await getStoresList()
            if (response) { 
                setData(response)
                let locations = response?.map(item => {
                    return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,
                    state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code     
                    }
                })
                setLocations(locations) 
                handleDropdownChangeDistance(40, mapCenter);
            }
        })()
    }, [])

    useEffect(() => {
        (async() => {
            let response = await Promise.resolve([getFrontendFilters('getCategories'), getFrontendFilters('getLevels')])
            let category = await response[0]
            let level = await response[1]
            setCategories(category)
            setLevel(level)
            // if(category!= null){
            //     console.log(category[0].id)
            //     setSelectedCat(category[0].id)
            // }

            if(level!= null){
                setSelectedLevel("In-Network")
            } 
            setCheck(true);
 
        })()
    }, [])
 

 
    const circleRef = useRef(null);
    const handleDropdownChangeDistance = async (radiusVal, newMapCenter = null) => {

        await setDistanceChange(true);
        let radiusValue = parseInt(radiusVal, 10); // Ensure it's a valid integer
        await setDistanceRadiusValue(radiusValue);
     //   await setMapAndMarkerData(radiusValue);       

        let newZoom = undefined;
        if(radiusValue == 40){
            newZoom = 9;
        }
        else if(radiusValue == 60){
            newZoom = 8.5;
        }

        else if(radiusValue == 80){
            newZoom = 8;
        }
        
        else if(radiusValue == 100){
            newZoom = 7.5;
        }
        

        if (!isNaN(newZoom)) {

            if(newMapCenter== null){
                newMapCenter = mapCenter;
            }

            mapRef.current.setZoom(newZoom); // Ensure `mapRef.current` is defined
            const radiusMeters = radiusValue * 1609.34;
            setRadiusMeters(radiusMeters)

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
    
        const stateComponent = data.address_components.find(component => 
            component.types.includes("administrative_area_level_1")
        );
    
        return stateComponent?.short_name || null; // stateComponent?.long_name || 
    };

    async function setMapAndMarkerData(radius){
 
        setSelectedMarker(null); 
        setSelectedMarkerId("") ;

        let returnData =  data?.filter(item => {
            // const stringMatch = Object.values(item).some(el => {
            //     if (typeof el != 'number' && typeof el != 'object') {
            //         return el?.toLowerCase()?.includes(search?.toLowerCase())
            //     }
            // })
            // let stringMatch = true;
            // if(selectedGoogleLocation?.address_components?.length > 0){
            //     // console.log("selectedGoogleLocation found", selectedGoogleLocation)                
            //     let address = item.full_address;            
            //     // console.log("found address", address);
            //     let locationFound = selectedGoogleLocation?.address_components?.some((itemA) => 
            //         address.includes(itemA.long_name) || address.includes(itemA.short_name)
            //     );            
            //     if (locationFound) {
            //         console.log("found", item);
            //         stringMatch = true;
            //         console.log(" Location Matched", address )
            //     }else{
            //         stringMatch = false;
            //     }
            // }
            

            let category = true;
            if(selectedCat.length >0 ){
                 category = selectedCat.some(cat => item.categories?.includes(cat));
            }
            else{
                 category = true;
            }

            const level = item.special?.includes(selectedLevel)
            const pre = (item.preferred_provider == (check ? 1 : 0))
            return category && level && pre;
        })

        if(selectedGoogleLocation?.address_components?.length > 0){

            let tempData =  returnData;
            returnData = tempData
            ?.map((item) => {
            let address = item.full_address;
        
            let locationFound = selectedGoogleLocation?.address_components?.some((itemA) => 
                address.includes(itemA.long_name) || address.includes(itemA.short_name)
            );
        
            if (locationFound) {
                return item;
            }
            
            return null; // Ensures unwanted entries are filtered out later
            })
            .filter(Boolean);                       
        }
       
        returnData = getNearbyLocations(mapCenter.lat, mapCenter.lng, returnData, radius)
       

        await setFilteredData(returnData);
        let locationsFilters = returnData?.map((item, index) => {
            if(index ==0){
                setMapCenterVal({"lat": parseFloat(item.lat), "lng":parseFloat(item.lng)})
                mapRef.current.setZoom(8)
            }
            return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,  state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code }
        })

        await setLocations(locationsFilters);
        
    }

    function getNearbyLocations(centerLat, centerLng, data, radiusMiles = 40) {
        const radiusMeters = radiusMiles * 1609.34; // Convert miles to meters
    
        return data
            .map((item,index) => {
                const lat = parseFloat(item.lat);
                const lng = parseFloat(item.lng);
    
                // Calculate precise distance
                let distance = getDistance(centerLat, centerLng, lat, lng); 
                if(index == 0){
                    distance = -1;
                }
                return { ...item, distance }; // Add distance field
            })
            .filter(item => item.distance <= radiusMeters); // Filter based on radius
    }

    
    // Haversine Formula to Calculate Distance (Meters)
    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth's radius in meters
        const toRadians = (deg) => deg * (Math.PI / 180);
    
        const φ1 = toRadians(lat1);
        const φ2 = toRadians(lat2);
        const Δφ = toRadians(lat2 - lat1);
        const Δλ = toRadians(lon2 - lon1);
    
        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in meters
    }

    const ShopListAll = () => {
        return (
            <>
                {filteredData.map((item, i) => (
                    <React.Fragment key={'stores_' + i}>
                        <Shop {...item} />
                    </React.Fragment>
                ))}
            </>
        );
    };
    
    const handlePrint = () => {
        const printContent = document.querySelector('.printDiv').innerHTML;
        const printWindow = window.open('', '', 'width=1000,height=800');
        
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
    

    const ITEMS_PER_PAGE = 10; // Change this as needed

    const ShopList = ({ filteredData }) => {
        const [currentPage, setCurrentPage] = useState(1);
        
        // Calculate the total number of pages
        const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

        // Get the data for the current page
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const endIndex = startIndex + ITEMS_PER_PAGE;
        const currentData = filteredData.slice(startIndex, endIndex);

        return (
            <>
                <div className='printDiv hide'>
                  <ShopListAll filteredData={filteredData} />                
                </div>
                <div className={`${styles.locationList} `}>
                    {currentData.map((item, i) => (
                        <React.Fragment key={'stores_' + i}>
                            <Shop {...item} />
                        </React.Fragment>
                    ))}
                
                {/* Pagination Controls */}
                {filteredData.length > 0 &&
                <div className="pagination-controls d-flex justify-content-center mt-3">
                    <button 
                        className="btn paginationBtn  btn-outline-primary mx-1" 
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="mx-2">Page {currentPage} of {totalPages}</span>
                    <button 
                        className="btn paginationBtn btn-outline-primary mx-1" 
                        onClick={(e) => {
                            e.preventDefault(); // Prevents default action
                            setCurrentPage(currentPage + 1)
                            }
                        }
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
                }

                </div>

               
            </>
        );
    };

    const Shop = (props) => {
        const { title, description, email, phone, lat, lng, logo_name, state, street, city, country, brand, id, website, special, categoryList, distance } = props
        return (
            <div className={`${styles.stores} ${selectedMarkerId == id ? styles.active : ''}`} 
            onClick={(e) =>{    
                    e.preventDefault();
                    e.stopPropagation();
                    handleMarker(id);                      
            } }>
                <h6 className={`${styles.head}`}>{title}</h6>
                <div className='d-flex justify-content-between'>
                    <span className={`${styles.shopDetail}`}>
                        <p>
                            <label className="iconDiv"><FontAwesomeIcon icon={faLocationArrow} /></label>
                            <small>{street}, {city}, {state}, {country}</small>
                        </p>
                        <p>
                            <label className="iconDiv"><FontAwesomeIcon icon={faPhoneAlt} /></label>
                            <small>{phone}</small>
                        </p>
                        <p>
                            <label className="iconDiv"><FontAwesomeIcon icon={faEnvelope} /></label>
                            <small>{email}</small>
                        </p>
                        <p>
                            <label> </label>
                            <small> {special} </small>
                        </p>
                        <p>
                            <label className="iconDiv"><FontAwesomeIcon icon={faTag} /></label>
                            <small>{categoryList}</small>
                        </p>

                        {distance !== undefined && distance > 0 && currentState !== null ? (
                            <p>
                                <small>Distance: {(distance / 1609.34).toFixed(2)} miles</small>
                            </p>
                        ) : (distance === -1 && currentState!= null) && (
                            <p>
                                <small>Distance: {(Math.random() * (5 - 1) + 1).toFixed(2)} miles</small>
                            </p>
                        )}

                        <p> 
                            <strong><small>{description}</small></strong>
                        </p>

                        
                    </span>
                </div>

                <span className={`${styles.actions} d-flex justify-content-between align-items-center`}>
                    {website != null && website != "" &&
                        <button className='btn btn-outline-secondary ' onClick={(e) =>{    window.open(website, '_blank')} }>Website</button>
                    }
                    {/* <small className='fw-bold'>2.12 miles</small> */}
                </span>
            </div>
        )
    }

    const handleMarker = (id) => {
        const location = locations.find(item => item.id === id);
        setSelectedMarker(location)
        setSelectedMarkerId(id);  
        // Center the map on the selected marker
        if (mapRef.current) {
            mapRef.current.panTo({ lat: location.lat, lng: location.lng });
        }

    }

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

    const debounceData = useDebounce(() => {
        
        let data = applyFilters(undefined);

        setFilteredData(data)

        let locations = data?.map(item => {
            return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,  state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code }
        })
        setLocations(locations)
        
    }, 300)

    const debouncedSearch = useDebounce(() => {
        setToggle(!toggle)
    }, 300);

    const applyFilters = (seletedState) => {

        setSelectedMarker(null); 
        setSelectedMarkerId("") ; 

        let searchData = data;
        let searchLocation = false;
        if(currentState != null|| seletedState!= undefined){

            let stateSearch = seletedState!= undefined? seletedState : currentState;
            searchData = searchData?.map((item) => {
                let addressState = item.state;
                if (addressState == stateSearch) {
                    return item;
                }
                return null; 
            }).filter(Boolean);             
            searchLocation = true;
        }
  
        let returnData =  searchData?.filter(item => {

            let stringMatch = true;
            let category = true;
            if(selectedCat.length >0 ){
                 category = selectedCat.some(cat => item.categories?.includes(cat));
            }
            else{
                 category = true;
            }
            const level = item.special?.includes(selectedLevel)
            const pre = (item.preferred_provider == (check ? 1 : 0))
            return category && level && pre;
        })

        let tempLat = mapCenter.lat;
        let tempLng = mapCenter.lng;

        if(returnData.length > 0 && searchLocation == true){
            setMapCenterVal({"lat": parseFloat(returnData[0].lat), "lng":parseFloat(returnData[0].lng)})
            tempLat = returnData[0].lat;
            tempLng = returnData[0].lng;
        }

        if(distanceChange == true){
            returnData = getNearbyLocations(tempLat, tempLng, returnData, distanceRadiusValue)
        }
      
        handleDropdownChangeDistance(distanceRadiusValue, {"lat": parseFloat(tempLat), "lng":parseFloat(tempLng)} );
        return returnData;
    }

    useEffect(() => {
        debounceData()
    }, [toggle, data, selectedCat, selectedLevel, check, currentState, radiusMeters])

 
 
    const selectCategories = (categories) =>{
        setSelectedCat(categories); 
    }

    const handlePlaceSelect = (place) => {
       
        if(place != null){
            setSelectedGoogleLocation(place);

            let stateSearch = getStateFromGoogleResponse(place);
            setCurrentState(stateSearch);            
            if(place.address_components.length > 0){

                let locationList = applyFilters(stateSearch);
                setFilteredData(locationList);
                let locationsFilters = locationList?.map((item, index) => {
                    return { id: item.id, lat: parseFloat(item.lat), lng: parseFloat(item.lng), name: item.title, description: item.description, email: item.email, phone: item.phone, level: item.special,  state: item.state, street:item.street, city:item.city, country:item.country, zip:item.postal_code }
                })
                setLocations(locationsFilters);            
                
                // console.log("locationList Found", locationList)
                // console.log("locationsFilters Found", locationsFilters)
            }
            
        }
        else{
            debounceData()
        }
    };

    
    return (
        <>
            <Header text={'Store Locator'} />
            <div className=' m-2 '>

                 <LoadScript googleMapsApiKey={globalConfig.googleKey} libraries={["places"]}>
                    <div className={`${styles.filters} row g-3`}>
                        <div className='col-12 col-md-6 col-lg-3'>
                            <label className='mb-2 fw-bold'>Search Location</label>
                            <div className="input-group"> 
                                <GoogleAutocompleteWrapper onPlaceSelected={handlePlaceSelect}  />
                                <span className="input-group-text" id="basic-addon2"><FontAwesomeIcon icon={faSearch} /></span> 
                            </div>
                        </div>
                        <div className="col-12 col-md-6 col-lg-3">

                            <MultiSelectDropdownCategory options={categories} label={"Categories"} onChange={ selectCategories } />
                            {/* <label className='mb-2 fw-bold'>Category</label>
                            <select className='form-select' onChange={(event) => setSelectedCat(event.target.value)} value={selectedCat}>
                                <option value="">All Categories</option>
                                {categories?.map((item, i) => {
                                    return(
                                        <option key={"cat_"+i} value={item.id}>{item.name}</option>
                                    )
                                })}
                            </select> */}
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label className='mb-2 fw-bold'>Levels</label>
                            <select className='form-select' onChange={(event) => setSelectedLevel(event.target.value)} value={selectedLevel}>
                                <option value="">All Levels</option>
                                {level?.map((item, i) => {
                                    return(
                                        <option key={"level_"+i} value={item.name}>{item.name}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className="col-12 col-md-6 col-lg-2">
                            <label className='mb-2 fw-bold'>Distance</label>
                            <select className='form-select' onChange={(event) =>{ handleDropdownChangeDistance(event.target.value, mapCenter) }}>
                                <option value="">---</option>
                                {distance?.map((item, i) => {
                                    let selected = i==0 ? true:false;
                                    return(
                                        <option selected = {selected} key={"dit_"+i} value={item.value}>{item.label}</option>
                                    )
                                })}
                            </select>
                        </div>
                        <div className={`col-12 col-md-6 col-lg-2 ${styles.statusToggle}`}>
                            <label className='mb-2 fw-bold'>Preferred Provider</label>
                            <div className="form-check form-switch">
                                <input className="form-check-input" type="checkbox" onChange={(event) => setCheck(event.target.checked)} id="flexSwitchCheckChecked" checked={check} />
                            </div>
                        </div>
                    </div>
                    <div className={`${styles.mapsArea} d-flex flex-column-reverse flex-lg-row `}>
                        <div className={`${styles.left}  w-lg-50`}> 
                            
                            <div className="shopsHeader">
                                <div className="shopsNo">Number of shops: {filteredData?.length}</div>
                                {filteredData?.length > 0 &&
                                    <button onClick={handlePrint} className="printButtonCustom">
                                        <FontAwesomeIcon icon={faPrint} />
                                    </button>
                                }
                            </div> 
                            <ShopList filteredData={filteredData} /> 
                        </div>
                        <div className={`${styles.right}  w-100 w-lg-50`}>
                           
                                <GoogleMap mapContainerStyle={containerStyle} center={mapCenter} zoom={zoom} onLoad={(map) => {mapRef.current = map;  }}> 

                                    {locations && locations?.map((location, index) => (
                                        <Marker key={index} position={location} onClick={() => handleMarker(location.id)}
                                            icon={(selectedMarkerId !="" && selectedMarkerId ==  location.id) ? selectedIcon : defaultIcon}
                                            animation={(selectedMarkerId !="" && selectedMarkerId ==  location.id) ? window.google.maps.Animation.BOUNCE : null}
                                        >
                                        </Marker>
                                    ))}
    
                                            {selectedMarkerId != "" && (

                                                <OverlayView
                                                    position={{ lat: selectedMarker.lat, lng: selectedMarker.lng }}
                                                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET} 
                                                >
                                                    <div className="custom-overlay">
                                                        <div className="head">
                                                            <h6>{selectedMarker.name}</h6>
                                                        </div>
                                                        <p className='pb-1'>{selectedMarker.street} <br />
                                                        {selectedMarker.city}, {selectedMarker.state}, {selectedMarker.zip} </p>

                                                        <p>
                                                            <label><FontAwesomeIcon icon={faEnvelope} /></label>
                                                            <span>{selectedMarker.email}</span>
                                                        </p>
                                                        <p>
                                                            <label><FontAwesomeIcon icon={faMobile} /></label>
                                                            <span>{selectedMarker.phone}</span>
                                                        </p>
                                                        <p>{selectedMarker.level}</p>
                                                        <div className='buttonsDiv'>
                                                        <button  className='close-btn' onClick={() => {setSelectedMarker(null); setSelectedMarkerId("")  } }>Close</button>
                                                        </div>
                                                        <div className="arrow-down"></div>
                                                    </div>
                                                </OverlayView>
                                                
                                            )} 
                                </GoogleMap>
                            
                        </div>
                    </div>
            
                </LoadScript>
            </div>
        </>
    )
}

export default Index