const DEFAULT_USER = {
  id: 'user_001',
  name: 'University Student',
  faculty: 'General Faculty',
  year: 'Unknown Year',
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('user');
  if (stored) return JSON.parse(stored);
  return null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// When you connect real auth later, replace getCurrentUser() with:
// export const getCurrentUser = () => authContext.user;