import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5001/api',
})

export const getCustomers = () => API.get('/customers')
export const createCustomer = (data) => API.post('/customers', data)
export const getItems = () => API.get('/items')
export const createItem = (data) => API.post('/items', data)
export const getInvoices = () => API.get('/invoices')
export const getInvoiceById = (id) => API.get(`/invoices/${id}`)
export const createInvoice = (data) => API.post('/invoices', data)
