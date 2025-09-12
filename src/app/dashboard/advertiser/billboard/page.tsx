"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useProfileProtection } from "../../../../hooks/useProfileProtection";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
	title: string;
	address: string;
	city: {
		static_id: string;
		city_name: string;
	};
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

function BillboardContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const staticId = searchParams.get("id") || "";
	const [billboard, setBillboard] = useState<Billboard | null>(null);
	const [error, setError] = useState<string>("");
	const [showBooking, setShowBooking] = useState(false);
	const [bookingConfirmed, setBookingConfirmed] = useState(false);
	const [startDate, setStartDate] = useState<string>("");
	const [endDate, setEndDate] = useState<string>("");
	const [dateError, setDateError] = useState<string>("");
	const minDate = new Date().toISOString().split("T")[0];

	useEffect(() => {
		async function fetchBillboard() {
			const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
			try {
				const res = await fetch(apiUrl(`/users/advertiser/billboard/detail/?id=${staticId}`), {
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
				setError("Failed to fetch billboard details.");
			}
		}
		if (staticId) fetchBillboard();
	}, [staticId]);

	if (error) {
		return <div className="flex justify-center items-center min-h-screen text-red-400 font-semibold">{error}</div>;
	}
	if (!billboard) {
		return <div className="flex justify-center items-center min-h-screen text-lg text-gray-200">Loading...</div>;
	}

	return (
		<div className="w-full flex flex-row gap-10 px-10 py-12">
			{/* Left: Map and Photo */}
			<div className="w-1/2 flex flex-col items-center space-y-6">
				<div className="mt-2 rounded-lg overflow-hidden border border-gray-700 shadow w-full">
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
				
				{/* Billboard Photo */}
				{billboard.photo && (
					<div className="w-full rounded-lg overflow-hidden border border-gray-700 shadow">
						<Image
							src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${billboard.photo}`}
							alt={billboard.title}
							width={600}
							height={400}
							className="w-full h-64 object-cover"
						/>
					</div>
				)}
				{showBooking && (
					<div className="mt-8 p-6 bg-gray-800 rounded-xl shadow flex flex-col gap-6 items-center w-full max-w-xl border border-gray-700">
						<div className="w-full flex flex-col md:flex-row gap-6">
							<div className="flex-1 flex flex-col gap-2">
								<label className="font-semibold text-blue-300">Start Date</label>
								<input
									type="date"
									value={startDate}
									min={minDate}
									onChange={e => {
										setStartDate(e.target.value);
										setDateError("");
									}}
									className="border border-gray-600 rounded-lg px-3 py-2 text-gray-100 bg-gray-700 focus:border-blue-400 focus:outline-none"
								/>
							</div>
							<div className="flex-1 flex flex-col gap-2">
								<label className="font-semibold text-blue-300">End Date</label>
								<input
									type="date"
									value={endDate}
									min={startDate || minDate}
									onChange={e => {
										setEndDate(e.target.value);
										setDateError("");
									}}
									className="border border-gray-600 rounded-lg px-3 py-2 text-gray-100 bg-gray-700 focus:border-blue-400 focus:outline-none"
								/>
							</div>
						</div>
						<button
							className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-lg"
							onClick={async () => {
								if (!startDate || !endDate) {
									setDateError("Please select both start and end dates.");
									return;
								}
								if (billboard?.is_available) {
									const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
									try {
										const res = await fetch(apiUrl("/users/advertiser/bookings/create/"), {
											method: "POST",
											headers: {
												"Content-Type": "application/json",
												...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
											},
											body: JSON.stringify({
												start_date: startDate,
												end_date: endDate,
												id: staticId,
											}),
										});
										if (res.ok) {
											setBookingConfirmed(true);
											setShowBooking(false);
											setDateError("");
										} else {
											const data = await res.json();
											setError(data?.message || "Booking failed. Please try again.");
										}
									} catch {
										setError("Booking failed. Please try again.");
									}
								}
							}}
							disabled={!startDate || !endDate}
						>
							Confirm Request
						</button>
						{dateError && (
							<div className="mt-2 text-red-400 text-sm font-semibold">{dateError}</div>
						)}
					</div>
				)}
				{bookingConfirmed && (
					<div className="mt-6 p-4 bg-gray-800 border border-green-500 rounded-xl text-green-300 text-center font-semibold shadow">
						Booking Requested from {startDate} to {endDate}!
					</div>
				)}
			</div>
			{/* Right: Details */}
			<div className="w-1/2 space-y-6 text-[1.15rem] text-gray-200">
				<h1 className="text-4xl font-extrabold text-gray-100 mb-8 tracking-tight">Billboard Details</h1>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">Title:</span>
					<span>{billboard.title}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">City:</span>
					<span>{billboard.city.city_name}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">Type:</span>
					<span>{billboard.type}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">Price:</span>
					<span className="font-bold">₹{billboard.price}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">Status:</span>
					<span>{String(billboard.status)}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
					<span className="font-semibold text-green-400">Available:</span>
					<span>{billboard.is_available ? "Yes" : "No"}</span>
				</div>
				<div className="flex justify-between items-center py-2 border-b border-gray-700">
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
	);
}
export default function BillboardDetail() {
	// Protect route and check profile completion
	useProfileProtection();
	
	return (
		<div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-gray-800">
			<Sidebar />
			<main className="flex-1 flex items-center justify-center">
				<React.Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg text-gray-200">Loading...</div>}>
					<BillboardContent />
				</React.Suspense>
			</main>
		</div>
	);
}
