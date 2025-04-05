interface PostCardProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  category?: string;
  author?: string;
}

export default function PostCard({
  id,
  title,
  content,
  createdAt,
  category,
  author,
}: PostCardProps) {
  // Helper function to format dates
  const formatDate = (isoString: string): string => {
    try {
      const date = new Date(isoString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {category && (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
          {category}
        </span>
      )}
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      
      {author && <p className="text-gray-600 mb-4">by {author}</p>}
      
      <p className="text-sm text-gray-500 mb-4">{formatDate(createdAt)}</p>
      
      <p className="text-gray-700">{content}</p>
    </div>
  );
}
