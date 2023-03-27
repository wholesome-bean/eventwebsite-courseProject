import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// Define an interface named User that defines the structure of the user data that will be fetched from the server.
interface User {
  id: number;
  email: string;
  name: string;
  // Include any other fields you want to display from the 'users' table
}

export default function Profile() {
  // Define a state variable named user that will hold the user data returned from the server. Initialize it to null.
  const [user, setUser] = useState<User | null>(null);

  // Get the router object
  const router = useRouter();

  // Use the useEffect hook to fetch the user data when the component mounts or the router changes
  useEffect(() => {
    // Define an async function to fetch the user data from the server
    const fetchUserData = async () => {
      // Get the JWT token from local storage
      const token = localStorage.getItem('token');

      // If the token is not present, redirect the user to the login page
      if (!token) {
        router.push('/login');
        return;
      }

      // Verify the JWT token with the server
      const response = await fetch('/api/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // If the token is valid, fetch the user data from the server
      if (response.ok) {
        // Decode the token to get the user ID
        const decodedToken = await response.json();

        // If the user ID is not present in the token, redirect the user to the login page
        if (!decodedToken || !decodedToken.userId) {
          router.push('/login');
          return;
        }

        // Fetch the user data from the server using the user ID
        const userResponse = await fetch(`/api/user/${decodedToken.userId}`);

        // If the user data is fetched successfully, set it in the state
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

    // Call the fetchUserData function to fetch the user data
    fetchUserData();
  }, [router]);

  // If the user data is not present, display a loading message
  if (!user) {
    return <div>Loading...</div>;
  }

  // If the user data is present, display the user's name and ID
  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Your user ID is: {user.id}</p>
      {/* Add any other fields you want to display from the 'super_admins' table */}
      <button onClick={() => router.push('/events')}>Go to Events</button>
    </div>
  );
}
