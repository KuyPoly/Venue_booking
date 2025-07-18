import React from 'react';
import Hero from './Hero';
import CategorySection from './CategorySection'; // ✅ adjust path

export default function Home() {
  return (
    <div>
      <Hero />
      <CategorySection /> {/* ✅ Add this line to include the section */}
      {/* You can add more sections here later */}
    </div>
  );
}
