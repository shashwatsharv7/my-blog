'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Container from './components/Container';

interface ContentItem {
  id: number;
  title: string;
  content: string;
  author?: string;
  category?: string;
  createdAt: string;
  type: string;
}

export default function Home() {
  const [latestContent, setLatestContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    // Fetch content from localStorage
    const referenceTexts = JSON.parse(localStorage.getItem('referenceTexts') || '[]');
    const authorPosts = JSON.parse(localStorage.getItem('authorPosts') || '[]');
    const miscPosts = JSON.parse(localStorage.getItem('miscPosts') || '[]');

    // Combine all content into a single array
    const allContent = [
      ...referenceTexts.map((item: any) => ({
        ...item,
        type: 'Reference Texts',
        path: '/reference-texts',
      })),
      ...authorPosts.map((item: any) => ({
        ...item,
        type: 'By Author',
        path: '/by-author',
      })),
      ...miscPosts.map((item: any) => ({
        ...item,
        type: 'Miscellaneous',
        path: '/miscellaneous',
      })),
    ];

    // Sort by date (newest first)
    allContent.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Take top 3 items for display
    setLatestContent(allContent.slice(0, 3));
  }, []);

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative h-screen bg-cover bg-center"
        style={{ backgroundImage: "url('/images/mithila-bg.jpg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-30"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Mithila By Rajnath</h1>
          <p className="text-lg md:text-xl mb-8">
            Explore literary insights, book references, and more
          </p>
          <a
            href="#latest-content"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
          </a>
        </div>
      </div>

      {/* Latest Content Section */}
      <Container id="latest-content">
        <div className="py-12">
          <h2 className="text-center text-3xl font-bold mb-8">Latest Content</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {latestContent.length > 0 ? (
              latestContent.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full mb-2">
                      {item.type}
                    </span>
                    <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                    {item.author && (
                      <p className="text-gray-700 mb-1">by {item.author}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-3">{item.createdAt}</p>
                    <p className="text-gray-600 mb-4 line-clamp-3">{item.content}</p>
                    <Link
                      href={item.path}
                      className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                    >
                      Read more →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">No content available.</p>
            )}
          </div>
        </div>
      </Container>
    </>
  );
}
