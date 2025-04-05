import Link from 'next/link';

interface PostCardProps {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  category?: string;
  author?: string;
  tags?: string[];
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

export default function PostCard({
  id,
  title,
  content,
  createdAt,
  category,
  author,
  tags,
  isAdmin,
  onDelete
}: PostCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      {isAdmin && (
        <button
          onClick={() => onDelete && onDelete(id)}
          className="absolute top-2 right-2 text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      )}
      {category && (
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full mb-3">
          {category}
        </span>
      )}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      {author && <p className="text-gray-600 mb-4">by {author}</p>}
      <p className="text-sm text-gray-500 mb-4">
        {new Date(createdAt).toLocaleDateString()}
      </p>
      <div className="text-gray-700">
        <p>{content}</p>
      </div>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2a mt-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
