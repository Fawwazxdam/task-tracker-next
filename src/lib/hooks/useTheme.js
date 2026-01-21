// lib/hooks/useTheme.js
import { useState, useEffect } from 'react';
import apiClient from '../axios';

export const useTheme = () => {
  // Ambil dari localStorage dulu sebagai fallback
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });
  const [loading, setLoading] = useState(false); // Ubah jadi false

  // Apply theme class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  useEffect(() => {
    const fetchTheme = async () => {
      try {
        const response = await apiClient.get('/user/preferences/theme');
        const fetchedTheme = response.data.data.value || 'light';
        setThemeState(fetchedTheme);
        localStorage.setItem('theme', fetchedTheme);
      } catch (error) {
        console.error('Failed to fetch theme preference:', error);
        // Jika gagal (misal: not authenticated), gunakan localStorage
        // Tidak throw error, cukup gunakan fallback
      }
    };

    // Cek apakah user authenticated (ada token atau cara lain)
    const token = localStorage.getItem('authToken'); // Sesuaikan dengan auth logic Anda
    if (token) {
      fetchTheme();
    }
  }, []);

  const setTheme = async (newTheme) => {
    console.log('setTheme called with:', newTheme);
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme); // Simpan ke localStorage
    
    try {
      await apiClient.put('/user/preferences/theme', { value: newTheme });
    } catch (error) {
      console.error('Failed to save theme preference:', error);
      // Tidak masalah jika gagal save ke backend, theme tetap work di localStorage
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    console.log('toggleTheme: current =', theme, ', new =', newTheme);
    await setTheme(newTheme);
  };

  return { theme, setTheme, toggleTheme, loading };
};