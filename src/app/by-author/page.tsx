'use client';

import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import { checkAdmin } from '@/utils/adminAuth';

interface AuthorPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

// Default data to display if no content exists yet
const defaultAuthorPosts: AuthorPost[] = [
  {
    id: 1,
    title: 'My Writing Process',
    content: 'Everyone has a different approach to writing. In this post, I share my personal writing process from initial idea to final draft.',
    createdAt: '2025-03-28',
  }
];

export default function ByAuthor() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [authorPosts, setAuthorPosts] = useState<AuthorPost[]>(defaultAuthorPosts);

  useEffect(() => {
    // Check if user is admin
    setIsAdmin(checkAdmin());
    
    // Load stored author posts
    const storedPosts = localStorage.getItem('authorPosts');
    if (storedPosts) {
      setAuthorPosts(JSON.parse(storedPosts));
    }
  }, []);

  const handleAddAuthorPost = (formData: any) => {
    const newPost: AuthorPost = {
      id: Date.now(),
      title: formData.title,
      content: formData.content,
      createdAt: new Date().toISOString().split('T')[0],
    };
    
    const updatedPosts = [...authorPosts, newPost];
    setAuthorPosts(updatedPosts);
    
    // Save to localStorage
    localStorage.setItem('authorPosts', JSON.stringify(updatedPosts));
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">By Author</h1>
      </div>
      
      <Container>
        <div className="py-8">
          {/* Only show the form to admins */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Author Post</h2>
              <AddForm 
                type="Author Post" 
                fields={[
                  { name: 'title', label: 'Title', placeholder: 'Enter post title', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Write your post content here', type: 'textarea', required: true },
                ]} 
                onSubmit={handleAddAuthorPost}
              />
            </div>
          )}
          
          <div className="space-y-6">
            {authorPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{post.createdAt}</p>
                <div className="text-gray-700">
                  <p>{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
