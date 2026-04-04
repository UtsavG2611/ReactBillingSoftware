import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@mui/material'
import Sidebar from './components/Layout/Sidebar.jsx'
import Header from './components/Layout/Header.jsx'
import DashboardHome from './components/Dashboard/DashboardHome.jsx'
import InvoiceDetails from './components/Dashboard/InvoiceDetails.jsx'
import MasterHome from './components/Master/MasterHome.jsx'
import CustomerMaster from './components/Master/CustomerMaster.jsx'
import ItemMaster from './components/Master/ItemMaster.jsx'
import BillingHome from './components/Billing/BillingHome.jsx'

function App() {
  return (
    <BrowserRouter>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh', bgcolor: '#1a1a2e' }}>
        <Header />
        <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          <Sidebar />
          <Box sx={{ flex: 1, bgcolor: '#ffffff', overflow: 'auto' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/dashboard/invoice/:id" element={<InvoiceDetails />} />
              <Route path="/master" element={<MasterHome />} />
              <Route path="/master/customers" element={<CustomerMaster />} />
              <Route path="/master/items" element={<ItemMaster />} />
              <Route path="/billing" element={<BillingHome />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </BrowserRouter>
  )
}

export default App
