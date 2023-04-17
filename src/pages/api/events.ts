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
    const { rsoId, name, description, eventCategoryId, eventTypeId, address, locationName, university_id } = req.body;
    const startTime = new Date(req.body.startTime).toISOString().replace('T', ' ').replace('Z', '');
    const endTime = new Date(req.body.endTime).toISOString().replace('T', ' ').replace('Z', '');


    const missingParams = [
      !rsoId && "rsoId",
      !name && "name",
      !startTime && "startTime",
      !endTime && "endTime",
      !eventCategoryId && "eventCategoryId",
      !eventTypeId && "eventTypeId",
      !address && "address",
      !locationName && "locationName",
      !university_id && "university_id",
    ].filter(Boolean);

    if (missingParams.length > 0) {
      return res.status(400).json({ message: `Missing required parameters: ${missingParams.join(", ")}` });
    }

    const connection = await pool.getConnection();
    try {
      const [result] = await connection.query(
        'INSERT INTO Events (ETID, Event_category_id, university_id, name, description, start_time, end_time, location_name, location_address) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [eventTypeId, eventCategoryId, university_id, name, description, startTime, endTime, locationName, address]
      );

      const eventId = result.insertId;
      res.status(200).json({ message: 'success', eventId });


     // Add RSO event association
     await connection.query(
        'INSERT INTO RSO_events (RID, EID, isPrivate) VALUES (?, ?, ?)',
        [rsoId, eventId, eventTypeId === 2 ? 1 : 0]
      );
      
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