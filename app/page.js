'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';

export default function HomePage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    // If the user is authenticated, redirect to the Pantry page
    if (!loading && user) {
      router.push('/pantry');
    }
  }, [user, loading, router]);

  if (loading) {
    // Display a loading state while we determine auth status
    return <p>Loading...</p>;
  }

  if (user) {
    // If user is authenticated, redirect to the pantry. This code is safe since
    // useEffect will handle the redirection, so we don't render any login form here.
    return null;
  }

  // If the user is not authenticated, render the login page
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
        onClick={signInWithGoogle}
        sx={{ mt: 2 }}
      >
        Login with Google
      </Button>
    </Box>
  );
}
