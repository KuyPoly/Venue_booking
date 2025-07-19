import React from 'react';
import Hero from '../../component/HomePage/Hero';
import CategorySection from '../../component/HomePage/venue_card'; // ✅ adjust path
import Featured from '../../component/HomePage/Featured'; // ✅ adjust path
import DiscoverAndBook from '../../component/HomePage/DiscoverAndBook';

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection /> {/* ✅ Add this line to include the section */}
      <Featured /> {/* ✅ Add this line to include the featured venues */}
      <DiscoverAndBook />

      {/* You can add more sections here later */}
    </div>
  );
}
