import { SiteLayout } from '@/components/layout/site-layout';
import { ArticleDetail } from '@/components/articles/article-detail';
import { useParams } from 'wouter';
import { useQuery } from '@tanstack/react-query';

export default function ArticlePage() {
  const { id } = useParams();
  
  // Fetch article to get title for SEO
  const { data: article } = useQuery({
    queryKey: [`/api/article/${id}`],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/article/${id}`);
        if (!res.ok) throw new Error('Failed to fetch article');
        return res.json();
      } catch (error) {
        console.error("Failed to fetch article:", error);
        return null;
      }
    },
  });

  return (
    <SiteLayout 
      title={article?.tieuDe}
      description={article?.tomTat}
    >
      <ArticleDetail id={id} />
    </SiteLayout>
  );
}
