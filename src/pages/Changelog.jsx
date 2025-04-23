import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';

const changelog = [
  {
    version: '1.3',
    changes: [
      'Amélioration de l’affichage responsive du formulaire public',
      'Largeur du container ajustée pour une meilleure lisibilité sur desktop',
      'Correction de l’affichage des labels sur mobile',
      'Ajout de la page changelog'
    ],
  },
  {
    version: '1.2',
    changes: [
      'Ajout de la page 404 pour les routes non autorisées',
      'Redirection automatique selon le statut de connexion',
    ],
  },
  {
    version: '1.1',
    changes: [
      'Ajout des splash screens iOS',
      'Optimisation du manifest PWA',
    ],
  },
  {
    version: '1.0',
    changes: [
      'Création de l’application',
    ],
  },
];

export default function Changelog() {
  return (
    <Box maxWidth={700} mx="auto" mt={6} p={3} bgcolor="background.paper" borderRadius={3} boxShadow={3}>
      <Typography variant="h4" gutterBottom>Changelog</Typography>
      {changelog.map((entry, idx) => (
        <Box key={entry.version} mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>Version {entry.version}</Typography>
          <List dense>
            {entry.changes.map((change, i) => (
              <ListItem key={i} sx={{ pl: 2 }}>
                <ListItemText primary={change} />
              </ListItem>
            ))}
          </List>
          {idx < changelog.length - 1 && <Divider sx={{ my: 2 }} />}
        </Box>
      ))}
    </Box>
  );
}
