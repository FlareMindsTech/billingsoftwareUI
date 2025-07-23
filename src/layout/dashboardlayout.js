import React from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import logiright from '../images/logi-right.png';

import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Sidebar menu: show 'Users' only for Owner role
  const navItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Bills', icon: <ReceiptIcon />, path: '/bills' },
  ];
  if (user?.role === 'Owner') {
    navItems.push({ text: 'Users', icon: <PeopleIcon />, path: '/users' });
  }
  navItems.push({ text: 'Logout', icon: <LogoutIcon />, action: logout });

  // Handle navigation and logout
  const handleNav = (item) => {
    if (item.action) {
      item.action();
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
            bgcolor: 'white',
            color: 'primary.main',
            borderRight: 0,
            boxShadow: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            minHeight: '100vh',
          },
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                overflow: 'hidden',
                mb: 1,
                boxShadow: 3,
                bgcolor: 'white',
                border: '2px solid #fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <img
                src={logiright}
                alt="Tritech Logo"
                style={{
                  width: '200%',
                  height: '200%',
                  objectFit: 'cover',
                }}
              />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: 'primary.main' }}>
              Tritech Systems
            </Typography>
          </Box>
        </Toolbar>
        <Divider sx={{ bgcolor: 'rgba(0,0,0,0.08)', mb: 2 }} />
        <List>
          {navItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => handleNav(item)}
                sx={{
                  my: 1,
                  borderRadius: 2,
                  px: 2,
                  transition: 'background 0.2s',
                  '&:hover': { background: 'rgba(25, 118, 210, 0.08)' }
                }}
              >
                <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ '& .MuiTypography-root': { fontWeight: 600, fontSize: '1.05rem' } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          bgcolor: 'background.paper',
          p: { xs: 2, md: 4 },
          borderRadius: { xs: 0, md: 4 },
          boxShadow: { md: 2 },
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
export default DashboardLayout;
