// /pages/api/rsos.ts
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
  if (req.method === 'GET') {
    const { university_id } = req.query;

    if (!university_id) {
      return res.status(400).json({ message: 'Missing university_id parameter' });
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM RSOs WHERE university_id = ?', [university_id]);

      res.status(200).json(rows);
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
