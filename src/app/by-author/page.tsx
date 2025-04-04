'use client';

import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import { checkAdmin } from '@/utils/adminAuth';

// Define the AuthorPost interface
interface AuthorPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function ByAuthor() {
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [authorPosts, setAuthorPosts] = useState<AuthorPost[]>([]); // State to store author posts

  // Fetch author posts on component mount
  useEffect(() => {
    setIsAdmin(checkAdmin()); // Check if the user is an admin

    async function fetchAuthorPosts() {
      try {
        const response = await fetch('/api/posts?type=author'); // Fetch posts of type "author"
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data: AuthorPost[] = await response.json();

        // Sort posts by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setAuthorPosts(sorted);
      } catch (error) {
        console.error('Error fetching author posts:', error);
      }
    }

    fetchAuthorPosts();
  }, []);

  // Handle form submission for adding a new post
  const handleAddAuthorPost = async (formData: { title: string; content: string }) => {
    const newPost = {
      title: formData.title,
      content: formData.content,
      type: 'author',
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const createdPost: AuthorPost = await response.json();
      setAuthorPosts((prev) => [createdPost, ...prev]); // Add the new post to the state
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding author post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">By Author</h1>
      </div>

      <Container>
        <div className="py-8">
          {/* Show Add Form only for admins */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Post</h2>
              <AddForm
                fields={[
                  { name: 'title', label: 'Title', placeholder: 'Enter post title', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Write your content here', type: 'textarea', required: true },
                ]}
                onSubmit={handleAddAuthorPost}
              />
            </div>
          )}

          {/* Display Author Posts */}
          <div className="space-y-6">
            {authorPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
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
