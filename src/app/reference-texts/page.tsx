'use client';
import { useState, useEffect } from 'react';
import Container from '../components/Container';
import AddForm from '../components/AddForm';
import PostCard from '../components/PostCard';
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
    fetchReferenceTexts();
  }, []);

  const fetchReferenceTexts = async () => {
    try {
      const response = await fetch('/api/posts?type=reference');
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setReferenceTexts(data);
    } catch (error) {
      console.error('Error fetching reference texts:', error);
    }
  };

  const handleAddReferenceText = async (formData: Record<string, string>) => {
    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'reference',
          category: formData.category || 'Uncategorized'
        }),
      });

      if (!response.ok) throw new Error('Failed to create post');
      
      const createdPost = await response.json();
      setReferenceTexts(prev => [createdPost, ...prev]);
      alert('Post added successfully!');
    } catch (error) {
      console.error('Error adding reference text:', error);
    }
  };

  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const response = await fetch(`/api/posts?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete post');

      setReferenceTexts(prev => prev.filter(post => post.id !== id));
    } catch (error) {
      console.error('Error deleting post:', error);
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
              <PostCard
                key={item.id}
                id={item.id}
                title={item.title}
                content={item.content}
                createdAt={item.createdAt}
                category={item.category}
                author={item.author}
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
