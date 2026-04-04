import React, { useState } from 'react'
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl } from '@mui/material'
import { createItem } from '../../services/api'

function AddItem({ onClose }) {
  const [form, setForm] = useState({ item_name: '', selling_price: '', is_active: 'Y' })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.item_name || !form.selling_price) return
    await createItem(form)
    onClose()
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Add New Item</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography fontSize={12} mb={0.5}>Item Name</Typography>
          <TextField name="item_name" size="small" fullWidth onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
        </Box>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer Selling Price</Typography>
          <TextField name="selling_price" size="small" fullWidth type="number"
            onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
        </Box>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer Status</Typography>
          <FormControl size="small" fullWidth>
            <Select name="is_active" value={form.is_active} onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }}>
              <MenuItem value="Y">Active</MenuItem>
              <MenuItem value="N">In-Active</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, mt: 4 }}>
        <Button onClick={onClose}
          sx={{ border: '1px solid #e57373', color: '#e57373', borderRadius: 1, px: 3 }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}
          sx={{ bgcolor: '#1e1e4b', color: '#fff', borderRadius: 1, px: 3, '&:hover': { bgcolor: '#2d2d6b' } }}>
          Create
        </Button>
      </Box>
    </Box>
  )
}

export default AddItem
