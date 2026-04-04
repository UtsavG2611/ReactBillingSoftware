const express = require('express');
const router = express.Router();
const { getInvoices, getInvoiceById, createInvoice } = require('../controllers/invoiceController');

router.get('/', getInvoices);
router.get('/:invoice_id', getInvoiceById);
router.post('/', createInvoice);

module.exports = router;