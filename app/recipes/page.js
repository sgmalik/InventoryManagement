'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';

export default function Recipes() {
  const [recipe, setRecipe] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchRecipe = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const items = queryParams.get('items').split(',');

      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        body: JSON.stringify({ items }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      setRecipe(data.recipe);
    };

    fetchRecipe();
  }, []);

  return (
    <>
      <NavBar />
      <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" p={4}>
        <Typography variant="h4" mb={2}>Generated Recipe</Typography>
        <Typography variant="body1">{recipe}</Typography>
      </Box>
    </>
  );
}
