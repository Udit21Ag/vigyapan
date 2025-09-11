"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

// API utility
const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function CompleteProfile() {
	const router = useRouter();
	const [userType, setUserType] = useState<string>("");
	const [existingUserType, setExistingUserType] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const fileInputRef = useRef<HTMLInputElement | null>(null);
	const addressInputRef = useRef<HTMLInputElement | null>(null);
	const [currentStep, setCurrentStep] = useState(1);
	
	const [formData, setFormData] = useState({
		phone: "",
		address: "",
		company: "",
		pincode: "",
		photo: null as File | null
	});

	useEffect(() => {
		// Check if user is authenticated
		const token = localStorage.getItem("accessToken");
		if (!token) {
			router.push("/signIn");
			return;
		}

		// Check if profile is already completed
		const completed = localStorage.getItem("completed_profile");
		if (completed === "true") {
			router.push("/");
			return;
		}

		// Get existing userType if available
		const existingType = localStorage.getItem("userType");
		setExistingUserType(existingType);
		if (existingType && existingType !== "null" && existingType !== "") {
			setUserType(existingType);
		}
	}, [router]);

	// Initialize Google Places Autocomplete
	const initializeAutocomplete = () => {
		if (typeof window !== "undefined" && window.google && addressInputRef.current) {
			const autocompleteInstance = new window.google.maps.places.Autocomplete(
				addressInputRef.current,
				{
					types: ["address"],
					componentRestrictions: { country: "IN" } // Restrict to India
				}
			);

			autocompleteInstance.addListener("place_changed", () => {
				const place = autocompleteInstance.getPlace();
				if (place.formatted_address) {
					setFormData(prev => ({ ...prev, address: place.formatted_address || "" }));
					
					// Extract pincode from address components
					const addressComponents = place.address_components;
					const pincodeComponent = addressComponents?.find(component => 
						component.types.includes("postal_code")
					);
					if (pincodeComponent) {
						setFormData(prev => ({ ...prev, pincode: pincodeComponent.long_name }));
					}
				}
			});
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
		setError(""); // Clear error when user types
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0] || null;
		setFormData(prev => ({ ...prev, photo: file }));
	};

	const nextStep = () => {
		if (currentStep < 3) setCurrentStep(currentStep + 1);
	};

	const prevStep = () => {
		if (currentStep > 1) setCurrentStep(currentStep - 1);
	};

	const isStepValid = (step: number) => {
		switch (step) {
			case 1:
				return userType !== "";
			case 2:
				return formData.phone && formData.company;
			case 3:
				return formData.address && formData.pincode;
			default:
				return false;
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		// Validation
		if (!userType) {
			setError("Please select your user type");
			setIsLoading(false);
			return;
		}

		try {
			const formDataToSend = new FormData();
			formDataToSend.append("userType", userType);
			formDataToSend.append("phone", formData.phone);
			formDataToSend.append("address", formData.address);
			formDataToSend.append("company", formData.company);
			formDataToSend.append("pincode", formData.pincode);
			if (formData.photo) {
				formDataToSend.append("photo", formData.photo);
			}

			const token = localStorage.getItem("accessToken");
			const response = await fetch(apiUrl("/users/profile/complete/"), {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
				},
				body: formDataToSend,
			});

			if (response.ok) {
				localStorage.setItem("completed_profile", "true");
				
				localStorage.setItem("userType", userType);
				
				if (userType === "vendor") {
					router.push("/for-vendor");
				} else {
					router.push("/for-advertisers");
				}
			} else {
				const errorData = await response.json();
				setError(errorData.message || "Failed to complete profile. Please try again.");
			}
		} catch (error) {
			setError(`Server error. Please try again later. ${error}`);
		} finally {
			setIsLoading(false);
		}
	};

	const renderStep = () => {
		switch (currentStep) {
			case 1:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-3">Choose Your Role</h2>
							<p className="text-gray-600 text-lg">Tell us how you plan to use Vigyapan</p>
						</div>

						{existingUserType && existingUserType !== "null" && existingUserType !== "" ? (
							<div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-2xl p-6 text-center">
								<span className="text-gray-800 font-bold text-2xl">
									{existingUserType === "vendor" ? "Vendor" : "Advertiser"}
								</span>
								<span className="text-sm text-gray-600 block mt-1">(Already selected)</span>
							</div>
						) : (
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<button
									type="button"
									onClick={() => setUserType("vendor")}
									className={`p-8 rounded-2xl border-3 font-bold text-xl transition-all duration-300 ${
										userType === "vendor"
											? "bg-gradient-to-br from-green-600 to-green-700 border-green-600 text-white shadow-2xl transform scale-105"
											: "bg-white border-gray-300 text-gray-800 hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-lg"
									}`}
								>
									<div className="text-center">
										<svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
										</svg>
										<div>Vendor</div>
										<p className="text-sm opacity-80 font-normal mt-2">I own billboard spaces and want to rent them out</p>
									</div>
								</button>
								<button
									type="button"
									onClick={() => setUserType("advertiser")}
									className={`p-8 rounded-2xl border-3 font-bold text-xl transition-all duration-300 ${
										userType === "advertiser"
											? "bg-gradient-to-br from-green-600 to-green-700 border-green-600 text-white shadow-2xl transform scale-105"
											: "bg-white border-gray-300 text-gray-800 hover:border-green-500 hover:bg-green-50 hover:text-green-700 hover:shadow-lg"
									}`}
								>
									<div className="text-center">
										<svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
										</svg>
										<div>Advertiser</div>
										<p className="text-sm opacity-80 font-normal mt-2">I want to advertise on billboards</p>
									</div>
								</button>
							</div>
						)}
					</div>
				);

			case 2:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 002 2h2a1 1 0 011 1v6.5M6 20.5A2.5 2.5 0 018.5 18h7a2.5 2.5 0 012.5 2.5v0A2.5 2.5 0 0115.5 23h-7A2.5 2.5 0 016 20.5v0z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-3">Contact Information</h2>
							<p className="text-gray-600 text-lg">We need your contact details and company information</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Phone */}
							<div>
								<label className="block text-sm font-semibold text-gray-800 mb-3">
									Phone Number
								</label>
								<div className="relative">
									<input
										type="tel"
										name="phone"
										required
										value={formData.phone}
										onChange={handleInputChange}
										className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-600 bg-white dark-placeholder"
										placeholder="Enter your phone number"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4">
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									</div>
								</div>
							</div>

							{/* Company */}
							<div>
								<label className="block text-sm font-semibold text-gray-800 mb-3">
									Company Name
								</label>
								<div className="relative">
									<input
										type="text"
										name="company"
										required
										value={formData.company}
										onChange={handleInputChange}
										className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-600 bg-white dark-placeholder"
										placeholder="Enter your company name"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4">
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
										</svg>
									</div>
								</div>
							</div>
						</div>
					</div>
				);

			case 3:
				return (
					<div className="space-y-6">
						<div className="text-center">
							<div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4">
								<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
								</svg>
							</div>
							<h2 className="text-3xl font-bold text-gray-900 mb-3">Location & Photo</h2>
							<p className="text-gray-600 text-lg">Tell us your address and upload a profile photo</p>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Address with Google Places */}
							<div>
								<label className="block text-sm font-semibold text-gray-800 mb-3">
									Address
								</label>
								<div className="relative">
									<input
										ref={addressInputRef}
										type="text"
										name="address"
										required
										value={formData.address}
										onChange={handleInputChange}
										className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-600 bg-white dark-placeholder"
										placeholder="Start typing your address..."
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4">
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
									</div>
								</div>
							</div>

							{/* Pincode */}
							<div>
								<label className="block text-sm font-semibold text-gray-800 mb-3">
									Pincode
								</label>
								<div className="relative">
									<input
										type="number"
										name="pincode"
										required
										value={formData.pincode}
										onChange={handleInputChange}
										className="w-full px-4 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-600 bg-white dark-placeholder"
										placeholder="Enter your area pincode"
									/>
									<div className="absolute inset-y-0 right-0 flex items-center pr-4">
										<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
								</div>
							</div>
						</div>

						{/* Photo Upload */}
						<div>
							<label className="block text-sm font-semibold text-gray-800 mb-3">
								Profile Photo (Optional)
							</label>
							<input
								type="file"
								ref={fileInputRef}
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								className="w-full px-6 py-6 border-2 border-dashed border-gray-300 rounded-xl text-gray-800 hover:border-green-500 hover:bg-green-50 transition-all duration-200 flex items-center justify-center gap-4 bg-white"
							>
								<div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full">
									<svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<span className="font-medium text-lg">
									{formData.photo ? formData.photo.name : "Choose Profile Photo"}
								</span>
							</button>
						</div>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee] flex flex-col">
			{/* Google Maps Script */}
			<Script
				src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
				onLoad={initializeAutocomplete}
			/>

			{/* Header */}
			<header className="flex items-center justify-between px-4 md:px-12 py-6 border-b bg-white/80 backdrop-blur-sm shadow-sm">
				<Link href="/" className="text-xl md:text-2xl font-bold text-green-600">
					<Image
						src="/vigyapan.png"
						alt="Vigyapan"
						width={160}
						height={60}
						className="h-[30px] md:h-[38px] w-auto"
					/>
				</Link>
				<div className="text-sm font-medium text-gray-700 bg-green-50 px-3 py-1 rounded-full">
					Step {currentStep} of 3
				</div>
			</header>

			{/* Progress Bar */}
			<div className="w-full bg-gray-200 h-2">
				<div 
					className="bg-gradient-to-r from-green-500 to-green-600 h-2 transition-all duration-500"
					style={{ width: `${(currentStep / 3) * 100}%` }}
				></div>
			</div>

			{/* Main Content */}
			<main className="flex-1 flex items-center justify-center p-4 md:p-8">
				<div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-12 w-full max-w-4xl">
					{error && (
						<div className="bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl mb-6 flex items-start gap-3">
							<svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span className="font-medium">{error}</span>
						</div>
					)}

					<form onSubmit={handleSubmit}>
						{renderStep()}

						{/* Navigation Buttons */}
						<div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
							<button
								type="button"
								onClick={prevStep}
								disabled={currentStep === 1}
								className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
							>
								Previous
							</button>

							{currentStep < 3 ? (
								<button
									type="button"
									onClick={nextStep}
									disabled={!isStepValid(currentStep)}
									className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-xl hover:from-green-700 hover:to-green-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									Next
								</button>
							) : (
								<button
									type="submit"
									disabled={isLoading || !isStepValid(3)}
									className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 flex items-center gap-3 shadow-lg hover:shadow-xl"
								>
									{isLoading ? (
										<>
											<svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
												<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
												<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
											</svg>
											<span className="text-lg">Completing Profile...</span>
										</>
									) : (
										<>
											<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
											</svg>
											<span className="text-lg">Complete Profile</span>
										</>
									)}
								</button>
							)}
						</div>
					</form>
				</div>
			</main>

			{/* Footer */}
			<footer className="text-center py-4 text-gray-600 border-t bg-white text-sm">
				<p>© 2025 Vigyapan. All rights reserved.</p>
			</footer>
		</div>
	);
}
