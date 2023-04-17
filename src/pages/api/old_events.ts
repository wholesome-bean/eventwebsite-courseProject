// pages/api/events.ts
import type { NextApiRequest, NextApiResponse } from 'next';
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
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { rsoId, name, description, startTime, endTime, eventCategoryId, eventTypeId, universityId, address } = req.body;

  try {
    const connection = await pool.getConnection();

    // Insert location entry into the Locations table
    const locationQuery = 'INSERT INTO Locations (name, address) VALUES (?, ?)';
    const [locationResult] = await connection.query(locationQuery, [name, address]);

    // Create a new entry in the Events table
    const eventQuery = 'INSERT INTO Events (LID, ETID, Event_category_id, university_id, name, description, start_time, end_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const [eventResult] = await connection.query(eventQuery, [locationResult.insertId, eventTypeId, eventCategoryId, universityId, name, description, new Date(startTime), new Date(endTime)]);

    // Create a new entry in the RSO_Events table
    const rsoEventQuery = 'INSERT INTO RSO_Events (RID, EID) VALUES (?, ?)';
    await connection.query(rsoEventQuery, [rsoId, eventResult.insertId]);

    connection.release();

    res.status(201).json({ message: 'Event created successfully', eventId: eventResult.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error creating event' });
  }
}
