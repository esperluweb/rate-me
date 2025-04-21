import React, { useEffect, useState } from 'react';
import { Box, Button, Slide, Paper, Typography } from '@mui/material';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <Slide direction="up" in={showBanner} mountOnEnter unmountOnExit>
      <Paper elevation={8} sx={{ position: 'fixed', bottom: 24, left: 0, right: 0, mx: 'auto', maxWidth: 360, bgcolor: '#1B263B', color: '#fff', p: 2, zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>Installer RateMe ?</Typography>
          <Typography variant="body2">Ajoutez cette app à votre écran d'accueil pour une expérience optimale.</Typography>
        </Box>
        <Button variant="contained" sx={{ ml: 2, bgcolor: '#415A77' }} onClick={handleInstall}>Installer</Button>
      </Paper>
    </Slide>
  );
}
