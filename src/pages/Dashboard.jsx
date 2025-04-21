import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Typography, Button, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert, Stack
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';


function Dashboard() {
  const [forms, setForms] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [noteLabel, setNoteLabel] = useState('');
  const [externalLinks, setExternalLinks] = useState([{ label: '', url: '' }]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editForm, setEditForm] = useState(null); // Stocke le formulaire à éditer
  const [openResponses, setOpenResponses] = useState(false);
  const [responses, setResponses] = useState([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [responsesForm, setResponsesForm] = useState(null);
  const navigate = useNavigate();

  // Vérifie si l'utilisateur est connecté
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) navigate('/login');
    });
  }, [navigate]);

  // Récupère les formulaires de l'utilisateur
  useEffect(() => {
    const fetchForms = async () => {
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error) setForms(data);
    };
    fetchForms();
  }, [success]);

  const handleAddQuestion = () => {
    if (questions.length < 5) setQuestions([...questions, '']);
  };

  const handleQuestionChange = (idx, value) => {
    const updated = [...questions];
    updated[idx] = value;
    setQuestions(updated);
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleCreateForm = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title || questions.some(q => !q) || questions.length === 0) {
      setError('Titre et toutes les questions sont obligatoires.');
      return;
    }
    if (editForm) {
      // Edition d'un formulaire existant
      const { error } = await supabase.from('forms').update({
        title,
        questions,
        note_label: noteLabel,
        external_links: externalLinks.filter(l => l.label && l.url),
      }).eq('id', editForm.id);
      if (error) setError(error.message);
      else {
        setSuccess('Formulaire modifié !');
        setOpen(false);
        setEditForm(null);
        setTitle('');
        setQuestions(['']);
        setNoteLabel('');
      }
    } else {
      // Création
      const user = (await supabase.auth.getUser()).data.user;
      const public_link = crypto.randomUUID();
      const { error } = await supabase.from('forms').insert([
        {
          user_id: user.id,
          title,
          questions,
          note_label: noteLabel,
          public_link,
          external_links: externalLinks.filter(l => l.label && l.url)
        }
      ]);
      if (error) setError(error.message);
      else {
        setSuccess('Formulaire créé !');
        setOpen(false);
        setTitle('');
        setQuestions(['']);
        setNoteLabel('');
      }
    }
  };

  // Lance la modale d'édition avec les valeurs du formulaire à modifier
  const handleEditForm = (form) => {
    setEditForm(form);
    setTitle(form.title);
    setQuestions([...form.questions]);
    setNoteLabel(form.note_label || '');
    setExternalLinks(form.external_links && Array.isArray(form.external_links) && form.external_links.length > 0 ? form.external_links : [{ label: '', url: '' }]);
    setOpen(true);
  };


  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>Mes formulaires</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Nouveau formulaire
      </Button>
      <Stack spacing={3}>
        {forms.map(form => (
          <Paper key={form.id} elevation={2} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>{form.title}</Typography>
            <Stack direction="row" alignItems="center" spacing={1} mb={1}>
              <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-all' }}>
                Lien public :
                <Button size="small" onClick={() => navigator.clipboard.writeText(window.location.origin + '/form/' + form.public_link)} sx={{ textTransform: 'none', ml: 1 }}>
                  {window.location.origin + '/form/' + form.public_link}
                </Button>
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <Button variant="outlined" size="small" onClick={() => handleEditForm(form)}>
                Modifier
              </Button>
              <Button size="small" variant="contained" color="secondary" onClick={async () => {
                setResponsesLoading(true);
                setOpenResponses(true);
                setResponsesForm(form);
                const { data } = await supabase
                  .from('reviews')
                  .select('*')
                  .eq('form_id', form.id)
                  .order('created_at', { ascending: false });
                setResponses(data || []);
                setResponsesLoading(false);
              }}>
                Voir les réponses
              </Button>
            </Stack>
          </Paper>
        ))}
      </Stack>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Créer un formulaire</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleCreateForm}>
            <TextField label="Titre" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} required />
            {questions.map((q, idx) => (
              <Box key={idx} display="flex" alignItems="center">
                <TextField
                  label={`Question ${idx + 1}`}
                  value={q}
                  onChange={e => handleQuestionChange(idx, e.target.value)}
                  required
                  fullWidth
                  margin="normal"
                />
                {questions.length > 1 && (
                  <IconButton onClick={() => handleRemoveQuestion(idx)} color="error">
                    ✕
                  </IconButton>
                )}
              </Box>
            ))}
            <Button onClick={handleAddQuestion} disabled={questions.length >= 5}>Ajouter une question</Button>
            <TextField label="Label de la note (optionnel)" fullWidth margin="normal" value={noteLabel} onChange={e => setNoteLabel(e.target.value)} />

            <Box mt={2} mb={1}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Liens d'avis externes (Google, Trustpilot...)</Typography>
              {externalLinks.map((link, idx) => (
                <Stack direction="row" spacing={1} alignItems="center" key={idx} mb={1}>
                  <TextField
                    label="Plateforme"
                    value={link.label}
                    onChange={e => {
                      const updated = [...externalLinks];
                      updated[idx].label = e.target.value;
                      setExternalLinks(updated);
                    }}
                    sx={{ minWidth: 120 }}
                  />
                  <TextField
                    label="URL"
                    value={link.url}
                    onChange={e => {
                      const updated = [...externalLinks];
                      updated[idx].url = e.target.value;
                      setExternalLinks(updated);
                    }}
                    sx={{ flex: 1 }}
                  />
                  <IconButton color="error" onClick={() => setExternalLinks(externalLinks.filter((_, i) => i !== idx))} disabled={externalLinks.length === 1}>
                    ✕
                  </IconButton>
                </Stack>
              ))}
              <Button variant="outlined" size="small" onClick={() => setExternalLinks([...externalLinks, { label: '', url: '' }])} sx={{ mt: 1 }}>
                Ajouter un lien
              </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateForm} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>
      {/* Modale d'affichage des réponses */}
      <Dialog open={openResponses} onClose={() => setOpenResponses(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Réponses pour : {responsesForm?.title}
        </DialogTitle>
        <DialogContent dividers>
          {responsesLoading ? (
            <Typography>Chargement...</Typography>
          ) : responses.length === 0 ? (
            <Typography>Aucune réponse pour ce formulaire.</Typography>
          ) : (
            responses.map((resp, idx) => (
              <Box key={resp.id || idx} mb={3} p={2} border={1} borderColor="grey.200" borderRadius={2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Soumis le {new Date(resp.created_at).toLocaleString()} {resp.client_email ? `par ${resp.client_email}` : ''}
                </Typography>
                {responsesForm?.note_label && (
                  <Typography><b>{responsesForm.note_label} :</b> {resp.note ?? '-'}/5</Typography>
                )}
                {Array.isArray(resp.answers) && responsesForm?.questions && responsesForm.questions.map((q, i) => (
                  <Typography key={i}><b>{q} :</b> {resp.answers[i] ?? '-'}</Typography>
                ))}
              </Box>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenResponses(false)}>Fermer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
