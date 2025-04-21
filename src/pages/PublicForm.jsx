import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Box, Typography, CircularProgress, Alert, Button, TextField, Rating } from '@mui/material';

export default function PublicForm() {
  const { public_link } = useParams();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [answers, setAnswers] = useState([]);
  const [note, setNote] = useState(0);
  const [success, setSuccess] = useState(false);
  const [clientEmail, setClientEmail] = useState('');
  const [showThanks, setShowThanks] = useState(false);

  useEffect(() => {
    const fetchForm = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('forms')
        .select('*')
        .eq('public_link', public_link)
        .single();
      if (error || !data) {
        setError("Ce formulaire n'existe pas ou n'est plus disponible.");
      } else {
        setForm(data);
        setAnswers(Array(data.questions.length).fill(''));
      }
      setLoading(false);
    };
    fetchForm();
  }, [public_link]);

  const handleAnswerChange = (idx, value) => {
    const updated = [...answers];
    updated[idx] = value;
    setAnswers(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (form.questions.some((q, i) => !answers[i])) {
      setError('Merci de répondre à toutes les questions.');
      return;
    }
    // Enregistrement dans la table "reviews"
    const { error } = await supabase.from('reviews').insert([
      {
        form_id: form.id,
        client_email: clientEmail || null,
        answers: answers, // Si jamais ça échoue, essayer JSON.stringify(answers)
        note,
      }
    ]);
    if (error) setError((error.message || 'Erreur') + (error.details ? ' - ' + error.details : ''));
    else {
      setSuccess(true);
      setShowThanks(true);
    }
  };

  if (loading) return <Box textAlign="center" mt={8}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>;
  if (!form) return null;

  return (
    <>
      <Box maxWidth={480} mx="auto" mt={6} p={3} bgcolor="background.paper" borderRadius={2} boxShadow={2}>
        <Typography variant="h4" gutterBottom>{form.title}</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Votre email (facultatif)"
            value={clientEmail}
            onChange={e => setClientEmail(e.target.value)}
            fullWidth
            margin="normal"
            type="email"
          />
          {form.questions.map((q, idx) => (
            <TextField
              key={idx}
              label={q}
              value={answers[idx]}
              onChange={e => handleAnswerChange(idx, e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          ))}
          {form.note_label && (
            <Box mt={2} mb={1}>
              <Typography>{form.note_label}</Typography>
              <Rating
                value={note}
                onChange={(_, v) => setNote(v)}
                size="large"
                max={5}
              />
            </Box>
          )}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mt: 2 }}>Merci pour votre réponse !</Alert>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Envoyer</Button>
        </form>
      </Box>
      {/* Pop-up de remerciement avec liens externes */}
      {showThanks && (
        <Box position="fixed" top={0} left={0} width="100vw" height="100vh" bgcolor="rgba(0,0,0,0.4)" zIndex={9999} display="flex" alignItems="center" justifyContent="center">
          <Box bgcolor="background.paper" p={4} borderRadius={3} boxShadow={6} minWidth={320} maxWidth={400} textAlign="center">
            <Typography variant="h5" gutterBottom>Merci pour votre avis !</Typography>
            <Typography gutterBottom>Vous pouvez aussi soutenir {form.title} en laissant un avis sur les plateformes suivantes :</Typography>
            {Array.isArray(form.external_links) && form.external_links.length > 0 ? (
              <Box mt={2} mb={2}>
                {form.external_links.map((link, idx) => (
                  <Button key={idx} variant="contained" color="secondary" href={link.url} target="_blank" rel="noopener" sx={{ m: 1 }}>
                    {link.label}
                  </Button>
                ))}
              </Box>
            ) : (
              <Typography color="text.secondary">Aucune plateforme renseignée.</Typography>
            )}
            <Button variant="outlined" onClick={() => setShowThanks(false)} sx={{ mt: 2 }}>Fermer</Button>
          </Box>
        </Box>
      )}
    </>
  );
}
