import React, { useState, useEffect } from 'react'
import {
  Box, Typography, Button, Dialog, DialogContent,
  Table, TableBody, TableCell, TableHead, TableRow,
  Card, CardContent, Chip, IconButton
} from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { getCustomers, getItems, createInvoice } from '../../services/api'

function BillingHome() {
  const [customer, setCustomer] = useState(null)
  const [selectedItems, setSelectedItems] = useState([])
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [customers, setCustomers] = useState([])
  const [items, setItems] = useState([])
  const [generatedInvoice, setGeneratedInvoice] = useState(null)

  useEffect(() => {
    getCustomers().then(r => setCustomers(r.data))
    getItems().then(r => setItems(r.data))
  }, [])

  const handleSelectCustomer = (c) => {
    setCustomer(c)
    setCustomerModalOpen(false)
  }

  const handleAddItem = (item) => {
    const exists = selectedItems.find(i => i.item_code === item.item_code)
    if (exists) {
      setSelectedItems(selectedItems.map(i =>
        i.item_code === item.item_code ? { ...i, quantity: i.quantity + 1 } : i
      ))
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }])
    }
  }

  const handleQtyChange = (item_code, delta) => {
    setSelectedItems(prev =>
      prev.map(i => i.item_code === item_code
        ? { ...i, quantity: Math.max(1, i.quantity + delta) }
        : i
      )
    )
  }

  const isGstRegistered = customer?.cust_gst && customer.cust_gst.trim() !== ''
  const subtotal = selectedItems.reduce((sum, i) => sum + i.selling_price * i.quantity, 0)
  const gstAmount = isGstRegistered ? 0 : subtotal * 0.18
  const grandTotal = subtotal + gstAmount

  const handleCreate = async () => {
    if (!customer || selectedItems.length === 0) return
    const payload = {
      cust_id: customer.cust_id,
      items: selectedItems.map(i => ({
        item_code: i.item_code,
        quantity: i.quantity,
        unit_price: i.selling_price,
      }))
    }
    const res = await createInvoice(payload)
    setGeneratedInvoice({ ...res.data, customer, items: selectedItems })
  }

  const handleCancel = () => {
    setCustomer(null)
    setSelectedItems([])
    setGeneratedInvoice(null)
  }

  if (generatedInvoice) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" fontWeight={700} mb={3}>Billing</Typography>
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 2, p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <Typography fontWeight={600}>Customer Details</Typography>
            <Typography fontWeight={600} fontSize={13}>Invoice ID: {generatedInvoice.invoice_id}</Typography>
          </Box>
          <Box sx={{ mb: 3 }}>
            <Typography fontSize={13}><b>Name</b> : {generatedInvoice.customer.cust_name}</Typography>
            <Typography fontSize={13}><b>Address</b> : {generatedInvoice.customer.cust_address}</Typography>
            <Typography fontSize={13}><b>Pan Card</b> : {generatedInvoice.customer.cust_pan}</Typography>
            <Typography fontSize={13}><b>GST Num</b> : {generatedInvoice.customer.cust_gst}</Typography>
          </Box>
          <Typography fontWeight={600} mb={1}>Items</Typography>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                <TableCell><b>Name</b></TableCell>
                <TableCell align="center"><b>Qty</b></TableCell>
                <TableCell align="right"><b>Amount</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {generatedInvoice.items.map((item) => (
                <TableRow key={item.item_code}>
                  <TableCell>{item.item_name}</TableCell>
                  <TableCell align="center">{item.quantity}</TableCell>
                  <TableCell align="right">{(item.selling_price * item.quantity).toLocaleString()}</TableCell>
                </TableRow>
              ))}
              {generatedInvoice.gst_applied && (
                <TableRow>
                  <TableCell colSpan={2}><b>GST (18%)</b></TableCell>
                  <TableCell align="right">{Number(generatedInvoice.gst_amount).toLocaleString()}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell colSpan={2}><b>Total</b></TableCell>
                <TableCell align="right"><b>{Number(generatedInvoice.grand_total).toLocaleString()}</b></TableCell>
              </TableRow>
            </TableBody>
          </Table>
          <Box sx={{ mt: 3 }}>
            <Button onClick={handleCancel}
              sx={{ bgcolor: '#1e1e4b', color: '#fff', px: 3, '&:hover': { bgcolor: '#2d2d6b' } }}>
              New Bill
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h6" fontWeight={700} mb={3}>Billing</Typography>

      <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 2 }}>
        <Box sx={{ bgcolor: '#f9f9f9', px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
          <Typography fontWeight={600} fontSize={14}>Customer Details</Typography>
        </Box>
        <Box sx={{ p: 2, minHeight: 100 }}>
          {customer ? (
            <Box>
              <Typography fontSize={13}><b>Name</b> : {customer.cust_name}</Typography>
              <Typography fontSize={13}><b>Address</b> : {customer.cust_address}</Typography>
              <Typography fontSize={13}><b>Pan Card</b> : {customer.cust_pan}</Typography>
              <Typography fontSize={13}><b>GST Num</b> : {customer.cust_gst}</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 80 }}>
              <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setCustomerModalOpen(true)}
                sx={{ bgcolor: '#1e1e4b', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#2d2d6b' } }}>
                ADD
              </Button>
            </Box>
          )}
        </Box>
      </Box>

      {customer && (
        <Box sx={{ border: '1px solid #e0e0e0', borderRadius: 1, mb: 3 }}>
          <Box sx={{ bgcolor: '#f9f9f9', px: 2, py: 1.5, borderBottom: '1px solid #e0e0e0' }}>
            <Typography fontWeight={600} fontSize={14}>Items</Typography>
          </Box>
          <Box sx={{ p: 2 }}>
            {selectedItems.length > 0 && (
              <Table size="small" sx={{ mb: 2 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                    <TableCell><b>Name</b></TableCell>
                    <TableCell align="center"><b>Qty</b></TableCell>
                    <TableCell align="right"><b>Amount</b></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.item_code}>
                      <TableCell>{item.item_name}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          <IconButton size="small" onClick={() => handleQtyChange(item.item_code, -1)}>
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography fontSize={13}>{item.quantity}</Typography>
                          <IconButton size="small" onClick={() => handleQtyChange(item.item_code, 1)}>
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{(item.selling_price * item.quantity).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {!isGstRegistered && (
                    <TableRow>
                      <TableCell colSpan={2} sx={{ color: '#888', fontSize: 12 }}>GST (18%)</TableCell>
                      <TableCell align="right" sx={{ fontSize: 12 }}>{gstAmount.toLocaleString()}</TableCell>
                    </TableRow>
                  )}
                  <TableRow>
                    <TableCell colSpan={2}><b>Total</b></TableCell>
                    <TableCell align="right"><b>{grandTotal.toLocaleString()}</b></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <Button startIcon={<AddCircleOutlineIcon />} onClick={() => setItemModalOpen(true)}
                sx={{ bgcolor: '#1e1e4b', color: '#fff', borderRadius: 2, px: 3, '&:hover': { bgcolor: '#2d2d6b' } }}>
                ADD
              </Button>
            </Box>
          </Box>
        </Box>
      )}

      {customer && selectedItems.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button onClick={handleCancel}
            sx={{ border: '1px solid #e57373', color: '#e57373', px: 3, borderRadius: 1 }}>
            Cancel
          </Button>
          <Button onClick={handleCreate}
            sx={{ bgcolor: '#1e1e4b', color: '#fff', px: 3, borderRadius: 1, '&:hover': { bgcolor: '#2d2d6b' } }}>
            Create
          </Button>
        </Box>
      )}

      <Dialog open={customerModalOpen} onClose={() => setCustomerModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Select Customer</Typography>
            <Button onClick={() => setCustomerModalOpen(false)}
              sx={{ border: '1px solid #e57373', color: '#e57373', borderRadius: 1, px: 2 }}>
              Cancel
            </Button>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {customers.map((c) => (
              <Card key={c.cust_id}
                onClick={() => c.is_active === 'Y' && handleSelectCustomer(c)}
                sx={{
                  width: 160, cursor: c.is_active === 'Y' ? 'pointer' : 'not-allowed',
                  border: '1px solid #e0e0e0', borderRadius: 2, opacity: c.is_active === 'Y' ? 1 : 0.5,
                  '&:hover': c.is_active === 'Y' ? { boxShadow: '2px 4px 12px rgba(0,0,0,0.15)' } : {}
                }}>
                <CardContent sx={{ pb: '12px !important' }}>
                  <Typography fontWeight={600} fontSize={13} mb={1}>{c.cust_name}</Typography>
                  <Chip label={c.is_active === 'Y' ? 'Active' : 'In-Active'} size="small"
                    sx={{ bgcolor: c.is_active === 'Y' ? '#e8f5e9' : '#fce4ec',
                      color: c.is_active === 'Y' ? '#2e7d32' : '#c62828', fontWeight: 600, fontSize: 11 }} />
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      <Dialog open={itemModalOpen} onClose={() => setItemModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight={700}>Select Items</Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {items.map((item) => {
              const selected = selectedItems.find(i => i.item_code === item.item_code)
              return (
                <Card key={item.item_code}
                  sx={{ width: 160, border: '1px solid #e0e0e0', borderRadius: 2, opacity: item.is_active === 'Y' ? 1 : 0.5 }}>
                  <CardContent sx={{ pb: '12px !important' }}>
                    <Typography fontWeight={600} fontSize={13} mb={1}>{item.item_name}</Typography>
                    {item.is_active === 'N' ? (
                      <Chip label="In-Active" size="small"
                        sx={{ bgcolor: '#fce4ec', color: '#c62828', fontWeight: 600, fontSize: 11 }} />
                    ) : selected ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <IconButton size="small" onClick={() => handleQtyChange(item.item_code, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography fontSize={13}>{selected.quantity}</Typography>
                        <IconButton size="small" onClick={() => handleQtyChange(item.item_code, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ) : (
                      <Button size="small" onClick={() => handleAddItem(item)}
                        sx={{ bgcolor: '#1e1e4b', color: '#fff', fontSize: 11, px: 1.5, minWidth: 0, '&:hover': { bgcolor: '#2d2d6b' } }}>
                        ADD
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
            <Button onClick={() => setItemModalOpen(false)}
              sx={{ border: '1px solid #e57373', color: '#e57373', borderRadius: 1, px: 3 }}>Cancel</Button>
            <Button onClick={() => setItemModalOpen(false)}
              sx={{ bgcolor: '#1e1e4b', color: '#fff', px: 3, borderRadius: 1, '&:hover': { bgcolor: '#2d2d6b' } }}>ADD</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export default BillingHome
