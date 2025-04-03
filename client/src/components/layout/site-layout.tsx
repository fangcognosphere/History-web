import { ReactNode } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Helmet } from 'react-helmet-async';

interface SiteLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export function SiteLayout({ children, title, description }: SiteLayoutProps) {
  const pageTitle = title ? `${title} | Lịch Sử Việt Nam` : 'Lịch Sử Việt Nam';
  const pageDescription = description || 'Website thông tin lịch sử Việt Nam với các bài viết về nhân vật, sự kiện và triều đại lịch sử';

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
      </Helmet>
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}
