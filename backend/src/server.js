const express = require('express');
const cors = require('cors');
require('dotenv').config();

const customerRoutes = require('./routes/customers');
const itemRoutes = require('./routes/items');
const invoiceRoutes = require('./routes/invoices');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/invoices', invoiceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});