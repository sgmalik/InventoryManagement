import { AppBar, Toolbar, Typography, Button, CssBaseline } from '@mui/material';
import { signOutUser } from '@/firebase';
import { useRouter } from 'next/navigation';

export default function NavBar() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOutUser();
      router.push('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Pantry Tracker
          </Typography>
          <Button color="inherit" href="/pantry">Pantry</Button>
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Toolbar>
      </AppBar>
    </>
  );
}
