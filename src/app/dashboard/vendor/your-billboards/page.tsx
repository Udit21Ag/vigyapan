"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
	static_id: string;
	title: string;
	address: string;
	city: {
		static_id: string;
		city_name: string;
	} | string;
	status: string;
	is_available: boolean;
	type: string;
	price: string | number;
	photo?: string;
	dimensionLen?: string;
	dimensionWid?: string;
	latitude?: number;
	longitude?: number;
};

export default function YourBillboards() {
	const router = useRouter();
	const [billboards, setBillboards] = useState<Billboard[]>([]);
	const [filteredBillboards, setFilteredBillboards] = useState<Billboard[]>([]);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");

	useEffect(() => {
		const fetchBillboards = async () => {
			setLoading(true);
			setError("");
			const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
			
			try {
				const res = await fetch(apiUrl("/users/vendor/billboard/list/"), {
					method: "GET",
					headers: {
						...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
					},
				});
				
				if (res.ok) {
					const data = await res.json();
					setBillboards(data.results || data);
					setFilteredBillboards(data.results || data);
				} else {
					setError("Failed to fetch your billboards.");
				}
			} catch {
				setError("Error fetching billboards.");
			}
			setLoading(false);
		};

		fetchBillboards();
	}, []);

	// Filter billboards based on search query
	useEffect(() => {
		if (!searchQuery.trim()) {
			setFilteredBillboards(billboards);
			return;
		}

		const filtered = billboards.filter((billboard) => {
			const cityName = getCityName(billboard.city);
			const searchLower = searchQuery.toLowerCase();
			
			return (
				billboard.title.toLowerCase().includes(searchLower) ||
				billboard.address.toLowerCase().includes(searchLower) ||
				cityName.toLowerCase().includes(searchLower)
			);
		});
		
		setFilteredBillboards(filtered);
	}, [searchQuery, billboards]);

	const handleBillboardClick = (staticId: string) => {
		router.push(`/dashboard/vendor/billboard/details/${staticId}`);
	};

	const getTypeColor = (type: string) => {
		switch (type.toLowerCase()) {
			case 'digital':
				return 'bg-blue-100 text-blue-800';
			case 'traditional':
				return 'bg-green-100 text-green-800';
			case 'led':
				return 'bg-purple-100 text-purple-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	};

	const getCityName = (city: Billboard['city']) => {
		return typeof city === 'object' ? city.city_name : city;
	};

	if (loading) {
		return (
			<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
				<Sidebar />
				<main className="flex-1 flex items-center justify-center">
					<div className="flex flex-col items-center gap-4">
						<div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
						<p className="text-lg text-gray-600">Loading your billboards...</p>
					</div>
				</main>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
				<Sidebar />
				<main className="flex-1 flex items-center justify-center">
					<div className="text-center">
						<div className="text-6xl mb-4">❌</div>
						<h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
						<p className="text-lg text-gray-600 mb-4">{error}</p>
						<button
							onClick={() => window.location.reload()}
							className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
						>
							Retry
						</button>
					</div>
				</main>
			</div>
		);
	}

	return (
		<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
			<Sidebar />
			<main className="flex-1 p-8">
				<div className="max-w-6xl mx-auto">
					<div className="mb-8">
						<h1 className="text-4xl font-bold text-green-800 mb-2">Your Billboards</h1>
						<p className="text-lg text-gray-600 mb-6">
							Manage and view details of your billboard listings
						</p>
						
						{/* Search Bar */}
						<div className="relative max-w-md">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
								</svg>
							</div>
							<input
								type="text"
								placeholder="Search by city, location, or title..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors text-black"
							/>
						</div>
					</div>

					{billboards.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">📺</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">No Billboards Found</h3>
							<p className="text-gray-600 mb-6">
								You haven&apos;t added any billboards yet. Start by adding your first billboard.
							</p>
							<button
								onClick={() => router.push('/dashboard/vendor/addBillboard')}
								className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
							>
								Add Your First Billboard
							</button>
						</div>
					) : filteredBillboards.length === 0 ? (
						<div className="text-center py-12">
							<div className="text-6xl mb-4">🔍</div>
							<h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
							<p className="text-gray-600 mb-6">
								No billboards match your search criteria. Try adjusting your search terms.
							</p>
							<button
								onClick={() => setSearchQuery("")}
								className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
							>
								Clear Search
							</button>
						</div>
					) : (
						<>
							{/* Results Count */}
							{searchQuery && (
								<div className="mb-6">
									<p className="text-gray-600">
										Showing {filteredBillboards.length} of {billboards.length} billboard{billboards.length !== 1 ? "s" : ""}
									</p>
								</div>
							)}
							
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{filteredBillboards.map((billboard) => (
								<div
									key={billboard.static_id}
									onClick={() => handleBillboardClick(billboard.static_id)}
									className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer transform hover:scale-[1.02]"
								>
									{/* Billboard Photo */}
									<div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative overflow-hidden">
										{billboard.photo ? (
											<Image
												src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${billboard.photo}`}
												alt={billboard.title}
												fill
												className="object-cover"
												sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
											/>
										) : (
											<div className="text-6xl">📺</div>
										)}
									</div>
									
									{/* Billboard Info */}
									<div className="p-6">
										<div className="flex items-start justify-between mb-3">
											<h3 className="text-xl font-semibold text-gray-800 line-clamp-1">{billboard.title}</h3>
											<span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(billboard.type)}`}>
												{billboard.type}
											</span>
										</div>
										
										<p className="text-gray-600 text-sm mb-3 line-clamp-2">
											{billboard.address}
										</p>
										
										<div className="flex items-center justify-between mb-4">
											<div className="text-xl font-bold text-green-600">
												₹{billboard.price}/day
											</div>
											<div className="text-sm text-gray-500 capitalize">
												{getCityName(billboard.city)}
											</div>
										</div>
										
										<div className="flex items-center justify-between">
											<div className="flex items-center gap-2">
												<div className={`w-2 h-2 rounded-full ${billboard.is_available ? 'bg-green-500' : 'bg-red-500'}`}></div>
												<span className={`text-xs font-medium ${billboard.is_available ? 'text-green-700' : 'text-red-700'}`}>
													{billboard.is_available ? 'Available' : 'Not Available'}
												</span>
											</div>
											<span className={`px-2 py-1 rounded text-xs font-medium ${
												billboard.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
											}`}>
												{billboard.status}
											</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</>
					)}
				</div>
			</main>
		</div>
	);
}
