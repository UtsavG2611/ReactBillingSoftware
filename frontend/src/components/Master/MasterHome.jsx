import React from 'react'
import { Box, Typography, Card, CardContent } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function MasterHome() {
  const navigate = useNavigate()
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" fontWeight={700} mb={3}>Master</Typography>
      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card
          onClick={() => navigate('/master/customers')}
          sx={{
            width: 220, cursor: 'pointer', border: '1px solid #e0e0e0',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.08)', borderRadius: 2,
            '&:hover': { boxShadow: '2px 4px 12px rgba(0,0,0,0.15)' },
          }}
        >
          <CardContent>
            <Typography fontWeight={700} fontSize={16} mb={1}>Customer</Typography>
            <Typography fontSize={13} color="text.secondary">Read or Create customer data</Typography>
          </CardContent>
        </Card>
        <Card
          onClick={() => navigate('/master/items')}
          sx={{
            width: 220, cursor: 'pointer', border: '1px solid #e0e0e0',
            boxShadow: '2px 2px 8px rgba(0,0,0,0.08)', borderRadius: 2,
            '&:hover': { boxShadow: '2px 4px 12px rgba(0,0,0,0.15)' },
          }}
        >
          <CardContent>
            <Typography fontWeight={700} fontSize={16} mb={1}>Items</Typography>
            <Typography fontSize={13} color="text.secondary">Read or Create items data</Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default MasterHome
