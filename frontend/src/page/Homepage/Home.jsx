import React, { useState } from 'react';
import Hero from '../../component/HomePage/Hero';
import CategorySection from '../../component/HomePage/venue_card';
import Featured from '../../component/HomePage/Featured';
import DiscoverAndBook from '../../component/HomePage/DiscoverAndBook';
import SignupModal from '../../component/SignupModal/SignupModal';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      <Hero />
      <CategorySection />
      <Featured />
      <DiscoverAndBook />

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}
    </div>
  );
}