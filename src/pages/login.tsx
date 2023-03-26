import { useState } from 'react';
import { useRouter } from 'next/router';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Send a POST request to your backend server with the email and password
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok) {
      // If the login is successful, store the JWT in local storage or a cookie
      localStorage.setItem('token', data.token);
      router.push(`/profile`); // Redirect the user to the profile page
    } else {
      // If the login fails, display an error message
      alert(data.message || 'Login failed');
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <button type="submit">Login</button>
    </form>
  );
}
