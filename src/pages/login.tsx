import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const router = useRouter();

  // Check if the superadmin query parameter is present
  const isSuperAdminLogin = router.query.superadmin === 'true';

  useEffect(() => {
  if (isSuperAdminLogin) {
  // Set the page title for super admin login
  document.title = 'Super Admin Login';
  }
  }, [isSuperAdminLogin]);
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();

  const response = await fetch('/api/login', {
    method: 'POST',
    body: JSON.stringify(form),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await response.json();
  
  if (response.ok) {
    localStorage.setItem('token', data.token);
  
    const decodedToken: any = jwt.decode(data.token);
    const { role } = decodedToken;
  
    if (role === 'superadmin') {
      router.push('/supAdDashboard');
    } else {
      router.push('/profile');
    }
  } else {
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
<input
       type="email"
       name="email"
       value={form.email}
       onChange={handleChange}
       required
     />
</div>
<div>
<label htmlFor="password">Password</label>
<input
type="password"
name="password"
value={form.password}
onChange={handleChange}
required
/>
</div>
<button type="submit">{isSuperAdminLogin ? 'Super Admin Login' : 'Login'}</button>
</form>
);
}
