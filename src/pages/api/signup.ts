// /pages/api/signup.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root',
  password: 'password',
  database: 'eventwebsite',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password, university_id } = req.body;

    const connection = await pool.getConnection();
    try {
      // Insert the new user into the 'users' table
      const [result] = await connection.query(
        'INSERT INTO users (name, email, password, university_id) VALUES (?, ?, ?, ?)',
        [name, email, password, university_id]
      );

      res.status(201).json({ message: 'User created successfully', userId: result.insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      connection.release();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
