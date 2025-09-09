"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Advertisement = {
    static_id: string;
    billboard: string;
    status: string;
    created_at: string;
};

export default function AdvertisementsPage() {
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
            <main className="flex-1 flex flex-col items-center justify-center p-12">
                <h1 className="text-3xl font-bold text-green-700 mb-6">Your Advertisements</h1>
                <div className="bg-white rounded-lg shadow p-6 w-full max-w-3xl">
                    {loading ? (
                        <div className="text-center text-lg py-8">Loading advertisements...</div>
                    ) : ads.length === 0 ? (
                        <div className="text-center text-lg py-8">No advertisements found.</div>
                    ) : (
                        <>
                            <table className="w-full table-auto text-black mb-6">
                                <thead>
                                    <tr className="bg-green-100">
                                        <th className="px-4 py-2">Billboard</th>
                                        <th className="px-4 py-2">Status</th>
                                        <th className="px-4 py-2">Created At</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ads.map((ad) => (
                                        <tr key={ad.static_id} className="hover:bg-green-50 cursor-pointer">
                                            <td className="px-4 py-2 font-medium">
                                                <Link
                                                    href={`/dashboard/advertiser/billboard?id=${ad.billboard}`}
                                                    className="text-green-700 underline hover:text-green-900"
                                                >
                                                    {billboardTitles[ad.billboard] || ad.billboard}
                                                </Link>
                                            </td>
                                            <td className="px-4 py-2 capitalize">{ad.status}</td>
                                            <td className="px-4 py-2">{new Date(ad.created_at).toLocaleString()}</td>
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
