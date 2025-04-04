'use client';

import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import { checkAdmin } from '@/utils/adminAuth';

// Define the MiscPost interface
interface MiscPost {
  id: number;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
}

export default function Miscellaneous() {
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the user is an admin
  const [miscPosts, setMiscPosts] = useState<MiscPost[]>([]); // State to store miscellaneous posts

  // Fetch miscellaneous posts on component mount
  useEffect(() => {
    setIsAdmin(checkAdmin()); // Check if the user is an admin

    async function fetchMiscPosts() {
      try {
        const response = await fetch('/api/posts?type=misc'); // Fetch posts of type "misc"
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data: MiscPost[] = await response.json();

        // Sort posts by newest first
        const sorted = data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setMiscPosts(sorted);
      } catch (error) {
        console.error('Error fetching miscellaneous posts:', error);
      }
    }

    fetchMiscPosts();
  }, []);

  // Handle form submission for adding a new post
  const handleAddMiscPost = async (formData: Record<string, string>) => {
    // Convert tags from a comma-separated string to an array
    const tags = formData.tags ? formData.tags.split(',').map((tag) => tag.trim()) : [];

    const newPost = {
      title: formData.title,
      content: formData.content,
      tags: tags,
      type: 'misc',
    };

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) throw new Error('Failed to create post');

      const createdPost = await response.json();
      setMiscPosts((prev) => [createdPost, ...prev]); // Add the new post to the state
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding miscellaneous post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Miscellaneous</h1>
      </div>

      <Container>
        <div className="py-8">
          {/* Show Add Form only for admins */}
          {isAdmin && (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold mb-4">Add New Miscellaneous Post</h2>
              <AddForm
                fields={[
                  { name: 'title', label: 'Title', placeholder: 'Enter post title', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Write your content here', type: 'textarea', required: true },
                  { name: 'tags', label: 'Tags', placeholder: 'Comma-separated tags (e.g., Books, Reviews)', type: 'text' },
                ]}
                onSubmit={handleAddMiscPost}
              />
            </div>
          )}

          {/* Display Miscellaneous Posts */}
          <div className="space-y-6">
            {miscPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
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
