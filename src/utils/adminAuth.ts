export const checkAdmin = (): boolean => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adminAccess') === 'true';
};

export const setAdmin = (isAdmin: boolean): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('adminAccess', isAdmin ? 'true' : 'false');
};
