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

    const { university_id, userId } = decodedToken;
    const filters = JSON.parse(req.query.filters as string);

    const connection = await pool.getConnection();
    try {
      const [rsoRows] = await connection.query(
        'SELECT RID FROM RSO_Members WHERE UID = ?',
        [userId]
      );

      const rsoIds = rsoRows.map((row: any) => row.RID);

      const rsoCondition = rsoIds.length > 0 ? `OR (RSO_Events.RID IN (?) AND RSO_Events.isPrivate = FALSE)` : '';
      const query = `
  SELECT Events.*, RSO_Events.RID, RSO_Events.isPrivate, Public_Events.status, Events.location_name, Events.location_address
  FROM Events
  LEFT JOIN RSO_Events ON Events.EID = RSO_Events.EID
  LEFT JOIN Public_Events ON Events.EID = Public_Events.EID
  WHERE Events.university_id = ?
    AND (Events.ETID IN (?) ${rsoCondition})
    AND (Public_Events.status = 1 OR Public_Events.status IS NULL)
`;

      const [events] = rsoIds.length > 0
        ? await connection.query(query, [university_id, filters, rsoIds])
        : await connection.query(query, [university_id, filters]);

      // Add a new query to fetch RSO events associated with the user's id
      const [userRsoEventsRows] = await connection.query(
        `SELECT Events.*
        FROM RSO_Members
        JOIN RSO_Events ON RSO_Members.RID = RSO_Events.RID
        JOIN Events ON RSO_Events.EID = Events.EID
        WHERE RSO_Members.UID = ? AND Events.ETID = 1`,
        [userId]
      );

      const userRsoEvents = Array.isArray(userRsoEventsRows) ? userRsoEventsRows : [];

      res.status(200).json({ events, userRsoEvents });
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
