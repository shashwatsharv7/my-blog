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

export default function Miscellaneous() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [miscPosts, setMiscPosts] = useState<MiscPost[]>([]);

  // Fetch posts on component mount
  useEffect(() => {
    setIsAdmin(checkAdmin());

    async function fetchMiscPosts() {
      try {
        const response = await fetch('/api/posts?type=misc');
        if (!response.ok) throw new Error('Failed to fetch posts');
        const data = await response.json();
        setMiscPosts(data);
      } catch (error) {
        console.error('Error fetching miscellaneous posts:', error);
      }
    }

    fetchMiscPosts();
  }, []);

  // Handle form submission
  const handleAddMiscPost = async (formData: Omit<MiscPost, 'id' | 'createdAt' | 'tags'> & { tags: string }) => {
    try {
      // Convert tags string to array
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      const postData = {
        title: formData.title,
        content: formData.content,
        tags: tags,
        type: 'misc'
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdPost = await response.json();
      
      // Update state to show new post immediately
      setMiscPosts((prev) => [createdPost, ...prev]);
      
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Failed to add post. Check console for details.');
    }
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">Miscellaneous</h1>
      </div>

      <Container>
        <div className="py-8">
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
