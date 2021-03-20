import "mapbox-gl/dist/mapbox-gl.css";
import "react-map-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { render } from "react-dom";

import Geocoder from "react-map-gl-geocoder";
import { NavLink } from 'react-router-dom';
import { ReactComponent as PersonLogo } from  '../icons/person-24px.svg';
import { ReactComponent as FilterLogo } from  '../icons/filter-24px.svg';
import MapGL, {GeolocateControl, Marker, Popup} from "react-map-gl";
import { Card, CardActions,Chip, Avatar,  Typography, Button, CardContent, makeStyles, ListItemSecondaryAction } from '@material-ui/core';
import {AccessibleForward, AirlineSeatLegroomExtra, Info, Person, PersonAddDisabled, PlayCircleFilledWhite, PregnantWoman, Wc} from '@material-ui/icons'; 
import { indigo } from "@material-ui/core/colors";
import { withTheme } from "@material-ui/styles";
// Please be a decent human and don't abuse my Mapbox API token.
// If you fork this sandbox, replace my API token with your own.
// Ways to set Mapbox token: https://uber.github.io/react-map-gl/#/Documentation/getting-started/about-mapbox-tokens
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white", 
    
  },
  icons:
  {
    fill:indigo[800], 
  }
}));
function Map(props) {
  const chipStyle = useStyles(); 
  const [toilets,setToilets] = useState([]);
  const [selectedToilet, setSelectedToilet] = useState(null);
  useEffect(() => {
    const listener = e => {
      if (e.key === "Escape") {
        setSelectedToilet(null);
      }
    };
    window.addEventListener("keydown", listener);

    return () => {
      window.removeEventListener("keydown", listener);
    };
  }, []);
  useEffect(()=>{   
     fetch('/toilet/allToilets',{
       
     }).then(res=>res.json())
     .then(result=>{
          console.log("Found toilets, "+result.length+" toilets"); 
          
          const filter=JSON.parse(localStorage.getItem("filterSettings"));
          
          var filteredToilets=[];
          if(!filter){
            setToilets(result);
            console.log("no filter found.");
            return;
          }
          result.forEach((toilet) => {
            
            var toiletFits=true;
            if(filter.differentlyAbled&&filter.differentlyAbled!==""&&filter.differentlyAbled==="true"&&toilet.differentlyAbled!==null&&toilet.differentlyAbled===false){
              //console.log({toilet, filter})
              toiletFits=false;
            }
            if(filter.indianPreferred!==""&&toilet.isIndian!==null&&((filter.indianPreferred==="true"&&toilet.isIndian===false)||(filter.indianPreferred==="false"&&toilet.isIndian===true))){
              //console.log({toilet, filter})
              toiletFits=false;
            }
            if(filter.maximumPrice!==""&&toilet.restroomPrice!==null&&filter.maximumPrice<toilet.restroomPrice){
              toiletFits=false;
            }
            if(filter.needsToiletPaper==="true"&&toilet.hasToiletPaper!==null&&toilet.hasToiletPaper===false){
              toiletFits=false;
            }
            if(filter.gender!==""&&toilet.gender!==null&&((filter.gender==="male"&&toilet.gender==="a")||
                    (filter.gender==="female"&&toilet.gender==="b")
                    ||(filter.gender==="other"&&!toilet.gender==="c"))){
                      toiletFits=false;
                    }
            if(toiletFits){
              //console.log({toilet, filter})
              filteredToilets.push(toilet);
            }
            else{
              console.log({toilet, filter});
            }
            
        });
         setToilets(filteredToilets); 
         console.log("Filtered toilets, "+filteredToilets.length+" toilets");
     })
  },[])


  const [viewport, setViewport] = useState({
    latitude: 28.7,
      longitude:77.2,
    zoom: 8
  });

  const mapRef = useRef();
  const handleViewportChange = useCallback(
    (newViewport) => setViewport(newViewport),
    []
  );

  // if you are happy with Geocoder default settings, you can just use handleViewportChange directly
  const handleGeocoderViewportChange = useCallback(
    (newViewport) => {
      const geocoderDefaultOverrides = { transitionDuration: 1000 };

      return handleViewportChange({
        ...newViewport,
        ...geocoderDefaultOverrides
      });
    },
    [handleViewportChange]
  );
  const geolocateControlStyle= {
    
    right: 10, 
    bottom:50,  
  };

  



  return (
    <div style={{ height: "100vh" }}>
      <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="100%"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
          {toilets.map(toilet => (
      <Marker
        key={toilet._id}
        latitude={toilet.lat}
        longitude={toilet.lng}
      >
        <button
              className="marker-btn"
              onClick={e => {
                e.preventDefault();
                setSelectedToilet(toilet);
              }}
             
            >
              <img src="./public_icons/wc.png" alt="" />
            </button>
      </Marker>
    ))}
     <GeolocateControl
        style={geolocateControlStyle}
        positionOptions={{enableHighAccuracy: true}}
        trackUserLocation={true}
        
      />
        <Geocoder
          mapRef={mapRef}
          onViewportChange={handleGeocoderViewportChange}
          mapboxApiAccessToken={MAPBOX_TOKEN}
          position="top-left"
          placeholder = "Search"

        />
          {selectedToilet ? (
          <Popup
            latitude={selectedToilet.lat}
            longitude={selectedToilet.lng}
            
            onClose={() => {
              setSelectedToilet(null);
            
            }}
          >
            <Card>
              <CardContent>
              <Typography  color="textSecondary" gutterBottom>
              { selectedToilet.isAvailable ?  <span style={{color:"#4caf50"}}>{"Open" }</span>: <span style={{color:"#f44336"}}>Closed</span>}
        </Typography>
                <Typography variant="h5" component="h2">
                  {selectedToilet.landmarkName}
        </Typography>
                <Typography  color="textSecondary">
                  {selectedToilet.avgRating}/5
        </Typography>
                <div>
                  {selectedToilet.differentlyAbled ? 
                  <span><Chip variant="outlined" icon={<AccessibleForward className={chipStyle.icons}/>} size="small" label="Different abled friendly" className = {chipStyle.root}/>&nbsp;</span> 
                   : null}
                  
                  {selectedToilet.toiletType === "w" ? <span> <Chip  variant="outlined" icon={<AirlineSeatLegroomExtra className={chipStyle.icons}/>}   size="small" label="Commode" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selectedToilet.gender === "a" ? <span> <Chip   variant="outlined" icon={<PregnantWoman className={chipStyle.icons}/>}   size="small" label="Ladies" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selectedToilet.gender === "b" ? <span> <Chip   variant="outlined" icon={<Person className={chipStyle.icons}/>}   size="small" label="Gents" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selectedToilet.gender === "c" ? <span> <Chip   variant="outlined" icon={<Wc className={chipStyle.icons}/>} label="Unisex" size="small" className = {chipStyle.root}/>&nbsp; </span>: null}

                  
                 
                 
                </div>
              </CardContent>
              <CardActions>
                 <Chip icon= {<Info style={{color:"white"}}/>} label = "Details" style={{backgroundColor:"#3f50b5", color:"white", fontWeight:"bold"}}></Chip>
              </CardActions>
            </Card>
          </Popup>
        ) : null}
      </MapGL>
      <NavLink to="/profile"><PersonLogo className="profile" /></NavLink>
    <NavLink to="/filter"><FilterLogo className="filter" /></NavLink>
    </div>
  );
};

export default Map; 