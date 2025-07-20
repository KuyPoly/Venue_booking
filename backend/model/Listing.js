// models/Listing.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.promise().query('SELECT * FROM listings');
  return rows;
};

exports.getById = async (id) => {
  const [rows] = await db.promise().query('SELECT * FROM listings WHERE id = ?', [id]);
  return rows[0];
};

exports.create = async (data) => {
  const [result] = await db.promise().query('INSERT INTO listings SET ?', data);
  return { id: result.insertId, ...data };
};

exports.update = async (id, data) => {
  const [result] = await db.promise().query('UPDATE listings SET ? WHERE id = ?', [data, id]);
  return result.affectedRows > 0;
};

exports.remove = async (id) => {
  const [result] = await db.promise().query('DELETE FROM listings WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
