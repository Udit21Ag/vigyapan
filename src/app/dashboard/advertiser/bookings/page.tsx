"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Booking = {
    static_id: string;
    billboard: string;
    status: string;
    created_at: string;
    is_active: boolean;
};

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [billboardTitles, setBillboardTitles] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: "",
        is_active: "",
        title: ""
    });

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
            const url = apiUrl(`/users/advertiser/bookings/list/?page=${page}`);
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setBookings(data.results || []);
                    setTotalPages(data.total_pages || 1);
                } else {
                    setBookings([]);
                    setTotalPages(1);
                }
            } catch {
                setBookings([]);
                setTotalPages(1);
            }
            setLoading(false);
        };
        fetchBookings();
    }, [page]);

    // Fetch billboard titles for each booking
    useEffect(() => {
        const fetchTitles = async () => {
            const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
            const promises = bookings.map(async (booking) => {
                if (!billboardTitles[booking.billboard]) {
                    try {
                        const res = await fetch(apiUrl(`/users/advertiser/billboard/detail/?id=${booking.billboard}`), {
                            method: "GET",
                            headers: {
                                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                            },
                        });
                        if (res.ok) {
                            const data = await res.json();
                            return { id: booking.billboard, title: data.title };
                        }
                    } catch {}
                }
                return null;
            });
            const results = await Promise.all(promises);
            const titles: Record<string, string> = { ...billboardTitles };
            results.forEach((result) => {
                if (result) titles[result.id] = result.title;
            });
            setBillboardTitles(titles);
        };
        if (bookings.length > 0) fetchTitles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookings]);

    // Filtered bookings
    const filteredBookings = bookings.filter(booking => {
        const statusMatch = !filters.status || booking.status === filters.status;
        const activeMatch = !filters.is_active || String(booking.is_active) === filters.is_active;
        const titleMatch = !filters.title || (billboardTitles[booking.billboard] || "").toLowerCase().includes(filters.title.toLowerCase());
        return statusMatch && activeMatch && titleMatch;
    });

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-green-800 mb-2">Your Bookings</h1>
                        <p className="text-lg text-gray-600">
                            Track and manage your billboard booking requests and confirmations
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Your Bookings</h3>
                            <p className="text-gray-500">Please wait while we fetch your booking history...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">📅</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Bookings Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                You haven&apos;t made any billboard bookings yet. Start exploring and book your first billboard to get started!
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto mb-6">
                                <h4 className="font-semibold text-blue-800 mb-2">🚀 Ready to Get Started?</h4>
                                <p className="text-blue-700 text-sm mb-4">
                                    Browse our extensive collection of billboards in prime locations and make your first booking request.
                                </p>
                                <Link
                                    href="/cities"
                                    className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
                                >
                                    Browse Billboards
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                                            <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
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
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters & Search</h3>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            name="title"
                                            value={filters.title}
                                            onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
                                            placeholder="Search by title..."
                                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                        />
                                    </div>
                                    <select
                                        name="status"
                                        value={filters.status}
                                        onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    >
                                        <option value="">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                    <select
                                        name="is_active"
                                        value={filters.is_active}
                                        onChange={e => setFilters(f => ({ ...f, is_active: e.target.value }))}
                                        className="border border-gray-300 rounded-lg px-4 py-3 text-gray-900 bg-white focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
                                    >
                                        <option value="">All Activity</option>
                                        <option value="true">Active</option>
                                        <option value="false">Inactive</option>
                                    </select>
                                    <button
                                        type="button"
                                        onClick={() => setFilters({ status: "", is_active: "", title: "" })}
                                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition border border-gray-300"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            {/* Results Info */}
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Showing {filteredBookings.length} of {bookings.length} booking{bookings.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Bookings Cards */}
                            <div className="space-y-4">
                                {filteredBookings.map((booking) => (
                                    <div
                                        key={booking.static_id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            {billboardTitles[booking.billboard] || 'Loading...'}
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
                                                            <span className="font-medium">Booking ID:</span>
                                                            <p className="text-gray-900 mt-1 font-mono text-xs">
                                                                {booking.static_id.slice(0, 8)}...
                                                            </p>
                                                        </div>
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
                                                                href={`/dashboard/advertiser/billboard?id=${booking.billboard}`}
                                                                className="text-green-600 hover:text-green-800 font-medium mt-1 block"
                                                            >
                                                                View Details →
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center text-gray-400 ml-4">
                                                    <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                                                        <span className="text-2xl">📺</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center items-center gap-2 mt-8">
                                    <button
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        onClick={() => setPage(page - 1)}
                                        disabled={page <= 1}
                                    >
                                        Previous
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                            <button
                                                key={p}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${
                                                    p === page 
                                                        ? "bg-green-600 text-white shadow-md" 
                                                        : "bg-white text-green-600 border border-gray-200 hover:bg-green-50"
                                                }`}
                                                onClick={() => setPage(p)}
                                            >
                                                {p}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                        onClick={() => setPage(page + 1)}
                                        disabled={page >= totalPages}
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
