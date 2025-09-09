"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useSearchParams, useRouter } from "next/navigation";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Booking = {
	static_id: string;
	billboard: string;
	status: string;
	created_at: string;
	is_active: boolean;
	title: string;
};

type BookingListResponse = {
	count: number;
	page_size: number;
	current_page: number;
	total_pages: number;
	results: Booking[];
};

function BookingRequestsContent() {
	const searchParams = useSearchParams();
	const router = useRouter();
	const page = parseInt(searchParams.get("page") || "1");

	const [bookingsData, setBookingsData] = useState<BookingListResponse | null>(null);
	const [titles, setTitles] = useState<string[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		setLoading(true);
		setError("");
			const fetchBookings = async () => {
				try {
					const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
					const res = await fetch(apiUrl(`/users/vendor/bookings/list/?page=${page}`), {
						cache: "no-store",
						headers: {
							...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
						},
					});
					if (!res.ok) throw new Error("Failed to fetch bookings");
					const data = await res.json();
					setBookingsData(data);
					const titleResults = await Promise.all(
						data.results.map((b: Booking) => fetchBillboardTitle(b.billboard ?? undefined, accessToken || undefined))
					);
					setTitles(titleResults);
				} catch (err) {
					setError(`Error fetching bookings. ${err}`);
					setBookingsData(null);
				}
				setLoading(false);
			};
			fetchBookings();
	}, [page]);

	async function fetchBillboardTitle(static_id: string, accessToken?: string): Promise<string> {
		try {
			const res = await fetch(apiUrl(`/users/vendor/billboard/detail/?id=${static_id}`), {
				cache: "no-store",
				headers: {
					...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
				},
			});
			if (!res.ok) return "-";
			const data = await res.json();
			return data.title || "-";
		} catch {
			return "-";
		}
	}

	if (loading) {
		return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
	}
	if (error) {
		return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
	}
	if (!bookingsData || !bookingsData.results.length) {
		return <div className="p-8 text-center text-lg">No bookings found.</div>;
	}

	return (
		<div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow border border-green-100">
			<h1 className="text-3xl font-bold mb-6 text-green-800">Active Bookings</h1>
			<table className="w-full text-left border-collapse">
				<thead>
					<tr className="bg-green-50">
						<th className="py-3 px-4 font-semibold text-green-700">Billboard Title</th>
						<th className="py-3 px-4 font-semibold text-green-700">Status</th>
						<th className="py-3 px-4 font-semibold text-green-700">Created At</th>
						<th className="py-3 px-4 font-semibold text-green-700">Is Active</th>
					</tr>
				</thead>
				<tbody>
					{bookingsData.results.map((booking, idx) => (
						<tr
							key={booking.static_id}
							className="border-b cursor-pointer hover:bg-green-50 transition"
							onClick={() => router.push(`/dashboard/vendor/booking-requests/details/${booking.static_id}`)}
						>
							<td className="py-2 px-4">
								<span className="text-green-700 underline font-semibold hover:text-green-900">
									{titles[idx]}
								</span>
							</td>
							<td className="py-2 px-4">{booking.status}</td>
							<td className="py-2 px-4">{new Date(booking.created_at).toLocaleString()}</td>
							<td className="py-2 px-4">{booking.is_active ? "Yes" : "No"}</td>
						</tr>
					))}
				</tbody>
			</table>
			{/* Pagination */}
			<div className="flex justify-center items-center gap-2 mt-8">
				{Array.from({ length: bookingsData.total_pages }, (_, i) => (
					<button
						key={i + 1}
						className={`px-4 py-2 rounded ${bookingsData.current_page === i + 1 ? "bg-green-600 text-white" : "bg-green-50 text-green-700 hover:bg-green-100"}`}
						onClick={() => router.push(`/dashboard/vendor/booking-requests?page=${i + 1}`)}
					>
						{i + 1}
					</button>
				))}
			</div>
		</div>
	);
}

import { Suspense } from "react";

export default function VendorBookingRequests() {
	return (
		<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
			<Sidebar />
			<main className="flex-1 flex items-center justify-center">
				<Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>}>
					<BookingRequestsContent />
				</Suspense>
			</main>
		</div>
	);
}
