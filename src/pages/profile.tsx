import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import RSOItem from '/components/RSOItem';

// Define the User and RSO interfaces
interface User {
  id: number;
  email: string;
  name: string;
}

interface RSO {
  RID: number;
  name: string;
  description: string;
  Status: boolean;
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [memberOfRSOs, setMemberOfRSOs] = useState<RSO[]>([]);
  const [adminOfRSOs, setAdminOfRSOs] = useState<RSO[]>([]);
  const [activePopup, setActivePopup] = useState<number | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('/api/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const decodedToken = await response.json();

        if (!decodedToken || !decodedToken.userId) {
          router.push('/login');
          return;
        }

        const userResponse = await fetch(`/api/user/${decodedToken.userId}`);

        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUser(userData);

          // Fetch the RSO data
          const memberOfRSOsResponse = await fetch(`/api/user/${decodedToken.userId}/memberOfRSOs`);
          const adminOfRSOsResponse = await fetch(`/api/user/${decodedToken.userId}/adminOfRSOs`);

          if (memberOfRSOsResponse.ok) {
            const memberOfRSOsData = await memberOfRSOsResponse.json();
            setMemberOfRSOs(memberOfRSOsData);
          } else {
            console.error('Failed to fetch memberOfRSOs data');
          }

          if (adminOfRSOsResponse.ok) {
            const adminOfRSOsData = await adminOfRSOsResponse.json();
            setAdminOfRSOs(adminOfRSOsData);
          } else {
            console.error('Failed to fetch adminOfRSOs data');
          }

        } else {
          console.error('Failed to fetch user data');
        }
      } else {
        console.error('Invalid token');
        router.push('/login');
      }
    };

    fetchUserData();
  }, [router]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your user ID is: {user.id}</p>
      <h2>RSOs you are a member of:</h2>
      <ul>
      {memberOfRSOs
          .filter((rso) => !adminOfRSOs.some((adminRso) => adminRso.RID === rso.RID))
          .map((rso) => (
            <RSOItem
              key={rso.RID}
              rso={rso}
              isAdmin={false}
              activePopup={activePopup}
              setActivePopup={setActivePopup}
            />
          ))}
      </ul>

      <h2>RSOs you are an admin of:</h2>
      <ul>
        {adminOfRSOs.map((rso) => (
          <RSOItem
            key={rso.RID}
            rso={rso}
            isAdmin={true}
            activePopup={activePopup}
            setActivePopup={setActivePopup}
          />
        ))}
      </ul>
      <button onClick={() => router.push('/events')}>Go to Events</button>
    </div>
  );
}