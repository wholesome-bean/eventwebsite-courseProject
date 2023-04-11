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
  if (req.method === 'POST') {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decodedToken = verifyToken(token);

    if (!decodedToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { userId, university_id } = decodedToken;
    const { name, description, memberEmails } = req.body;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Check if the current user is already an admin
      const [admin] = await connection.query('SELECT ID FROM admins WHERE UID = ?', [userId]);
      
      let adminId;
      if (admin.length === 0) {
        // If not, insert the current user into the admins table
        const [adminResult] = await connection.query('INSERT INTO admins (UID) VALUES (?)', [userId]);
        adminId = adminResult.insertId;
      } else {
        adminId = admin[0].AID;
      }

      // Insert the new RSO into the rsos table using the current user's admin id
      const [rsoResult] = await connection.query(
        'INSERT INTO rsos (RID, name, description, university_id, Status, AID) VALUES (NULL, ?, ?, ?, ?, ?)',
        [name, description, university_id, false, adminId]
      );
      
      const rsoId = rsoResult.insertId;

      const [userIds] = await connection.query(
        'SELECT id FROM users WHERE email IN (?, ?, ?, ?)',
        memberEmails
      );
    
      if (userIds.length !== 4) {
        throw new Error('One or more of the provided emails does not exist');
      }
    
      const allMemberIds = [userId, ...userIds.map((user) => user.id)];
      await Promise.all(
        allMemberIds.map((userId) =>
          connection.query('INSERT INTO rso_members (RID, UID) VALUES (?, ?)', [rsoId, userId])
        )
      );
    
      await connection.commit();
    
      res.status(201).json({ message: 'RSO application submitted successfully', rsoId });
    } catch (err) {
      await connection.rollback();
    
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      connection.release();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
