"use client";

import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useRouter, useSearchParams } from "next/navigation";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

type Billboard = {
	title: string;
	address: string;
	city: string;
	status: string;
	is_available: boolean;
	type: string;
	price: string | number;
	dimensionLen?: string;
	dimensionWid?: string;
	latitude?: number;
	longitude?: number;
	vendor?: { static_id: string; name: string };
};

function BillboardContent() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const staticId = searchParams.get("id");

	// Get today's date in yyyy-mm-dd format for min attribute
	const today = new Date();
	const yyyy = today.getFullYear();
	const mm = String(today.getMonth() + 1).padStart(2, '0');
	const dd = String(today.getDate()).padStart(2, '0');
	const minDate = `${yyyy}-${mm}-${dd}`;

	const [billboard, setBillboard] = useState<Billboard | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [showBooking, setShowBooking] = useState(false);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [bookingConfirmed, setBookingConfirmed] = useState(false);
	const [dateError, setDateError] = useState("");

	useEffect(() => {
		if (!staticId) {
			setError("No billboard ID provided.");
			setLoading(false);
			return;
		}
		const fetchBillboard = async () => {
			setLoading(true);
			setError("");
			const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
			try {
				const res = await fetch(apiUrl(`/users/advertiser/billboard/detail/?id=${staticId}`), {
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
	}, [staticId]);

	if (loading) {
		return <div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>;
	}
	if (error) {
		return <div className="flex justify-center items-center min-h-screen text-red-600 text-lg">{error}</div>;
	}
	if (!billboard) {
		return <div className="flex justify-center items-center min-h-screen text-lg">No details found.</div>;
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#e6f7ee] to-[#c3e6d6] p-8 overflow-hidden">
			<div className="bg-white rounded-2xl shadow-2xl p-10 max-w-screen-xl w-full border border-green-100 flex flex-row gap-10 items-start">
				{/* Left: Map and Location */}
				<div className="w-1/2 flex flex-col items-start">
					<h2 className="text-2xl font-bold text-green-700 mb-4">Location</h2>
					<div className="mb-2 text-gray-700 text-base">
						<span className="font-semibold">Address:</span> {billboard.address}
					</div>
					{billboard.latitude && billboard.longitude && (
						<div className="mt-2 rounded-lg overflow-hidden border border-green-200 shadow w-full">
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
				</div>
				{/* Right: Details */}
				<div className="w-1/2 space-y-6 text-[1.15rem] text-gray-900">
					<h1 className="text-4xl font-extrabold text-green-800 mb-8 tracking-tight">Billboard Details</h1>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Title:</span>
						<span>{billboard.title}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">City:</span>
						<span>{billboard.city}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Type:</span>
						<span>{billboard.type}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Price:</span>
						<span className="font-bold">₹{billboard.price}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Status:</span>
						<span>{String(billboard.status)}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Available:</span>
						<span>{billboard.is_available ? "Yes" : "No"}</span>
					</div>
					<div className="flex justify-between items-center py-2 border-b border-gray-100">
						<span className="font-semibold text-green-700">Dimensions:</span>
						<span>{billboard.dimensionLen} x {billboard.dimensionWid} ft</span>
					</div>
					<div className="flex gap-4 mt-10">
						<button
							className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition text-lg"
							onClick={() => router.back()}
						>
							← Back to List
						</button>
						<button
							className={`px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-lg ${!billboard.is_available ? 'opacity-50 cursor-not-allowed' : ''}`}
							onClick={() => billboard.is_available && setShowBooking(true)}
							disabled={!billboard.is_available}
						>
							Book Billboard
						</button>
					</div>
					{showBooking && (
						<div className="mt-8 p-6 bg-blue-50 rounded-xl shadow flex flex-col md:flex-row gap-6 items-center">
							<div className="flex flex-col gap-2">
								<label className="font-semibold text-blue-700">Start Date</label>
								<input
									type="date"
									value={startDate}
									min={minDate}
									onChange={e => {
										setStartDate(e.target.value);
										setDateError("");
									}}
									className="border border-blue-300 rounded-lg px-3 py-2"
								/>
							</div>
							<div className="flex flex-col gap-2">
								<label className="font-semibold text-blue-700">End Date</label>
								<input
									type="date"
									value={endDate}
									min={startDate || minDate}
									onChange={e => {
										setEndDate(e.target.value);
										setDateError("");
									}}
									className="border border-blue-300 rounded-lg px-3 py-2"
								/>
							</div>
							<button
								className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition text-lg"
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
								Confirm Booking
							</button>
							{dateError && (
								<div className="mt-2 text-red-600 text-sm font-semibold">{dateError}</div>
							)}
						</div>
					)}
					{bookingConfirmed && (
						<div className="mt-6 p-4 bg-green-50 rounded-xl text-green-700 text-center font-semibold shadow">
							Booking confirmed from {startDate} to {endDate}!
						</div>
					)}
				</div>
			</div>
		</div>
	);
	}
export default function BillboardDetail() {
	return (
		<div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
			<Sidebar />
			<main className="flex-1 flex items-center justify-center">
				<React.Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg">Loading...</div>}>
					<BillboardContent />
				</React.Suspense>
			</main>
		</div>
	);
}
