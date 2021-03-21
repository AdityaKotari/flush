
import React, { useState, useEffect } from 'react';
import {Link,NavLink,useHistory} from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import Slider from '@material-ui/core/Slider';
import { Close } from '@material-ui/icons';
import {AppBar, Toolbar, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

const sliderMarks = [
    {
      value: 0,
      label: '₹0',
    },
    {
      value: 100,
      label: '₹500',
    },
  ];
function valuetext(value) {
    return `₹${value*5}`;
  }
function valueLabelFormat(value){
    return `₹${value*5}`;
}

const Filter = () => {
  const classes = useStyles();

  const history = useHistory()
  const [needsToiletPaper,setPaper] = useState("")
  const [gender,setGender] = useState("")
  const [differentlyAbled,setAbled] = useState("")
  const [maximumPrice,setMax] = useState("")
  const [indianPreferred,setStyle] = useState("")
  const [filter,setFilter] = useState("")
  const [isAvailable,setAvailable] = useState("")

  const filterResults = () => {
    
    localStorage.setItem("filterSettings", JSON.stringify({isAvailable, indianPreferred, needsToiletPaper, gender, differentlyAbled, maximumPrice}))
    history.push("/");
  }
  useEffect( ()=>{
        var filter=JSON.parse(localStorage.getItem("filterSettings"));
        if(!filter){
            filter={
                indianPreferred:"false",
                needsToiletPaper:"false",
                gender:"male",
                differentlyAbled:"false",
                maximumPrice:"500",
                isAvailable:"true",

            }
        }
        setFilter(filter);
        console.log(filter);
        console.log(String(filter.indianPreferred))
        
  })

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
      <Container className={classes.container} maxWidth="xs" paddingTop="20vh">
      <form onSubmit={(e)=>{e.preventDefault()}}>
        <Grid container 
            spacing={3}
            
        >
            <Grid item xs={12}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center">Filter Search Results</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1" align="center">Tip: Leave any of the fields blank if you don't have a preference.</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="indianPreferred" label="Do you prefer Indian or Western style?"  variant="filled" select onChange={(e)=>setStyle(e.target.value)}>
                            <MenuItem value="true">Indian</MenuItem>
                            <MenuItem value="false">Western</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="needsToiletPaper" label="Do you require toilet paper?"  variant="filled" select onChange={(e)=>setPaper(e.target.value)}>
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="gender" label="Your Gender?" variant="filled" select onChange={(e)=>setGender(e.target.value)}>
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="differentlyAbled" label="Are you differently-abled?" variant="filled" select onChange={(e)=>setAbled(e.target.value)}>
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField fullWidth id="availability" label="Toilet availability" variant="filled" select onChange={(e)=>setAvailable(e.target.value)}>
                            <MenuItem value="true">Show only available toilets</MenuItem>
                            <MenuItem value="false">Show all toilets</MenuItem>
                        </TextField>
                    </Grid>
                    <Grid item xs={12}>
                    <Typography id="discrete-slider-custom" gutterBottom>
                        Maximum price
                    </Typography>
                    <Slider
                        defaultValue={20}
                        valueLabelFormat={valueLabelFormat}
                        getAriaValueText={valuetext}
                        aria-labelledby="discrete-slider-custom"
                        step={10}
                        valueLabelDisplay="auto"
                        marks={sliderMarks}
                        onChange={ (e, val) => setMax(val) }
                    />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                <Button color="primary" fullWidth type="submit" variant="contained" onClick={()=>filterResults()}>
                    Done
                </Button>
            </Grid>
        </Grid>
      </form>
    </Container>
    </div>
    
  );
};

export default Filter;