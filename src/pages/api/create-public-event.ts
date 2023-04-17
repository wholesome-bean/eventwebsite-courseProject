// /pages/api/create-public-event.ts
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
    const { name, description, locationName, location, startTime, endTime, eventCategoryId, university_id, user_id } = req.body;

    const missingParams = [
      !name && "name",
      !description && "description",
      !locationName && "locationName",
      !location && "location",
      !startTime && "startTime",
      !endTime && "endTime",
      !eventCategoryId && "eventCategoryId",
      !university_id && "university_id",
      !user_id && "user_id",
    ].filter(Boolean);

    if (missingParams.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missingParams.join(", ")}` });
    }

    const connection = await pool.getConnection();
    try {
      // Insert event into Events table
      const [result] = await connection.query(
        'INSERT INTO Events (ETID, Event_category_id, university_id, name, description, start_time, end_time, location_name, location_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [3, eventCategoryId, university_id, name, description, startTime, endTime, locationName, location]
      );
      const eventId = result.insertId;

      // Retrieve SAID using the university_id
const [superAdminRows] = await connection.query(
    'SELECT id FROM super_admins WHERE university_id = ?',
    [university_id]
  );
  
  console.log('superAdminRows:', superAdminRows);
  
  if (superAdminRows.length === 0) {
    throw new Error('No super admin found for the university');
  }
  
  const SAID = superAdminRows[0].id;
  console.log('SAID:', SAID);
  
  // Insert the public event into Public_Events table
  await connection.query(
    'INSERT INTO Public_Events (UID, SAID, EID) VALUES (?, ?, ?)',
    [user_id, SAID, eventId]
  );

      res.status(200).json({ message: 'success', eventId });

    } catch (error) {
      console.error('Error creating event', error);
      res.status(500).json({ message: 'Failed to create event', error });
    } finally {
      connection.release();
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}
