import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const CitiesTable = () => {
  const [cities, setCities] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  // Function to fetch cities from the API
  const fetchCities = async (page, query = '') => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://public.opendatasoft.com/api/records/1.0/search/?dataset=geonames-all-cities-with-a-population-1000&rows=20&start=${page * 20}&q=${query}`
      );
      const data = await response.json();
      console.log('Fetched data:', data); // Debugging log

      if (data.records && data.records.length > 0) {
        setCities((prev) => [...prev, ...data.records]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCities(page, query);
  }, [page, query]);

  // Handle search input change
  const handleSearch = (e) => {
    setQuery(e.target.value);
    setCities([]); // Reset the cities array on new search
    setPage(0);     // Reset the page to 0 for new search
    setHasMore(true); // Reset the hasMore flag
  };

  // Handle scroll event for infinite scrolling
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop < 
      document.documentElement.offsetHeight - 200 || // Trigger 200px before reaching the bottom
      loading
    ) {
      return;
    }
    if (hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div>
      <h1>Cities</h1>
      <input
        type="text"
        placeholder="Search for a city or country..."
        value={query}
        onChange={handleSearch}
        className="search-bar"
      />
      <table className="city-table">
        <thead>
          <tr>
            <th>City Name</th>
            <th>Country</th>
            <th>Timezone</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((city, index) => (
              <tr key={index}>
                <td>
                  <Link to={`/weather/${city.fields.name}`}>{city.fields.name}</Link>
                </td>
                <td>{city.fields.cou_name_en || 'Unknown'}</td> {/* Update the field here */}
                <td>{city.fields.timezone || 'Unknown'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && <p className="loading">Loading more cities...</p>}
    </div>
  );
};

export default CitiesTable;
