import React, { useEffect, useState } from 'react'
import { Box, Typography, TextField, Table, TableBody, TableCell, TableHead, TableRow, Button, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { getInvoices, getInvoiceById } from '../../services/api'
import { useNavigate } from 'react-router-dom'

function DashboardHome() {
  const [invoices, setInvoices] = useState([])
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => { getInvoices().then(r => setInvoices(r.data)) }, [])

  const handleSearch = async (e) => {
    const val = e.target.value
    setSearch(val)
    if (val.trim() === '') {
      getInvoices().then(r => setInvoices(r.data))
    } else if (val.length >= 10) {
      try {
        const res = await getInvoiceById(val.trim())
        setInvoices([{ invoice_id: res.data.invoice_id, cust_name: res.data.cust_name, item_names: res.data.items?.map(i => i.item_name).join(', '), grand_total: res.data.grand_total }])
      } catch {
        setInvoices([])
      }
    }
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Dashboard</Typography>
      <TextField
        placeholder="Search by Invoice ID"
        size="small"
        value={search}
        onChange={handleSearch}
        sx={{ mb: 3, width: 300, bgcolor: '#f5f5f5' }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
        }}
      />
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: '#1e1e4b' }}>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Invoice ID</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Customer name</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Item name (s)</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
            <TableCell sx={{ color: '#fff', fontWeight: 700 }}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow key={inv.invoice_id} sx={{ '&:hover': { bgcolor: '#f9f9f9' } }}>
              <TableCell><b>{inv.invoice_id}</b></TableCell>
              <TableCell>{inv.cust_name}</TableCell>
              <TableCell>{inv.item_names}</TableCell>
              <TableCell>{Number(inv.grand_total).toLocaleString()}</TableCell>
              <TableCell>
                <Button onClick={() => navigate(`/dashboard/invoice/${inv.invoice_id}`)}
                  sx={{ bgcolor: '#1e1e4b', color: '#fff', px: 2, py: 0.5, fontSize: 12, '&:hover': { bgcolor: '#2d2d6b' } }}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {invoices.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} align="center" sx={{ color: '#888', py: 4 }}>No invoices found</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>
  )
}

export default DashboardHome
