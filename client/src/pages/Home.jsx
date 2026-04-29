import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import EventsBanner from '../components/EventsBanner';
import FeatureSection from '../components/FeatureSection';
import Footer from '../components/Footer';

const features = [
  {
    id: 'notices',
    title: 'Special Notices',
    tags: ['Notices', 'Club events', 'Special notes'],
    description:
      'Stay informed with the latest university announcements, club activities, and important academic updates all in one centralized hub.',
    image: 'https://images.unsplash.com/photo-1541339907198-e08756ebafe1?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'University events and notices',
    linkText: 'View All Notices',
    reverse: false,
  },
  {
    id: 'marketplace',
    title: 'Student Marketplace',
    tags: ['Boarding items', 'Electronics', 'Textbooks'],
    description:
      'A dedicated platform for students to buy and sell pre-loved items, from textbooks to dorm essentials, making campus life more affordable.',
    image: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Student marketplace',
    linkText: 'Visit Marketplace',
    reverse: true,
  },
  {
    id: 'bookings',
    title: 'Seat Bookings',
    tags: ['Study areas', 'Common Rooms', 'Library'],
    description:
      'Never miss out on your favorite study spot again. Browse available seating areas and book your place in advance for focused study sessions.',
    image: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Study room bookings',
    linkText: 'Book a Seat',
    reverse: false,
  },
  {
    id: 'boarding',
    title: 'Find a Boarding',
    tags: ['Safe', 'Convenient', 'Peer-reviewed'],
    description:
      'Discover the best boarding places near campus. Read reviews from fellow students and find a safe, comfortable place to call home.',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Student boarding places',
    linkText: 'Explore Boardings',
    reverse: true,
  },
  {
    id: 'careers',
    title: 'Career Opportunities',
    tags: ['Part-time', 'Internships', 'Freelance'],
    description:
      'Kickstart your professional journey with job listings tailored for students. Find flexible work opportunities that fit your academic schedule.',
    image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070&auto=format&fit=crop',
    imageAlt: 'Career opportunities',
    linkText: 'Find a Job',
    reverse: false,
  },
];

import './Home.css';

function Home() {
  return (
    <div className="home-page-bg">
      {/* Aurora glow layer */}
      <div className="hm-bg-aurora" aria-hidden="true">
        <div className="hm-aurora-blob hm-aurora-blob-1" />
        <div className="hm-aurora-blob hm-aurora-blob-2" />
        <div className="hm-aurora-blob hm-aurora-blob-3" />
      </div>

      {/* Film grain layer */}
      <div className="hm-bg-grain" aria-hidden="true" />

      <Navbar />
      <Hero />
      <EventsBanner />
      {features.map((feature) => (
        <FeatureSection key={feature.id} {...feature} />
      ))}
      <Footer />
    </div>
  );
}

export default Home;
