import React,{useEffect,createContext,useReducer,useContext} from 'react'; 
import Map from './screens/Mapscreen'; 
import Profile from './screens/Profile'; 
import ProfileInfo from './screens/ProfileInfo'; 
import SignUp from './screens/SignUp';
import LogIn from './screens/LogIn';
import Filter from './screens/Filter';
import ToiletsLeased from './screens/ToiletsLeased';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
 
} from "react-router-dom";
import {reducer,initialState} from './reducers/userReducer'

import { CssBaseline } from  '@material-ui/core'
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import NewToilet from './screens/NewToilet';
import OneToilet from './screens/OneToilet';


export const UserContext = createContext();

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#212121",
    },
    secondary: {
      main: "#fafafa",
    },

  },
  overrides: {
    MuiRadio: {
      root: {
        color: '#212121',
      },
      colorSecondary: {
        '&$checked': {
          color: '#212121',
        },
      },
    },
    MuiCheckbox: {
      root: {
        color: '#212121',
      },
      colorSecondary: {
        '&$checked': {
          color: '#212121',
        },
      },
    },
  },
});

const Routing = () => {
  const history = useHistory()
  const {state, dispatch} = useContext(UserContext)
  const [lat, setLat] = React.useState(-31.89628);
  const [lng, setLng] = React.useState(115.95578);
  const [zoom, setZoom] = React.useState(8);
  const [dragCount, setDragCount] = React.useState(0);

  const changePositionState = () =>{
    let pos = JSON.parse(localStorage.getItem('position'))
    console.log(pos)
    setLat(pos.lat);
    setLng(pos.lng);
    setZoom(pos.zoom)
    setDragCount(dragCount+1)
    console.log(dragCount)
  } 

  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"));
    if(user){
      dispatch({type:"USER",payload:user})
    }else if(!history.location.pathname.startsWith('/LogIn'&&!history.location.pathname.startsWith('/api'))){
        history.push('/SignUp');
    }
  },[]);

  return (
    <Switch>
          <Route exact path="/">
            <Map key={lat} changePositionState={changePositionState} dragCount={dragCount} currentLat={lat} currentLng={lng} zoom={zoom}/>
          </Route>
          <Route path="/profile">
            <Profile /> 
          </Route>
          <Route path="/login">
            <LogIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>    
          <Route path="/filter">
            <Filter />
          </Route>   
          <Route path="/new_toilet">
            <NewToilet /> 
            </Route>   
            <Route path="/toilets_leased">
            <ToiletsLeased/> 
            </Route>   
          <Route path="/example">
            <Map />
            </Route>   
            <Route path="/profile_info">
            < ProfileInfo />
            </Route>   
            <Route path="/one_toilet/:toiletId">
                <OneToilet />
            </Route>

        
        </Switch>
  )
}

function App() {
  const [state,dispatch] = useReducer(reducer,initialState)
  return (
    <UserContext.Provider value={{ state, dispatch }}>
    <ThemeProvider theme = {theme}>
      <CssBaseline>
      <Router>
      <div className="App">
        <Routing />
      </div>
    </Router>
      </CssBaseline>
       
    </ThemeProvider>
    </UserContext.Provider>
   
  );
}

export default App;
