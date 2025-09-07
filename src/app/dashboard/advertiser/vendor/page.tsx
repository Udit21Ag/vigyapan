"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Vendor = {
  static_id: string;
  name?: string;
  [key: string]: unknown;
};

function VendorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const staticId = searchParams.get("id");
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!staticId) {
      setError("No vendor ID provided.");
      setLoading(false);
      return;
    }
    const fetchVendor = async () => {
      setLoading(true);
      setError("");
      try {
        const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
        const res = await fetch(apiUrl(`/users/vendor/profile/detail/?id=${staticId}`), {
          method: "GET",
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch vendor");
        const data = await res.json();
        setVendor(data);
      } catch {
        setError("Error fetching vendor details.");
      }
      setLoading(false);
    };
    fetchVendor();
  }, [staticId]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
  }
  if (!vendor) {
    return <div className="flex justify-center items-center min-h-screen text-lg">No details found.</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7ee] to-[#c3e6d6] p-8 overflow-hidden">
      <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-2xl w-full border border-green-100">
        <h1 className="text-4xl font-extrabold text-green-800 mb-8 tracking-tight text-center">Vendor Details</h1>
        <div className="mb-6 text-gray-700 text-lg">
          <span className="font-semibold">Name:</span> {vendor.name}
        </div>
        {Object.entries(vendor)
          .filter(([key]) => !["created_at", "is_active", "profile", "authUser", "photo", "static_id", "name"].includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="font-semibold text-green-700 capitalize">{key.replace(/_/g, " ")}</span>
              <span className="break-all text-gray-800">{String(value)}</span>
            </div>
          ))}
        <div className="flex gap-4 mt-10">
          <button
            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-lg"
            onClick={() => router.back()}
          >
            ← Back to List
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VendorDetail() {
  return (
    <React.Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>}>
      <VendorContent />
    </React.Suspense>
  );
}
