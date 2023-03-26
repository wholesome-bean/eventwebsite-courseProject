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
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM super_admins WHERE id = ?', [userId]);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'User not found' });
      }

      const user = rows[0];
      res.status(200).json(user);
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
