"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useProfileProtection } from "../../../../hooks/useProfileProtection";

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
			<div className="max-w-6xl mx-auto p-8">
				<div className="text-center py-16">
					<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
					<h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Booking Requests</h3>
					<p className="text-gray-500">Please wait while we fetch your booking requests...</p>
				</div>
			</div>
		);
	}
	if (error) {
		return (
			<div className="max-w-6xl mx-auto p-8">
				<div className="text-center py-16">
					<div className="text-6xl mb-6">⚠️</div>
					<h3 className="text-2xl font-bold text-red-600 mb-4">Error Loading Booking Requests</h3>
					<p className="text-gray-600 mb-6 max-w-md mx-auto">{error}</p>
					<button
						onClick={() => window.location.reload()}
						className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}
	if (!bookingsData || !bookingsData.results.length) {
		return (
			<div className="max-w-6xl mx-auto p-8">
				<div className="text-center py-16">
					<div className="text-8xl mb-6">📋</div>
					<h3 className="text-2xl font-bold text-gray-700 mb-4">No Booking Requests Yet</h3>
					<p className="text-gray-500 mb-6 max-w-md mx-auto">
						You haven&apos;t received any booking requests yet. When advertisers book your billboards, they&apos;ll appear here.
					</p>
					<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
						<h4 className="font-semibold text-blue-800 mb-2">💡 Tip</h4>
						<p className="text-blue-700 text-sm">
							Make sure your billboards are marked as available and have competitive pricing to attract more bookings.
						</p>
					</div>
				</div>
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
		<div className="max-w-6xl mx-auto p-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold text-green-800 mb-2">Booking Requests</h1>
				<p className="text-lg text-gray-600">
					Manage and respond to billboard booking requests from advertisers
				</p>
			</div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Total Requests</p>
							<p className="text-2xl font-bold text-gray-900">{bookingsData.count}</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">📋</span>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Pending</p>
							<p className="text-2xl font-bold text-yellow-600">
								{filteredBookings.filter(b => b.status === 'pending').length}
							</p>
						</div>
						<div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">⏳</span>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Confirmed</p>
							<p className="text-2xl font-bold text-green-600">
								{filteredBookings.filter(b => b.status === 'confirmed').length}
							</p>
						</div>
						<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">✅</span>
						</div>
					</div>
				</div>
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600">Active</p>
							<p className="text-2xl font-bold text-blue-600">
								{filteredBookings.filter(b => b.is_active).length}
							</p>
						</div>
						<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
							<span className="text-2xl">🚀</span>
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
				<h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Sorting</h3>
				<div className="flex flex-wrap gap-6 items-center">
					<div className="flex items-center gap-2">
						<label className="font-medium text-gray-700">Status:</label>
						<select
							value={statusFilter}
							onChange={e => setStatusFilter(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
						>
							<option value="all">All Status</option>
							<option value="pending">Pending</option>
							<option value="cancelled">Cancelled</option>
							<option value="confirmed">Confirmed</option>
						</select>
					</div>
					<div className="flex items-center gap-2">
						<label className="font-medium text-gray-700">Sort by:</label>
						<select
							value={sortOrder}
							onChange={e => setSortOrder(e.target.value)}
							className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
						>
							<option value="latest">Latest First</option>
							<option value="oldest">Oldest First</option>
						</select>
					</div>
				</div>
			</div>

			{/* Booking Requests Cards */}
			<div className="space-y-4">
				{filteredBookings.map((booking, idx) => (
					<div
						key={booking.static_id}
						className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all cursor-pointer"
						onClick={() => router.push(`/dashboard/vendor/booking-requests/details/${booking.static_id}`)}
					>
						<div className="p-6">
							<div className="flex items-start justify-between">
								<div className="flex-1">
									<div className="flex items-center gap-3 mb-3">
										<h3 className="text-xl font-semibold text-gray-900">
											{titles[idx] || 'Loading...'}
										</h3>
										<span className={`px-3 py-1 rounded-full text-sm font-medium ${
											booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
											booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
											booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
											'bg-gray-100 text-gray-800'
										}`}>
											{booking.status}
										</span>
										{booking.is_active && (
											<span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
												Active
											</span>
										)}
									</div>
									<div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
										<div>
											<span className="font-medium">Request Date:</span>
											<p className="text-gray-900 mt-1">
												{new Date(booking.created_at).toLocaleDateString()}
											</p>
										</div>
										<div>
											<span className="font-medium">Request Time:</span>
											<p className="text-gray-900 mt-1">
												{new Date(booking.created_at).toLocaleTimeString()}
											</p>
										</div>
										<div>
											<span className="font-medium">Billboard:</span>
											<Link
												href={`/dashboard/vendor/billboard/details/${booking.billboard}`}
												className="text-green-600 hover:text-green-800 font-medium mt-1 block"
												onClick={(e: React.MouseEvent<HTMLAnchorElement>) => e.stopPropagation()}
											>
												View Details →
											</Link>
										</div>
										<div>
											<span className="font-medium">Status:</span>
											<p className={`mt-1 font-medium ${
												booking.is_active ? 'text-green-600' : 'text-gray-500'
											}`}>
												{booking.is_active ? 'Currently Active' : 'Inactive'}
											</p>
										</div>
									</div>
								</div>
								<div className="flex items-center text-gray-400">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
									</svg>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* Pagination */}
			{bookingsData.total_pages > 1 && (
				<div className="flex justify-center items-center gap-2 mt-8">
					<div className="flex items-center gap-1">
						{Array.from({ length: bookingsData.total_pages }, (_, i) => (
							<button
								key={i + 1}
								className={`px-4 py-2 rounded-lg font-medium transition ${
									bookingsData.current_page === i + 1 
										? "bg-green-600 text-white shadow-md" 
										: "bg-white text-green-600 border border-gray-200 hover:bg-green-50"
								}`}
								onClick={() => router.push(`/dashboard/vendor/booking-requests?page=${i + 1}`)}
							>
								{i + 1}
							</button>
						))}
					</div>
				</div>
			)}
		</div>
	);
}

import { Suspense } from "react";

export default function VendorBookingRequests() {
	// Protect route and check profile completion
	useProfileProtection();
	
	return (
		<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
			<Sidebar />
			<main className="flex-1 p-8">
				<Suspense fallback={
					<div className="max-w-6xl mx-auto p-8">
						<div className="text-center py-16">
							<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">Loading</h3>
							<p className="text-gray-500">Please wait...</p>
						</div>
					</div>
				}>
					<BookingRequestsContent />
				</Suspense>
			</main>
		</div>
	);
}
