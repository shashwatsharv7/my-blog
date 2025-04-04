export const checkAdmin = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('adminAccess') === 'true';
};

export const loginAdmin = (password: string) => {
  if (password === 'admin123') {
    localStorage.setItem('adminAccess', 'true');
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem('adminAccess');
};
