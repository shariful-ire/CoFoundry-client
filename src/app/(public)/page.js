import HeroBanner from '@/components/home/HeroBanner';
import FeaturedStartups from '@/components/home/FeaturedStartups';

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
      {/* more sections coming next */}
    </>
  );
}
