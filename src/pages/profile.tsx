import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface User {
  id: number;
  email: string;
  name: string;
  // Include any other fields you want to display from the 'users' table
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
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
      {/* Add any other fields you want to display from the 'super_admins' table */}
    </div>
  );
}
