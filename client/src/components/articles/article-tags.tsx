import { Link } from "wouter";

interface ArticleTagsProps {
  tags: string[];
}

export function ArticleTags({ tags }: ArticleTagsProps) {
  if (!tags || tags.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag, index) => (
        <Link
          key={index}
          href={`/search?q=${encodeURIComponent(tag)}`}
          className="text-xs px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}