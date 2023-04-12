// pages/supAdDashboard.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../styles/Home.module.css';
import jwt from 'jsonwebtoken';
import RSOPopup from 'components/RSOPopup';

export default function SupAdDashboard() {
  const [rsos, setRsos] = useState([]);

  useEffect(() => {
    async function fetchRsos() {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/getRsos', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setRsos(data);
      } else {
        console.error('Failed to fetch RSOs');
      }
    }

    

    fetchRsos();
  }, []);

  const activeRsos = rsos.filter((rso) => rso.Status === 1);
  const pendingRsos = rsos.filter((rso) => rso.Status === 0);

  const [selectedRso, setSelectedRso] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);

  const handleRSOButtonClick = (rso) => {
    setSelectedRso(rso);
    setPopupOpen(true);
  };

  const handlePopupClose = () => {
    setPopupOpen(false);
  };

  const handleApprove = async (rso) => {
    const response = await fetch('/api/approveRso', {
      method: 'PUT',
      body: JSON.stringify({ RID: rso.RID }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (response.ok) {
      // Update the local state
      setRsos(
        rsos.map((item) =>
          item.RID === rso.RID ? { ...item, Status: 1 } : item
        )
      );
      setPopupOpen(false);
    } else {
      alert('Failed to approve RSO');
    }
  };
  
  const handleReject = async (rso) => {
    const response = await fetch('/api/rejectRso', {
      method: 'DELETE',
      body: JSON.stringify({ RID: rso.RID }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (response.ok) {
      // Update the local state
      setRsos(rsos.filter((item) => item.RID !== rso.RID));
      setPopupOpen(false);
    } else {
      alert('Failed to reject RSO');
    }
  };
  

  return (
    <div>
      <h1 className={styles.title}>Welcome Super Admin!</h1>
      <h2>Active RSOs</h2>
      <ul>
        {activeRsos.map((rso) => (
          <li key={rso.RID}>{rso.RID}>{rso.name}</li>
          ))}
        </ul>
        <h2>RSOs Needing Approval</h2>
      <ul>
        {pendingRsos.map((rso) => (
          <li key={rso.RID}>
            <button onClick={() => handleRSOButtonClick(rso)}>{rso.name}</button>
          </li>
        ))}
      </ul>
      {selectedRso && (
        <RSOPopup
          isOpen={popupOpen}
          onRequestClose={handlePopupClose}
          rso={selectedRso}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}