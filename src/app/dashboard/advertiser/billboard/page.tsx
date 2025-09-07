"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

function BillboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const staticId = searchParams.get("id");
  type Billboard = {
    title: string;
    address: string;
    city: string;
    status: string;
    is_available: boolean;
    type: string;
    price: string | number;
    dimensionLen?: string;
    dimensionWid?: string;
    latitude?: number;
    longitude?: number;
    vendor?: { static_id: string; name: string };
  };
  const [billboard, setBillboard] = useState<Billboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!staticId) {
      setError("No billboard ID provided.");
      setLoading(false);
      return;
    }
    const fetchBillboard = async () => {
      setLoading(true);
      setError("");
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
      try {
        const res = await fetch(apiUrl(`/users/advertiser/billboard/detail/?id=${staticId}`), {
          method: "GET",
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBillboard(data);
        } else {
          setError("Failed to fetch billboard details.");
        }
      } catch {
        setError("Error fetching billboard details.");
      }
      setLoading(false);
    };
    fetchBillboard();
  }, [staticId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
  }
  if (!billboard) {
    return <div className="flex justify-center items-center min-h-screen text-lg">No details found.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7ee] to-[#c3e6d6] p-8 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-4xl w-full border border-green-100 flex flex-row gap-10 items-start">
        {/* Left: Map and Location */}
        <div className="w-1/2 flex flex-col items-start">
          <h2 className="text-2xl font-bold text-green-700 mb-4">Location</h2>
          <div className="mb-2 text-gray-700 text-base">
            <span className="font-semibold">Address:</span> {billboard.address}
          </div>
          {billboard.latitude && billboard.longitude && (
            <div className="mt-2 rounded-lg overflow-hidden border border-green-200 shadow w-full">
              <iframe
                title="Google Map"
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
        {/* Right: Details */}
        <div className="w-1/2 space-y-6 text-[1.15rem] text-gray-900">
          <h1 className="text-4xl font-extrabold text-green-800 mb-8 tracking-tight">Billboard Details</h1>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Title:</span>
            <span>{billboard.title}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">City:</span>
            <span>{billboard.city}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Type:</span>
            <span>{billboard.type}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Price:</span>
            <span className="font-bold">₹{billboard.price}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Status:</span>
            <span>{String(billboard.status)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Available:</span>
            <span>{billboard.is_available ? "Yes" : "No"}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="font-semibold text-green-700">Dimensions:</span>
            <span>{billboard.dimensionLen} x {billboard.dimensionWid} ft</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="font-semibold text-green-700">Vendor:</span>
            {billboard.vendor ? (
              <button
                className="text-green-800 font-bold underline hover:text-green-600 transition"
                onClick={() => {
                  if (billboard.vendor?.static_id) {
                    router.push(`/dashboard/advertiser/vendor?id=${billboard.vendor?.static_id}`);
                  }
                }}
              >
                {billboard.vendor.name}
              </button>
            ) : (
              <span className="text-gray-500">Unknown</span>
            )}
          </div>
          <div className="flex gap-4 mt-10">
            <button
              className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-lg"
              onClick={() => router.back()}
            >
              ← Back to List
            </button>
            <button
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-lg"
              onClick={() => alert('Book Billboard feature coming soon!')}
            >
              Book Billboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BillboardDetail() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>}>
      <BillboardContent />
    </React.Suspense>
  );
}
