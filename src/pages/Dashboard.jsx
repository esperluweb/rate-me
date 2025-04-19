import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import {
  Typography, Button, Box, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

function Dashboard() {
  const [forms, setForms] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [noteLabel, setNoteLabel] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    const user = (await supabase.auth.getUser()).data.user;
    const public_link = crypto.randomUUID();
    const { error } = await supabase.from('forms').insert([
      {
        user_id: user.id,
        title,
        questions,
        note_label: noteLabel,
        public_link
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
  };

  return (
    <Box mt={4}>
      <Typography variant="h4" gutterBottom>Mes formulaires</Typography>
      <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)} sx={{ mb: 2 }}>
        Nouveau formulaire
      </Button>
      <List>
        {forms.map(form => (
          <ListItem key={form.id} secondaryAction={
            <Button onClick={() => navigator.clipboard.writeText(window.location.origin + '/form/' + form.public_link)}>
              Copier le lien
            </Button>
          }>
            <ListItemText
              primary={form.title}
              secondary={`Questions : ${form.questions.length} | Lien : /form/${form.public_link}`}
            />
          </ListItem>
        ))}
      </List>
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
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={handleCreateForm} variant="contained">Créer</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Dashboard;
