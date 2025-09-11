"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Fuse from "fuse.js";
import Sidebar from "./Sidebar";
import { useProfileProtection } from "../../../hooks/useProfileProtection";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
    id: number;
    title: string;
    city: {
        static_id: string;
        city_name: string;
    };
    type: string;
    price: number;
    status: "active" | "inactive";
    is_available: boolean;
};

export default function AdvertiserDashboard() {
    const router = useRouter();
    
    // Protect route and check profile completion
    useProfileProtection();
    
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
            const uniqueCities = Array.from(new Set(billboards.map(b => b.city.city_name).filter(Boolean)));
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
            <main className="flex-1 p-3 md:p-8 overflow-auto">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-4xl font-bold text-green-800 mb-2">Billboard Directory</h1>
                        <p className="text-base md:text-lg text-gray-600 px-2 md:px-0">
                            Browse and book billboards from our extensive network of premium locations
                        </p>
                    </div>

                    {/* Stats Overview */}
                    {!loading && billboards.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs md:text-sm font-medium text-gray-600">Total Available</p>
                                        <p className="text-2xl font-bold text-gray-900">{billboards.length}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">📺</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Active Billboards</p>
                                        <p className="text-2xl font-bold text-green-600">
                                            {billboards.filter(b => b.status === 'active').length}
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
                                        <p className="text-sm font-medium text-gray-600">Available Now</p>
                                        <p className="text-2xl font-bold text-blue-600">
                                            {billboards.filter(b => b.is_available).length}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🚀</span>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Cities</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {new Set(billboards.map(b => b.city.city_name)).size}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-2xl">🏙️</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Advanced Filters */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filter Billboards</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                            {/* City Search with Fuzzy Search */}
                            <div className="relative">
                                <label className="block text-sm font-medium text-gray-700 mb-1">City/State</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="citySearch"
                                        value={citySearch}
                                        onChange={e => setCitySearch(e.target.value)}
                                        placeholder="Search city or state..."
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                    />
                                </div>
                                {citySearch && (
                                    <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                                        {filteredCities.length === 0 ? (
                                            <div className="px-4 py-3 text-gray-500 text-sm">No cities found</div>
                                        ) : (
                                            filteredCities.map(city => (
                                                <div
                                                    key={city}
                                                    className="px-4 py-3 hover:bg-green-50 cursor-pointer text-gray-900 border-b border-gray-100 last:border-b-0"
                                                    onClick={() => {
                                                        setFilters(f => ({ ...f, city }));
                                                        setCitySearch("");
                                                    }}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400">📍</span>
                                                        {city}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Billboard Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Billboard Type</label>
                                <input
                                    type="text"
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    placeholder="e.g., Digital, LED, Traditional"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                />
                            </div>

                            {/* Max Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (₹)</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={filters.price}
                                    onChange={handleFilterChange}
                                    placeholder="Enter maximum price"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                />
                            </div>

                            {/* Sort by Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sort by Price</label>
                                <select
                                    name="orderBy"
                                    value={orderBy}
                                    onChange={e => setOrderBy(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                >
                                    <option value="">Default Order</option>
                                    <option value="min-max">Price: Low to High</option>
                                    <option value="max-min">Price: High to Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Status Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                >
                                    <option value="">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>

                            {/* Availability Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                                <select
                                    name="is_available"
                                    value={filters.is_available}
                                    onChange={handleFilterChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
                                >
                                    <option value="">All Billboards</option>
                                    <option value="true">Available for Booking</option>
                                    <option value="false">Currently Booked</option>
                                </select>
                            </div>

                            {/* Clear Filters Button */}
                            <div className="flex items-end">
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition border border-gray-300"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-6"></div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading Billboards</h3>
                            <p className="text-gray-500">Searching for the best billboard options...</p>
                        </div>
                    ) : billboards.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="text-8xl mb-6">📊</div>
                            <h3 className="text-2xl font-bold text-gray-700 mb-4">No Billboards Found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                {Object.values(filters).some(f => f) 
                                    ? "No billboards match your current filters. Try adjusting your search criteria."
                                    : "There are no billboards available at the moment. Please check back later."
                                }
                            </p>
                            {Object.values(filters).some(f => f) && (
                                <button
                                    onClick={clearFilters}
                                    className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition transform hover:scale-105"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <>
                            {/* Results Count */}
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Showing <span className="font-semibold">{sortedBillboards.length}</span> billboard{sortedBillboards.length !== 1 ? 's' : ''} 
                                    {Object.values(filters).some(f => f) && (
                                        <span className="ml-1">matching your criteria</span>
                                    )}
                                </p>
                            </div>

                            {/* Billboard Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                                {sortedBillboards.map((billboard, idx) => (
                                    <div
                                        key={billboard.id ? billboard.id : `${billboard.title}-${billboard.city.city_name}-${billboard.type}-${billboard.price}-${idx}`}
                                        className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
                                        onClick={() => {
                                            if (billboard.id) {
                                                router.push(`/billboard/${billboard.id}`);
                                            }
                                        }}
                                    >
                                        <div className="p-4 md:p-6">
                                            <div className="flex items-start justify-between mb-3 md:mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{billboard.title}</h3>
                                                    <div className="flex items-center gap-2 text-xs md:text-sm text-gray-600 mb-2">
                                                        <span className="text-gray-400">📍</span>
                                                        <span className="capitalize">{billboard.city.city_name}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        billboard.type.toLowerCase() === 'digital' ? 'bg-blue-100 text-blue-800' :
                                                        billboard.type.toLowerCase() === 'led' ? 'bg-purple-100 text-purple-800' :
                                                        'bg-green-100 text-green-800'
                                                    }`}>
                                                        {billboard.type}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="space-y-2 md:space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs md:text-sm font-medium text-gray-600">Price per day:</span>
                                                    <span className="text-lg md:text-xl font-bold text-green-600">₹{billboard.price.toLocaleString()}</span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs md:text-sm font-medium text-gray-600">Status:</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        billboard.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {billboard.status}
                                                    </span>
                                                </div>

                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs md:text-sm font-medium text-gray-600">Availability:</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className={`w-2 h-2 rounded-full ${billboard.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                        <span className={`text-xs font-medium ${billboard.is_available ? 'text-green-700' : 'text-red-700'}`}>
                                                            {billboard.is_available ? 'Available' : 'Booked'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-100">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs md:text-sm text-gray-500">Click to view details</span>
                                                    <svg className="w-4 h-4 md:w-5 md:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
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