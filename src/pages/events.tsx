// /pages/events.tsx
import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCallback } from 'react';

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
  const [userRsoEvents, setUserRsoEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [filters, setFilters] = useState<{ [key: number]: boolean }>({ 1: true, 2: true, 3: true });
  const [comments, setComments] = useState([]);
  const [ratings, setRatings] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('token');
      
    
      if (!token) {
        router.push('/login');
        return;
      }
    
      // Decode the token to get the user's university_id and userId
      const decodedToken: any = jwt.decode(token);
      const university_id = decodedToken?.university_id;
      const userId = decodedToken?.userId;
    
      if (!university_id || !userId) {
        router.push('/login');
        return;
      }
    
      // Fetch events from the API and include the selected filters
const response = await fetch(
  `/api/getEvents?university_id=${university_id}&user_id=${userId}&filters=${JSON.stringify(
    Object.keys(filters).filter((key) => filters[parseInt(key, 10)])
  )}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);
    
if (response.ok) {
  const { events: eventsData, userRsoEvents: userRsoEventsData } = await response.json();
  setEvents(Array.isArray(eventsData) ? eventsData : []);
  setUserRsoEvents(Array.isArray(userRsoEventsData) ? userRsoEventsData : []);
} else {
  console.error('Failed to fetch events');
}
};

fetchEvents();
}, [filters]);

  useEffect(() => {
  if (Array.isArray(events)) {
    const updatedFilteredEvents = events.filter((event) => {
      if (filters[event.ETID]) {
        if (event.ETID === 1) {
          return userRsoEvents.some((rsoEvent) => rsoEvent.id === event.id);
        }
        return true;
      }
      return false;
    });
    
    setFilteredEvents(updatedFilteredEvents);
  }
}, [events, filters, userRsoEvents]);

const handleEventClick = useCallback(async (event: Event) => {
  console.log('Clicked event:', event);
  setSelectedEvent(event);
  setSelectedEventId(event.id);

  // Fetch comments and ratings for the selected event
  const token = localStorage.getItem('token');
const response = await fetch(`/api/getEventCommentsAndRatings?event_id=${event.id}`, {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

  if (response.ok) {
    const { comments: fetchedComments, ratings: fetchedRatings } = await response.json();
    setComments(fetchedComments);
    setRatings(fetchedRatings);
  } else {
    console.error('Failed to fetch comments and ratings');
  }
}, []);

const handleSubmitComment = async (e) => {
  e.preventDefault();
  const commentText = e.target.commentText.value;
  const rating = e.target.rating.value;

  const token = localStorage.getItem('token');
  const decodedToken: any = jwt.decode(token);


  const userId = decodedToken?.userId;

  //console.log(selectedEvent?.id);

  if (!userId) {
    router.push('/login');
    return;
  }

   // Check if selectedEvent is set and has an id
   if (!selectedEvent || !selectedEventId) {
    console.error('Selected event is not set or has no id');
    return;
  }

const response = await fetch('/api/submitEventCommentAndRating', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    event_id: selectedEventId,
    user_id: decodedToken.userId,
    comment_text: commentText,
    rating: rating,
  }),
});

if (response.ok) {
  const newComment = {
    CID: Math.random(),
    EID: selectedEvent.id,
    UID: decodedToken.userId,
    Comment_text: commentText,
    comment_time: new Date(),
  };

  const newRating = {
    RID: Math.random(),
    EID: selectedEvent.id,
    UID: decodedToken.userId,
    rating: rating,
  };

  setComments([...comments, newComment]);
  setRatings([...ratings, newRating]);
} else {
  console.error('Failed to submit comment and rating');
}


  // Clear the input fields
  e.target.commentText.value = '';
  e.target.rating.value = '';
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
      <h1>Events <button><Link href ="/create-public-event">Create an Event!</Link></button></h1>
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
            <p>{selectedEvent.location_name}</p>
            <p>{selectedEvent.location_address}</p>
            <h3>Comments</h3>
        {comments.map((comment) => (
          <div key={comment.CID}>
            <p>{comment.Comment_text}</p>
            {/* Add more comment details if needed */}
          </div>
        ))}
        <h3>Ratings</h3>
        {ratings.map((rating) => (
          <div key={rating.RID}>
            <p>{rating.rating}</p>
            {/* Add more rating details if needed */}
          </div>
        ))}
        <form onSubmit={handleSubmitComment}>
          <label>
            Comment:
            <input type="text" name="commentText" />
          </label>
          <label>
            Rating:
            <input type="number" name="rating" min="1" max="5" />
          </label>
          <button type="submit">Submit</button>
        </form>
          </div>
        </div>
      )}
    </div>
  );
}