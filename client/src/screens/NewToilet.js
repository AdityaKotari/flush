import React, { useState, useRef, useCallback, useEffect } from "react";
import Geocoder from "react-map-gl-geocoder";

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {InputAdornment, Typography, AppBar, Toolbar, Button, Container, IconButton, Radio, RadioGroup, Snackbar, FormControl, FormGroup, Checkbox, FormLabel, FormControlLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import mapboxgl from 'mapbox-gl'
import { Bathtub, Search, Wc, PhotoCamera, Backspace, ArrowBack, PinDrop, EditLocationOutlined, EditLocationSharp, AddLocation } from '@material-ui/icons';
import MapGL, {GeolocateControl} from 'react-map-gl';
import { NavLink, useHistory } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
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


function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
    input: {
      display: 'none',
    },
  }));
const MAPBOX_TOKEN = "pk.eyJ1IjoiMTV0aHJlYWQiLCJhIjoiY2ttZmUxMnhnMDk3ZjJ1czB4Z2xvYzZscCJ9.-88YuiCjn8ZYzeTcmfNnaQ";

const NewToilet = ()  => {

    //snackbar code
    const [snackbarStatus, setOpenSnackbar] = React.useState(false);
    const [successMessage, setSuccessMessage ] = React.useState("")
    const [errorStatus, setErrorStatus] = React.useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

 
    //-----------------
    const history =useHistory(); 

    //MAP CODE
    const [viewport, setViewport] = React.useState({
        width: "100vw",
        height: "40vh",
        latitude: 28.7,
        longitude: 77.2,
        zoom: 10
      });
      const mapRef = useRef();
      const geolocateControlStyle= {
        
        right: 10, 
        bottom:50,  
      };
      const handleViewportChange = useCallback(
        (newViewport) => setViewport(newViewport),
        []
      );
     


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
    //LOCATION PICKER
      const [marker, setMarker] = useState({
        latitude: null,
        longitude: null,
      });

      useEffect(()=>{
          setMarker({
              latitude:viewport.latitude, 
              longitude:viewport.longitude
          })
      }, [viewport

      ]); 

      
      const [events, logEvents] = useState({});

      const onMarkerDragStart = useCallback(event => {
        logEvents(_events => ({..._events, onDragStart: event.lngLat}));
      }, []);
    
      const onMarkerDrag = useCallback(event => {
        logEvents(_events => ({..._events, onDrag: event.lngLat}));
      }, []);
    
      const onMarkerDragEnd = (event) => {
       
        setMarker({
          longitude: event.lngLat[0],
          latitude: event.lngLat[1]
        });
        console.log(marker)
       
      };
    //--------------------------------
    //FORM CODE

    //FORM data
    //lat lng is markers
    const [name, setName] = React.useState(""); 
    const [restroomPrice, setRestroomPrice] = React.useState(); 
    const [bathroomPrice, setBathroomPrice] = React.useState(); 
    const [hasToiletPaper, setHasToiletPaper] = React.useState(false); 
    const [gender, setGender] = React.useState("a");
    const [differentlyAbled   , setDifferentlyAbled] = React.useState(false);
    const [desc, setDesc] = React.useState("")
    const [isPublic, setPublic] = React.useState(false); 
    const [indian, setIndian] = React.useState('i'); 
    const [image,setImage] = useState("")
    const [photoURL, setPhotoURL ] = useState("")
    const [photos, setPhotos] = useState([])
    const [rem, setRem] = useState(5)

    


    const classes = useStyles();
  

   
    
    const addBathroom = ()=>{
       console.log({
        landmarkName: name,
        isPublic:isPublic,
        differentlyAbled:differentlyAbled,
        gender:gender,
        hasToiletPaper:hasToiletPaper, 
        restroomPrice:restroomPrice, 
        bathroomPrice:bathroomPrice, 
        lat:marker.latitude, 
        lng:marker.longitude, 
        Indian: indian, 
        photos: photos

    })
        
        fetch("/api/toilet/newToilet",{
            method:"post",
            headers:{
                "Content-Type":"application/json", 
                "Authorization":"Bearer "+localStorage.getItem("jwt"), 
            },
            body:JSON.stringify({
                landmarkName: name,
                isPublic:isPublic,
                differentlyAbled:differentlyAbled,
                gender:gender,
                hasToiletPaper:hasToiletPaper, 
                restroomPrice:restroomPrice, 
                bathroomPrice:bathroomPrice, 
                toiletType:indian, 
                lat:marker.latitude, 
                lng:marker.longitude, 
                photos: photos
                
                

            })
        }).then(res=>res.json())
        .then(data=>{

            console.log(data);
           if(data.error){
               setErrorStatus(true)
               setErrorMessage(data.error)
               console.log(data.error); 
             
           }
           else{
              setOpenSnackbar(true)
              setSuccessMessage("Added listing")
               history.push('/')
           }
        }).catch(err=>{
            //setErrorStatus(true)
            //setErrorMessage(err)
            console.log(err)
        })
    }
     
    const imageDetails = ()=>{

     if ((rem != 0) && (image))
     {
      const data = new FormData()
      data.append("file",image)
      data.append("upload_preset","trash-overflow")
      data.append("cloud_name","dngglmcuk")
      fetch("https://api.cloudinary.com/v1_1/dngglmcuk/image/upload",{
          method:"post",
          body:data
      })
      .then(res=>res.json())
      .then(data=>{
          if(data.error){
            setErrorStatus(true)
            setErrorMessage(data.error)
            console.log(data.error); 
           }
           else
           {
            setPhotoURL(data.url)
             setOpenSnackbar(true)
             setSuccessMessage("Image upload successful")
              
              
           }
          
      })
      .catch(error=>{
          
        setErrorStatus(true)
        setErrorMessage(error)
        console.log(error); 
      })
  
   
  }
     
     else
     {
      setErrorStatus(true)
      setErrorMessage("You cannot upload more than 4 pictures. Make sure that image field is not null")
      console.log("Not more than 4"); 
        
     }
    }



    useEffect(()=>{
      setPhotos([...photos, photoURL])
    }, [photoURL]); 





    
    useEffect(()=>{
      
      setRem(rem-1)
    }, [photoURL]); 
   
      
  return (
    <div>
       
             <Picker /> 
   


   <Container maxWidth="xs">
       

       <Grid container justify="center" spacing={4}>
             <Grid item xs = {12}>
                 

             </Grid>
              <Grid item xs={12}>
                  <TextField
                  fullWidth
                      variant="filled"
                     
                      id="filled-basic"
                      label = "Restroom landmark/name (e.g., Railways toilet)"
                      value = {name} onChange={(e)=>setName(e.target.value)}
                     
                  />
              </Grid>
              <Grid item xs = {12}>
                  <FormControl component="fieldset">
                      <FormLabel component="legend">Restroom type</FormLabel>
                      <RadioGroup aria-label="type" name="type" value={indian} onChange={(event) => {
      setIndian(event.target.value);
      
    }}>
                          <FormControlLabel value="i" control={<Radio />} label="Indian" style = {{color:"black"}}/>
                          <FormControlLabel value="w" control={<Radio />} label="Western" style = {{color:"black"}}/>
                
                      </RadioGroup>
                  </FormControl>
              

              </Grid>
              <Grid item xs = {12}>
                  <FormControl component="fieldset">
                      <FormLabel component="legend">Gender accessibility</FormLabel>
                      <RadioGroup aria-label="type" name="type" value={gender} onChange={(event) => {
      setGender(event.target.value);
      
    }}>
                          <FormControlLabel value="a" control={<Radio />} label="Ladies" style = {{color:"black"}}/>
                          <FormControlLabel value="b" control={<Radio />} label="Gents" style = {{color:"black"}}/>
                          <FormControlLabel value="c" control={<Radio />} label="Unisex" style = {{color:"black"}}/>
                
                      </RadioGroup>
                  </FormControl>
              

              </Grid>
              <Grid item xs = {12}>

                  <FormControl component="fieldset">
                  <FormLabel component="legend">Norms</FormLabel>
                      <FormGroup row>
                          <FormControlLabel
                              control={<Checkbox checked={hasToiletPaper} onChange={(e)=>{
                                  setHasToiletPaper(e.target.checked)
                              }} name="has toilet paper" />}
                              label="Toilet paper included"
                          />
                          <FormControlLabel
                              control={<Checkbox checked={differentlyAbled } onChange={(e)=>{
                                setDifferentlyAbled(e.target.checked)
                            }} name="diff ab friendly" />}
                              label="Differently abled friendly"
                          />

    



                      </FormGroup>

                  </FormControl>
                  
              
             

             </Grid>
             <Grid item xs = {12}>

                  <FormControl component="fieldset">
                  <FormLabel component="legend">Ownership (skip if restroom is privately held)</FormLabel>
                      <FormGroup row>
                          <FormControlLabel
                              control={<Checkbox checked={isPublic} onChange={(e)=>{
                                  setPublic(e.target.checked)
                              }} name="public toilet" />}
                              label="Public restroom"
                          />
                          

    



                      </FormGroup>

                  </FormControl>
                  
              
             

             </Grid>
              <Grid item xs={12}>

                  <FormControl component="fieldset">
                      <FormLabel component="legend">Pricing</FormLabel>
                      <br />
                      <FormGroup row>
                        <Grid container spacing = {2}>
                            <Grid item xs={6}>
                                  <TextField
                                      fullWidth
                                      variant="filled"
                                      value = {restroomPrice} onChange={(e)=>setRestroomPrice(e.target.value)}
                                      id="filled-basic"
                                      label="Restroom (INR)"
                                      InputProps={{
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  <Wc />
                                              </InputAdornment>
                                          ),
                                      }}
                                  />
                            </Grid>
                            
                            <Grid item xs={6}>
                            <TextField
                                      fullWidth
                                      variant="filled"
                                      value = {bathroomPrice} onChange={(e)=>setBathroomPrice(e.target.value)}
                                      id="filled-basic"
                                      label="Bathroom (INR)"
                                      InputProps={{
                                          startAdornment: (
                                              <InputAdornment position="start">
                                                  <Bathtub />
                                              </InputAdornment>
                                          ),
                                      }}
                                  />
                           
                            </Grid>
                            <Grid item xs = {12}>
                                
                                <br></br>
                            <FormLabel component="legend">Upload image (optional). {rem} uploads remaining</FormLabel>
                            <br></br>
                                <Container align="center">
                                <div className={classes.root}>
                                      {/* <input
                                          accept="image/*"
                                          className={classes.input}
                                          id="contained-button-file"
                                          multiple
                                          type="file"
                                          
                                      /> */}
                                      <label htmlFor="contained-button-file">
                                          <Button variant="contained" color="primary" component="span" onClick = {(e)=>{imageDetails()}}>
                                              Upload
        </Button>
                                      </label>
                                      <input accept="image/*" className={classes.input} multiple id="icon-button-file" type="file" onChange={(e)=>setImage(e.target.files[0])}/>
                                      <label htmlFor="icon-button-file">
                                          <IconButton color="primary" aria-label="upload picture" component="span">
                                              <PhotoCamera />
                                          </IconButton>
                                      </label>
                                  </div>
                                </Container>
                                  
                            </Grid>
                            <Grid item xs={12}>
                                      <Button onClick = {()=>addBathroom()}  color="primary" on fullWidth type="submit" variant="contained">
                                          Add restroom
            </Button>
                            </Grid>
                        </Grid>


                      </FormGroup>  

                  </FormControl>




              </Grid>

       </Grid>
       
      
     
      
    
   </Container>
   <Snackbar open={snackbarStatus} autoHideDuration={6000} onClose={(e)=>{setOpenSnackbar(false)}}>
  <Alert onClose={(e)=>{setOpenSnackbar(false)}} severity="success">
    {successMessage}
  </Alert>
</Snackbar>
<Snackbar open={errorStatus} autoHideDuration={6000} onClose={(e)=>{setErrorStatus(false)}}>
  <Alert onClose={(e)=>{setErrorStatus(false)}} severity="error">
     {errorMessage}
  </Alert>
</Snackbar>

   </div>

   
  );
}




