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

export default async function submitEventCommentAndRating(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { event_id, user_id, comment_text, rating } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.query(
        `INSERT INTO Event_Comments (EID, UID, Comment_text, comment_time) VALUES (?, ?, ?, NOW())`,
        [event_id, user_id, comment_text]
      );

      await connection.query(
        `INSERT INTO Event_Ratings (EID, UID, rating) VALUES (?, ?, ?)`,
        [event_id, user_id, rating]
      );

      res.status(200).json({ message: 'Comment and rating submitted' });
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

