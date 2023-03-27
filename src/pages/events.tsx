// /pages/events.tsx
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';

interface Event {
  id: number;
  name: string;
  description: string;
  date: string;
  location: string;
  ETID: number;
}

interface EventType {
  id: number;
  type: string;
}

const eventTypes: EventType[] = [
  { id: 1, type: 'RSO' },
  { id: 2, type: 'Private' },
  { id: 3, type: 'Public' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<{ [key: number]: boolean }>({ 1: false, 2: false, 3: false });
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      // Decode the token to get the user's university_id
      const decodedToken: any = jwt.decode(token);
      const university_id = decodedToken?.university_id;

      if (!university_id) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/events?university_id=${university_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const eventsData = await response.json();
        setEvents(eventsData);
      } else {
        console.error('Failed to fetch events');
      }
    };

    fetchEvents();
  }, [router]);

  useEffect(() => {
    const updatedFilteredEvents = events.filter((event) => filters[event.ETID]);
    setFilteredEvents(updatedFilteredEvents);
  }, [events, filters]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeOverlay = () => {
    setSelectedEvent(null);
  };

  const joinEvent = () => {
    console.log('Join event', selectedEvent);
    // Add your code to handle joining the event here
  };

  const toggleFilter = (id: number) => {
    setFilters({ ...filters, [id]: !filters[id] });
  };

  return (
    <div>
      <h1>Events</h1>
      <div>
        {eventTypes.map(({ id, type }) => (
          <label key={id}>
            <input
              type="checkbox"
              checked={filters[id]}
              onChange={() => toggleFilter(id)}
            />
            {type}
          </label>
        ))}
      </div>
      <div>
        {filteredEvents.map((event) => (
          <button
            key={event.id}
            style={{
              display: 'block',
              marginBottom: '1rem',
              cursor: 'pointer',
              width: '100%',
              height: '60px',
            }}
            onClick={() => handleEventClick(event)}
          >
            {event.name}
          </button>
        ))}
      </div>
      {selectedEvent && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={closeOverlay}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '2rem',
              maxWidth: '80%',
              maxHeight: '80%',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedEvent.name}</h2>
            <p>{selectedEvent.description}</p>
            <p>{selectedEvent.location}</p>
            <p>{new Date(selectedEvent.date).toLocaleString()}</p>
            <button onClick={joinEvent}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
}