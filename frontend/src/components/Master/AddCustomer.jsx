import React, { useState } from 'react'
import { Box, Typography, TextField, Button, MenuItem, Select, FormControl } from '@mui/material'
import { createCustomer } from '../../services/api'

function AddCustomer({ onClose }) {
  const [form, setForm] = useState({
    cust_name: '', cust_address: '', cust_pan: '', cust_gst: '', is_active: 'Y'
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async () => {
    if (!form.cust_name || !form.cust_pan || !form.cust_gst) return
    await createCustomer(form)
    onClose()
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Add New Customer</Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer Name</Typography>
          <TextField name="cust_name" size="small" fullWidth onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
        </Box>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer Address</Typography>
          <TextField name="cust_address" size="small" fullWidth onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
        </Box>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer Pan Card Number</Typography>
          <TextField name="cust_pan" size="small" fullWidth onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
        </Box>
        <Box>
          <Typography fontSize={12} mb={0.5}>Customer GST Number</Typography>
          <TextField name="cust_gst" size="small" fullWidth onChange={handleChange} sx={{ bgcolor: '#f5f5f5' }} />
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

export default AddCustomer
