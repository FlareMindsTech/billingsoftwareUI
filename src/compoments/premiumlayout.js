import React from 'react';
import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography, AppBar } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import logo1 from '../Assets/logo1.png';

const drawerWidth = 220;

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Bills', icon: <ReceiptIcon />, path: '/bills' },
  { text: 'Customers', icon: <PeopleIcon />, path: '/customers' },
  { text: 'Logout', icon: <LogoutIcon />, action: 'logout' }, 
];

const PremiumLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item) => {
    if (item.action === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/login');
    } else {
      navigate(item.path);
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'primary.main',
            color: 'white',
            borderRight: 0,
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              component="img"
              src={logo1} 
              alt="Tritech Logo"
              sx={{ width: 70, height: 70, mb: 1, borderRadius: 2, boxShadow: 2, bgcolor: 'white' }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1 }}>
              Tritech Systemssss
            </Typography>
          </Box>
        </Toolbar>
        <List>
          {menuItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem
                button
                key={item.text}
                onClick={() => handleNavigation(item)}
                sx={{
                  my: 1,
                  borderRadius: 2,
                  px: 2,
                  backgroundColor: selected ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { backgroundColor: 'rgba(255,255,255,0.15)' },
                }}
              >
                <ListItemIcon 
                sx={{ color: 'white' }}
                >{item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{ '& .MuiTypography-root': { fontWeight: 600, color: 'white' } }}
                />
              </ListItem>
            );
          })}
        </List>
      </Drawer>
      <Box sx={{ flexGrow: 1 }}>        
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: 'white',
            color: 'primary.main',
            boxShadow: 2,
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        >
          <Toolbar sx={{ justifyContent: 'space-between', minHeight: 70 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                component="img"
                src={logo1}
                alt="Tritech Logo"
                sx={{ width: 45, height: 45, borderRadius: 1, bgcolor: 'white', boxShadow: 1 }}
              />
              <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
                Tritech Billing Software ssssss
              </Typography>
            </Box>
          </Toolbar>
        </AppBar> 
        <Toolbar /> 
        <Box sx={{ p: { xs: 2, md: 4 }, mt: 2 }}>
          {children}
        </Box>
        <Box sx={{ textAlign: 'center', py: 2 }}>
    <Box
      component="img"
      src={logo1}
      alt="Bottom Logo"
      sx={{ width: 60, height: 60, borderRadius: 2, bgcolor: 'white', mx: 'auto', boxShadow: 2 }}
    />
    <Typography variant="caption" sx={{ color: 'white', mt: 1 }}>
      © 2025 Tritech
    </Typography>
  </Box>
      </Box>
    </Box>
  );
};

export default PremiumLayout;
