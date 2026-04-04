const pool = require('../db');

const getCustomers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM customers ORDER BY cust_id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createCustomer = async (req, res) => {
  const { cust_name, cust_address, cust_pan, cust_gst, is_active } = req.body;
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM customers');
    const count = parseInt(countResult.rows[0].count) + 1;
    const cust_id = 'C' + String(count).padStart(5, '0');

    const result = await pool.query(
      'INSERT INTO customers (cust_id, cust_name, cust_address, cust_pan, cust_gst, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [cust_id, cust_name, cust_address, cust_pan, cust_gst, is_active || 'Y']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCustomers, createCustomer };