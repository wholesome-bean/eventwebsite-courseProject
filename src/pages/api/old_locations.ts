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
    const { name, address } = req.body;

    if (!name || !address) {
      return res.status(400).json({ message: 'Missing name or address parameter' });
    }

    const connection = await pool.getConnection();
    try {
      const result = await connection.query('INSERT INTO Locations (name, address) VALUES (?, ?)', [name, address]);

      res.status(200).json({ message: 'Location successfully created', id: result.insertId });
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
