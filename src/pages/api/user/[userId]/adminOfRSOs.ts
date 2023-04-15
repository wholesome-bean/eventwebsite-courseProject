import type { NextApiRequest, NextApiResponse } from 'next';
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
  const {
    query: { userId },
  } = req;

  if (req.method === 'GET') {
    try {
      const connection = await pool.getConnection();
      const query = `
        SELECT RSOs.*
        FROM Admins
        JOIN RSOs ON Admins.ID = RSOs.AID
        WHERE Admins.UID = ?
      `;
      const [results] = await connection.execute(query, [userId]);
      connection.release();

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch RSOs user is an admin of' });
      console.error(error);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
