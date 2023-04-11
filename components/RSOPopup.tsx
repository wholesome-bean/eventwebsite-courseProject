// components/RSOPopup.tsx
import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#__next');

const RSOPopup = ({
  isOpen,
  onRequestClose,
  rso,
  onApprove,
  onReject,
}) => {
  const handleApprove = () => {
    onApprove(rso);
  };

  const handleReject = () => {
    onReject(rso);
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>{rso.name}</h2>
      <p>{rso.description}</p>
      <button onClick={handleApprove}>Approve</button>
      <button onClick={handleReject}>Reject</button>
    </Modal>
  );
};

export default RSOPopup;
