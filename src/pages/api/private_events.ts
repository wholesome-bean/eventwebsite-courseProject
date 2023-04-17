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
    const { eventId /* Add other attributes for private events */ } = req.body;

    if (!eventId /* || !otherAttributes */) {
      return res.status(400).json({ message: 'Missing eventId or other required parameters' });
    }

    const connection = await pool.getConnection();
    try {
      await connection.query('INSERT INTO Private_Events (EID /*, otherAttributes */) VALUES (? /*, otherValues */) ', [eventId /*, otherValues */]);

      res.status(200).json({ message: 'Private event successfully created' });
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
