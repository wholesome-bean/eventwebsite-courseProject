// pages/api/approveRso.ts
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
  if (req.method !== 'PUT') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // Extract the RID from the request body
  const { RID } = req.body;

  try {
    // Approve RSO using your database (set Status to 1)
    const connection = await pool.getConnection();
    const query = 'UPDATE RSOs SET Status = 1 WHERE RID = ?';
    await connection.execute(query, [RID]);
    connection.release();

    res.status(200).json({ message: 'RSO approved successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to approve RSO' });
  }
}