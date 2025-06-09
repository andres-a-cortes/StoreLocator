import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const GoogleMapComponent = ({ latitude, longitude }) => {
  const mapStyles = { height: "400px", width: "100%" };
  const lat = parseFloat(latitude) || 0; 
  const lng = parseFloat(longitude) || 0;

  console.log(latitude+ " --  " +longitude )
  return (
    <LoadScript googleMapsApiKey="AIzaSyBrJb02SjP_JhsxFrGb_IXJrXrXunf-ofo">
       <GoogleMap mapContainerStyle={mapStyles} center={{ lat, lng }} zoom={15}>
        {/* ✅ Ensure marker gets valid latitude and longitude */}
        {lat !== 0 && lng !== 0 && <Marker position={{ lat, lng }} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
