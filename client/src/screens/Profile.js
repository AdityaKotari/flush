import React from 'react' 
import {List, ListItem, ListItemIcon, ListItemText, Divider, Container, AppBar, Typography, Button, Toolbar, IconButton, Paper} from '@material-ui/core';
import { ArrowBack, ThreeDRotation, Wc, Settings, Person, AccountBalance, Toll, Close, Add} from '@material-ui/icons';
import ListAltIcon from '@material-ui/icons/ListAlt';

import { makeStyles } from '@material-ui/core/styles';
import { NavLink, useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      maxWidth: 360,
     
    },
  }));


  function ListItemLink(props) {
    return <ListItem button component="a" {...props} />;
  }

  function SimpleList() {
    const classes = useStyles();
  
    return (
      <div className={classes.root}>
        <List component="nav" aria-label="main mailbox folders">
          <ListItem button>
            <ListItemIcon>
              <Wc />
            </ListItemIcon>
             
            <ListItemText primary="Book a restroom" />
          
          </ListItem>

          <NavLink to="/profile_info" style={{ textDecoration: 'none', color: '#212121' }}>
          <ListItem button>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary="Profile info" />
            </ListItem>
          </NavLink>
          
          <NavLink to="/toilets_leased" style={{ textDecoration: 'none', color: '#212121' }}>
          <ListItem button>
            <ListItemIcon>
              <ListAltIcon />
            </ListItemIcon>
            <ListItemText primary="Toilets Leased" />
            </ListItem>
          </NavLink>



        
          <ListItem button>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>

            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem button>
            <ListItemIcon>
              <AccountBalance />
            </ListItemIcon>
            
            <ListItemText primary="Wallet" />
          </ListItem>
          

          <NavLink to="/new_toilet" style={{ textDecoration: 'none', color: '#212121' }}><ListItem button>
            <ListItemIcon>
              <Add />
            </ListItemIcon>

            <ListItemText primary="Add restroom" />
          </ListItem></NavLink>
          

          

        </List>
       
        
      </div>
    );
  }
  
const Profile = () =>
{
    const history = useHistory()
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
            <main>
                <Container maxWidth="xs">
                <Typography variant="h2" align="left">&nbsp; Hello, User</Typography>
                </Container>
                <Container maxWidth="xs" align="center">
                    <SimpleList />
                </Container>
                
                
            </main>
         
             
            
            
        </div>
    ); 
}

export default Profile; 