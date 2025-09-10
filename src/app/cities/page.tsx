"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

type CityData = {
  static_id: string;
  city_name: {
    static_id: string;
    city: string;
  };
  photo: string | null;
  billboardCount: number;
};

export default function CitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch cities from API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city/billboards/list/`);
        if (response.ok) {
          const data = await response.json();
          setCities(data);
        }
      } catch (error) {
        console.error('Failed to fetch cities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search query
    const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return cities;
    
    return cities.filter((city) =>
      city.city_name.city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [cities, searchQuery]);

  // Generate gradient colors
  const getGradientClass = (index: number) => {
    const gradients = [
      "from-red-100 to-red-200",
      "from-blue-100 to-blue-200", 
      "from-green-100 to-green-200",
      "from-yellow-100 to-orange-200",
      "from-purple-100 to-pink-200",
      "from-indigo-100 to-indigo-200",
      "from-teal-100 to-teal-200",
      "from-orange-100 to-orange-200",
      "from-pink-100 to-pink-200",
      "from-gray-100 to-gray-200",
      "from-amber-100 to-amber-200",
      "from-slate-100 to-slate-200"
    ];
    return gradients[index % gradients.length];
  };

  return (
    <div className="min-h-screen bg-[#f8fcfa] font-inter">
      {/* Header */}
      <header className="w-full border-b-1 pb-5 bg-white">
        <div className="flex items-center justify-between px-12 pt-5 max-w-6xl mx-auto w-full flex-wrap gap-4">
          <Link href="/">
            <Image
              src="/vigyapan.png"
              alt="Vigyapan"
              width={160}
              height={60}
              className="h-[38px] w-auto cursor-pointer"
            />
          </Link>
          <Link 
            href="/"
            className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#222] mb-4">All Cities</h1>
          <p className="text-lg text-[#666] mb-8">
            Discover billboard advertising opportunities across India&apos;s major cities
          </p>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto relative">
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent text-[#222]"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-[#666]">
            {loading ? "Loading..." : `${filteredCities.length} ${filteredCities.length === 1 ? 'city' : 'cities'} found`}
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-2xl mb-3"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Cities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredCities.map((city, index) => (
                <div 
                  key={city.static_id}
                  className="group cursor-pointer"
                  onClick={() => window.location.href = `/billboards/${city.static_id}`}
                >
                  <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${getGradientClass(index)} h-48 mb-3 group-hover:shadow-lg transition-all`}>
                    {city.photo ? (
                      <>
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${city.photo}`}
                          alt={city.city_name.city}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </>
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="bg-white/90 text-xs font-medium px-2 py-1 rounded-full text-black">
                        {city.billboardCount} Billboard{city.billboardCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {index < 3 && (
                      <div className="absolute top-3 right-3">
                        <span className="bg-[#1db954] text-black text-xs font-medium px-2 py-1 rounded-full">
                          Popular
                        </span>
                      </div>
                    )}
                    {!city.photo && (
                      <div className="flex items-center justify-center h-full text-6xl">
                        🏛️
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-[#222] group-hover:text-[#1db954] transition-colors capitalize">
                    {city.city_name.city}
                  </h3>
                  <p className="text-sm text-black">
                    {city.billboardCount} advertising space{city.billboardCount !== 1 ? 's' : ''} available
                  </p>
                </div>
              ))}
            </div>

            {/* No Results */}
            {filteredCities.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-[#222] mb-2">No cities found</h3>
                <p className="text-[#666] mb-4">
                  Try adjusting your search terms or browse all available cities.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="bg-[#1db954] text-white px-6 py-2 rounded-full font-medium hover:bg-[#159c43] transition"
                >
                  Clear Search
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
