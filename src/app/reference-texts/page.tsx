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

  useEffect(() => {
    setIsAdmin(checkAdmin());
    
    const storedTexts = localStorage.getItem('referenceTexts');
    if (storedTexts) {
      setReferenceTexts(JSON.parse(storedTexts));
    }
  }, []);

  const handleAddReferenceText = async (formData: Omit<ReferenceText, 'id' | 'createdAt'>) => {
    const newText: ReferenceText = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      ...formData,
      category: formData.category || 'Uncategorized'
    };

    const updatedTexts = [newText, ...referenceTexts];
    setReferenceTexts(updatedTexts);
    localStorage.setItem('referenceTexts', JSON.stringify(updatedTexts));
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
              <AddForm<Omit<ReferenceText, 'id' | 'createdAt'>>
                fields={[
                  { 
                    name: 'title', 
                    label: 'Book Title', 
                    placeholder: 'Enter book title', 
                    type: 'text', 
                    required: true 
                  },
                  { 
                    name: 'author', 
                    label: 'Author', 
                    placeholder: 'Enter author name', 
                    type: 'text', 
                    required: true 
                  },
                  { 
                    name: 'content', 
                    label: 'Content', 
                    placeholder: 'Enter reference text', 
                    type: 'textarea', 
                    required: true 
                  },
                  { 
                    name: 'category', 
                    label: 'Category', 
                    placeholder: 'E.g., Fiction', 
                    type: 'text' 
                  }
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
                  &ldquo;{item.content}&rdquo;
                </blockquote>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
