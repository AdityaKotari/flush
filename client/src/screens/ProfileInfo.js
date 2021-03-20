
import React,{useState,useContext,} from 'react'
import {Link,NavLink,useHistory} from 'react-router-dom'
import {UserContext} from '../App'

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
        fetch("/profile/userData",{
            method:"get",
            headers:{
                "Content-Type":"application/json",
                "authorization":"bearer"+localStorage.getItem("jwt")
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
               console.log(data);
           }
        }).catch(err=>{
            console.log(err)
        })
    }




  return (
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
        </Grid>
      </form>
    </Container>
  );
};

export default LogIn;