// pages/api/event_types.ts
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
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  try {
    const connection = await pool.getConnection();
    const [eventTypes] = await connection.query('SELECT * FROM EventType');
    connection.release();

    res.status(200).json(eventTypes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching event types' });
  }
}
