'use client';

import { useState, useEffect } from 'react';
import { firestore } from '@/firebase';
import { collection, query, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';
import { Box, Button, Typography, Stack, TextField, Modal, Checkbox, FormControlLabel } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function Pantry() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

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
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
        });
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

  useEffect(() => {
    updateInventory();
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

  const handleGenerateRecipes = () => {
    router.push(`/recipes?items=${selectedItems.join(',')}`);
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box width="100vw" height="100vh" display="flex" flexDirection="column" alignItems="center" gap={2}>
      <TextField label="Search Items" variant="outlined" value={searchQuery} onChange={handleSearch} />
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
      <Button variant="contained" onClick={handleOpen}>
        Add New Item
      </Button>
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
  );
}
