'use client';

import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import { checkAdmin } from '@/utils/adminAuth';

interface ReferenceText {
  id: number;
  title: string;
  author: string;
  content: string;
  category?: string;
  createdAt: string;
}

// Default data to display if no content exists yet
const defaultReferenceTexts: ReferenceText[] = [
  {
    id: 1,
    title: 'The Elements of Style',
    author: 'William Strunk Jr.',
    content: 'Use the active voice. The active voice is usually more direct and vigorous than the passive.',
    category: 'Writing Guide',
    createdAt: '2025-04-01',
  }
];

export default function ReferenceTexts() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [referenceTexts, setReferenceTexts] = useState<ReferenceText[]>(defaultReferenceTexts);

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(checkAdmin());
    
    // Load stored reference texts
    const storedTexts = localStorage.getItem('referenceTexts');
    if (storedTexts) {
      setReferenceTexts(JSON.parse(storedTexts));
    }
  }, []);

  const handleAddReferenceText = (formData: any) => {
    const newText: ReferenceText = {
      id: Date.now(),
      title: formData.title,
      author: formData.author,
      content: formData.content,
      category: formData.category || 'Uncategorized',
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedTexts = [...referenceTexts, newText];
    setReferenceTexts(updatedTexts);
    
    // Save to localStorage
    localStorage.setItem('referenceTexts', JSON.stringify(updatedTexts));
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Reference Texts</h1>
      </div>
      
      <Container>
        <div className="py-8">
          {/* Only show the form to admins */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Reference Text</h2>
              <AddForm 
                type="Reference Text" 
                fields={[
                  { name: 'title', label: 'Book Title', placeholder: 'Enter book title', type: 'text', required: true },
                  { name: 'author', label: 'Author', placeholder: 'Enter author name', type: 'text', required: true },
                  { name: 'content', label: 'Reference Text', placeholder: 'Enter the reference text or quote', type: 'textarea', required: true },
                  { name: 'category', label: 'Category', placeholder: 'E.g., Fiction, Writing Guide, etc.', type: 'text' },
                ]} 
                onSubmit={handleAddReferenceText}
              />
            </div>
          )}
          
          <div className="space-y-6">
            {referenceTexts.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-3">
                  {item.category || 'Uncategorized'}
                </span>
                <h3 className="text-xl font-bold mb-1">{item.title}</h3>
                <p className="text-gray-600 mb-4">by {item.author}</p>
                <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-700">
                  "{item.content}"
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
