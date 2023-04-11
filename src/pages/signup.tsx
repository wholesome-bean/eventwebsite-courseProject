// /pages/signup.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

interface SignUpForm {
  name: string;
  email: string;
  password: string;
  university_id: number;
}

interface University {
  id: number;
  name: string;
}

export default function SignUpPage() {
  const [form, setForm] = useState<SignUpForm>({ name: '', email: '', password: '', university_id: 0 });
  const [universities, setUniversities] = useState<University[]>([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await fetch('/api/universities');
      const data = await response.json();
      setUniversities(data);
    };
    fetchUniversities();
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      router.push('/login');
    } else {
      const errorData = await response.json();
      setError(errorData.message);
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input type="email" name="email" value={form.email} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input type="password" name="password" value={form.password} onChange={handleChange} required />
      </div>
      <div>
        <label htmlFor="university_id">University</label>
        <select
          name="university_id"
          value={form.university_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a university</option>
          {universities.map((university) => (
            <option key={university.id} value={university.id}>
              {university.name}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Sign Up</button>
      {error && (
        <div>
          <p style={{ color: 'red' }}>{error}</p>
        </div>
      )}
    </form>
  );
}
