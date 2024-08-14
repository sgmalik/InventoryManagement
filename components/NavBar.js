'use client';

import { AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';
import { signOutUser } from '@/firebase'; // Ensure you import the signOutUser function

export default function NavBar() {
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
    </>
  );
}
