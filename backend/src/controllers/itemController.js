const pool = require('../db');

const getItems = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM items ORDER BY item_code');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createItem = async (req, res) => {
  const { item_name, selling_price, is_active } = req.body;
  try {
    const countResult = await pool.query('SELECT COUNT(*) FROM items');
    const count = parseInt(countResult.rows[0].count) + 1;
    const item_code = 'IT' + String(count).padStart(5, '0');

    const result = await pool.query(
      'INSERT INTO items (item_code, item_name, selling_price, is_active) VALUES ($1,$2,$3,$4) RETURNING *',
      [item_code, item_name, selling_price, is_active || 'Y']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getItems, createItem };