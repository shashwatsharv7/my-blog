'use client';
import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import PostCard from '../components/PostCard';
import { checkAdmin } from '@/utils/adminAuth';

interface AuthorPost {
  id: number;
  title: string;
  content: string;
  createdAt: string;
}

export default function ByAuthor() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [authorPosts, setAuthorPosts] = useState<AuthorPost[]>([]);

  useEffect(() => {
    setIsAdmin(checkAdmin());
    fetchAuthorPosts();
  }, []);

  const fetchAuthorPosts = async () => {
    try {
      const response = await fetch('/api/posts?type=author');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setAuthorPosts(data);
    } catch (error) {
      console.error('Error fetching author posts:', error);
    }
  };

  const handleAddAuthorPost = async (formData: Record<string, string>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'author'
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      const createdPost = await response.json();
      setAuthorPosts(prev => [createdPost, ...prev]);
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding author post:', error);
      alert('Failed to add post. Please try again.');
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');
      
      setAuthorPosts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post. Please check console for details.');
    }
  };

  return (
    <>
      <div className="bg-blue-600 py-10 text-center text-white">
        <h1 className="text-3xl font-bold">By Author</h1>
      </div>

      <Container>
        <div className="py-8">
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

          <div className="space-y-6">
            {authorPosts.map((post) => (
              <PostCard
                key={post.id}
                id={post.id}
                title={post.title}
                content={post.content}
                createdAt={post.createdAt}
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
