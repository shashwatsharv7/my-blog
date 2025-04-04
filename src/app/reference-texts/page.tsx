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

export default function ReferenceTexts() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [referenceTexts, setReferenceTexts] = useState<ReferenceText[]>([]);

  // Fetch posts on component mount
  useEffect(() => {
    setIsAdmin(checkAdmin());

    async function fetchReferenceTexts() {
      try {
        const response = await fetch('/api/posts?type=reference');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setReferenceTexts(data);
      } catch (error) {
        console.error('Error fetching reference texts:', error);
      }
    }

    fetchReferenceTexts();
  }, []);

  // Handle form submission
  const handleAddReferenceText = async (formData: Omit<ReferenceText, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Required for JSON data
        },
        body: JSON.stringify({ 
          ...formData,
          type: 'reference' // Ensure type matches your API expectation
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const createdPost = await response.json();
      
      // Update state to show new post immediately
      setReferenceTexts((prev) => [createdPost, ...prev]);
      
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Check console for details.');
    }
  };
  

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Reference Texts</h1>
      </div>

      <Container>
        <div className="py-8">
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Reference Text</h2>
              <AddForm
                type="Reference Text"
                fields={[
                  { name: 'title', label: 'Book Title', placeholder: 'Enter book title', type: 'text', required: true },
                  { name: 'author', label: 'Author', placeholder: 'Enter author name', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Enter reference text', type: 'textarea', required: true },
                  { name: 'category', label: 'Category', placeholder: 'E.g., Fiction', type: 'text' },
                ]}
                onSubmit={handleAddReferenceText}
              />
            </div>
          )}

          <div className="space-y-6">
            {referenceTexts.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
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
