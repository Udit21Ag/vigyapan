"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import Sidebar from "./Sidebar";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
    id: number;
    title: string;
    city: string;
    type: string;
    price: number;
    status: "active" | "inactive";
    is_available: boolean;
};

export default function AdvertiserDashboard() {
    const router = useRouter();
        // ...existing code...
        const [billboards, setBillboards] = useState<Billboard[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        city: "",
        type: "",
        price: "",
        status: "",
        is_available: "",
    });
    const [citySearch, setCitySearch] = useState("");
    const [cityOptions, setCityOptions] = useState<string[]>([]);
    const [filteredCities, setFilteredCities] = useState<string[]>([]);
    const [orderBy, setOrderBy] = useState("");
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Fetch billboards with filters
    useEffect(() => {
        const fetchBillboards = async () => {
            setLoading(true);
            const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
            const params = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) params.append(key, value);
            });
            params.append("page", String(page));
            const url = apiUrl(`/users/advertiser/billboard/list/?${params.toString()}`);
            try {
                const res = await fetch(url, {
                    method: "GET",
                    headers: {
                        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    // Fix price type and use static_id for key if available
                    const billboardsData = (data.results || data).map((b: Record<string, unknown>) => ({
                        ...b,
                        id: b.static_id || b.id,
                        price: typeof b.price === 'string' ? parseFloat(b.price) : b.price,
                    }));
                    setBillboards(billboardsData);
                    setTotalPages(data.total_pages || 1);
                    if (typeof data.current_page === 'number') {
                        setPage(data.current_page);
                    }
                } else {
                    setBillboards([]);
                    setTotalPages(1);
                }
            } catch {
                setBillboards([]);
                setTotalPages(1);
            }
            setLoading(false);
        };
        fetchBillboards();
    }, [filters, page]);

    // Fetch all cities from billboards for fuzzy search
    useEffect(() => {
        if (billboards.length > 0) {
            const uniqueCities = Array.from(new Set(billboards.map(b => b.city).filter(Boolean)));
            setCityOptions(uniqueCities);
        }
    }, [billboards]);

    // Fuzzy search cities
    useEffect(() => {
        if (citySearch && cityOptions.length > 0) {
            const fuse = new Fuse(cityOptions, { threshold: 0.4 });
        setFilteredCities(fuse.search(citySearch).map((r: { item: string }) => r.item));
        } else {
            setFilteredCities(cityOptions);
        }
    }, [citySearch, cityOptions]);

    // Sort billboards by price
    const sortedBillboards = [...billboards].sort((a, b) => {
        if (orderBy === "min-max") return a.price - b.price;
        if (orderBy === "max-min") return b.price - a.price;
        return 0;
    });

    // Handle filter changes
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setFilters({
            city: "",
            type: "",
            price: "",
            status: "",
            is_available: "",
        });
        setCitySearch("");
        setOrderBy("");
        setPage(1);
    };

    return (
        <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Dashboard Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-12" style={{ color: '#222' }}>
                <h1 className="text-4xl font-bold text-green-700 mb-4">Billboard List</h1>
                <div className="mb-6 flex flex-wrap gap-4 bg-white p-4 rounded-lg shadow">
                    {/* Fuzzy city/state search */}
                    <div className="flex flex-col">
                        <input
                            type="text"
                            name="citySearch"
                            value={citySearch}
                            onChange={e => setCitySearch(e.target.value)}
                            placeholder="Search State/City"
                            className="border px-3 py-2 rounded text-black bg-gray-50 mb-1"
                        />
                        {citySearch && (
                            <div className="bg-white border rounded shadow p-2 max-h-32 overflow-y-auto">
                                {filteredCities.length === 0 ? (
                                    <div className="text-gray-500">No matches</div>
                                ) : (
                                    filteredCities.map(city => (
                                        <div
                                            key={city}
                                            className="cursor-pointer px-2 py-1 hover:bg-green-100"
                                            onClick={() => {
                                                setFilters(f => ({ ...f, city }));
                                                setCitySearch("");
                                            }}
                                        >
                                            {city}
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                    <input
                        type="text"
                        name="type"
                        value={filters.type}
                        onChange={handleFilterChange}
                        placeholder="Type"
                        className="border px-3 py-2 rounded text-black bg-gray-50"
                    />
                    <input
                        type="number"
                        name="price"
                        value={filters.price}
                        onChange={handleFilterChange}
                        placeholder="Max Price"
                        className="border px-3 py-2 rounded text-black bg-gray-50"
                    />
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="border px-3 py-2 rounded text-black bg-gray-50"
                    >
                        <option value="">Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                    <select
                        name="is_available"
                        value={filters.is_available}
                        onChange={handleFilterChange}
                        className="border px-3 py-2 rounded text-black bg-gray-50"
                    >
                        <option value="">Availability</option>
                        <option value="true">Available</option>
                        <option value="false">Not Available</option>
                    </select>
                    <select
                        name="orderBy"
                        value={orderBy}
                        onChange={e => setOrderBy(e.target.value)}
                        className="border px-3 py-2 rounded text-black bg-gray-50"
                    >
                        <option value="">Order by Price</option>
                        <option value="min-max">Min to Max</option>
                        <option value="max-min">Max to Min</option>
                    </select>
                    <button
                        type="button"
                        onClick={clearFilters}
                        className="px-4 py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                        Clear Filters
                    </button>
                </div>
                                <div className="bg-white rounded-lg shadow p-4 w-full max-w-4xl">
                                        {loading ? (
                                                <div className="text-center text-lg py-8">Loading billboards...</div>
                                        ) : billboards.length === 0 ? (
                                                <div className="text-center text-lg py-8">No billboards found.</div>
                                        ) : (
                                                <>
                                                <table className="w-full table-auto text-black">
                                                        <thead>
                                                                <tr className="bg-green-100">
                                                                        <th className="px-4 py-2">Title</th>
                                                                        <th className="px-4 py-2">City</th>
                                                                        <th className="px-4 py-2">Type</th>
                                                                        <th className="px-4 py-2">Price</th>
                                                                        <th className="px-4 py-2">Status</th>
                                                                        <th className="px-4 py-2">Available</th>
                                                                </tr>
                                                        </thead>
                                                        <tbody>
                                                                {sortedBillboards.map((b, idx) => (
                                                                    <tr
                                                                        key={b.id ? b.id : `${b.title}-${b.city}-${b.type}-${b.price}-${idx}`}
                                                                        className="hover:bg-green-50 cursor-pointer"
                                                                        onClick={() => {
                                                                            if (b.id) {
                                                                                router.push(`/dashboard/advertiser/billboard?id=${b.id}`);
                                                                            }
                                                                        }}
                                                                    >
                                                                        <td className="px-4 py-2 font-medium">{b.title}</td>
                                                                        <td className="px-4 py-2">{b.city}</td>
                                                                        <td className="px-4 py-2">{b.type}</td>
                                                                        <td className="px-4 py-2">₹{b.price}</td>
                                                                        <td className="px-4 py-2 capitalize">{b.status}</td>
                                                                        <td className="px-4 py-2">{b.is_available ? "Yes" : "No"}</td>
                                                                    </tr>
                                                                ))}
                                                        </tbody>
                                                </table>
                                                {/* Pagination Controls */}
                                                                        <div className="flex justify-center items-center gap-2 mt-6">
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