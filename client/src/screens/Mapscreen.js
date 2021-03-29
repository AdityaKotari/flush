import React, { useEffect } from "react";
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

import "@reach/combobox/styles.css";
// import mapStyles from "./mapStyles";

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
  lat: 43.6532,
  lng: -79.3832,
};

export default function Map() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "",
    libraries,
  });
  const [toilets, setToilets] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  useEffect(()=>{   
    fetch('/api/toilet/allToilets',{
      
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
      

      <Locate panTo={panTo} />
      <Search panTo={panTo} />

      <GoogleMap
        id="map"
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        options={options}
        // onClick={onMapClick}
        onLoad={onMapLoad}
      >
        {toilets.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            // onClick={() => {
            //   setSelected(marker);
            // }}
            
            icon ={{
              url: `./public_icons/wc.png`,
              
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
              <h2>
                <span role="img" aria-label="bear">
                  🐻
                </span>{" "}
                Alert
              </h2>
              <p>Spotted {formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}

const Profile = () => 
{
  return (
    <button
    
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
          placeholder="Search your location"
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

