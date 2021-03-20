
// import React,{useState,useContext,} from 'react'
// import {Link,NavLink,useHistory} from 'react-router-dom'
// import {UserContext} from '../App'

// import Button from '@material-ui/core/Button';
// import Container from '@material-ui/core/Container';
// import Grid from '@material-ui/core/Grid';
// import TextField from '@material-ui/core/TextField';
// //import Typography from '@material-ui/core/Typography';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({
//   container: {
//     padding: theme.spacing(3),
//   },
// }));

// const LogIn = () => {
//   const classes = useStyles();

//   const {state,dispatch} = useContext(UserContext)
//   const history = useHistory()
//         fetch("/profile/userData",{
//             method:"get",
//             headers:{
//                 "Content-Type":"application/json",
//                 "authorization":"bearer"+localStorage.getItem("jwt")
//             },
//             body:JSON.stringify({
//                 password,
//                 email
//             })
//         }).then(res=>res.json())
//         .then(data=>{
//             console.log(data)
//            if(data.error){
//               alert(data.error)
//            }
//            else{
//                console.log(data);
//            }
//         }).catch(err=>{
//             console.log(err)
//         })
//     }




//   return (
//     <Container className={classes.container} maxWidth="xs">
//       <form onSubmit={(e)=>{e.preventDefault()}}>
//         <Grid container spacing={3}>
//           <Grid item xs={12}>
//             <Grid container spacing={2}>
//               <Grid item xs={12}>
//                 <TextField fullWidth label="Email" name="email" size="small" variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
//               </Grid>
//               <Grid item xs={12}>
//                 <TextField
//                   fullWidth
//                   label="Password"
//                   name="password"
//                   size="small"
//                   type="password"
//                   variant="outlined"
//                   onChange={(e)=>setPasword(e.target.value)}
//                 />
//               </Grid>
//             </Grid>
//           </Grid>
//           <Grid item xs={12}>
//             <Button color="primary" fullWidth type="submit" variant="contained" onClick={()=>uploadFields()}>
//               Log in
//             </Button>
//           </Grid>
//         </Grid>
//       </form>
//     </Container>
//   );
// };

// export default LogIn;

import React, { useState, useEffect, useContext } from 'react';
import {Link,NavLink,useHistory} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import {Box, Avatar} from '@material-ui/core';
import logo from '../logo.svg';
import MuiAlert from '@material-ui/lab/Alert';
import { AccountCircle, Person, PortableWifiOff } from '@material-ui/icons';
import {UserContext} from '../App'; 

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}
const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: 65,
    alignItems: 'flex-start',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    alignSelf: 'center',
  },
}));



const ProfileInfo = () => {
  const [open, setOpen] = React.useState(false);
  
  const {state,dispatch} = useContext(UserContext)
  

   

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles();

  const history = useHistory()
    // const [name,setName] = useState("")
    // const [password,setPassword] = useState("")
    // const [email,setEmail] = useState("")
    // const [phone,setPhone] = useState("")
    const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [items, setItems] = useState([]);

  useEffect(() => {

    const myHeaders = new Headers();
    myHeaders.append('Authorization', "Bearer "+localStorage.getItem("jwt"));

    const myRequest = new Request('/profile/userData', {
        method: 'GET',
        headers: myHeaders
    });
    
    fetch(myRequest)
    .then(res => res.json())
    .then(
    (result) => {
      setIsLoaded(true);
      setItems(result);
    },
    
    (error) => {
      setIsLoaded(true);
      setError(error);
    }
  )
}, [])

  





  return (
    <div>

      
      
<AppBar position="static" color="secondary" elevation={0}>
                <Toolbar>
                   
                    
                    
                </Toolbar>
            </AppBar>
          
       <br>
       </br>
       <br>
       </br>
       
     <Container className={classes.container} maxWidth="xs" container align="center">
        {/*<img src="./public_icons/toilet-paper.png" className = "logoImg"></img>
        <Typography><Box fontWeight="fontWeightBold">Flush away your worries</Box></Typography> */}
        <Avatar style={{width:"80px", height:"80px"}}>
          <AccountCircle style={{width:"80px", height:"80px"}} />
        </Avatar>
        <br></br>
        <Typography>{items.name}</Typography>
        <form onSubmit={(e)=>{e.preventDefault()}}>
          <Grid container spacing={3} style={{paddingTop:40}}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth  name="name" size="small" variant="outlined" value = {items.name} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth  name="phone" size="small" variant="outlined" value = {items.phone} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth  name="email" size="small" variant="outlined" value = {items.email} />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField fullWidth label="Password" name="password" size="small" type="password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>
                </Grid> */}

              </Grid>
            </Grid>
            <Grid item xs={12}>
            <Button color="primary" fullWidth type="submit" variant="contained">
              COMMIT CHANGES
            </Button>
          </Grid>
          
          <Grid item xs={12} align="left">
            <Typography>
              
                <Button variant="contained" style={{backgroundColor:"#3f50b5", color:"white"}} onClick={()=>{
              localStorage.clear()
              dispatch({type:"CLEAR"})
              history.push('/login')
            }}>
                  Logout
      </Button>
              
            </Typography>

          </Grid>
          
          </Grid>

          
          
        
      </form>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
  <Alert  severity="error">
    Your form details are not valid! 
  </Alert>
</Snackbar>
    </Container>
</div>
  );
};

export default ProfileInfo;