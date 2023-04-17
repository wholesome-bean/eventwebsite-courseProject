// UserContext.tsx
import { createContext, useState, useContext } from 'react';

interface User {
  id: number;
  email: string;
  name: string;
  university_id: number;
}

interface UserContextState {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextState>({
  user: null,
  setUser: () => {},
});

export const UserProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
