// /pages/api/add-rso-member.ts
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
    const { userId, rsoId } = req.body;

    if (!userId || !rsoId) {
      return res.status(400).json({ message: 'Missing userId or rsoId parameter' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query('INSERT INTO RSO_Members (RID, UID) VALUES (?, ?)', [rsoId, userId]);

      res.status(200).json({ message: 'User successfully added to RSO' });
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
