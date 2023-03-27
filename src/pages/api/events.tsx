// /pages/api/events.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { createPool } from 'mysql2/promise';
import jwt from 'jsonwebtoken';

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
    const token = req.headers.authorization?.split(' ')[1];
    const university_id = req.query.university_id;

    if (!token) {
      return res.status(401).json({ message: 'Authentication token missing' });
    }

    if (!university_id) {
      return res.status(400).json({ message: 'University ID missing' });
    }

    try {
      const decodedToken: any = jwt.verify(token, process.env.JWT_SECRET);

      if (!decodedToken || !decodedToken.userId) {
        return res.status(401).json({ message: 'Invalid authentication token' });
      }

      const connection = await pool.getConnection();
      try {
        const [user] = await connection.query('SELECT * FROM users WHERE id = ?', [decodedToken.userId]);
        if (!user || user.length === 0) {
          return res.status(404).json({ message: 'User not found' });
        }

        const [events] = await connection.query('SELECT * FROM events WHERE university_id = ?', [university_id]);
        res.status(200).json(events);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Invalid authentication token' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
