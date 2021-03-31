import React, { useEffect, useLayoutEffect } from "react";
import { NavLink } from 'react-router-dom'
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import { formatRelative } from "date-fns";
import { ReactComponent as PersonLogo } from  '../icons/person-24px.svg';
import { ReactComponent as FilterLogo } from  '../icons/filter-24px.svg';
import "@reach/combobox/styles.css";
import { SearchOutlined } from "@material-ui/icons";
// import mapStyles from "./mapStyles";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Card, CardActions,Chip, Avatar, Box,  Typography, Button, CardContent, makeStyles, ListItemSecondaryAction } from '@material-ui/core';
import {AccessibleForward, AirlineSeatLegroomExtra, Info, Person, PersonAddDisabled, PlayCircleFilledWhite, PregnantWoman, Wc} from '@material-ui/icons'; 
import { indigo } from "@material-ui/core/colors";
import { withTheme } from "@material-ui/styles";
import Rating from '@material-ui/lab/Rating';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: "white", 
    
  },
  icons:
  {
    fill:indigo[800], 
  }
}));

const libraries = ["places"];
const mapContainerStyle = {
  height: "100vh",
  width: "100vw",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: false,
};
const center = {
  lat: 51.501286,
  lng: 0.046541,
};  

const Map = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const [currentLat, setLat] = React.useState(51.501286);
  const [currentLng, setLng] = React.useState(0.046541);
  const [zoom, setZoom] = React.useState(14);
  const [doneWithMapLoad, doneMapLoad] = React.useState(false);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const handleExtraZoom = () => {
    setSnackbarOpen(true);
  };

  const handleSnackbarClose = (event, reason) => {


    setSnackbarOpen(false);
  };
  
  
  //const [currentPosition, setCurrentPosition] = React.useState({lng:center.lng, lat:center.lat});
  
  //const [ignored, forceUpdate] = React.useReducer(x => x + 1, 0);





  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
    doneMapLoad(true)
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    changePositionState();
  }, []);

  const changePositionState = () =>{
    
    console.log("Position changed.")
    
    setLat(mapRef.current.getCenter().lat());
    setLng(mapRef.current.getCenter().lng());
    changeZoomState();
  } 
  const changeZoomState = () => {
    if(!doneWithMapLoad){
      return 0; 
    }
    setZoom(mapRef.current.getZoom())
    if(zoom<=12){
      handleExtraZoom()
    }
    else{
      handleSnackbarClose()
    }
  }
  
  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  

  return (
    <div>
      
    <NavLink to="/profile" className="profile"><PersonLogo className="profile" /></NavLink>
    <NavLink to="/filter" className="filter"><FilterLogo className="filter" /></NavLink>
      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        key="map"
        mapContainerStyle={mapContainerStyle}
        zoom={zoom}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
        onDragEnd={changePositionState}
        onZoomChanged={changeZoomState}
      >


      <Markers key={currentLat*currentLng} currentLat={currentLat} currentLng={currentLng} zoom={zoom}></Markers>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="warning">
          Zoom in more to load the toilets properly!
        </Alert>
      </Snackbar>

        




      </GoogleMap>
    </div>
  );
}

function Locate({ panTo }) {
  return (
    <button
      className="locate"
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
    >
      <img src="./my_loc.svg" alt="loc" />
    </button>
  );
}

function Search({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 70 * 1000,
    },
  });

  // https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
    } catch (error) {
      console.log("😱 Error: ", error);
    }
  };

  return (
    <div className="search">
      
      <Combobox onSelect={handleSelect}>
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="🔍 Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={description} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}



const Markers = ({currentLat, currentLng}) => {
  const [toilets, setToilets] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const chipStyle = useStyles(); 
  useLayoutEffect(()=>{   
    console.log("useEffect triggered")
    fetch('/api/toilet/nearbyToilets?lat='+currentLat+'&lng='+currentLng+"&maxDistance="+10*1000,{
      method:"GET",
            headers:{
                "Content-Type":"application/json", 
                "Authorization":"Bearer "+localStorage.getItem("jwt"), 
            },
    }).then(res=>res.json())
    .then(result=>{
         console.log("Found toilets, "+result.length+" toilets"); 
         
         const filter=JSON.parse(localStorage.getItem("filterSettings"));
         
         var filteredToilets=[];
         if(!filter||!result||result.length===0){
           setToilets(result);
           console.log("no filter or toilets found.");
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
           if(filter.maximumPrice!==""&&toilet.restroomPrice!==null&&parseInt(filter.maximumPrice)<toilet.restroomPrice){
             toiletFits=false;
           }
           if(filter.isAvailable&&filter.isAvailable!==""&&toilet.isAvailable!==null&&((filter.isAvailable==="true"&&toilet.isAvailable===false))){
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

 const handleMarkerClick = (marker) => {
  fetch("/api/toilet/oneToilet", {
    method: "post",
    headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt"),
    },
    body: JSON.stringify({
        toilet_id: marker._id
    })
  })
  .then(res => res.json())
  .then(data => {
        console.log(data);
        setSelected(data)
    }).catch(err => {
        console.log(err)
    })
    //setSelected(marker)
}

 return(
   <div>
     {toilets.map((marker) => (
          <Marker
            key={`${marker._id}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              handleMarkerClick(marker);
              //setSelected(marker);
            }}
            
            icon ={{
              url: `https://img1.pnghut.com/18/5/15/0Tdqtwk9XN/toilet-symbol-brand-female-area.jpg`,
              
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
              scaledSize: new window.google.maps.Size(30, 30),
            }}
          />
        ))}

        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
            <Card>
            <CardContent>
            
            
            <Typography variant="body2" component="p">
                  {selected.landmarkName}
            </Typography>
            
            <Box component="fieldset" borderColor="transparent">
                  {selected.avgRating > 0 ? <Rating name="read-only" value={selected.avgRating > 0 ? selected.avgRating: 0} readOnly />: null}
            </Box>
            <div>
                  {selected.differentlyAbled ? 
                  <span><Chip variant="outlined" icon={<AccessibleForward className={chipStyle.icons}/>} size="small" label="Different abled friendly" className = {chipStyle.root}/>&nbsp;</span> 
                   : null}
                  
                  {selected.toiletType === "w" ? <span> <Chip  variant="outlined" icon={<AirlineSeatLegroomExtra className={chipStyle.icons}/>}   size="small" label="Commode" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selected.gender === "a" ? <span> <Chip   variant="outlined" icon={<PregnantWoman className={chipStyle.icons}/>}   size="small" label="Ladies" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selected.gender === "b" ? <span> <Chip   variant="outlined" icon={<Person className={chipStyle.icons}/>}   size="small" label="Gents" className = {chipStyle.root}/>&nbsp; </span>: null}
                  {selected.gender === "c" ? <span> <Chip   variant="outlined" icon={<Wc className={chipStyle.icons}/>} label="Unisex" size="small" className = {chipStyle.root}/>&nbsp; </span>: null}

                  
                 
                 
            </div>
            
            
            
            
            
            </CardContent>
            <CardActions>
                <NavLink to={'/one_toilet/'+selected._id}><Chip  icon= {<Info style={{color:"white"}}/>} label = "Details" style={{backgroundColor:"#3f50b5", color:"white", fontWeight:"bold"}}></Chip></NavLink>     
            </CardActions>
            </Card>
            </div>
          </InfoWindow>
        ) : null}

   </div>
 )

}

export default Map;