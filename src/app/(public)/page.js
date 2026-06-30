import HeroBanner from '@/components/home/HeroBanner';

export const metadata = {
  title: 'CoFoundry — Build Your Dream Team',
  description:
    'Connect with startup founders and collaborators. Find your co-founder, post team openings, and build something great together.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      {/* more sections coming next */}
    </>
  );
}
