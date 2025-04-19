import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Stack } from '@mui/material';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Récupère l'utilisateur connecté à l'initialisation et écoute les changements
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => { listener?.subscription.unsubscribe(); };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  const menuItems = user
    ? [
        { label: 'Dashboard', path: '/dashboard' },
        { label: 'Mes formulaires', path: '/dashboard' },
        { label: 'Déconnexion', action: handleLogout },
      ]
    : [
        { label: 'Se connecter', path: '/login' },
        { label: 'S\'inscrire', path: '/signup' },
      ];

  return (
    <>
      <CssBaseline />
      <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: 'primary.main', cursor: 'pointer' }} onClick={() => navigate('/')}>RateMe</Typography>
          <Stack direction="row" spacing={1}>
            {menuItems.map((item, idx) =>
              item.action ? (
                <Button key={idx} color="inherit" onClick={item.action} sx={{ fontWeight: location.pathname === '/dashboard' && item.label.includes('Dashboard') ? 700 : 400 }}>
                  {item.label}
                </Button>
              ) : (
                <Button key={idx} color="inherit" onClick={() => navigate(item.path)} sx={{ fontWeight: location.pathname === item.path ? 700 : 400 }}>
                  {item.label}
                </Button>
              )
            )}
          </Stack>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px - 40px)', // header + footer
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,rgb(53, 56, 59) 0%,rgb(31, 34, 40) 100%)',
        }}
      >
        <Container maxWidth="sm" sx={{ p: 0 }}>
          <Box
            sx={{
              width: '100%',
              bgcolor: 'background.paper',
              p: { xs: 2, sm: 4 },
              borderRadius: 3,
              boxShadow: 3,
              maxWidth: 420,
              mx: 'auto',
            }}
          >
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Container>
      </Box>
      <Box component="footer" sx={{ width: '100vw', height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.paper', boxShadow: 1, position: 'fixed', bottom: 0, left: 0, zIndex: 1200 }}>
        <Typography variant="body2" color="text.secondary">
          Développé avec 🍵 et ❤️ par EsperluWeb
        </Typography>
      </Box>
    </>
  );
}

export default App
