import { useState, useEffect } from 'react';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface RSO {
  RID: number;
  name: string;
  description: string;
}

export default function RSOPage() {
  const [rsoList, setRsoList] = useState<RSO[]>([]);
  const [selectedRso, setSelectedRso] = useState<RSO | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchRSOs = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const decodedToken: any = jwt.decode(token);
      const university_id = decodedToken?.university_id;

      if (!university_id) {
        router.push('/login');
        return;
      }

      const response = await fetch(`/api/rsos?university_id=${university_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const rsoData = await response.json();
        setRsoList(rsoData);
      } else {
        console.error('Failed to fetch RSOs');
      }
    };

    fetchRSOs();
  }, [router]);

  const handleRsoClick = (rso: RSO) => {
    setSelectedRso(rso);
  };

  const closeOverlay = () => {
    setSelectedRso(null);
  };

  const joinRso = async () => {
    console.log('Join RSO', selectedRso);
    
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    const decodedToken: any = jwt.decode(token);
    const userId = decodedToken?.userId;
  
    if (!userId) {
      router.push('/login');
      return;
    }
  
    const response = await fetch('/api/add-rso-member', {
      method: 'POST',
      body: JSON.stringify({ userId, rsoId: selectedRso.RID }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      alert('You have successfully joined the RSO');
    } else {
      const error = await response.json();
      console.error('Failed to join RSO:', error.message);
      alert('Failed to join RSO');
    }
  };

  return (
    <div>
      <h1>RSOs <button><Link href ="/create-rso">Create an RSO!</Link></button></h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around' }}>
        {rsoList.map((rso) => (
          <div
            key={rso.RID}
            style={{
              width: '200px',
              height: '200px',
              border: '1px solid black',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              margin: '1rem',
            }}
            onClick={() => handleRsoClick(rso)}
          >
            <h2>{rso.name}</h2>
          </div>
        ))}
      </div>
      {selectedRso && (
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
            <h2>{selectedRso.name}</h2>
            <p>{selectedRso.description}</p>
            <button onClick={joinRso}>Join</button>
          </div>
        </div>
      )}
    </div>
  );
}
