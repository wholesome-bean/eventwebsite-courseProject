// components/RSOItem.tsx
import { RSO } from '/pages/profile';
import { useState } from 'react';
import { useRouter } from 'next/router';

interface RSOItemProps {
    rso: RSO;
    isAdmin: boolean;
    activePopup: number | null;
    setActivePopup: (id: number | null) => void;
  }

  const RSOItem: React.FC<RSOItemProps> = ({ rso, isAdmin, activePopup, setActivePopup }) => {
    const showPopup = activePopup === rso.RID;
    const router = useRouter();
  
    const handleClick = () => {
      if (activePopup === null) {
        setActivePopup(rso.RID);
      } else if (activePopup === rso.RID) {
        setActivePopup(null);
      }
    };

  const handleCreateEvent = () => {
    // Replace this with the route to your create event page for RSOs
    router.push(`/create-rso-event/${rso.RID}`);
  };

  return (
    <>
      <li
        className="rso-item"
        onClick={handleClick}
        style={{
          cursor: 'pointer',
          opacity: showPopup || activePopup === null ? 1 : 0.5,
        }}
      >
        {rso.name}
      </li>
      {showPopup && (
        <div className="rso-popup">
          <h3>{rso.name}</h3>
          <p>{rso.description}</p>
          <p>Status: {rso.Status ? 'Active' : 'Inactive'}</p>
          {isAdmin && <button onClick={handleCreateEvent}>Create RSO Event</button>}
          <button onClick={handleClick}>Close</button>
        </div>
      )}
      <style jsx>{`
        .rso-item {
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 10px;
          min-height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .rso-popup {
          background-color: white;
          border: 1px solid #ccc;
          padding: 20px;
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 1000;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          border-radius: 5px;
          max-width: 400px;
        }
      `}</style>
    </>
  );
};

export default RSOItem;
