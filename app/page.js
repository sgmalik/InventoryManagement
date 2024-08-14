'use client';

import { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography } from '@mui/material';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);  // Get the user state from Firebase
  const router = useRouter();

  useEffect(() => {
    // If loading is done and the user is logged in, redirect to the pantry
    if (!loading && user) {
      router.push('/pantry');
    }
  }, [user, loading, router]);

  // If the page is still loading, display a loading indicator
  if (loading) {
    return <p>Loading...</p>;
  }

  // If the user is not authenticated, show the login page
  if (!user) {
    return (
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Typography variant="h4">Login to Your Pantry Tracker</Typography>
        <Button
          variant="contained"
          onClick={signInWithGoogle}  // Trigger Google sign-in on click
          sx={{ mt: 2 }}
        >
          Login with Google
        </Button>
      </Box>
    );
  }

  // No need to render anything if we have the user, as redirection is handled by useEffect
  return null;
}