export default NewToilet; 




const libraries = ["places"];
const mapContainerStyle = {
  height: "50vh",
  width: "100vw",
};
const options = {
  // styles: mapStyles,
  disableDefaultUI: true,
  zoomControl: false,
};
const center = {
  lat: 43.6532,
  lng: -79.3832,
};

function Picker() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  
 


  // const onMapClick = React.useCallback((e) => {
  //   setMarkers((current) => [
  //     ...current,
  //     {
  //       lat: e.latLng.lat(),
  //       lng: e.latLng.lng(),
  //       time: new Date(),
  //     },
  //   ]);
  // }, []);

  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <div>
      
    <NavLink to="/profile" className="profile"><PersonLogo className="profile" /></NavLink>
    <NavLink to="/filter" className="filter"><FilterLogo className="filter" /></NavLink>
      <Locate panTo={panTo} />
      <SearchMap panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
      >

       
      </GoogleMap>
    </div>
  );
}

// const Profile = () => 
// {
//   return (
//     <button
    
//     onClick={() => {
//       navigator.geolocation.getCurrentPosition(
//         (position) => {
//           panTo({
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           });
//         },
//         () => null
//       );
//     }}
//   >
//     <img src="./my_loc.svg" alt="loc" />
//   </button>
//   );  
// }


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

function SearchMap({ panTo }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 43.6532, lng: () => -79.3832 },
      radius: 100 * 1000,
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
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
    </div>
  );
}

