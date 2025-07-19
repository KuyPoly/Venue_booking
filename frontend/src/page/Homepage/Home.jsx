import React, { useState } from 'react';
import Hero from '../../component/HomePage/Hero';
import CategorySection from '../../component/HomePage/venue_card'; // ✅ adjust path
import Featured from '../../component/HomePage/Featured'; // ✅ adjust path
import DiscoverAndBook from '../../component/HomePage/DiscoverAndBook';
import SignupModal from '../../components/SignupModal';

export default function Home() {
  const [showSignup, setShowSignup] = useState(false);

  return (
    <div>
      <Hero />
      <CategorySection /> {/* ✅ Add this line to include the section */}
      <Featured /> {/* ✅ Add this line to include the featured venues */}
      <DiscoverAndBook />

      {showSignup && <SignupModal onClose={() => setShowSignup(false)} />}

      {/* You can add more sections here later */}
    </div>
  );
}
