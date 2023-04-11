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
    // Send approve request to your API
    // Update the local state
  };

  const handleReject = async (rso) => {
    // Send reject request to your API
    // Update the local state
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