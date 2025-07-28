import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Check if token is valid on app load
  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthContext: Checking authentication...', { hasToken: !!token });
      
      if (token) {
        try {
          const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/profile`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            console.log('AuthContext: Authentication valid', data.user);
          } else {
            console.warn('AuthContext: Token invalid, clearing auth');
            // Token is invalid, clear it
            logout();
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, [token]);

  const login = (newToken, userData) => {
    console.log('AuthContext: Logging in user', { token: newToken?.substring(0, 20) + '...', user: userData });
    setToken(newToken);
    setUser(userData);
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    console.log('AuthContext: Logging out user');
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ 
      token, 
      user, 
      loading,
      login, 
      logout, 
      updateUser,
      isAuthenticated: !!token 
    }}>
      {children}
    </AuthContext.Provider>
  );
};