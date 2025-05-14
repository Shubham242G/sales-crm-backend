import React, { useState } from "react";

function SearchBar() {
  const [searchData, setSearchData] = useState({
    location: "",
    startDate: "",
    endDate: "",
    eventSize: "",
  });
  const [filters, setFilters] = useState({
    regions: "",
    maxRadius: "",
    promotions: "",
    chains: "",
    rating: [1, 5],
    includeUnrated: false,
    amenities: "",
    venueTypes: "",
    totalMeetingSpace: [0, 100000],
    largestRoom: [0, 100000],
    meetingRooms: [0, 50],
    guestRooms: [0, 1000],
    areas: "",
    distanceFromAirport: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearchChange = (e:any) => {
    const { name, value } = e.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e:any) => {
    const { name, value, type, checked } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleRangeChange = (name: any, value:any) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // const handleSearch = () => {
  //   console.log("Searching with:", searchData, "and filters:", filters);
  // };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      {/* Header */}
      <header className="bg-white p-4 shadow-md">
        <h1 className="text-xl font-bold text-gray-800 ml-4">
          Find Meeting Venues, Request Quotes, and Book Event Space
        </h1>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              name="location"
              placeholder="Where is your event?"
              value={searchData.location}
              onChange={handleSearchChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="date"
              name="startDate"
              placeholder="Start date"
              value={searchData.startDate}
              onChange={handleSearchChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="date"
              name="endDate"
              placeholder="End date"
              value={searchData.endDate}
              onChange={handleSearchChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex-1">
            <input
              type="number"
              name="eventSize"
              placeholder="Event size"
              min={0}
              value={searchData.eventSize}
              onChange={handleSearchChange}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-200 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Filter
            </button>
            <button
              // onClick={handleSearch}
              className="bg-orange-500 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Find venues
            </button>
          </div>
        </div>

        {/* Filter Panel (shown when Filter button is clicked) */}
        {showFilters && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Filters</h2>

            {/* Location Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                LOCATION
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  name="location"
                  placeholder="Where is your event?"
                  value={searchData.location}
                  onChange={handleSearchChange}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">or</span>
                <select
                  name="regions"
                  value={filters.regions}
                  onChange={handleFilterChange}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select regions</option>
                  <option value="north-america">North America</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                </select>
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Maximum radius
                </label>
                <input
                  type="number"
                  name="maxRadius"
                  placeholder="Enter radius"
                  value={filters.maxRadius}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Event Dates Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                EVENT DATES
              </h3>
              <div className="flex gap-4">
                <input
                  type="date"
                  name="startDate"
                  value={searchData.startDate}
                  onChange={handleSearchChange}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-gray-500">-</span>
                <input
                  type="date"
                  name="endDate"
                  value={searchData.endDate}
                  onChange={handleSearchChange}
                  className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mt-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Promotions or need by
                </label>
                <input
                  type="text"
                  name="promotions"
                  placeholder="Enter promotions or need by"
                  value={filters.promotions}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Venue Details Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                VENUE DETAILS
              </h3>
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Chains, brands, venues, or affiliates
                </label>
                <input
                  type="text"
                  name="chains"
                  placeholder="Don't see a chain, brand, venue, or affiliate? Enter its name."
                  value={filters.chains}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  <span>{filters.rating[0]} ★</span>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={filters.rating[1]}
                    onChange={(e) =>
                      handleRangeChange("rating", [
                        filters.rating[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                  <span>{filters.rating[1]} ★</span>
                </div>
                <label className="flex items-center gap-2 mt-2">
                  <input
                    type="checkbox"
                    name="includeUnrated"
                    checked={filters.includeUnrated}
                    onChange={handleFilterChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm text-gray-700">
                    Include unrated venues
                  </span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Amenities
                </label>
                <select
                  name="amenities"
                  value={filters.amenities}
                  onChange={handleFilterChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select amenities</option>
                  <option value="wifi">WiFi</option>
                  <option value="parking">Parking</option>
                  <option value="pool">Pool</option>
                </select>
              </div>
            </div>

            {/* Venue Types Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                VENUE TYPES
              </h3>
              <select
                name="venueTypes"
                value={filters.venueTypes}
                onChange={handleFilterChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">
                  Boutique hotels, Conference centers, Hotels, Lux...
                </option>
                <option value="boutique">Boutique hotels</option>
                <option value="conference">Conference centers</option>
                <option value="hotels">Hotels</option>
              </select>
            </div>

            {/* Space Details Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                SPACE DETAILS
              </h3>
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Total meeting space
                </label>
                <div className="flex items-center gap-2">
                  <span>{filters.totalMeetingSpace[0]} sq.ft.</span>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={filters.totalMeetingSpace[1]}
                    onChange={(e) =>
                      handleRangeChange("totalMeetingSpace", [
                        filters.totalMeetingSpace[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                  <span>{filters.totalMeetingSpace[1]} sq.ft.</span>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Largest room
                </label>
                <div className="flex items-center gap-2">
                  <span>{filters.largestRoom[0]} sq.ft.</span>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    value={filters.largestRoom[1]}
                    onChange={(e) =>
                      handleRangeChange("largestRoom", [
                        filters.largestRoom[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                  <span>{filters.largestRoom[1]} sq.ft.</span>
                </div>
              </div>
              <div className="mb-2">
                <label className="block text-sm text-gray-700 mb-1">
                  Meeting rooms
                </label>
                <div className="flex items-center gap-2">
                  <span>{filters.meetingRooms[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={filters.meetingRooms[1]}
                    onChange={(e) =>
                      handleRangeChange("meetingRooms", [
                        filters.meetingRooms[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                  <span>{filters.meetingRooms[1]}+</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Guest rooms
                </label>
                <div className="flex items-center gap-2">
                  <span>{filters.guestRooms[0]}</span>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={filters.guestRooms[1]}
                    onChange={(e) =>
                      handleRangeChange("guestRooms", [
                        filters.guestRooms[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="flex-1"
                  />
                  <span>{filters.guestRooms[1]}+</span>
                </div>
              </div>
            </div>

            {/* Surrounding Areas Section */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                SURROUNDING AREAS
              </h3>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Areas
                  </label>
                  <select
                    name="areas"
                    value={filters.areas}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select areas</option>
                    <option value="downtown">Downtown</option>
                    <option value="suburbs">Suburbs</option>
                    <option value="rural">Rural</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-700 mb-1">
                    Distance from airport
                  </label>
                  <select
                    name="distanceFromAirport"
                    value={filters.distanceFromAirport}
                    onChange={handleFilterChange}
                    className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select distance</option>
                    <option value="5-miles">Within 5 miles</option>
                    <option value="10-miles">Within 10 miles</option>
                    <option value="20-miles">Within 20 miles</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Apply Filters Button */}
            <button
              // onClick={handleSearch}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Find venues
            </button>
          </div>
        )}

        {/* Results Section (Placeholder) */}
        <div>
  <h2 className="text-2xl font-bold mb-6 text-gray-800">Search Results</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100">
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-gray-800">Sample Venue</h3>
        <p className="text-gray-600 text-sm">📍 New York, NY</p>
        <p className="text-gray-500 text-sm">🏨 Type: Hotel | 👥 Capacity: 100</p>
        <button className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
          View Details
        </button>
      </div>
    </div>
  </div>
</div>

      </div>
    </div>
  );
}

export default SearchBar;