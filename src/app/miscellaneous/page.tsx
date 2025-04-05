'use client';
import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import PostCard from '../components/PostCard';
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

  useEffect(() => {
    setIsAdmin(checkAdmin());
    fetchMiscPosts();
  }, []);

  const fetchMiscPosts = async () => {
    try {
      const response = await fetch('/api/posts?type=misc');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setMiscPosts(data);
    } catch (error) {
      console.error('Error fetching miscellaneous posts:', error);
    }
  };

  const handleAddMiscPost = async (formData: Record<string, string>) => {
    try {
      const tags = formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [];
      
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'misc',
          tags
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      const createdPost = await response.json();
      setMiscPosts(prev => [createdPost, ...prev]);
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding miscellaneous post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch('/api/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      setMiscPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post');
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
                fields={[
                  { name: 'title', label: 'Title', placeholder: 'Enter post title', type: 'text', required: true },
                  { name: 'content', label: 'Content', placeholder: 'Write your content here', type: 'textarea', required: true },
                  { name: 'tags', label: 'Tags', placeholder: 'Comma-separated tags (e.g., Books, Reviews)', type: 'text' },
                ]}
                onSubmit={handleAddMiscPost}
              />
            </div>
          )}

          <div className="space-y-6">
            {miscPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
                tags={post.tags}
                isAdmin={isAdmin}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        </div>
      </Container>
    </>
  );
}
