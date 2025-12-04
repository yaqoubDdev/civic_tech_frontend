import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Mock user: 'citizen' or 'official' or null
  const [user, setUser] = useState({ role: 'citizen', name: 'John Doe' });

  const login = (role) => {
    setUser({ role, name: role === 'official' ? 'Gov Official' : 'John Doe' });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
