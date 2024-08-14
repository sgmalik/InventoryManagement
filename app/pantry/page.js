'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Box, Button, Typography, Stack, TextField, Modal, Checkbox, FormControlLabel, Card, CardContent, CircularProgress } from '@mui/material';
import NavBar from '@/components/NavBar'; // Import the NavBar component

export default function Pantry() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState('');
  const [responseModalOpen, setResponseModalOpen] = useState(false);

  const updateInventory = async () => {
    try {
      const snapshot = await getDocs(query(collection(firestore, 'inventory')));
      const inventoryList = snapshot.docs.map((doc) => ({
        name: doc.id,
        ...doc.data(),
      }));
      setInventory(inventoryList);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleResponseModalClose = () => {
    setResponseModalOpen(false);
  };

  useEffect(() => {
    updateInventory(); // Fetch the inventory on component mount
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSelect = (name) => {
    setSelectedItems((prevSelected) =>
      prevSelected.includes(name)
        ? prevSelected.filter((item) => item !== name)
        : [...prevSelected, name]
    );
  };

  const handleGenerateRecipes = async () => {
    if (!selectedItems.length) return;
    setLoading(true);
    setAiResponse('');
    setResponseModalOpen(true);

    try {
      const response = await fetch('/api/generateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: selectedItems }),
      });

      const data = await response.json();
      setAiResponse(data.recipe || 'No recipe generated.');
    } catch (error) {
      setAiResponse('Failed to generate a recipe.');
    } finally {
      setLoading(false);
    }
  };

  // Filter the pantry items based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <NavBar />
      <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2} pt={4}>
        {/* Search Field */}
        <TextField label="Search Items" variant="outlined" value={searchQuery} onChange={handleSearch} sx={{ marginBottom: '20px' }} />

        {/* Add Item Modal */}
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
            sx={{ transform: 'translate(-50%, -50%)' }}
          >
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                label="Item Name"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
              />
              <Button
                variant="outlined"
                onClick={() => {
                  addItem(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add
              </Button>
            </Stack>
          </Box>
        </Modal>

        {/* Buttons to Add and Generate Recipe */}
        <Button variant="contained" onClick={handleOpen}>
          Add New Item
        </Button>
        <Button variant="contained" onClick={handleGenerateRecipes} disabled={!selectedItems.length || loading}>
          {loading ? <CircularProgress size={24} /> : 'Generate Recipes'}
        </Button>

        {/* Pantry Items */}
        <Box border="1px solid #333" width="800px" mt={2}>
          <Box width="100%" bgcolor="#ADD8E6" p={2} display="flex" justifyContent="center">
            <Typography variant="h4" color="#333">
              Pantry Items
            </Typography>
          </Box>
          {filteredInventory.length > 0 ? (
            <Stack spacing={2} p={2} maxHeight="500px" overflow="auto">
              {filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  padding={2}
                  bgcolor="#f0f0f0"
                >
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
          ) : (
            <Typography variant="body1" align="center" p={2}>
              No items found.
            </Typography>
          )}
        </Box>

        {/* AI Response Modal */}
        <Modal open={responseModalOpen} onClose={handleResponseModalClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            width={500}
            maxHeight="80vh"  // Limit the height to ensure scrollability
            bgcolor="white"
            border="2px solid"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={2}
            sx={{ transform: 'translate(-50%, -50%)', overflowY: 'auto' }}  // Make the modal scrollable
          >
            <Typography variant="h5" textAlign="center">
              AI Generated Recipe
            </Typography>
            {loading ? (
              <Box display="flex" justifyContent="center">
                <CircularProgress />
              </Box>
            ) : (
              <Card variant="outlined" sx={{ bgcolor: '#f9f9f9', maxHeight: '60vh', overflowY: 'auto' }}>
                <CardContent>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
                    {aiResponse}
                  </Typography>
                </CardContent>
              </Card>
            )}
            <Button onClick={handleResponseModalClose} variant="contained">
              Close
            </Button>
          </Box>
        </Modal>
      </Box>
    </>
  );
}
