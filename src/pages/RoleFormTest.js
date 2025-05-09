import React, { useState } from 'react';
import {
  Container,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box
} from '@mui/material';

export default function RoleFormTest() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h5" gutterBottom>User Creation Form</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label="Username"
          margin="normal"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          margin="normal"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        />
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              id="role"
              value={formData.role}
              label="Role"
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              MenuProps={{
                PaperProps: {
                  sx: { zIndex: 2000 }
                }
              }}
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="site_engineer">Site Engineer</MenuItem>
              <MenuItem value="viewer">Viewer</MenuItem>
              <MenuItem value="paying_authority">Payment Authority</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Button variant="contained" type="submit" sx={{ mt: 3 }}>
          Submit
        </Button>
      </form>
    </Container>
  );
}
