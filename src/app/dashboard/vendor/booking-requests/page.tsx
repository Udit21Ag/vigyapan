"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Link from "next/link";
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
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [sortOrder, setSortOrder] = useState<string>("latest");

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
				setError(`Error fetching bookings: ${err}`);
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
		return (
			<div className="text-center py-12">
				<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto mb-4"></div>
				<p className="text-lg font-medium text-[#666]">Loading booking requests...</p>
			</div>
		);
	}
	if (error) {
		return (
			<div className="text-center py-12">
				<div className="text-6xl mb-4">⚠️</div>
				<h3 className="text-xl font-semibold text-[#222] mb-2">Error Loading Booking Requests</h3>
				<p className="text-red-600 mb-4">{error}</p>
				<button
					onClick={() => window.location.reload()}
					className="bg-[#1db954] text-white px-6 py-2 rounded-full font-medium hover:bg-[#159c43] transition"
				>
					Retry
				</button>
			</div>
		);
	}
	if (!bookingsData || !bookingsData.results.length) {
		return (
			<div className="text-center py-12">
				<div className="text-6xl mb-4">📋</div>
				<h3 className="text-xl font-semibold text-[#222] mb-2">No booking requests found</h3>
				<p className="text-[#666] mb-4">
					You haven&apos;t received any booking requests yet. When advertisers book your billboards, they&apos;ll appear here.
				</p>
			</div>
		);
	}

	// Filter and sort bookings
	let filteredBookings = bookingsData.results;
	if (statusFilter !== "all") {
		filteredBookings = filteredBookings.filter(b => b.status === statusFilter);
	}
	filteredBookings = [...filteredBookings].sort((a, b) => {
		const aTime = new Date(a.created_at).getTime();
		const bTime = new Date(b.created_at).getTime();
		return sortOrder === "latest" ? bTime - aTime : aTime - bTime;
	});

	return (
		<div className="max-w-full w-[80vw] mx-auto p-10 bg-white rounded-2xl shadow border border-green-100">
			<h1 className="text-3xl font-bold mb-8 text-black">Active Bookings</h1>
			{/* Filters */}
			<div className="flex flex-wrap gap-6 mb-6 items-center">
				<div>
					<label className="font-semibold text-green-700 mr-2">Status:</label>
					<select
						value={statusFilter}
						onChange={e => setStatusFilter(e.target.value)}
						className="border rounded px-3 py-2 text-black bg-green-50"
					>
						<option value="all">All</option>
						<option value="pending">Pending</option>
						<option value="cancelled">Cancelled</option>
						<option value="confirmed">Confirmed</option>
					</select>
				</div>
				<div>
					<label className="font-semibold text-green-700 mr-2">Sort by Time:</label>
					<select
						value={sortOrder}
						onChange={e => setSortOrder(e.target.value)}
						className="border rounded px-3 py-2 text-black bg-green-50"
					>
						<option value="latest">Latest - Oldest</option>
						<option value="oldest">Oldest - Latest</option>
					</select>
				</div>
			</div>
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
					{filteredBookings.map((booking, idx) => (
						<tr
							key={booking.static_id}
							className="border-b cursor-pointer hover:bg-green-50 transition"
							onClick={e => {
								if ((e.target as HTMLElement).tagName !== "A") {
									router.push(`/dashboard/vendor/booking-requests/details/${booking.static_id}`);
								}
							}}
						>
							<td className="py-2 px-4 text-black">
								<Link
									href={`/dashboard/vendor/billboard/details/${booking.billboard}`}
									className="text-green-700 underline font-semibold hover:text-green-900"
									onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
								>
									{titles[idx]}
								</Link>
							</td>
							<td className="py-2 px-4 text-black">{booking.status}</td>
							<td className="py-2 px-4 text-black">{new Date(booking.created_at).toLocaleString()}</td>
							<td className="py-2 px-4 text-black">{booking.is_active ? "Yes" : "No"}</td>
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
