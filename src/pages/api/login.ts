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
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate the email and password against the database

    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

      if (rows.length === 0) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const user = rows[0];

      if (user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // If the email and password are valid, create a JWT for the user
      const token = jwt.sign({ userId: user.id, university_id: user.university_id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Add the user ID to the response
      res.status(200).json({ token, userId: user.id });
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
