import React from 'react';
import Hero from '../../component/HomePage/Hero';
import CategorySection from '../../component/HomePage/venue_card'; // ✅ adjust path

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection /> {/* ✅ Add this line to include the section */}
      {/* You can add more sections here later */}
    </div>
  );
}
