// pages/api/remove-rso-member.ts
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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'DELETE') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // Extract userId and rsoId from the request body
  const { userId, rsoId } = req.body;

  try {
    // Remove user from the RSO in your database (delete entry in RSO_Members table)
    const connection = await pool.getConnection();
    const query = 'DELETE FROM RSO_Members WHERE RID = ? AND UID = ?';
    await connection.execute(query, [rsoId, userId]);
    connection.release();

    res.status(200).json({ message: 'User successfully left the RSO' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to leave RSO' });
  }
}
