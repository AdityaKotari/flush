import React, { useState, useRef, useCallback, useEffect } from "react";
import Geocoder from "react-map-gl-geocoder";

import { makeStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import {InputAdornment, Typography, AppBar, Toolbar, Button, Container, IconButton, Radio, RadioGroup, Snackbar, FormControl, FormGroup, Checkbox, FormLabel, FormControlLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import AccountCircle from '@material-ui/icons/AccountCircle';
import { Bathtub, Search, Wc, PhotoCamera, Backspace, ArrowBack, PinDrop, EditLocationOutlined, EditLocationSharp, AddLocation } from '@material-ui/icons';
import MapGL, {GeolocateControl, Marker} from 'react-map-gl';
import { NavLink, useHistory } from 'react-router-dom';
import MuiAlert from '@material-ui/lab/Alert';
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
const MAPBOX_TOKEN = process.env.REACT_APP_MAPBOX_TOKEN;

const NewToilet = ()  => {

    //snackbar code
    const [snackbarStatus, setOpenSnackbar] = React.useState(false);
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
        Indian: indian

    })
        
        fetch("/toilet/newToilet",{
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
               history.push('/')
           }
        }).catch(err=>{
            //setErrorStatus(true)
            //setErrorMessage(err)
            console.log(err)
        })
    }
     

  return (
    <div>
        <AppBar position="static" color="secondary" elevation={0}>
                <Toolbar>
                    <IconButton edge="start"  color="primary" aria-label="menu">
                        <ArrowBack onClick = {
                            history.goBack
                        }/>
                    </IconButton>
                    
          <Typography variant="h6">
            Pick restroom location 
         </Typography>
                </Toolbar>
            </AppBar>
            <MapGL
        ref={mapRef}
        {...viewport}
        width="100%"
        height="50vh"
        onViewportChange={handleViewportChange}
        mapboxApiAccessToken={MAPBOX_TOKEN}
      >
  <Marker
          longitude={marker.longitude}
          latitude={marker.latitude}
          offsetTop={-20}
          offsetLeft={-10}
          draggable
          onDragStart={onMarkerDragStart}
          onDrag={onMarkerDrag}
          onDragEnd={onMarkerDragEnd}
        >
          <AddLocation style = {{color:"red", width:"30px", height:"30px"}}/>
          {/* <button
              className="marker-btn"
             
            >
              <img src="./public_icons/wc.png" alt="" />
            </button> */}
        </Marker>

          {/* {toilets.map(toilet => (
      <Marker
        key={toilet._id}
        latitude={toilet.lat}
        longitude={toilet.lng}
      >
        <button
              className="marker-btn"
             
            >
              <img src="./public_icons/wc.png" alt="" />
            </button>
      </Marker>
    ))} */}
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
      </MapGL>
   


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
                            <FormLabel component="legend">Upload image (optional)</FormLabel>
                            <br></br>
                                <Container align="center">
                                <div className={classes.root}>
                                      <input
                                          accept="image/*"
                                          className={classes.input}
                                          id="contained-button-file"
                                          multiple
                                          type="file"
                                      />
                                      <label htmlFor="contained-button-file">
                                          <Button variant="contained" color="primary" component="span">
                                              Upload
        </Button>
                                      </label>
                                      <input accept="image/*" className={classes.input} id="icon-button-file" type="file" />
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
    Added your restroom listing
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