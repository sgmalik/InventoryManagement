'use client';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, signInWithGoogle, signOutUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AppBar, Toolbar, Button, Typography, CssBaseline, Box } from '@mui/material';
import Login from '@/app/login/page';

export default function AuthenticatedLayout({ children }) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pantry Tracker
          </Typography>
          <Button color="inherit" href="/pantry">Pantry</Button>
          <Button color="inherit" href="/recipes">Recipes</Button>
          <Button color="inherit" onClick={signOutUser}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Box sx={{ paddingTop: '64px' }}>
        {children}
      </Box>
    </>
  );
}
