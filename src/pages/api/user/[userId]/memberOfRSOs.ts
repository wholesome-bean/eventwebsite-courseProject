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
        FROM RSO_Members
        JOIN RSOs ON RSO_Members.RID = RSOs.RID
        WHERE RSO_Members.UID = ?
      `;
      const [results] = await connection.execute(query, [userId]);
      connection.release();

      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch RSOs user is a member of' });
      console.error(error);
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
