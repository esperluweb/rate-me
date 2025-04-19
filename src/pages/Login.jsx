import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else navigate('/dashboard');
  };

  return (
    <Box mt={6} component="form" onSubmit={handleLogin}>
      <Typography variant="h4" gutterBottom>Connexion</Typography>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Mot de passe"
        fullWidth
        margin="normal"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Se connecter</Button>
      <Button onClick={() => navigate('/signup')} fullWidth sx={{ mt: 1 }}>Créer un compte</Button>
    </Box>
  );
}
