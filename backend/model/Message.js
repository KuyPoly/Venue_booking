// models/Message.js
const db = require('../config/db');

exports.getAll = async () => {
  const [rows] = await db.promise().query('SELECT * FROM messages');
  return rows;
};

exports.create = async (data) => {
  const [result] = await db.promise().query('INSERT INTO messages SET ?', data);
  return { id: result.insertId, ...data };
};
