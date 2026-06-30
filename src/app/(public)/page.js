import HeroBanner from '@/components/home/HeroBanner';
import FeaturedStartups from '@/components/home/FeaturedStartups';
import FeaturedOpportunities from '@/components/home/FeaturedOpportunities';
import WhyCoFoundry from '@/components/home/WhyCoFoundry';
import Testimonials from '@/components/home/Testimonials';

export const metadata = {
  title: 'CoFoundry — Build Your Dream Team',
  description:
    'Connect with startup founders and collaborators. Find your co-founder, post team openings, and build something great together.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <FeaturedStartups />
      <FeaturedOpportunities />
      <WhyCoFoundry />
      <Testimonials />
    </>
  );
}
