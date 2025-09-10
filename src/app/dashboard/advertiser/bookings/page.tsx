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
            <main className="flex-1 flex flex-col items-center justify-center p-12">
                <h1 className="text-3xl font-bold text-green-700 mb-6">Your Bookings</h1>
                <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1db954] mx-auto mb-4"></div>
                            <p className="text-lg font-medium text-[#666]">Loading your bookings...</p>
                        </div>
                    ) : bookings.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📅</div>
                            <h3 className="text-xl font-semibold text-[#222] mb-2">No bookings found</h3>
                            <p className="text-[#666] mb-4">
                                You haven&apos;t made any billboard bookings yet. Start exploring and book your first billboard!
                            </p>
                            <a
                                href="/cities"
                                className="bg-[#1db954] text-white px-6 py-2 rounded-full font-medium hover:bg-[#159c43] transition"
                            >
                                Browse Billboards
                            </a>
                        </div>
                    ) : (
                        <>
                            {/* Filters */}
                            <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
                                <input
                                    type="text"
                                    name="title"
                                    value={filters.title}
                                    onChange={e => setFilters(f => ({ ...f, title: e.target.value }))}
                                    placeholder="Search Title"
                                    className="border px-3 py-2 rounded text-black bg-gray-50"
                                />
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
                                    className="border px-3 py-2 rounded text-black bg-gray-50"
                                >
                                    <option value="">Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="confirmed">Confirmed</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                                <select
                                    name="is_active"
                                    value={filters.is_active}
                                    onChange={e => setFilters(f => ({ ...f, is_active: e.target.value }))}
                                    className="border px-3 py-2 rounded text-black bg-gray-50"
                                >
                                    <option value="">Active?</option>
                                    <option value="true">Yes</option>
                                    <option value="false">No</option>
                                </select>
                                <button
                                    type="button"
                                    onClick={() => setFilters({ status: "", is_active: "", title: "" })}
                                    className="px-4 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition"
                                >
                                    Clear Filters
                                </button>
                            </div>
                            <table className="w-full table-auto text-black mb-6">
                                <thead>
                                    <tr className="bg-green-100">
                                        <th className="px-4 py-2">Title</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Created At</th>
                                        <th className="px-4 py-2">Active</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredBookings.map((booking) => (
                                        <tr key={booking.static_id} className="hover:bg-green-50 cursor-pointer">
                                            <td className="px-4 py-2 font-medium">
                                                <Link
                                                    href={`/dashboard/advertiser/billboard?id=${booking.billboard}`}
                                                    className="text-green-700 underline hover:text-green-900"
                                                >
                                                    {billboardTitles[booking.billboard] || booking.billboard}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2 capitalize">{booking.status}</td>
                                            <td className="px-4 py-2">{new Date(booking.created_at).toLocaleString()}</td>
                                            <td className="px-4 py-2">{booking.is_active ? "Yes" : "No"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Pagination Controls */}
                            <div className="flex justify-center items-center gap-2 mt-2">
                                <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    onClick={() => setPage(page - 1)}
                                    disabled={page <= 1}
                                >
                                    Prev
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                                    <button
                                        key={p}
                                        className={`px-3 py-1 rounded ${p === page ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-300'}`}
                                        onClick={() => setPage(p)}
                                        disabled={p === page}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                                    onClick={() => setPage(page + 1)}
                                    disabled={page >= totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </main>
        </div>
    );
}
