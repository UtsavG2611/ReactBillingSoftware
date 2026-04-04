const pool = require('../db');

const generateInvoiceId = () => {
  const digits = Math.floor(100000 + Math.random() * 900000);
  return 'INVC' + digits;
};

const getInvoices = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT i.invoice_id, c.cust_name, i.grand_total, i.created_at,
        STRING_AGG(it.item_name, ', ') AS item_names
      FROM invoices i
      JOIN customers c ON i.cust_id = c.cust_id
      JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
      JOIN items it ON ii.item_code = it.item_code
      GROUP BY i.invoice_id, c.cust_name, i.grand_total, i.created_at
      ORDER BY i.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getInvoiceById = async (req, res) => {
  const { invoice_id } = req.params;
  try {
    const invoiceResult = await pool.query(`
      SELECT i.*, c.cust_name, c.cust_address, c.cust_pan, c.cust_gst
      FROM invoices i
      JOIN customers c ON i.cust_id = c.cust_id
      WHERE i.invoice_id = $1
    `, [invoice_id]);

    if (invoiceResult.rows.length === 0)
      return res.status(404).json({ error: 'Invoice not found' });

    const itemsResult = await pool.query(`
      SELECT ii.quantity, ii.unit_price, ii.subtotal, it.item_name
      FROM invoice_items ii
      JOIN items it ON ii.item_code = it.item_code
      WHERE ii.invoice_id = $1
    `, [invoice_id]);

    res.json({ ...invoiceResult.rows[0], items: itemsResult.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createInvoice = async (req, res) => {
  const { cust_id, items } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check if customer is GST registered (has GST number)
    const custResult = await client.query('SELECT * FROM customers WHERE cust_id = $1', [cust_id]);
    const customer = custResult.rows[0];
    const isGstRegistered = customer.cust_gst && customer.cust_gst.trim() !== '';

    // Calculate totals
    let total_amount = 0;
    for (const item of items) {
      total_amount += item.unit_price * item.quantity;
    }

    const gst_applied = !isGstRegistered;
    const gst_amount = gst_applied ? parseFloat((total_amount * 0.18).toFixed(2)) : 0;
    const grand_total = parseFloat((total_amount + gst_amount).toFixed(2));

    // Generate unique invoice ID
    let invoice_id;
    let isUnique = false;
    while (!isUnique) {
      invoice_id = generateInvoiceId();
      const check = await client.query('SELECT invoice_id FROM invoices WHERE invoice_id = $1', [invoice_id]);
      if (check.rows.length === 0) isUnique = true;
    }

    // Insert invoice
    await client.query(
      'INSERT INTO invoices (invoice_id, cust_id, gst_applied, gst_amount, total_amount, grand_total) VALUES ($1,$2,$3,$4,$5,$6)',
      [invoice_id, cust_id, gst_applied, gst_amount, total_amount, grand_total]
    );

    // Insert invoice items
    for (const item of items) {
      const subtotal = item.unit_price * item.quantity;
      await client.query(
        'INSERT INTO invoice_items (invoice_id, item_code, quantity, unit_price, subtotal) VALUES ($1,$2,$3,$4,$5)',
        [invoice_id, item.item_code, item.quantity, item.unit_price, subtotal]
      );
    }

    await client.query('COMMIT');
    res.status(201).json({ invoice_id, grand_total, gst_amount, gst_applied });
  } catch (err) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  } finally {
    client.release();
  }
};

module.exports = { getInvoices, getInvoiceById, createInvoice };