'use client';

import { useState } from 'react';
import { setAdmin } from '@/utils/adminAuth';
import { useRouter } from 'next/navigation';
import Container from '../components/Container';

export default function AdminLogin() {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple password check - replace with secure method in production
    if (password === 'admin123') {
      setAdmin(true);
      router.push('/');
    } else {
      setError('Incorrect password');
    }
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Admin Access</h1>
      </div>
      
      <Container>
        <div className="py-12 flex justify-center">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-6">Login to Add Content</h2>
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </Container>
    </>
  );
}
