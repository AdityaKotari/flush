import React from 'react';
import { useHistory } from 'react-router-dom';
import { makeStyles, Container, ListItem, ListItemIcon, ListItemText, List, Divider, AppBar, Card, CardActionArea, Toolbar, IconButton, CardMedia, CardContent, Typography, Box, CardActions, Button } from '@material-ui/core';
import { AccessTime, AccessTimeOutlined, ArrowBack, AttachMoneyOutlined, BathtubOutlined, Contactless, Info, InfoOutlined, LocationCityOutlined, LocationOnOutlined, MoneyOutlined, Phone, WcOutlined } from '@material-ui/icons';
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
    const [stars, setStars] = React.useState(2);
    const classes = useStyles();
    const iconMakeup = iconStyles();
    const history = useHistory();

    return (<div>
        <AppBar position="static" color="secondary" elevation={0} >
            <Toolbar>
                <IconButton edge="start" color="primary" aria-label="menu">
                    <ArrowBack onClick={
                        history.goBack
                    } />
                </IconButton>
                <Typography variant="h6">
                    toilet name
         </Typography>

            </Toolbar>
        </AppBar>
        <Container maxWidth="xs" align="center">
            <Card className={classes.root} elevation={0}>
                <CardActionArea>
                    <CardMedia

                        image="https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Toilet_photo.jpg/800px-Toilet_photo.jpg"
                        title="landmarkName"
                        className={classes.media}

                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            landmarkName
          </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">

                            <Box component="fieldset" borderColor="transparent">

                                <Rating name="read-only" value={2} readOnly />
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
                        <ListItemText primary="landmarkName" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <WcOutlined className={iconMakeup.root} />
                        </ListItemIcon>
                        <ListItemText primary="RestroomPrice" />
                    </ListItem>
                    <ListItem button>
                        <ListItemIcon>
                            <BathtubOutlined className={iconMakeup.root} />
                        </ListItemIcon>
                        <ListItemText primary="RestroomPrice" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <AccessTimeOutlined className={iconMakeup.root} />
                        </ListItemIcon>
                        <ListItemText primary="RestroomPrice" />
                    </ListItem>
                    <Divider />
                    <ListItem button>
                        <ListItemIcon>
                            <Phone className={iconMakeup.root} />
                        </ListItemIcon>
                        <ListItemText primary="RestroomPrice" />
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

export default OneToilet;