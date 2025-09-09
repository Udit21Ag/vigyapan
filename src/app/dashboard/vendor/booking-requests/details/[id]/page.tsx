"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../Sidebar";
import { useRouter, useParams } from "next/navigation";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type BookingDetail = {
  billboard: string;
  status: string;
  start_date: string;
  end_date: string;
  total_price: string | number;
  created_at: string;
  is_active: boolean;
  title: string;
};

function getDuration(start: string, end: string): string {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  if (diffMs < 0) return "Invalid dates";
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 31) return `${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  const diffMonths = Math.floor(diffDays / 30.44);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? "s" : ""}`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears !== 1 ? "s" : ""}`;
}

function BookingDetailContent() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No booking ID provided.");
      setLoading(false);
      return;
    }
    const fetchBooking = async () => {
      setLoading(true);
      setError("");
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
      try {
        const res = await fetch(apiUrl(`/users/vendor/bookings/detail/?id=${id}`), {
          method: "GET",
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
        });
        if (res.ok) {
          const data = await res.json();
          setBooking(data);
        } else {
          setError("Failed to fetch booking details.");
        }
      } catch {
        setError("Error fetching booking details.");
      }
      setLoading(false);
    };
    fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
  }
  if (error) {
    return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
  }
  if (!booking) {
    return <div className="flex justify-center items-center min-h-screen text-lg">No details found.</div>;
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-2xl shadow border border-green-100">
      <h1 className="text-3xl font-bold mb-6 text-green-800">Booking Details</h1>
      <div className="space-y-4 text-lg">
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Billboard Title:</span>
          <span>{booking.title}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Status:</span>
          <span>{booking.status}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Start Date:</span>
          <span>{booking.start_date}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">End Date:</span>
          <span>{booking.end_date}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Total Duration:</span>
          <span>{getDuration(booking.start_date, booking.end_date)}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Booking Creation Date:</span>
          <span>{new Date(booking.created_at).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-gray-100">
          <span className="font-semibold text-green-700">Is Active:</span>
          <span>{booking.is_active ? "Yes" : "No"}</span>
        </div>
      </div>
      <div className="flex gap-4 mt-10">
        <button
          className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-lg"
          onClick={() => router.back()}
        >
          ← Back to List
        </button>
      </div>
    </div>
  );
}

export default function VendorBookingDetail() {
  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
      <Sidebar />
      <main className="flex-1 flex items-center justify-center">
        <BookingDetailContent />
      </main>
    </div>
  );
}
