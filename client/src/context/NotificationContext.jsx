import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const [newNotice, setNewNotice] = useState(null);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [latestId, setLatestId] = useState(localStorage.getItem('latest_notice_id') || null);

  const fetchNotices = async (isInitial = false) => {
    try {
      const res = await api.get('/notices');
      const allNotices = res.data;
      
      // Update global notifications list
      setNotifications(allNotices.slice(0, 10)); // Keep top 10 for dropdown
      
      // Calculate unread count
      const unread = allNotices.filter(n => !localStorage.getItem(`read_${n._id}`)).length;
      setUnreadCount(unread);

      if (allNotices.length > 0) {
        const currentLatest = allNotices[0];
        
        if (isInitial) {
          setLatestId(currentLatest._id);
          localStorage.setItem('latest_notice_id', currentLatest._id);
        } else if (currentLatest._id !== latestId) {
          // Found a new notice!
          setLatestId(currentLatest._id);
          localStorage.setItem('latest_notice_id', currentLatest._id);
          setNewNotice(currentLatest);
        }
      }
    } catch (err) {
      console.error('Notification fetch error:', err);
    }
  };

  useEffect(() => {
    fetchNotices(true);

    const interval = setInterval(() => {
      fetchNotices();
    }, 10000);

    return () => clearInterval(interval);
  }, [latestId]);

  const closeNotification = () => setNewNotice(null);

  const triggerRefresh = () => fetchNotices();

  const markAllAsRead = () => {
    notifications.forEach(n => localStorage.setItem(`read_${n._id}`, 'true'));
    setUnreadCount(0);
  };

  const markAsRead = (id) => {
    localStorage.setItem(`read_${id}`, 'true');
    // Recalculate unread count
    const unread = notifications.filter(n => !localStorage.getItem(`read_${n._id}`)).length;
    setUnreadCount(unread);
  };

  return (
    <NotificationContext.Provider value={{ 
      newNotice, 
      notifications,
      unreadCount,
      closeNotification, 
      triggerRefresh, 
      selectedNotice, 
      setSelectedNotice,
      markAllAsRead,
      markAsRead
    }}>
      {children}
    </NotificationContext.Provider>
  );
};
