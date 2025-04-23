import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, CssBaseline, Stack, IconButton, Drawer, List, ListItem, ListItemText, useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import esperluLogo from './assets/logo.png';
import InstallBanner from './components/InstallBanner';
import { useNavigate, useLocation, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PublicForm from './pages/PublicForm';
import NotFound from './pages/NotFound';
import Changelog from './pages/Changelog';
import { supabase } from './supabaseClient';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width:600px)');
  const [drawerOpen, setDrawerOpen] = useState(false);

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
        { label: 'Déconnexion', action: handleLogout },
      ]
    : [
        { label: 'Se connecter', path: '/login' },
        { label: 'S\'inscrire', path: '/signup' },
      ];

  return (
    <>
      <CssBaseline />
      <AppBar position="static" elevation={1} sx={{ bgcolor: '#1B263B', color: '#fff' }}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1, cursor: 'pointer' }} onClick={() => navigate('/') }>
            <Box component="img" src={esperluLogo} alt="Logo Esperluweb" sx={{ height: 36, mr: 2, borderRadius: 1, bgcolor: '#fff' }} />
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: 1, color: '#fff' }}>Donner mon avis</Typography>
          </Box>
          {isMobile ? (
            <>
              <IconButton edge="end" sx={{ color: '#fff' }} aria-label="menu" onClick={() => setDrawerOpen(true)}>
                <MenuIcon />
              </IconButton>
              <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
                <Box sx={{ width: 220, bgcolor: '#1B263B', height: '100%', color: '#fff' }} role="presentation" onClick={() => setDrawerOpen(false)}>
                  <List>
                    {menuItems.map((item, idx) => (
                      <ListItem button key={idx} onClick={item.action ? item.action : () => navigate(item.path)} sx={{ '&:hover': { bgcolor: '#415A77' } }}>
                        <ListItemText primary={item.label} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Drawer>
            </>
          ) : (
            <Stack direction="row" spacing={1}>
              {menuItems.map((item, idx) =>
                item.action ? (
                  <Button key={idx} sx={{ color: '#fff', fontWeight: location.pathname === '/dashboard' && item.label.includes('Dashboard') ? 700 : 400, '&:hover': { bgcolor: '#415A77' } }} onClick={item.action}>
                    {item.label}
                  </Button>
                ) : (
                  <Button key={idx} sx={{ color: '#fff', fontWeight: location.pathname === item.path ? 700 : 400, '&:hover': { bgcolor: '#415A77' } }} onClick={() => navigate(item.path)}>
                    {item.label}
                  </Button>
                )
              )}
            </Stack>
          )}
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          minHeight: 'calc(100vh - 64px - 56px)', // header + footer
          width: '100vw',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg,rgb(53, 56, 59) 0%,rgb(31, 34, 40) 100%)',
        }}
      >
        <Container maxWidth={false} sx={{ p: 0 }}>
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', md: 1280 },
              bgcolor: 'background.paper',
              p: { xs: 2, sm: 4 },
              borderRadius: 3,
              boxShadow: 3,
              mx: 'auto',
            }}
          >
            <Routes>
              {/* Redirige '/' vers /dashboard si connecté */}
              <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/signup" element={user ? <Navigate to="/dashboard" replace /> : <Signup />} />
              <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
              <Route path="/form/:public_link" element={<PublicForm />} />
              <Route path="/changelog" element={<Changelog />} />
              {/* Toutes les autres routes : 404 si non connecté, sinon redirige vers dashboard */}
              <Route path="*" element={user ? <Navigate to="/dashboard" replace /> : <NotFound />} />
            </Routes>
          </Box>
        </Container>
      </Box>
      <InstallBanner />
      <Box component="footer" sx={{ width: '100vw', bgcolor: '#1B263B', color: '#fff', py: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box component="img" src={esperluLogo} alt="Logo Esperluweb" sx={{ height: 28, mr: 1, borderRadius: 1, bgcolor: '#fff' }} />
          <Typography variant="body2" sx={{ color: '#fff', textAlign: 'center', ml: 1 }}>
            Développé avec 🍵 et ❤️ par EsperluWeb
            {' '}|{' '}
            <a href="/changelog" style={{ color: '#fff', textDecoration: 'underline', marginLeft: 8 }}>Changelog</a>
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default App
