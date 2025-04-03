import { SiteLayout } from '@/components/layout/site-layout';
import { HeroSection } from '@/components/home/hero-section';
import { CategoryNavigation } from '@/components/home/category-navigation';
import { FeaturedArticles } from '@/components/home/featured-articles';
import { TimelineSection } from '@/components/home/timeline-section';
import { MediaGallery } from '@/components/home/media-gallery';
import { RecentArticles } from '@/components/home/recent-articles';
import { NewsletterSignup } from '@/components/home/newsletter-signup';

export default function HomePage() {
  return (
    <SiteLayout>
      <HeroSection />
      <CategoryNavigation />
      <FeaturedArticles />
      <TimelineSection />
      <MediaGallery />
      <RecentArticles />
      <NewsletterSignup />
    </SiteLayout>
  );
}
