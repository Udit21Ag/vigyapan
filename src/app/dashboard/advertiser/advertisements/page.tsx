"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";
import { useProfileProtection } from "../../../../hooks/useProfileProtection";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Advertisement = {
    static_id: string;
    billboard: string;
    status: string;
    created_at: string;
};

export default function AdvertisementsPage() {
    // Protect route and check profile completion
    useProfileProtection();
    
    const [ads, setAds] = useState<Advertisement[]>([]);
    const [loading, setLoading] = useState(true);
    const [billboardTitles, setBillboardTitles] = useState<Record<string, string>>({});
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchAds = async () => {
            setLoading(true);
            const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
            const url = apiUrl(`/users/advertiser/bookings/list/?status=confirmed&page=${page}`);
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    setAds(data.results || []);
                    setTotalPages(data.total_pages || 1);
                } else {
                    setAds([]);
                    setTotalPages(1);
                }
            } catch {
                setAds([]);
                setTotalPages(1);
            }
            setLoading(false);
        };
        fetchAds();
    }, [page]);

    // Fetch billboard titles for each ad
    useEffect(() => {
        const fetchTitles = async () => {
            const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
            const promises = ads.map(async (ad) => {
                if (!billboardTitles[ad.billboard]) {
                    try {
                        const res = await fetch(apiUrl(`/users/advertiser/billboard/detail/?id=${ad.billboard}`), {
                            method: "GET",
                            headers: {
                                ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                            },
                        });
                        if (res.ok) {
                            const data = await res.json();
                            return { id: ad.billboard, title: data.title };
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
        if (ads.length > 0) fetchTitles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ads]);

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
            <Sidebar />
            <main className="flex-1 p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-green-800 mb-2">Your Advertisements</h1>
                        <p className="text-lg text-gray-600">
                            Manage and track your active billboard advertisements
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Advertisements</h3>
                            <p className="text-gray-500">Please wait while we fetch your advertisements...</p>
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">📢</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Advertisements Yet</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                You don&apos;t have any active advertisements yet. Start by booking a billboard to create your first advertisement.
                            </p>
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-lg mx-auto">
                                <h4 className="font-semibold text-blue-800 mb-2">💡 Get Started</h4>
                                <p className="text-blue-700 text-sm mb-4">
                                    Browse available billboards in your preferred locations and make a booking request.
                                </p>
                                <Link 
                                    href="/cities"
                                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                                >
                                    Browse Billboards
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Stats Card */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Active Advertisements</h3>
                                        <p className="text-gray-600">Confirmed billboard bookings</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600">{ads.length}</div>
                                            <div className="text-sm text-gray-500">Total Ads</div>
                                        </div>
                                        <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-3xl">📢</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Advertisements Grid */}
                            <div className="space-y-4">
                                {ads.map((ad) => (
                                    <div
                                        key={ad.static_id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
                                    >
                                        <div className="p-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <h3 className="text-xl font-semibold text-gray-900">
                                                            {billboardTitles[ad.billboard] || 'Loading...'}
                                                        </h3>
                                                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                            {ad.status}
                                                        </span>
                                                    </div>
                                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-600">
                                                        <div>
                                                            <span className="font-medium">Advertisement ID:</span>
                                                            <p className="text-gray-900 mt-1 font-mono text-xs">
                                                                {ad.static_id.slice(0, 8)}...
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Created Date:</span>
                                                            <p className="text-gray-900 mt-1">
                                                                {new Date(ad.created_at).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <span className="font-medium">Billboard:</span>
                                                            <Link
                                                                href={`/dashboard/advertiser/billboard?id=${ad.billboard}`}
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
                                                        ? 'bg-green-600 text-white shadow-md' 
                                                        : 'bg-white text-green-600 border border-gray-200 hover:bg-green-50'
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
