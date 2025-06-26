import React from 'react'
import Box from '@mui/material/Box';
import FavoriteIcon from '@mui/icons-material/Favorite';
import DeleteIcon from '@mui/icons-material/Delete';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import ListItemIcon from '@mui/material/ListItemIcon';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
const mainListItems = [
  { text: 'Home', icon: <FavoriteIcon/>, path: '/dashboard' },
  { text: 'Tracks', icon: <DeleteIcon color="success"/>, path: '/dashboard/tracks' },
  { text: 'Clients', icon: <PeopleRoundedIcon color="success"/>, path: '/dashboard/students' },
  { text: 'Stations', icon: <AccessAlarmIcon color="success"/>, path: '/dashboard/stations' },
];
export default function Station() {
  const listIconColor = '#2e7d32'; // This is the success green color
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>

    <h2>Station</h2>
    <List dense>
      {mainListItems.map((item, index) => (
        <ListItem key={index} disablePadding>
          <ListItemButton>
            <ListItemIcon>
              {React.cloneElement(item.icon, {
                style: { color: '#2e7d32' }
              })}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      ))}
    </List>

    <p>Single button examples:</p>
    <ListItemButton>
       {/* This works because ListItemIcon here is outside the strict List context */}
      <ListItemIcon
         sx={{ color: '#2e7aaa' }}
      >{mainListItems[0].icon}</ListItemIcon>
      <ListItemText primary="Single Button SX Test" />
    </ListItemButton>

     <ListItemButton
           sx={{
              // This works because ListItemButton here is outside the strict List context
              '& .MuiListItemIcon-root': {
                color: 'red', // Example of styling from parent sx working outside List
              },
            }}
      >
      <ListItemIcon>
          {mainListItems[0].icon}
      </ListItemIcon>
       <ListItemText primary="Single Button Parent SX Test" />
    </ListItemButton>
  </Box>
  )
}
