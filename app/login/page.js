'use client';

import { signInWithGoogle } from '@/firebase';
import { Button, Box, Typography } from '@mui/material';

export default function Login() {
  return (
    <Box 
      width="100vw" 
      height="100vh" 
      display="flex" 
      flexDirection="column" 
      justifyContent="center" 
      alignItems="center"
    >
      <Typography variant="h4" mb={2}>Login to Your Pantry Tracker</Typography>
      <Button variant="contained" onClick={signInWithGoogle}>Login with Google</Button>
    </Box>
  );
}
