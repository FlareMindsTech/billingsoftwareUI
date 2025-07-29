import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Authcontext';
import {
  Container, Typography, Paper,  TextField, Button,Box,  MenuItem, Select, InputLabel, FormControl,
  Alert,
  FormHelperText
} from '@mui/material';
// ...other imports

const CreateOrEditAdminPage = () => {
  const { token } = useAuth();
  const { id } = useParams(); // id will be defined for edit
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    status: 'Active'
  });
  const [role] = useState('Admin');
  const [errors, setErrors] = useState({});
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      // Editing: Fetch user details to pre-fill fields
      (async () => {
        try {
          const res = await fetch(`http://billingsoftware-back-end.onrender.com/api/users/getusersbyid/${id}`, {
            headers: { token }
          });
          const user = await res.json();
          setFields({
            name: user.name || '',
            email: user.email || '',
            number: user.number || '',
            password: '', // Leave password blank for security
            status: user.status || 'Active'
          });
        } catch (err) {
          setErrorMsg('Failed to load user data');
        }
      })();
    }
  }, [id, token]);

  const handleChange = e => {
    setFields({ ...fields, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const err = {};
    if (!fields.name.trim()) err.name = 'Name is required';
    if (!fields.email.trim()) err.email = 'Email is required';
    if (!fields.number.trim()) err.number = 'Mobile number is required';
    if ((fields.password || !id) && !fields.password.trim()) err.password = 'Password is required'; // Only require new password for creating
    if (!fields.status.trim()) err.status = 'User status is required';
    else if (fields.password && fields.password.length < 8) {
      err.password = 'Password must be at least 8 characters long';
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) return;

  setLoading(true);
  setErrorMsg('');

  try {
    let response;
    if (id) {
      // Edit user
      response = await fetch(`https://billingsoftware-back-end.onrender.com/api/users/updateuser/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({ ...fields }),
      });

      const result = await response.json();
      console.log("Update user response:", response.status, result);
      if (!response.ok) {
        throw new Error(result?.error || 'Failed to update user');
      }

    } else {
      // Create admin
      response = await fetch('https://billingsoftware-back-end.onrender.com/api/users/createadmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token,
        },
        body: JSON.stringify({
          name: fields.name,
          email: fields.email,
          password: fields.password,
          number: fields.number,
          status: fields.status,
          role: "Admin",
        }),
      });

      const result = await response.json();
      console.log("Create user response:", response.status, result);
      if (response.status !== 201) {
        throw new Error(result?.error || 'Failed to create user');
      }
    }

    alert("User saved successfully!");
    navigate('/users');
  } catch (err) {
    setErrorMsg(err.message || 'Error occurred');
  }

  setLoading(false);
};


 console.log('Sending token:', token);
console.log('Request body:', { ...fields });


  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" fontWeight={700} mb={3} color="primary">
          {id ? 'Edit Admin User' : 'Create Admin User'}
        </Typography>
        {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}
        <form onSubmit={handleSubmit} noValidate>
          <TextField label="Full Name" name="name" value={fields.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth margin="normal" />
          <TextField label="Email" name="email" value={fields.email} onChange={handleChange} error={!!errors.email} helperText={errors.email} fullWidth margin="normal" />
          <TextField label="Mobile Number" name="number" value={fields.number} onChange={handleChange} error={!!errors.number} helperText={errors.number} fullWidth margin="normal" />
          <TextField label="Password" name="password" type="password" value={fields.password} onChange={handleChange} error={!!errors.password} helperText={id ? 'Leave blank to keep unchanged' : errors.password} fullWidth margin="normal" />
          <FormControl fullWidth margin="normal" error={!!errors.status}>
            <InputLabel>Status</InputLabel>
            <Select name="status" value={fields.status} label="Status" onChange={handleChange}>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
            </Select>
            <FormHelperText>{errors.status}</FormHelperText>
          </FormControl>
          <Box mt={3} display="flex" gap={2}>
            <Button type="submit" variant="contained" color="primary" disabled={loading} fullWidth>
              {id ? 'Update' : 'Create'}
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/users')} fullWidth>
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateOrEditAdminPage;
