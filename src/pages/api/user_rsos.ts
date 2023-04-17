// pages/api/user_rsos.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { query } from '../../lib/db';

export default async function userRsos(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = req.query;

  if (req.method === 'GET') {
    try {
      const results = await query(
        `SELECT r.* FROM RSOs r
        JOIN Admins a ON r.AID = a.ID
        WHERE a.UID = ?`,
        [userId]
      );

      return res.json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching RSOs for user' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
