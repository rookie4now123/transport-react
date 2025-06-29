import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { NavLink } from 'react-router';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon color="success"/>, path: '/dashboard' },
  { text: 'Tracks', icon: <AnalyticsRoundedIcon color="success"/>, path: '/dashboard/tracks' },
  { text: 'Students', icon: <PeopleRoundedIcon color="success"/>, path: '/dashboard/students' },
  { text: 'Stations', icon: <AssignmentRoundedIcon color="success"/>, path: '/dashboard/stations' },
];

const secondaryListItems = [
  { text: 'Settings', icon: <SettingsRoundedIcon /> },
  { text: 'About', icon: <InfoRoundedIcon /> },
  { text: 'Feedback', icon: <HelpRoundedIcon /> },
];

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <NavLink to={item.path}
            className={({ isActive }) => isActive ? 'is-active-link' : ''}
            end={item.text === 'Home'}
            style={{ textDecoration: 'none', color: 'inherit' }}
            >
          <ListItemButton
    sx={{
      color: '#3110af', // Base text color
      '&:hover': {
        backgroundColor: '#11f0f0', // Example hover color
      },
      '.is-active-link &': {
        backgroundColor: '#123fff', // Background for the active state
        color: '#ffcc26',       // Text color for the active state
        // Add any other styles for the active state here (e.g., fontWeight)
      },
    }}
                >
             {/* <ListItemButton selected={index === 0} component={NavLink} to={item.path}> */}
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
            </NavLink>
          </ListItem>
        ))}
      </List>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
