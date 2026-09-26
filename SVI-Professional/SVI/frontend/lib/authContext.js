'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [victim, setVictim] = useState(null);
  const [lang, setLang] = useState('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('svi_staff_user');
      const storedVictim = localStorage.getItem('svi_victim_user');
      const storedLang = localStorage.getItem('svi_app_lang');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedVictim) {
        setVictim(JSON.parse(storedVictim));
      }
      if (storedLang) {
        setLang(storedLang);
        if (typeof document !== 'undefined') {
          const isRtl = ['ur', 'sd', 'ks'].includes(storedLang);
          document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
          document.documentElement.lang = storedLang;
        }
      }
    } catch (err) {
      console.warn('Could not read auth/lang from storage', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const isRtl = ['ur', 'sd', 'ks'].includes(lang);
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const loginStaff = (role = 'counsellor', officerName = 'Officer Sharma (ID: 4120)') => {
    const newUser = {
      role,
      name: officerName,
      badgeNumber: 'NHAA-OFFICER-412',
      token: 'jwt_mock_svi_' + Date.now(),
      loginTime: new Date().toISOString(),
    };
    setUser(newUser);
    try {
      localStorage.setItem('svi_staff_user', JSON.stringify(newUser));
    } catch (e) {}
  };

  const loginVictim = (name = 'Anonymous Complainant', contact = '') => {
    const newVictim = {
      id: 'SVI-NHAA-' + Math.floor(1000 + Math.random() * 9000),
      name: name || 'Anonymous Complainant',
      contact: contact || 'Protected',
      registeredAt: new Date().toISOString(),
    };
    setVictim(newVictim);
    try {
      localStorage.setItem('svi_victim_user', JSON.stringify(newVictim));
    } catch (e) {}
    return newVictim;
  };

  const logoutStaff = () => {
    setUser(null);
    try {
      localStorage.removeItem('svi_staff_user');
    } catch (e) {}
  };

  const logoutVictim = () => {
    setVictim(null);
    try {
      localStorage.removeItem('svi_victim_user');
      localStorage.removeItem('svi_victim_consent'); // Re-triggers consent on next manual login
    } catch (e) {}
  };

  const changeLanguage = (newLang) => {
    setLang(newLang);
    try {
      localStorage.setItem('svi_app_lang', newLang);
    } catch (e) {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        victim,
        login: loginStaff,
        loginStaff,
        loginVictim,
        logout: logoutStaff,
        logoutStaff,
        logoutVictim,
        lang,
        changeLanguage,
        isRtl: ['ur', 'sd', 'ks'].includes(lang),
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
