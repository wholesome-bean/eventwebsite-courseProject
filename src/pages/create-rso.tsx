// /pages/create-rso.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

interface RSOApplicationForm {
  name: string;
  description: string;
  memberEmails: string[];
}

export default function CreateRSOPage() {
    const [form, setForm] = useState<RSOApplicationForm>({
      name: '',
      description: '',
      memberEmails: ['', '', '', ''],
    });
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        if (!token) {
          router.push('/login');
          return;
        }

        const decodedToken = jwt.decode(token);
    setUser(decodedToken);
  }, [router]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (typeof index === 'number') {
      const newMemberEmails = [...form.memberEmails];
      newMemberEmails[index] = event.target.value;
      setForm({ ...form, memberEmails: newMemberEmails });
    } else {
      setForm({ ...form, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
  
    const response = await fetch('/api/create-rso', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
  
    if (response.ok) {
      router.push('/rso-created'); // Redirect to a confirmation page or any other page you'd like
    } else {
      console.error('RSO creation failed');
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      {/* Name */}
      <div>
        <label htmlFor="name">Name</label>
        <input type="text" name="name" value={form.name} onChange={handleChange} required />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description">Description</label>
        <input
          type="text"
          name="description"
          value={form.description}
          onChange={handleChange}
          required
        />
      </div>

      {/* Member emails */}
      {form.memberEmails.map((email, index) => (
        <div key={index}>
          <label htmlFor={`memberEmail${index}`}>Member {index + 1} email</label>
          <input
            type="email"
            name={`memberEmail${index}`}
            value={email}
            onChange={(e) => handleChange(e, index)}
            required
          />
        </div>
      ))}

      {/* Submit */}
      <button type="submit">Submit RSO Application</button>
    </form>
  );
}
