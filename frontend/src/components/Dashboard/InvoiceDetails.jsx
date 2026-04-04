import React, { useEffect, useState } from 'react'
import { Box, Typography, Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getInvoiceById } from '../../services/api'

function InvoiceDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [invoice, setInvoice] = useState(null)

  useEffect(() => {
    getInvoiceById(id).then(r => setInvoice(r.data))
  }, [id])

  if (!invoice) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Invoice Details</Typography>
      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography fontWeight={600}>Customer Details</Typography>
          <Typography fontWeight={700} fontSize={13}>Invoice ID: {invoice.invoice_id}</Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          <Typography fontSize={13} mb={0.5}><b>Name</b> : {invoice.cust_name}</Typography>
          <Typography fontSize={13} mb={0.5}><b>Address</b> : {invoice.cust_address}</Typography>
          <Typography fontSize={13} mb={0.5}><b>Pan Card</b> : {invoice.cust_pan}</Typography>
          <Typography fontSize={13} mb={0.5}><b>GST Num</b> : {invoice.cust_gst}</Typography>
        </Box>
        <Typography fontWeight={600} mb={1}>Items</Typography>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell align="center"><b>Amount</b></TableCell>
              <TableCell align="right"><b>Amount</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoice.items?.map((item, idx) => (
              <TableRow key={idx}>
                <TableCell>{item.item_name}</TableCell>
                <TableCell align="center">{item.quantity}</TableCell>
                <TableCell align="right">{Number(item.subtotal).toLocaleString()}</TableCell>
              </TableRow>
            ))}
            {invoice.gst_applied && (
              <TableRow>
                <TableCell colSpan={2}><b>GST (18%)</b></TableCell>
                <TableCell align="right">{Number(invoice.gst_amount).toLocaleString()}</TableCell>
              </TableRow>
            )}
            <TableRow>
              <TableCell colSpan={2}><b>Total</b></TableCell>
              <TableCell align="right"><b>{Number(invoice.grand_total).toLocaleString()}</b></TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Box sx={{ mt: 3 }}>
          <Button onClick={() => navigate('/dashboard')}
            sx={{ border: '1px solid #1e1e4b', color: '#1e1e4b', px: 3, borderRadius: 1 }}>
            ← Back
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default InvoiceDetails
