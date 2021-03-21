
import React, { useState, useEffect } from 'react';
import {Link,NavLink,useHistory} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Switch from '@material-ui/core/Switch';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { Close } from '@material-ui/icons';
import {AppBar, Toolbar, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';


const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));


const ToiletsLeased = (props) => {
  
  
  const classes = useStyles();
  const [ownedToilets, setOwnedToilets] = useState([{landmarkName:"Loading", avgRating:""}]);
  const history = useHistory();
  const [loading, setLoading] = useState(true)

  
  
  useEffect(() => {

    fetch('/toilet/allToilets',{
         
    }).then(res=>res.json())
    .then(result=>{
      
      var ownedToilets = [];
      const user=JSON.parse(localStorage.getItem('user'));
  
      if(!result){
        return;
      }
      result.forEach((toilet) => {
        console.log(user);
        if(String(toilet.owner._id)===String(user._id)){
            ownedToilets.push(toilet);
        }
        
      });
      setOwnedToilets(ownedToilets);
      setLoading(false)

      
      
    });
  
    
    
  
  }, []);
  
  const switchToggled = () => {
    //console.log(e);
    fetch('/toilet/changeAvailability',{
      method:"post",
            headers:{
                "Content-Type":"application/json", 
                "Authorization":"Bearer "+localStorage.getItem("jwt"), 
            },
            body:JSON.stringify({
                toilet_id: "incomplete"
            })
    })
    
  }
  
  
  if (loading)
  {
    return (<div></div>); 
  }
  else
  {
    return (
      <div>
        <AppBar position="static" color="secondary" elevation={0}>
                  <Toolbar>
                      <IconButton edge="start"  color="primary" aria-label="menu">
                          <Close onClick = {
                              history.goBack
                          }/>
                      </IconButton>
                      
                      
                  </Toolbar>
              </AppBar> 
        <Container className={classes.container}  minHeight="20vh">
        
              <Typography variant="h4" align="center">Toilets Leased</Typography>
              <Typography variant="h6" align="center">You own {ownedToilets.length} toilets</Typography>
          </Container>
  
        <Container className={classes.container} maxWidth="xs" paddingTop="20vh">
        
        <List className={classes.root}>
        <Divider component="li" />
        
        {ownedToilets.map((toilet) => (
              <div class="row">
                <ListItem>
                <ListItemText primary={toilet.landmarkName} secondary={toilet.avgRating === -1?"Not yet rated":String(toilet.avgRating+"/5")} />
                <FormControlLabel
      control={<Switch name={toilet._id} size="normal" color="primary"  />}
      label="Available"
      //issues, there is a switchToggled function above that should make the post req}
    />
                </ListItem>
                <Divider component="li" />
            </div>
          ))}
                          
        
        </List>
            <br></br>

            <Button color="primary" fullWidth type="submit" variant="contained" onClick={history.goBack}>
              Commit changes
            </Button>
        
        </Container>
      </div>
      
    );
  }
  
  
  
};

export default ToiletsLeased;