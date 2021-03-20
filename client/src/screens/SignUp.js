
import React, { useState, useEffect } from 'react';
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
import Box from '@material-ui/core/Box';
import logo from '../logo.svg';
import MuiAlert from '@material-ui/lab/Alert';


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



const SignUp = () => {
  const [open, setOpen] = React.useState(false);

  

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const classes = useStyles();

  const history = useHistory()
    const [name,setName] = useState("")
    const [password,setPassword] = useState("")
    const [email,setEmail] = useState("")
    const [phone,setPhone] = useState("")

    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
          setOpen(true);
            return
        }
        fetch("/api/profile/signup",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                phone
            })
        }).then(res=>res.json())
        .then(data=>{

            console.log(data);
           if(data.error){
               console.log(data.error); 
               setOpen(true);
           }
           else{
               history.push('/LogIn')
           }
        }).catch(err=>{
            console.log(err)
        })
    }





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
        <img src="./public_icons/toilet-paper.png" className = "logoImg"></img>
        <Typography><Box fontWeight="fontWeightBold">Flush away your worries</Box></Typography>
        <form onSubmit={(e)=>{e.preventDefault()}}>
          <Grid container spacing={3} style={{paddingTop:40}}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Name" name="name" size="small" variant="outlined" onChange={(e)=>setName(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Phone" name="phone" size="small" variant="outlined" onChange={(e)=>setPhone(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Email" name="email" size="small" variant="outlined" onChange={(e)=>setEmail(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label="Password" name="password" size="small" type="password" variant="outlined" onChange={(e)=>setPassword(e.target.value)}/>
                </Grid>

              </Grid>
            </Grid>
            <Grid item xs={12}>
            <Button color="primary" fullWidth type="submit" variant="contained" onClick={()=>uploadFields()}>
              Sign up
            </Button>
          </Grid>
          
          <Grid item xs={12} align="center">
            <Typography>
              
                Already have an account? <Link to="/LogIn" style={{ textDecoration: 'none' }}><Box fontWeight="fontWeightBold">Login</Box></Link>

              
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

export default SignUp;