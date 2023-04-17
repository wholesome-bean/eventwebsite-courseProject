// /pages/create-public-event.tsx
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { useUserContext } from '../context/UserContext';

interface EventCategory {
  id: number;
  name: string;
}

const CreatePublicEventPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [location, setLocation] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const router = useRouter();
  const { user } = useUserContext(); 
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [selectedEventCategoryId, setSelectedEventCategoryId] = useState<number | null>(null);
  

  useEffect(() => {
    const fetchEventCategories = async () => {
    const response = await fetch('/api/event_categories');
    if (response.ok) {
      const data = await response.json();
      setEventCategories(data);
    } else {
      console.error('Failed to fetch event categories');
    }
    };
    fetchEventCategories();
    }, []);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
      
        try {
          const response = await fetch('/api/create-public-event', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name,
                description,
                locationName,
                location,
                startTime,
                endTime,
                eventCategoryId: selectedEventCategoryId,
                university_id: user.university_id,
                user_id: user.id,
              }),
            });
            
            if (response.ok) {
              const result = await response.json();
              console.log('Event created successfully:', result.eventId);
              router.push('/events');
            } else {
              const result = await response.json();
              console.error('Error creating event:', result.message);
            }
        } catch (error) {
            console.error('Error creating event:', error);
            }
            };

  return (
    <div>
      <h1>Create a Public Event</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Description:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </label>
        <label>
          Location Name:
          <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
        </label>
        <label>
          Location:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} />
        </label>
        <label>
          Event Category:
          <select
            value={selectedEventCategoryId || ''}
            onChange={(e) => setSelectedEventCategoryId(Number(e.target.value))}
            required
          >
            <option value="" disabled>
              Select an event category
            </option>
            {eventCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Start Time:
          <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        </label>
        <label>
          End Time:
          <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
        </label>
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreatePublicEventPage;
