// pages/api/getRsos.ts
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

function verifyToken(token: string): { userId: number; university_id: number } | null {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return { userId: decoded.userId, university_id: decoded.university_id };
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { university_id } = decodedToken;

    const connection = await pool.getConnection();
    try {
      const [rsos] = await connection.query(
        'SELECT * FROM rsos WHERE university_id = ?',
        [university_id]
      );

      res.status(200).json(rsos);
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
