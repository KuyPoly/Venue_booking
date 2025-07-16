import React from "react";
import { useLocation } from "react-router-dom";
import rackData from "../../data/rack.json";
import benchData from "../../data/bench.json";
import specialtyData from "../../data/specialty.json";
import barWeightData from "../../data/bar_weight.json";
import accessoriesData from "../../data/accessories.json";
import Card from "../../component/rackpage/cards"; // Assuming you have a Card component for displaying items
import "./navbar.css";

export default function SearchResult() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  // Combine all data into a single array
  const allData = [
    ...rackData,
    ...benchData,
    ...specialtyData,
    ...barWeightData,
    ...accessoriesData,
  ];

  // Filter data based on the search query
  const filteredData = allData.filter((item) =>
    item.name.toLowerCase().includes(query)
  );

  return (
    <div className="search-result-page">
      <h2>Search Results for "{query}"</h2>
      {filteredData.length > 0 ? (
        <div className="search-result-grid">
          {filteredData.map((item, index) => (
            <Card key={index} item={item} />
          ))}
        </div>
      ) : (
        <p>No results found for your search.</p>
      )}
    </div>
  );
}