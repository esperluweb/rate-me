import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, InputAdornment } from '@mui/material';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function validatePassword(password) {
  // Au moins 8 caractères, une lettre, un chiffre, un caractère spécial
  const regex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).{8,}$/;
  return regex.test(password);
}

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const passwordValid = validatePassword(password);
  const passwordsMatch = password === confirm && password.length > 0;

  const allValid = passwordValid && passwordsMatch;

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!allValid) {
      setError("Le mot de passe ne respecte pas les exigences ou les deux champs ne correspondent pas.");
      return;
    }
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: window.location.origin + '/login'
      }
    });
    if (error) setError(error.message);
    else setSuccess(true);
  };

  return (
    <Box mt={6} component="form" onSubmit={handleSignup} sx={{ width: '100%', maxWidth: 420, mx: 'auto', p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom>Inscription</Typography>
      <TextField
        label="Nom"
        fullWidth
        margin="normal"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
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
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {password.length > 0 ? (passwordValid ? '✅' : '❌') : ''}
            </InputAdornment>
          ),
        }}
        helperText="Au moins 8 caractères, lettres, chiffres et caractères spéciaux."
      />
      <TextField
        label="Confirmer le mot de passe"
        fullWidth
        margin="normal"
        type="password"
        value={confirm}
        onChange={e => setConfirm(e.target.value)}
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {confirm.length > 0 ? (passwordsMatch ? '✅' : '❌') : ''}
            </InputAdornment>
          ),
        }}
        helperText={confirm.length > 0 && !passwordsMatch ? 'Les mots de passe ne correspondent pas.' : ''}
      />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>Vérifie ta boîte mail pour confirmer ton inscription.</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={!allValid}>
        S'inscrire
      </Button>
      <Button onClick={() => navigate('/login')} fullWidth sx={{ mt: 1 }}>Déjà un compte ? Se connecter</Button>
    </Box>
  );
}
