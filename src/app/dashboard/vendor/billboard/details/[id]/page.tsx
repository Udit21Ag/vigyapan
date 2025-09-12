
"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../../../Sidebar";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useProfileProtection } from "../../../../../../hooks/useProfileProtection";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
	title: string;
	address: string;
	city: string | { static_id: string; city_name: string };
	status: string;
	is_available: boolean;
	type: string;
	price: string | number;
	dimensionLen?: string;
	dimensionWid?: string;
	latitude?: number;
	longitude?: number;
	vendor?: { static_id: string; name: string };
	photo?: string;
};

import { useParams } from "next/navigation";

function BillboardDetailContent() {
	const router = useRouter();
	const params = useParams();
	const id = params?.id as string;

	const [billboard, setBillboard] = useState<Billboard | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		if (!id) {
			setError("No billboard ID provided.");
			setLoading(false);
			return;
		}
		const fetchBillboard = async () => {
			setLoading(true);
			setError("");
			const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
			try {
				const res = await fetch(apiUrl(`/users/vendor/billboard/detail/?id=${id}`), {
					method: "GET",
					headers: {
						...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
					},
				});
				if (res.ok) {
					const data = await res.json();
					setBillboard(data);
				} else {
					setError("Failed to fetch billboard details.");
				}
			} catch {
				setError("Error fetching billboard details.");
			}
			setLoading(false);
		};
		fetchBillboard();
	}, [id]);

	if (loading) {
		return <div className="flex justify-center items-center min-h-screen text-lg text-gray-100">Loading...</div>;
	}
	if (error) {
		return <div className="flex justify-center items-center min-h-screen text-red-400 text-lg">{error}</div>;
	}
	if (!billboard) {
		return <div className="flex justify-center items-center min-h-screen text-lg text-gray-100">No details found.</div>;
	}

	return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-8 overflow-hidden">
				<div className="bg-gray-800 rounded-2xl shadow-2xl p-10 max-w-full w-[75vw] border border-gray-700 flex flex-row gap-14 items-start">
				{/* Left: Map, Photo and Location */}
				<div className="w-1/2 flex flex-col items-start space-y-6">
					<h2 className="text-2xl font-bold text-green-400 mb-4">Location</h2>
					<div className="mb-2 text-gray-300 text-base">
						<span className="font-semibold">Address:</span> {billboard.address}
					</div>
					{billboard.latitude && billboard.longitude && (
						<div className="mt-2 rounded-lg overflow-hidden border border-gray-600 shadow w-full">
							<iframe
								title="Google Map"
								width="100%"
								height="300"
								style={{ border: 0 }}
								loading="lazy"
								allowFullScreen
								src={`https://www.google.com/maps?q=${billboard.latitude},${billboard.longitude}&z=16&output=embed`}
							/>
						</div>
					)}
					
					{/* Billboard Photo */}
					{billboard.photo && (
						<div className="w-full rounded-lg overflow-hidden border border-gray-600 shadow">
							<Image
								src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${billboard.photo}`}
								alt={billboard.title}
								width={600}
								height={400}
								className="w-full h-64 object-cover"
							/>
						</div>
					)}
				</div>
				{/* Right: Details */}
				<div className="w-1/2 space-y-6 text-[1.15rem] text-gray-100">
					<h1 className="text-4xl font-extrabold text-green-400 mb-8 tracking-tight">Billboard Details</h1>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Title:</span>
						<span>{billboard.title}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">City:</span>
						<span>{typeof billboard.city === 'object' ? billboard.city.city_name : billboard.city}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Type:</span>
						<span>{billboard.type}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Price:</span>
						<span className="font-bold">₹{billboard.price}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Status:</span>
						<span>{String(billboard.status)}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Available:</span>
						<span>{billboard.is_available ? "Yes" : "No"}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-600">
						<span className="font-semibold text-green-400">Dimensions:</span>
						<span>{billboard.dimensionLen} x {billboard.dimensionWid} ft</span>
					</div>
					<div className="flex gap-4 mt-10">
						<button
							className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-lg"
							onClick={() => router.back()}
						>
							← Back to List
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function VendorBillboardDetail() {
	// Protect route and check profile completion
	useProfileProtection();
	
	return (
			<div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-gray-800">
				<Sidebar />
				<main className="flex-1 flex items-center justify-center">
					<BillboardDetailContent />
				</main>
			</div>
	);
}
