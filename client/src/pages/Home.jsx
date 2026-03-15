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
      'All the university events, club events and special notes are in one place.',
    image: '/assets/images/special-notices.png',
    imageAlt: 'University events and notices',
    linkText: 'View All',
    reverse: false,
  },
  {
    id: 'marketplace',
    title: 'Market place',
    tags: ['Boarding items', 'Electronic items', 'Text books'],
    description:
      'Second hand market for all your important items. Buy and Sell platform for students.',
    image: '/assets/images/marketplace.png',
    imageAlt: 'Student marketplace',
    linkText: 'View All',
    reverse: true,
  },
  {
    id: 'bookings',
    title: 'Bookings',
    tags: ['Study areas', 'Sessions', 'Library'],
    description:
      'Book seatings before you miss your favourite spots in studies.',
    image: '/assets/images/bookings.png',
    imageAlt: 'Study room bookings',
    linkText: 'View All',
    reverse: false,
  },
  {
    id: 'boarding',
    title: 'Find a boarding',
    tags: ['Find', 'Rate', 'Share the best places'],
    description:
      'Find convenient boarding places around you recommended by your friends.',
    image: '/assets/images/find-boarding.png',
    imageAlt: 'Student boarding places',
    linkText: 'View All',
    reverse: true,
  },
  {
    id: 'careers',
    title: 'Careers',
    tags: ['Part time', 'Full time', 'Freelance'],
    description:
      'Find job opportunities and post to hire your next employee.',
    image: '/assets/images/careers.png',
    imageAlt: 'Career opportunities',
    linkText: 'View All',
    reverse: false,
  },
];

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <EventsBanner />
      {features.map((feature) => (
        <FeatureSection key={feature.id} {...feature} />
      ))}
      <Footer />
    </>
  );
}

export default Home;
