
import React,{useState,useContext,} from 'react'
import {Link,NavLink,useHistory} from 'react-router-dom'
import {UserContext} from '../App'
import {AppBar, Toolbar, Typography, Box} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
//import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

const LogIn = () => {
  const classes = useStyles();

  const {state,dispatch} = useContext(UserContext)
    const history = useHistory()
    const [password,setPasword] = useState("")
    const [email,setEmail] = useState("")
    const uploadFields = ()=>{
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            alert("Please enter a valid email")
            return
        }
        fetch("/profile/login",{
            method:"post",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                password,
                email
            })
        }).then(res=>res.json())
        .then(data=>{
            console.log(data)
           if(data.error){
              alert(data.error)
           }
           else{
               localStorage.setItem("jwt",data.token)
               
               localStorage.setItem("user", JSON.stringify(data.user))
               console.log("jwt token", data.token)
               console.log("User data", data.user); 
               dispatch({type:"USER",payload:data.user})
               history.push('/')
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
        <img src="./public_icons/logo.png" className = "logoImg"></img>
        <Typography><Box fontWeight="fontWeightBold">Get moving with flush</Box></Typography>
        </Container>
        
    <Container className={classes.container} maxWidth="xs">
      <form onSubmit={(e)=>{e.preventDefault()}}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField fullWidth label="Email" name="email" size="small" variant="outlined" onChange={(e)=>setEmail(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  size="small"
                  type="password"
                  variant="outlined"
                  onChange={(e)=>setPasword(e.target.value)}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Button color="primary" fullWidth type="submit" variant="contained" onClick={()=>uploadFields()}>
              Log in
            </Button>
          </Grid>
           
          <Grid item xs={12} align="center">
            <Typography>
              
               New User? <Link to="/SignUp" style={{ textDecoration: 'none',  color:"#3f50b5" }}><Box fontWeight="fontWeightBold">Signup</Box></Link>

              
            </Typography>

          </Grid>
        </Grid>
      </form>
    </Container>
    </div>
  );
};

export default LogIn;