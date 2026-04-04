import React from 'react'
import { Box, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined'
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined'
import ReceiptOutlinedIcon from '@mui/icons-material/ReceiptOutlined'
import { useNavigate, useLocation } from 'react-router-dom'

const navItems = [
  { label: 'Dashboard', icon: <DashboardOutlinedIcon />, path: '/dashboard' },
  { label: 'Master', icon: <ShieldOutlinedIcon />, path: '/master' },
  { label: 'Billing', icon: <ReceiptOutlinedIcon />, path: '/billing' },
]

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <Box
      sx={{
        width: '160px',
        flexShrink: 0,
        bgcolor: '#ffffff',
        borderRight: '1px solid #e0e0e0',
        pt: 2,
      }}
    >
      <List disablePadding>
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path)
          return (
            <ListItemButton
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                px: 2,
                py: 1.5,
                bgcolor: isActive ? '#f0f0f0' : 'transparent',
                '&:hover': { bgcolor: '#f5f5f5' },
              }}
            >
              <ListItemIcon sx={{ minWidth: 32, color: '#000' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
              />
            </ListItemButton>
          )
        })}
      </List>
    </Box>
  )
}

export default Sidebar
