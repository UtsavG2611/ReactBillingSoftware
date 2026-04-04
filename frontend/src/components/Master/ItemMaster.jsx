import React, { useEffect, useState } from 'react'
import { Box, Typography, Card, CardContent, Chip, Button, Dialog } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { getItems } from '../../services/api'
import AddItem from './AddItem.jsx'

function ItemMaster() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)

  const fetchItems = async () => {
    const res = await getItems()
    setItems(res.data)
  }

  useEffect(() => { fetchItems() }, [])

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6" fontWeight={700} letterSpacing={1}>ITEMS</Typography>
        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpen(true)}
          sx={{ bgcolor: '#1e1e4b', color: '#fff', borderRadius: 2, px: 2, '&:hover': { bgcolor: '#2d2d6b' } }}
        >
          ADD
        </Button>
      </Box>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {items.map((item) => (
          <Card key={item.item_code}
            sx={{ width: 180, border: '1px solid #e0e0e0', borderRadius: 2, boxShadow: '1px 1px 6px rgba(0,0,0,0.07)' }}>
            <CardContent sx={{ pb: '12px !important' }}>
              <Typography fontWeight={600} fontSize={14} mb={1}>{item.item_name}</Typography>
              <Chip
                label={item.is_active === 'Y' ? 'Active' : 'In-Active'}
                size="small"
                sx={{
                  bgcolor: item.is_active === 'Y' ? '#e8f5e9' : '#fce4ec',
                  color: item.is_active === 'Y' ? '#2e7d32' : '#c62828',
                  fontWeight: 600, fontSize: 11,
                }}
              />
            </CardContent>
          </Card>
        ))}
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <AddItem onClose={() => { setOpen(false); fetchItems() }} />
      </Dialog>
    </Box>
  )
}

export default ItemMaster
