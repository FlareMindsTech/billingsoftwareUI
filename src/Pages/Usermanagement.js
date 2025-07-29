import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Button, Box, Table, TableHead,
  TableRow, TableCell, TableContainer, IconButton, Modal,
  TextField, InputAdornment, TableBody,
} from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import HomeIcon from '@mui/icons-material/Home';
import LockIcon from '@mui/icons-material/Lock';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from '../context/Authcontext';
import { useNavigate } from 'react-router-dom';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: 500,
  bgcolor: 'background.paper',
  borderRadius: 4,
  boxShadow: 24,
  p: 4,
  maxHeight: '90vh',  
  overflowY: 'auto',
};
const UserManagementPage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://billingsoftware-back-end.onrender.com/api/users/getallusers', {
          headers: { token },
        });
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Error loading users:', err);
      } finally {
        setLoading(false);
      }
    }; 

    fetchUsers();
  }, []);
  const handleDeleteUser = async (userId) => {
  if (!window.confirm('Are you sure you want to delete this user?')) return;
  try {
    const response = await fetch(`https://billingsoftware-back-end.onrender.com/api/users/delete/${userId}`, {
      method: 'DELETE',
      headers: { token },
    });
    if (response.ok) {
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } else {
      alert('Failed to delete user');
    }
  } catch {
    alert('Error deleting user');
  }
};


  return (
    // <Container maxWidth="lg" sx={{ overflowX: 'hidden' , py: 4 }}>
    <Container maxWidth="lg" sx={{ py: { xs: 2, md: 4 }, minHeight: 'auto', width: '100%' }}>

      {/* Heading */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 4,
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          sx={{ borderRadius: 2, px: 4, py: 1 }}
          onClick={() => navigate('/users/create')}
        >
          Create User
        </Button>
      </Box>

      {/* User Table */}
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table size="medium">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'primary.light' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Number</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {users.map((user) => (
    <TableRow key={user._id}>
      <TableCell>{user.name}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.number}</TableCell>
      <TableCell>{user.role}</TableCell>
      <TableCell>
        <IconButton color="primary" size="small" onClick={() => navigate(`/users/edit/${user._id}`)}>
          <EditIcon />
        </IconButton>
        <IconButton color="error" size="small" onClick={() => handleDeleteUser(user._id)}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
        </Table>
      </TableContainer>

      {/* Modal (Closed by default) */}
      <Modal open={false}>
        <Box sx={modalStyle}>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            Create User
          </Typography>

          {/* Form Fields */}
          <TextField
            fullWidth margin="normal" label="Full Name" required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth margin="normal" label="Email Address" required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth margin="normal" label="Phone Number" required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth margin="normal" label="Address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HomeIcon color="primary" />
                </InputAdornment>
              )
            }}
          />
          <TextField
            fullWidth margin="normal" label="Password" type="password"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="primary" />
                </InputAdornment>
              )
            }}
          />

          {/* Buttons */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button variant="contained" color="primary">Create</Button>
            <Button variant="outlined" color="secondary" startIcon={<CloseIcon />}>
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default UserManagementPage;
