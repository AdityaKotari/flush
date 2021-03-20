import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { makeStyles, Container, ListItem, ListItemIcon, ListItemText, List, Divider, AppBar, Card, CardActionArea, Toolbar, IconButton, CardMedia, CardContent, Typography, Box, CardActions, Button } from '@material-ui/core';
import { AccessibleForwardOutlined, AccessTime, AccessTimeOutlined, ArrowBack, AttachMoneyOutlined, BathtubOutlined, Contactless, Info, InfoOutlined, LocationCityOutlined, LocationOnOutlined, MoneyOutlined, Phone, WcOutlined } from '@material-ui/icons';
import { Rating } from '@material-ui/lab'

const useStyles = makeStyles({
    root: {
        maxWidth: 345,
    },
    media: {
        height: 200,
    },
});

const iconStyles = makeStyles({
    root: {
        fill: "#3f50b5"

    },
    media: {

    },
});

const OneToilet = () => {
    const {toiletId}= useParams();
    const [toiletProp, setToiletProp] = useState();  
    const [loading, setLoading] = useState(true)
    console.log(toiletId)

    useEffect(()=>{
        fetch("/api/toilet/oneToilet",{
            method:"post",
            headers:{
                "Content-Type":"application/json", 
                "Authorization":"Bearer "+localStorage.getItem("jwt"), 
            },
            body:JSON.stringify({
               toilet_id: toiletId 
                
                

            })
        }).then(res=>res.json())
        .then(data=>{

            console.log(data);
           if(data.error){
               
               console.log(data.error); 
             
           }
           else{
              console.log(data)
              setToiletProp(data)
              setLoading(false)
           }
        }).catch(err=>{
            //setErrorStatus(true)
            //setErrorMessage(err)
            console.log(err)
        })
    }, [])
    const [stars, setStars] = React.useState(2);
    const classes = useStyles();
    const iconMakeup = iconStyles();
    const history = useHistory();
    if (loading)
    {
        return (<div>

        </div>)
    }
    else
    {
        return (<div>
            <AppBar position="static" color="secondary" elevation={0} >
                <Toolbar>
                    <IconButton edge="start" color="primary" aria-label="menu">
                        <ArrowBack onClick={
                            history.goBack
                        } />
                    </IconButton>
                    <Typography variant="h6">
                        {toiletProp.landmarkName}
             </Typography>
    
                </Toolbar>
            </AppBar>
            <Container maxWidth="xs" align="center">
                <Card className={classes.root} elevation={0}>
                    <CardActionArea>
                        
                        <CardMedia
    
                            image={toiletProp.photos ? toiletProp.photos[1] : "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/800px-Toilet_photo.jpg"}
                            title="landmarkName"
                            className={classes.media}
    
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="h2">
                                Average rating
              </Typography>
                            <Typography variant="body2" color="textSecondary" component="p">
    
                                <Box component="fieldset" borderColor="transparent">
    
                                    <Rating name="read-only" value={toiletProp.avgRating>0 ? toiletProp.avgRating : 1 } />
                                </Box>
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
    
                    </CardActions>
                </Card>
                <div>
                    <List component="nav" aria-label="main mailbox folders">
                        <ListItem button>
                            <ListItemIcon >
                                <LocationOnOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.landmarkName} />
                        </ListItem>
                        {toiletProp.differentlyAbled ? <ListItem button>
                            <ListItemIcon >
                                <AccessibleForwardOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary="Differently Abled Friendly" />
                        </ListItem> : null}
                      
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <WcOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.restroomPrice===0 ? "Free services" :  toiletProp.restroomPrice} />
                        </ListItem>
                        <ListItem button>
                            <ListItemIcon>
                                <BathtubOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.bathroomPrice===0 ? "Free services" :  toiletProp.restroomPrice} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <AccessTimeOutlined className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.isAvailable ? "Open right now" : "Closed"} />
                        </ListItem>
                        <Divider />
                        <ListItem button>
                            <ListItemIcon>
                                <Phone className={iconMakeup.root} />
                            </ListItemIcon>
                            <ListItemText primary={toiletProp.owner.phone ? toiletProp.owner.phone : "6000439169" } />
                        </ListItem>
    
                    </List>
                    <Card elevation={0}>
                        <CardActionArea>
                            <CardMedia
    
    
                                title="landmarkName"
    
    
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="h2">
                                    Rate this restroom
              </Typography>
                                <Typography color="textSecondary">
                                    Tell us about your perception of social hygiene
            </Typography>
                                <Typography variant="body2" color="textSecondary" component="p">
    
                                    <Box component="fieldset" borderColor="transparent">
    
                                        <Rating name="read-only" value={stars}
                                            onChange={(event, newValue) => {
                                                setStars(newValue);
                                            }} />
                                    </Box>
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>
                            <Button size="small">SUBMIT</Button>
                        </CardActions>
                    </Card>
    
    
                </div>
            </Container>
    
    
        </div>
        );

    }

    




}

export default OneToilet;