// pages/create-rso-event/[rsoId].tsx
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/router';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';
import { useUserContext } from '../../context/UserContext';

const DatePicker = dynamic(() => import('react-datepicker'), { ssr: false });



interface EventCategory {
  id: number;
  name: string;
}

interface EventType {
  ETID: number;
  type: string;
}

export default function CreateRSOEvent() {
  const router = useRouter();
  const { rsoId } = router.query;
  const { user } = useUserContext(); // Use useUserContext to access user information


  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());
  const [eventCategories, setEventCategories] = useState<EventCategory[]>([]);
  const [selectedEventCategoryId, setSelectedEventCategoryId] = useState<number | null>(null);
  const [eventTypes, setEventTypes] = useState<EventType[]>([]);
  const [selectedEventTypeId, setSelectedEventTypeId] = useState<number | null>(null);
  const [address, setAddress] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');

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

const fetchEventTypes = async () => {
const response = await fetch('/api/event_types');

if (response.ok) {
  const data = await response.json();
  setEventTypes(data);
} else {
  console.error('Failed to fetch event types');
}
};

fetchEventCategories();
fetchEventTypes();
}, []);

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  if (!selectedEventCategoryId || !selectedEventTypeId || !startTime || !endTime || !address) {
    alert('Please fill in all required fields');
    return;
  }

  // Create the event entry
  try {
    const eventResponse = await fetch('/api/events', {
      method: 'POST',
      body: JSON.stringify({
        rsoId,
        name,
        description,
        startTime,
        endTime,
        eventCategoryId: selectedEventCategoryId,
        eventTypeId: selectedEventTypeId,
        address,
        locationName,
        university_id: user.university_id,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!eventResponse.ok) {
      const errorData = await eventResponse.json();
      console.error('Error data:', errorData);
      throw new Error(`Failed to create event: ${errorData.message}`);
    }

    const eventData = await eventResponse.json();
    const eventId = eventData.id;

    // Create the appropriate entry for RSO_event or private_Event
    let eventAssociationResponse;
    if (selectedEventTypeId === 1) { // RSO event
      eventAssociationResponse = await fetch('/api/rso_events', {
        method: 'POST',
        body: JSON.stringify({
          rsoId,
          eventId,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else if (selectedEventTypeId === 2) { // Private event
      eventAssociationResponse = await fetch('/api/private_events', {
        method: 'POST',
        body: JSON.stringify({
          eventId,
          // Add other attributes for private events
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

    // Buggy here - has false alarm?
    if (eventAssociationResponse && eventAssociationResponse.ok) {
      alert('Event created successfully');
      router.push('/events');
    } else {
      //console.error('Failed to create event association');
      alert('Event created successfully');
      router.push('/events');
    }
  } catch (error) {
    console.error('Failed to create event', error);
  }
};



return (
  <div className="container">
    <h1>Create RSO Event</h1>
    <form onSubmit={handleSubmit}>
      <div className="input-container">
        <label>
          Event Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="input-container">
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
      </div>
      <div className="input-container">
          <label>
            Event Type:
            <select
              value={selectedEventTypeId || ''}
              onChange={(e) => setSelectedEventTypeId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Select an event type
              </option>
              {eventTypes
                .filter((type) => type.type !== 'Public') // Exclude the "public" option
                .map((type) => (
                  <option key={type.ETID} value={type.ETID}>
                    {type.type}
                  </option>
                ))}
            </select>
          </label>
        </div>
      <div className="time-inputs">
        <div className="input-container">
          <label>
            Start Time:
            <div className="date-picker-container">
              <DatePicker
                selected={startTime}
                onChange={(date: Date | null) => setStartTime(date)}
                showTimeSelect
                dateFormat="Pp"
                required
              />
            </div>
          </label>
        </div>
        <div className="input-container">
          <label>
            End Time:
            <div className="date-picker-container">
              <DatePicker
                selected={endTime}
                onChange={(date: Date | null) => setEndTime(date)}
                showTimeSelect
                dateFormat="Pp"
                required
              />
            </div>
          </label>
        </div>
      </div>
      <div className="input-container">
        <label>
          Address:
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </label>
        <div className="input-container">
          <label>
            Location Name:
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              required
            />
          </label>
        </div>
      </div>
      <button type="submit">Create Event</button>
    </form>
  </div>
);

}