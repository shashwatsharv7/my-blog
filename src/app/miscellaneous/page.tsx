'use client';

import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import { checkAdmin } from '@/utils/adminAuth';

interface MiscPost {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

// Default data to display if no content exists yet
const defaultMiscPosts: MiscPost[] = [
  {
    id: 1,
    title: 'The Joy of Reading',
    content: "There's nothing quite like getting lost in a good book. Reading opens up new worlds and perspectives.",
    tags: ['Reading', 'Books'],
    createdAt: '2025-03-25',
  }
];

export default function Miscellaneous() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [miscPosts, setMiscPosts] = useState<MiscPost[]>(defaultMiscPosts);

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(checkAdmin());
    
    // Load stored miscellaneous posts
    const storedPosts = localStorage.getItem('miscPosts');
    if (storedPosts) {
      setMiscPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleAddMiscPost = (formData: any) => {
    // Process tags if provided
    const tags = formData.tags ? formData.tags.split(',').map((tag: string) => tag.trim()) : [];
    
    const newPost: MiscPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      tags: tags,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedPosts = [...miscPosts, newPost];
    setMiscPosts(updatedPosts);
    
    // Save to localStorage
    localStorage.setItem('miscPosts', JSON.stringify(updatedPosts));
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Miscellaneous</h1>
      </div>
      
      <Container>
        <div className="py-8">
          {/* Only show the form to admins */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Miscellaneous Post</h2>
              <AddForm 
                type="Miscellaneous Post" 
                fields={[
                  { name: 'title', label: 'Title', placeholder: 'Enter post title', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Write your post content here', type: 'textarea', required: true },
                  { name: 'tags', label: 'Tags', placeholder: 'Comma-separated tags (e.g., Books, Reviews)', type: 'text' },
                ]} 
                onSubmit={handleAddMiscPost}
              />
            </div>
          )}
          
          <div className="space-y-6">
            {miscPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{post.createdAt}</p>
                <div className="text-gray-700 mb-4">
                  <p>{post.content}</p>
                </div>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
