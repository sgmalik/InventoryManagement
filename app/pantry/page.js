'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Box, Button, Typography, Stack, TextField, Modal, Checkbox, FormControlLabel, CircularProgress, Card, CardContent } from '@mui/material';
import NavBar from '@/components/NavBar';

export default function Pantry() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [recipe, setRecipe] = useState(null); // Recipe state
  const [loadingRecipe, setLoadingRecipe] = useState(false); // Loading state for recipe

  // Fetch and update inventory from Firebase
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  // Handle searching of pantry items
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle selection of items
  const handleSelect = (name) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((item) => item !== name)
        : [...prevSelected, name]
    );
  };

  // Generate recipe by sending selected items to the OpenAI API route
  const handleGenerateRecipes = async () => {
    setLoadingRecipe(true);
    setOpen(true); // Open the modal

    try {
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await response.json();
      setRecipe(data.recipe);
    } catch (error) {
      console.error('Error generating recipe:', error);
      setRecipe('Failed to generate recipe. Please try again.');
    }

    setLoadingRecipe(false);
  };

  // Close the modal and reset state
  const handleClose = () => {
    setOpen(false);
    setRecipe(null);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2}>
        <TextField label="Search Items" variant="outlined" value={searchQuery} onChange={handleSearch} />
        
        {/* Modal for displaying recipe */}
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            border="2px solid"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          >
            {loadingRecipe ? (
              <CircularProgress />
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6">Generated Recipe</Typography>
                  <Typography variant="body1">
                    {recipe || 'No recipe available.'}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Modal>

        <Button variant="contained" onClick={handleGenerateRecipes} disabled={!selectedItems.length}>
          Generate Recipes
        </Button>
        
        <Box border="1px solid #333" width="800px" mt={2}>
          <Box width="100%" bgcolor="#ADD8E6" p={2} display="flex" justifyContent="center">
            <Typography variant="h4" color="#333">
              Pantry Items
            </Typography>
          </Box>
          <Stack spacing={2} p={2} maxHeight="500px" overflow="auto">
            {filteredInventory.map(({ name, quantity }) => (
              <Box key={name} display="flex" alignItems="center" justifyContent="space-between" padding={2} bgcolor="#f0f0f0">
                <FormControlLabel
                  control={
                    <Checkbox checked={selectedItems.includes(name)} onChange={() => handleSelect(name)} />
                  }
                  label={`${name.charAt(0).toUpperCase() + name.slice(1)} (${quantity})`}
                />
                <Stack direction="row" spacing={2}>
                  <Button variant="contained" onClick={() => addItem(name)}>
                    Add
                  </Button>
                  <Button variant="contained" onClick={() => removeItem(name)}>
                    Remove
                  </Button>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Box>
    </>
  );
}
