// pages/create-event.tsx
import { useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(
  () => import('./CreateEventMap'),
  { ssr: false }
);

const CreateEventPage = () => {
  const [position, setPosition] = useState<[number, number]>([51.505, -0.09]);

  return (
    <DynamicMap position={position} setPosition={setPosition} />
  );
};

export default CreateEventPage;
