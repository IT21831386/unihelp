const DEFAULT_USER = {
  id: 'user_001',
  name: 'Ashan Karunaratne',
  faculty: 'Faculty of Engineering',
  year: '2nd Year',
};

export const getCurrentUser = () => {
  const stored = localStorage.getItem('currentUser');
  if (stored) return JSON.parse(stored);
  localStorage.setItem('currentUser', JSON.stringify(DEFAULT_USER));
  return DEFAULT_USER;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('currentUser', JSON.stringify(user));
};

// When you connect real auth later, replace getCurrentUser() with:
// export const getCurrentUser = () => authContext.user;