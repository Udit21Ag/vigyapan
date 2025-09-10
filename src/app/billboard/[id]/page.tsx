"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  dimensionLen?: string;
  dimensionWid?: string;
  latitude?: number;
  longitude?: number;
  vendor?: { static_id: string; name: string };
  description?: string;
};

export default function BillboardDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const billboardId = params?.id as string;

  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBooking, setShowBooking] = useState(false);
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [dateError, setDateError] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const minDate = new Date().toISOString().split("T")[0];

  // Check if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("token") || localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch billboard details
  useEffect(() => {
    const fetchBillboard = async () => {
      if (!billboardId) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/advertiser/billboard/detail/?id=${billboardId}`,
          {
            headers: {
              "Content-Type": "application/json",
              ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
            },
          }
        );
        
        if (response.ok) {
          const data: Billboard = await response.json();
          setBillboard(data);
        } else {
          setError('Failed to fetch billboard details');
        }
      } catch (error) {
        console.error('Failed to fetch billboard:', error);
        setError('Failed to fetch billboard details');
      } finally {
        setLoading(false);
      }
    };

    fetchBillboard();
  }, [billboardId]);

  const handleBookingRequest = async () => {
    if (!startDate || !endDate) {
      setDateError("Please select both start and end dates.");
      return;
    }

    if (!isLoggedIn) {
      router.push('/signIn');
      return;
    }

    const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("token");
    
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/advertiser/bookings/create/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({
            start_date: startDate,
            end_date: endDate,
            id: billboardId,
          }),
        }
      );

      if (response.ok) {
        setBookingConfirmed(true);
        setShowBooking(false);
        setDateError("");
      } else {
        const data = await response.json();
        setError(data?.message || "Booking failed. Please try again.");
      }
    } catch {
      setError("Booking failed. Please try again. ");
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

  if (loading) {
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
            <button 
              onClick={() => router.back()}
              className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          </div>
        </header>

        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#1db954]"></div>
        </div>
      </div>
    );
  }

  if (error || !billboard) {
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
            <button 
              onClick={() => router.back()}
              className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
            >
              ← Back
            </button>
          </div>
        </header>

        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-[#222] mb-2">Billboard Not Found</h2>
            <p className="text-[#666] mb-4">{error || 'The billboard you are looking for does not exist.'}</p>
            <button
              onClick={() => router.back()}
              className="bg-[#1db954] text-white px-6 py-2 rounded-full font-medium hover:bg-[#159c43] transition"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <button 
            onClick={() => router.back()}
            className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
          >
            ← Back
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Image and Map */}
          <div className="space-y-6">
            {/* Billboard Image */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden">
              {billboard.photo ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${billboard.photo}`}
                  alt={billboard.title}
                  width={600}
                  height={400}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-8xl">📺</div>
                </div>
              )}
            </div>

            {/* Map */}
            {billboard.latitude && billboard.longitude && (
              <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                <iframe
                  title="Billboard Location"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps?q=${billboard.latitude},${billboard.longitude}&z=16&output=embed`}
                />
              </div>
            )}
          </div>

          {/* Right Column - Details and Booking */}
          <div className="space-y-8">
            {/* Billboard Info */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-4xl font-bold text-[#222]">{billboard.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTypeColor(billboard.type)}`}>
                  {billboard.type}
                </span>
              </div>
              
              <p className="text-lg text-[#666] mb-6">{billboard.address}</p>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-[#666]">City</span>
                  <span className="text-[#222] capitalize">{billboard.city}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-[#666]">Price</span>
                  <span className="text-2xl font-bold text-[#1db954]">₹{billboard.price}/day</span>
                </div>
                
                {billboard.dimensionLen && billboard.dimensionWid && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-[#666]">Dimensions</span>
                    <span className="text-[#222]">{billboard.dimensionLen} x {billboard.dimensionWid} ft</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="font-semibold text-[#666]">Status</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${billboard.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    <span className={`text-sm font-medium ${billboard.is_available ? 'text-green-700' : 'text-red-700'}`}>
                      {billboard.is_available ? 'Available' : 'Not Available'}
                    </span>
                  </div>
                </div>

                {billboard.vendor && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <span className="font-semibold text-[#666]">Vendor</span>
                    <span className="text-[#222]">{billboard.vendor.name}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Booking Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-xl font-bold text-[#222] mb-4">Book this Billboard</h3>
              
              {bookingConfirmed ? (
                <div className="p-4 bg-green-50 rounded-lg text-green-700 text-center font-semibold">
                  🎉 Booking Request Submitted!
                  <p className="text-sm mt-1">Your booking request from {startDate} to {endDate} has been sent to the vendor.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {!showBooking ? (
                    <button
                      onClick={() => {
                        if (!isLoggedIn) {
                          router.push('/signIn');
                          return;
                        }
                        setShowBooking(true);
                      }}
                      disabled={!billboard.is_available}
                      className={`w-full py-3 px-6 rounded-lg font-medium transition ${
                        billboard.is_available 
                          ? 'bg-[#1db954] text-white hover:bg-[#159c43]' 
                          : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {!isLoggedIn ? 'Sign In to Book' : billboard.is_available ? 'Book Now' : 'Not Available'}
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-[#666] mb-2">Start Date</label>
                          <input
                            type="date"
                            value={startDate}
                            min={minDate}
                            onChange={(e) => {
                              setStartDate(e.target.value);
                              setDateError("");
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-[#666] mb-2">End Date</label>
                          <input
                            type="date"
                            value={endDate}
                            min={startDate || minDate}
                            onChange={(e) => {
                              setEndDate(e.target.value);
                              setDateError("");
                            }}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1db954] focus:border-transparent"
                          />
                        </div>
                      </div>
                      
                      {dateError && (
                        <p className="text-red-600 text-sm">{dateError}</p>
                      )}
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowBooking(false)}
                          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-[#666] hover:bg-gray-50 transition"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleBookingRequest}
                          disabled={!startDate || !endDate}
                          className="flex-1 py-2 px-4 bg-[#1db954] text-white rounded-lg font-medium hover:bg-[#159c43] transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Confirm Booking
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Additional Info */}
            {/* <div className="bg-blue-50 rounded-xl p-6">
              <h4 className="font-bold text-[#222] mb-3">💡 Booking Information</h4>
              <ul className="text-sm text-[#666] space-y-2">
                <li>• All bookings are subject to vendor approval</li>
                <li>• You will receive a confirmation email once approved</li>
                <li>• Payment will be processed after confirmation</li>
                <li>• Cancellation policy applies as per terms</li>
              </ul>
            </div> */}
          </div>
        </div>
      </main>
    </div>
  );
}
