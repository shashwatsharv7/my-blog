'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check admin status on component mount and storage changes
  useEffect(() => {
    const checkAdminStatus = () => {
      setIsAdmin(localStorage.getItem('adminAccess') === 'true');
    };

    // Initial check
    checkAdminStatus();

    // Listen for storage changes
    window.addEventListener('storage', checkAdminStatus);
    
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminAccess');
    window.dispatchEvent(new Event('storage')); // Trigger state update
    window.location.href = '/';
  };

  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold">
              Mithila By Rajnath
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            <Link href="/" className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Home
            </Link>
            <Link href="/reference-texts" className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Reference Texts
            </Link>
            <Link href="/by-author" className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              By Author
            </Link>
            <Link href="/miscellaneous" className="px-3 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Miscellaneous
            </Link>
            {isAdmin ? (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors"
              >
                Logout
              </button>
            ) : (
              <Link href="/admin" className="px-3 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition-colors">
                Admin Access
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:bg-blue-700 inline-flex items-center justify-center p-2 rounded-md"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link href="/" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link href="/reference-texts" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                Reference Texts
              </Link>
              <Link href="/by-author" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                By Author
              </Link>
              <Link href="/miscellaneous" className="block px-3 py-2 rounded-md hover:bg-blue-700" onClick={() => setIsMenuOpen(false)}>
                Miscellaneous
              </Link>
              {isAdmin ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              ) : (
                <Link
                  href="/admin"
                  className="block px-3 py-2 rounded-md bg-white text-blue-600 hover:bg-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Access
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
