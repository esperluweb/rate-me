import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h3" gutterBottom>
        404 - Page introuvable
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        La page que vous cherchez n'existe pas ou vous n'y avez pas accès.
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>Retour à l'accueil</Button>
    </Box>
  );
}
