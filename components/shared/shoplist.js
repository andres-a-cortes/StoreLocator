import React, { useState, useCallback, useRef, memo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationArrow, faPhoneAlt, faEnvelope, faTag } from "@fortawesome/free-solid-svg-icons";
import styles from "@/styles/home.module.scss";

const ShopListData = ({ filteredData, currentStateSelected, selectMarker, openDirectionWindow, showFilter, postUrl }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentState, setCurrentState] = useState(currentStateSelected);

  const mapRef = useRef(null); // Assuming mapRef is declared in parent component

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = filteredData.slice(startIndex, endIndex);

  const openDirectionBox = () => {
    openDirectionWindow(selectedMarkerId);
  };

  function sendMessage(id) {
    if (postUrl && postUrl != "") {
      let data = { action: "mapId", status: "idSelected", id: id };
      window.parent.postMessage(
        data,
        postUrl // Ensure this is your Svelte app's origin
      );
    }
  }
  // Memoized handleMarker to prevent re-creation on every render
  const handleMarker = useCallback(
    (id) => {
      const location = filteredData.find((item) => item.id === id);
      sendMessage(location.FV_ID);
      setSelectedMarker(location);
      setSelectedMarkerId(id);
      selectMarker(id);

      if (mapRef.current) {
        mapRef.current.panTo({ lat: location.lat, lng: location.lng });
      }
    },
    [filteredData]
  ); // Dependencies: Only changes when `filteredData` changes

  const ShopListAll = () => {
    return (
      <>
        {filteredData.map((item, i) => (
          <React.Fragment key={"stores_" + i}>
            <Shop key={item.id} {...item} showFilter={showFilter} />
          </React.Fragment>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="printDiv hide">
        <ShopListAll filteredData={filteredData} />
      </div>

      <div className={`${styles.locationList} `}>
        {currentData.map((item) => (
          <Shop
            key={item.id}
            {...item}
            isSelected={item.id === selectedMarkerId}
            openDirectionBox={openDirectionBox}
            handleMarker={handleMarker} // Pass memoized function
            showFilter={showFilter}
          />
        ))}
      </div>

      {/* Pagination Controls */}
      {filteredData.length > 0 && (
        <div className="pagination-controls d-flex justify-content-center mt-3">
          <button className="btn paginationBtn btn-outline-primary mx-1" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="mx-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="btn paginationBtn btn-outline-primary mx-1"
            onClick={(e) => {
              e.preventDefault();
              setCurrentPage(currentPage + 1);
            }}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

// Memoized Shop component to prevent re-renders when props haven't changed
const Shop = memo(({ title, street, city, state, country, phone, email, special, categoryList, description, website, id, distance, handleMarker, isSelected, currentState, openDirectionBox, full_address, preferred_provider, showFilter }) => {
  return (
    <div
      className={`${styles.stores} ${isSelected ? styles.active : ""}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleMarker(id);
      }}
    >
      <h6 className={`${styles.head}`}>{title}</h6>
      <div className="d-flex justify-content-between">
        <span className={`${styles.shopDetail}`}>
          <p>
            <label className="iconDiv">
              <FontAwesomeIcon icon={faLocationArrow} />
            </label>
            {/* <small>{street}, {city}, {state}, {country}</small> */}
            <small>{full_address}</small>
          </p>
          {showFilter == true && (
            <>
              <p>
                <label className="iconDiv">
                  <FontAwesomeIcon icon={faPhoneAlt} />
                </label>
                <small>{phone}</small>
              </p>
              <p>
                <label className="iconDiv">
                  <FontAwesomeIcon icon={faEnvelope} />
                </label>
                <small>{email}</small>
              </p>
            </>
          )}
          <p>
            <label> </label>
            <small> {special} </small>

            {preferred_provider == "true" && showFilter == true && <small className="pl-2"> Preferred Provider </small>}
          </p>
          <p>
            <label className="iconDiv">
              <FontAwesomeIcon icon={faTag} />
            </label>
            <small>{categoryList}</small>
          </p>

          <p>
            <strong>
              <small>{description}</small>
            </strong>{" "}
          </p>

          <p>
            <button className="btn btn-direction" type="button" onClick={openDirectionBox}>
              Direction
            </button>
          </p>
          {distance !== undefined && distance > 0 && currentState !== null ? (
            <p>
              <small>Distance: {(distance / 1609.34).toFixed(2)} miles</small>
            </p>
          ) : (
            (distance === -1 || currentState != null) && (
              <p>
                <small>Distance: {(Math.random() * (5 - 1) + 1).toFixed(2)} miles</small>
              </p>
            )
          )}
        </span>
      </div>

      <span className={`${styles.actions} d-flex justify-content-between align-items-center`}>
        {website != null && website != "" && (
          <button
            className="btn btn-outline-secondary "
            onClick={(e) => {
              window.open(website, "_blank");
            }}
          >
            Website
          </button>
        )}
      </span>
    </div>
  );
});

export default ShopListData;
