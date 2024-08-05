'use client'
import Image from "next/image";
import {useState, useEffect} from 'react'
import { firestore } from "@/firebase";
import{ Box, Modal, Typography,Stack, TextField,Button, IconButton } from '@mui/material'
import AddIcon from "@mui/icons-material/Add"
import RemoveIcon from "@mui/icons-material/Remove"
import { collection,getDocs, query, doc, getDoc,setDoc,deleteDoc, where} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openSearchModal, setOpenSearchModal] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  const updateInventory = async () => {
    const snapshot = query(collection(firestore,'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc)=>{
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
    setFilteredInventory(inventoryList)
  }

  const addItem = async (item)=>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      await setDoc(docRef,{quantity: quantity + 1})
      }
    else{
      await setDoc(docRef, {quantity: 1 })
      }
    await updateInventory()
  }

  const removeItem = async (item)=>{
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)

    if(docSnap.exists()){
      const {quantity} = docSnap.data()
      if (quantity === 1){
        await deleteDoc(docRef)
      }
      else{
        await setDoc(docRef,{quantity:quantity - 1})
      }
    }
    await updateInventory()
 }

 const searchItem = async()=>{
    if (!searchTerm.trim()){
      updateInventory()
      return
    }

    const lowerCasedSearchTerm = searchTerm.trim().toLowerCase()
    const inventoryRef = collection(firestore, 'inventory')
    const inventorySnap = await getDocs(inventoryRef)

    const searchResults = []
    inventorySnap.forEach((doc)=>{
      const data = doc.data()
      const lowerCasedName = doc.id.toLowerCase()

      if (lowerCasedName.includes(lowerCasedSearchTerm)){
        searchResults.push({
          name: doc.id,
          ...data
        })
      }
    })
    setFilteredInventory(searchResults)
 }

 const resetSearch = () =>{
    setSearchTerm('')
    setFilteredInventory(inventory)
 }

  useEffect(()=>{
    updateInventory()
  },[])

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenSearchModal = () => setOpenSearchModal(true);
  const handleCloseSearchModal = () => setOpenSearchModal(false);

  return( <Box width="100vw" height="100vh" display="flex" justifyContent="center" 
  alignItems="center" gap={2} flexDirection="column" sx={{
    backgroundColor: '#FAF0E6', // Light linen color or any suitable background color
    padding: 4,
  }}>
   <Stack direction="row" spacing={2} >
    <Modal open={openAddModal} onClose={handleCloseAddModal} > 
      <Box position="absolute" top="50%" left="50%" sx={{transform:"translate(-50%,-50%)"}}
       width={400} bgcolor="white" border="2px solid #000"
      boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} >
        <Stack width="100%" direction="row" spacing={2}>
          <TextField variant='outlined' fullWidth value={itemName} onChange={(e)=>{setItemName(e.target.value)}}
          placeholder="Add Item"
          />
          <Button variant="outlined" onClick={()=>{ 
            addItem(itemName)
            setItemName('')
            handleCloseAddModal()
          }}>
            Add
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="outlined" onClick={()=>{
      handleOpenAddModal()
    }} sx={{color: "#333" , border: "2px solid #333"}} >
      Add New item
    </Button>

    <Modal open={openSearchModal} onClose={handleCloseSearchModal}> 
      <Box position="absolute" top="50%" left="50%" sx={{transform:"translate(-50%,-50%)"}}
       width={400} bgcolor="white" border="2px solid #000"
       boxShadow={24} p={4} display="flex" flexDirection="column" gap={3} >
        <Stack width="100%" direction="row" spacing={2}>
          <TextField variant='outlined' fullWidth value={searchTerm} onChange={(e)=>{setSearchTerm(e.target.value)}}
          placeholder="Search Item"
          />
          <Button variant="outlined" onClick={()=>{ 
            searchItem(searchTerm)
            handleCloseSearchModal()
          }}>
            Search
          </Button>
        </Stack>
      </Box>
    </Modal>
    <Button variant="outlined" onClick={()=>{
      searchItem()
      handleOpenSearchModal()
    }} sx={{color: "#333" , border: "2px solid #333"}} >
      Search Item
    </Button>
   </Stack>
  
    <Box border='1px solid #333' width="800px" sx={{
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#DEB887', // Wood-like background
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        }}>
      <Box width="800px" height="100px"  bgcolor="#C19A6B" display="flex" alignItems="center" justifyContent="center"
      sx={{ borderRadius: '16px', overflow: 'hidden' }}>
        <Typography fontFamily={'Monserrat , sans-serif'} variant="h2" color="#333">
          Inventory Items
        </Typography>
      </Box>
    <Stack width="800px" height="300px" spacing={2} overflow="auto">
      {
        filteredInventory.map(({name, quantity})=>(
          <Box key={name} 
          width="100%" 
          minHeight="80px"
          display="flex"
          alignItems="center" 
          justifyContent="space-between" 
          bgcolor="#FFE4C4"
          sx={{
            borderRadius: '8px', // Rounded edges for shelf items
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', 
          }}// Shadow for depth 
          padding={5}
          >
            <Typography fontFamily={'Quicksand, sans-serif'} variant="h4" color="#333" textAlign="center">
            {name.charAt(0).toUpperCase() + name.slice(1)}
            </Typography>
            <Typography fontFamily={'Quicksand, sans-serif'} variant="h4" color="#333" textAlign="center">
            {quantity}
            </Typography>
            <Stack direction="row" spacing={2}>
            <IconButton onClick={()=>{
              removeItem(name)
            }} sx={{color: "#333"}}>
              <RemoveIcon />
            </IconButton>
            <IconButton onClick={()=>{
              addItem(name)
            }} sx={{color: "#333"}}>
              <AddIcon />
            </IconButton>
           </Stack>
          </Box>
      ))}
    </Stack>
   </Box>
   <Box width="800px" display="flex" justifyContent="flex-end" mt={2}>
        <Button variant="outlined" onClick={resetSearch} sx={{color: "#333" , border: "1px solid #333"}} >
          Back
        </Button>
    </Box>
  </Box>
  )
}
