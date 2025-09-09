"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

type Billboard = {
  static_id: string;
  title: string;
  address: string;
  city: string;
  status: string;
  is_available: boolean;
  type: string;
  price: string;
  photo: string | null;
};

type ApiResponse = {
  count: number;
  page_size: number;
  current_page: number;
  total_pages: number;
  city: string;
  results: Billboard[];
};

export default function CityBillboardsPage() {
  const params = useParams();
  const cityId = params?.city as string;

  const [billboards, setBillboards] = useState<Billboard[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState<string | null>(null);
  const [cityDisplayName, setCityDisplayName] = useState<string>('');

  // Fetch billboards for the specific city
  useEffect(() => {
    const fetchBillboards = async () => {
      if (!cityId) return;
      
      console.log('Fetching billboards for cityId (static_id):', cityId);
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch billboards using city static_id
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city/billboard/citylist/?id=${cityId}&page=${currentPage}`
        );
        
        console.log('API call URL:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city/billboard/citylist/?id=${cityId}&page=${currentPage}`);
        
        if (response.ok) {
          const data: ApiResponse = await response.json();
          console.log('API Response:', data);
          setBillboards(data.results);
          setTotalPages(data.total_pages);
          setTotalCount(data.count);
          setPageSize(data.page_size);
          
          // Set city name from the API response
          if (data.city) {
            setCityDisplayName(data.city);
          }
        } else {
          console.error('API Error Response:', response.status, response.statusText);
          setError(`Failed to fetch billboards: ${response.status} ${response.statusText}`);
        }
      } catch (error) {
        console.error('Failed to fetch billboards:', error);
        setError('Failed to fetch billboards');
      } finally {
        setLoading(false);
      }
    };

    fetchBillboards();
  }, [cityId, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'digital':
        return 'bg-blue-100 text-blue-800';
      case 'traditional':
        return 'bg-green-100 text-green-800';
      case 'led':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        items.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        items.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return items;
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
            href="/cities"
            className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
          >
            ← Back to Cities
          </Link>
        </div>
      </header>

      {/* Page Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#222] mb-2 capitalize">
            {loading && !cityDisplayName ? 'Loading...' : `Billboards in ${cityDisplayName || 'City'}`}
          </h1>
          <p className="text-lg text-[#666]">
            {loading ? 'Loading...' : `${totalCount} billboard${totalCount !== 1 ? 's' : ''} available`}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 h-48 rounded-xl mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-2/3 mb-2"></div>
                <div className="bg-gray-200 h-3 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Billboards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {billboards.map((billboard) => (
                <div
                  key={billboard.static_id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Billboard Image */}
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
                    {billboard.photo ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_IMAGE_BASE_URL}${billboard.photo}`}
                        alt={billboard.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="text-6xl">📺</div>
                    )}
                  </div>
                  
                  {/* Billboard Info */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-[#222]">{billboard.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(billboard.type)}`}>
                        {billboard.type}
                      </span>
                    </div>
                    
                    <p className="text-[#666] text-sm mb-3 line-clamp-2">
                      {billboard.address}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-[#1db954]">
                        ₹{billboard.price}/day
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${billboard.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className={`text-xs font-medium ${billboard.is_available ? 'text-green-700' : 'text-red-700'}`}>
                          {billboard.is_available ? 'Available' : 'Not Available'}
                        </span>
                      </div>
                    </div>
                    
                    {billboard.is_available ? (
                      <button
                        onClick={() => {
                          // Check if user is logged in
                          const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
                          if (token) {
                            // User is logged in, redirect to billboard details
                            window.location.href = `/billboard/${billboard.static_id}`;
                          } else {
                            // User is not logged in, redirect to sign in
                            window.location.href = '/signIn';
                          }
                        }}
                        className="w-full py-2 px-4 rounded-lg font-medium transition bg-[#1db954] text-white hover:bg-[#159c43]"
                      >
                        Request Booking
                      </button>
                    ) : (
                      <button 
                        className="w-full py-2 px-4 rounded-lg font-medium transition bg-gray-200 text-gray-500 cursor-not-allowed"
                        disabled
                      >
                        Unavailable
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* No Results */}
            {billboards.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚫</div>
                <h3 className="text-xl font-semibold text-[#222] mb-2">No billboards found</h3>
                <p className="text-[#666] mb-4">
                  There are currently no billboards available in {cityDisplayName || 'this city'}.
                </p>
                <Link
                  href="/cities"
                  className="bg-[#1db954] text-white px-6 py-2 rounded-full font-medium hover:bg-[#159c43] transition"
                >
                  Browse Other Cities
                </Link>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8">
                <div className="text-sm text-[#666]">
                  Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, totalCount)} of {totalCount} results
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Previous
                  </button>
                  
                  {generatePaginationItems().map((item, index) => (
                    <button
                      key={index}
                      onClick={() => typeof item === 'number' ? handlePageChange(item) : undefined}
                      disabled={typeof item !== 'number'}
                      className={`px-3 py-2 text-sm border rounded-lg transition ${
                        item === currentPage
                          ? 'bg-[#1db954] text-white border-[#1db954]'
                          : typeof item === 'number'
                          ? 'border-gray-300 hover:bg-gray-50'
                          : 'border-transparent cursor-default'
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
