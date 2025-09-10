"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type CityData = {
	static_id: string;
	city_name: {
		static_id: string;
		city: string;
	};
	photo: string | null;
	billboardCount: number;
};

export default function LandingPage() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [cities, setCities] = useState<CityData[]>([]);
	const [loading, setLoading] = useState(true);
	const [logoErrors, setLogoErrors] = useState<{[key: string]: boolean}>({});

	// Check localStorage only on client
	useEffect(() => {
		const loggedIn =
			Boolean(localStorage.getItem("token")) ||
			Boolean(localStorage.getItem("accessToken"));
		setIsLoggedIn(loggedIn);
	}, []);

	// Fetch cities from API
	useEffect(() => {
		const fetchCities = async () => {
			try {
				const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users/city/billboards/list/`);
				if (response.ok) {
					const data = await response.json();
					setCities(data);
				}
			} catch (error) {
				console.error('Failed to fetch cities:', error);
			} finally {
				setLoading(false);
			}
		};

		fetchCities();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userType");
		window.location.reload();
	};

	// Get userType from localStorage (client only)
	const [userType, setUserType] = useState<string | null>(null);
	useEffect(() => {
		if (typeof window !== "undefined") {
			setUserType(localStorage.getItem("userType"));
		}
	}, [isLoggedIn]);

	return (
		<div className="font-inter bg-[#f8fcfa] min-h-screen text-[#111] flex flex-col">
			{/* Header */}
			<header className="w-full border-b-1 pb-5 relative z-10">
				<div className="flex items-center justify-between px-12 pt-5 max-w-6xl mx-auto w-full flex-wrap gap-4">
					<Link href="/" className="cursor-pointer">
						<Image
							src="/vigyapan.png"
							alt="Vigyapan"
							width={160}
							height={60}
							className="h-[38px] w-auto"
						/>
					</Link>

					<nav className="flex gap-9 text-[1.08rem] font-medium items-center z-10 relative">
						<Link
							href="/cities"
							className="text-[#222] hover:text-[#1db954] transition-colors px-2 py-1"
						>
							Find Ad Spaces
						</Link>
						<Link
							href="#how-it-works"
							className="text-[#222] hover:text-[#1db954] transition-colors px-2 py-1"
						>
							How It Works
						</Link>
						{userType === "vendor" ? (
							<>
								<Link
									href="/for-vendors"
									className="text-[#1db954] font-semibold hover:text-[#159c43] cursor-pointer transition-colors block px-2 py-1"
								>
									For Vendors
								</Link>
								<Link
									href="/dashboard/vendor"
									className="text-[#222] hover:text-[#1db954] cursor-pointer transition-colors block px-2 py-1"
								>
									Dashboard
								</Link>
							</>
						) : userType === "advertiser" ? (
							<>
								<Link
									href="/for-advertisers"
									className="text-[#1db954] font-semibold hover:text-[#159c43] cursor-pointer transition-colors block px-2 py-1"
								>
									For Advertisers
								</Link>
								<Link
									href="/dashboard/advertiser"
									className="text-[#222] hover:text-[#1db954] cursor-pointer transition-colors block px-2 py-1"
								>
									Dashboard
								</Link>
							</>
						) : (
							<>
								<Link
									href="/for-vendors"
									className="text-[#222] hover:text-[#1db954] cursor-pointer transition-colors block px-2 py-1"
								>
									For Vendors
								</Link>
								<Link
									href="/for-advertisers"
									className="text-[#1db954] font-semibold hover:text-[#159c43] cursor-pointer transition-colors block px-2 py-1"
								>
									For Advertisers
								</Link>
							</>
						)}
					</nav>

					<div className="flex gap-4">
						{isLoggedIn ? (
							<button
								className="bg-[#1db954] text-white rounded-full px-6 py-2 font-medium hover:bg-[#159c43] transition"
								onClick={handleLogout}
							>
								Log Out
							</button>
						) : (
							<>
								<Link
									href="/signUp"
									className="bg-[#1db954] text-white rounded-full px-6 py-2 font-medium hover:bg-[#159c43] transition"
								>
									Create Account
								</Link>
								<Link
									href="/signIn"
									className="bg-white text-[#222] border border-[#eee] rounded-full px-6 py-2 font-medium hover:shadow-md transition"
								>
									Sign In
								</Link>
							</>
						)}
					</div>
				</div>
			</header>

			{/* Hero Section */}
			<section className="text-center pt-16 max-w-2xl mx-auto">
				<h1 className="text-[3.2rem] font-extrabold leading-tight mb-4">
					Amplify Your Brand with
					<br />
					<span className="text-[#1db954]">Impactful</span> Outdoor
					<br />
					Advertising
				</h1>
				<p className="text-lg text-[#444] mb-10">
					Reach your target audience with premium billboard, digital
					display, and transit advertising spaces across the country.
				</p>
				<div className="flex justify-center gap-4 mb-10">
					<Link
						href="/cities"
						className="bg-[#1db954] text-white rounded-3xl px-8 py-3 text-lg font-semibold shadow-md hover:bg-[#159c43] flex items-center gap-2 transition"
					>
						Find Ad Spaces <span>&rarr;</span>
					</Link>
				</div>
			</section>

			{/* Features Section */}
			<section className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-[#222] mb-4">
						Revolutionizing OOH Advertising in India
					</h2>
					<p className="text-lg text-[#666] max-w-3xl mx-auto">
						Our platform connects advertisers with ad space owners across major Indian cities
						through cutting-edge technology and seamless experiences.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Feature 1 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-3">Smart Ad Space Discovery</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Find the perfect advertising spaces using AI-powered location
							targeting and audience matching.
						</p>
					</div>

					{/* Feature 2 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-3">Real-Time Analytics</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Track impressions, engagement,
							and ROI with our comprehensive
							analytics dashboard.
						</p>
					</div>

					{/* Feature 3 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-3">Verified Ad Spaces</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							All locations are verified and
							authenticated for quality and
							performance.
						</p>
					</div>

					{/* Feature 4 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<svg className="w-8 h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
							</svg>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-3">Dynamic Pricing</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Get the best rates with our AI-driven dynamic pricing engine
							based on demand and
							seasonality.
						</p>
					</div>
				</div>
			</section>

			{/* Most Popular Areas */}
			<section className="max-w-6xl mx-auto w-full px-6 md:px-12 py-12 mt-8">
				<div className="flex items-end justify-between mb-8">
					<h2 className="text-3xl font-bold text-[#222]">Most Popular Areas</h2>
					<Link 
						href="/cities"
						className="text-[#1db954] font-medium hover:text-[#159c43] transition-colors flex items-center gap-1"
					>
						View More <span>&rarr;</span>
					</Link>
				</div>
				
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="animate-pulse">
								<div className="bg-gray-200 h-48 rounded-2xl mb-3"></div>
								<div className="bg-gray-200 h-4 rounded mb-2"></div>
								<div className="bg-gray-200 h-3 rounded w-2/3"></div>
							</div>
						))}
					</div>
				) : cities.length === 0 ? (
					<div className="text-center py-12">
						<div className="text-6xl mb-4">🏙️</div>
						<h3 className="text-xl font-semibold text-[#222] mb-2">No cities available</h3>
						<p className="text-[#666] mb-4">
							We&apos;re working on adding more cities. Check back soon!
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
						{cities.slice(0, 5).map((city, index) => {
							const gradients = [
								"from-red-100 to-red-200",
								"from-blue-100 to-blue-200", 
								"from-green-100 to-green-200",
								"from-yellow-100 to-orange-200",
								"from-purple-100 to-pink-200"
							];
							
							return (
								<div 
									key={city.static_id}
									className="group cursor-pointer"
									onClick={() => window.location.href = `/billboards/${city.static_id}`}
								>
									<div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradients[index]} h-48 mb-3 group-hover:shadow-lg transition-all`}>
										{city.photo ? (
											<>
												<Image
													src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${city.photo}`}
													alt={city.city_name.city}
													fill
													className="object-cover"
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 20vw"
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
											</>
										) : (
											<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
										)}
										<div className="absolute top-3 left-3">
										
										</div>
										{index === 0 && (
											<div className="absolute top-3 right-3">
												<span className="bg-[#1db954] text-white text-xs font-medium px-2 py-1 rounded-full">Featured</span>
											</div>
										)}
										{!city.photo && (
											<div className="flex items-center justify-center h-full text-6xl">
												🏛️
											</div>
										)}
									</div>
									<h3 className="font-semibold text-lg text-[#222] group-hover:text-[#1db954] transition-colors capitalize">
										{city.city_name.city}
									</h3>
									<p className="text-sm text-[#666]">
										{city.billboardCount} billboard{city.billboardCount !== 1 ? 's' : ''} available
									</p>
								</div>
							);
						})}
					</div>
				)}
			</section>

			{/* How It Works Section */}
			<section id="how-it-works" className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16">
				<div className="text-center mb-16">
					<h2 className="text-4xl font-bold text-[#222] mb-4">
						How It Works
					</h2>
					<p className="text-lg text-[#666] max-w-3xl mx-auto">
						Get your advertising campaign up and running in just a few simple steps
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
					{/* Step 1 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-white font-bold text-lg">01</span>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-4">Search & Filter</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Browse thousands of advertising spaces with our intuitive map interface and advanced filters.
						</p>
					</div>

					{/* Step 2 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-white font-bold text-lg">02</span>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-4">Book & Pay</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Secure your preferred dates instantly with our streamlined booking and payment system.
						</p>
					</div>

					{/* Step 3 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-white font-bold text-lg">03</span>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-4">Upload Creative</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Upload your creative assets and manage your campaign details from our dashboard.
						</p>
					</div>

					{/* Step 4 */}
					<div className="text-center">
						<div className="w-16 h-16 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
							<span className="text-white font-bold text-lg">04</span>
						</div>
						<h3 className="text-xl font-bold text-[#222] mb-4">Track Performance</h3>
						<p className="text-[#666] text-sm leading-relaxed">
							Monitor your campaign&apos;s performance with real-time analytics and audience insights.
						</p>
					</div>
				</div>

				<div className="text-center">
					<Link 
						href="#how-it-works" 
						className="bg-[#1db954] text-white px-8 py-3 rounded-full font-medium hover:bg-[#159c43] transition inline-flex items-center gap-2"
					>
						Learn More About The Process
						<span>&rarr;</span>
					</Link>
				</div>
			</section>

			{/* Trusted by Leading Brands Section */}
			<section className="max-w-6xl mx-auto w-full px-6 md:px-12 py-16 bg-gray-50">
				<div className="text-center mb-12">
					<h2 className="text-3xl font-bold text-[#222] mb-4">
						Trusted by Leading Brands
					</h2>
					<p className="text-lg text-[#666]">
						We&apos;ve helped these brands reach their audience effectively
					</p>
				</div>

				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
					{/* Row 1 */}
					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.zomato ? (
							<Image
								src="/zomato.png"
								alt="Zomato"
								width={120}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, zomato: true}))}
							/>
						) : (
							<span className="text-2xl font-bold text-red-500">zomato</span>
						)}
					</div>
					
					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.swiggy ? (
							<Image
								src="/swiggy.png"
								alt="Swiggy"
								width={120}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, swiggy: true}))}
							/>
						) : (
							<div className="flex items-center">
								<div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full mr-2 flex items-center justify-center">
									<span className="text-white font-bold text-sm">S</span>
								</div>
								<span className="text-xl font-bold text-orange-600">Swiggy</span>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.puma ? (
							<Image
								src="/puma.png"
								alt="PUMA"
								width={100}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, puma: true}))}
							/>
						) : (
							<div className="flex items-center">
								<div className="w-8 h-8 mr-2">
									<svg viewBox="0 0 24 24" className="w-full h-full fill-current text-black">
										<path d="M12.5 2L8 8h3v12h3V8h3l-4.5-6z"/>
									</svg>
								</div>
								<span className="text-2xl font-bold text-black">PUMA</span>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.myntra ? (
							<Image
								src="/myntra.png"
								alt="Myntra"
								width={120}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, myntra: true}))}
							/>
						) : (
							<div className="flex items-center">
								<div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mr-1">M</div>
								<span className="text-xl font-medium text-gray-700">yntra</span>
							</div>
						)}
					</div>

					{/* Row 2 */}
					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.amazon ? (
							<Image
								src="/amazon.png"
								alt="Amazon"
								width={120}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, amazon: true}))}
							/>
						) : (
							<div>
								<span className="text-2xl font-bold text-gray-900">amazon</span>
								<div className="w-12 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full mt-1"></div>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.flipkart ? (
							<Image
								src="/flipkart.png"
								alt="Flipkart"
								width={120}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, flipkart: true}))}
							/>
						) : (
							<div className="flex items-center bg-blue-600 px-3 py-1 rounded">
								<span className="text-xl font-bold text-white italic">Flipkart</span>
							</div>
						)}
					</div>

					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.uber ? (
							<Image
								src="/uber.png"
								alt="Uber"
								width={100}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, uber: true}))}
							/>
						) : (
							<span className="text-2xl font-medium text-black">Uber</span>
						)}
					</div>

					<div className="flex items-center justify-center h-16 hover:scale-105 transition-all duration-300">
						{!logoErrors.ola ? (
							<Image
								src="/ola.png"
								alt="OLA"
								width={100}
								height={40}
								className="object-contain"
								onError={() => setLogoErrors(prev => ({...prev, ola: true}))}
							/>
						) : (
							<div className="flex items-center">
								<div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mr-2">
									<span className="text-white font-bold">O</span>
								</div>
								<span className="text-xl font-bold text-green-600">LA</span>
							</div>
						)}
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="bg-white mt-16 border-t-1">
				<div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-12">
					{/* Brand */}
					<div className="md:col-span-2 space-y-4">
						<h3 className="text-2xl font-bold">Vigyapan</h3>
						<p className="text-[#555]">
							The premier marketplace connecting advertisers with
							premium out-of-home and digital advertising spaces
							worldwide.
						</p>
						<div className="space-y-2 text-sm text-[#444]">
							<div>
								📍 42 MG Road, Bangalore, Karnataka 560001,
								India
							</div>
							<div>✉️ info@vigyapan.com</div>
							<div>📞 +91 8317242108</div>
							<div>⏰ Mon-Fri: 10AM-7PM (IST)</div>
						</div>
						<div className="flex gap-4 pt-4">
							<Image
								src="/Download_on_the_App_Store_Badge.svg"
								alt="App Store"
								width={140}
								height={40}
								className="h-10 w-auto"
							/>
							<Image
								src="/Google_Play_Store_badge_EN.svg"
								alt="Google Play"
								width={140}
								height={40}
								className="h-10 w-auto"
							/>
						</div>
					</div>

					{/* Links */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 col-span-3 text-sm">
						<div className="space-y-2 flex flex-col">
							<h4 className="font-semibold mb-2">Company</h4>
							<Link href="#">About Us</Link>
							<Link href="#">Careers</Link>
							<Link href="#">Press</Link>
							<Link href="#">Blog</Link>
							<Link href="#">Contact</Link>
						</div>
						<div className="space-y-2 flex flex-col">
							<h4 className="font-semibold mb-2">Advertisers</h4>
							<Link href="#how-it-works">How It Works</Link>
							<Link href="/for-advertisers">Pricing</Link>
							<Link href="/for-advertisers">Case Studies</Link>
							<Link href="/for-advertisers">Success Stories</Link>
							<Link href="/for-advertisers">Resources</Link>
						</div>
						<div className="space-y-2 flex flex-col">
							<h4 className="font-semibold mb-2">Vendors</h4>
							<Link href="/for-vendors">List Your Space</Link>
							<Link href="/for-vendors">Vendor Guidelines</Link>
							<Link href="/for-vendors">Vendor Success Stories</Link>
							<Link href="/dashboard/vendor">Vendor Dashboard</Link>
							<Link href="/for-vendors">Vendor Support</Link>
						</div>
						<div className="space-y-2 flex flex-col">
							<h4 className="font-semibold mb-2">Support</h4>
							<Link href="#">Help Center</Link>
							<Link href="#">FAQs</Link>
							<Link href="#">Terms of Service</Link>
							<Link href="#">Privacy Policy</Link>
							<Link href="#">Cookie Policy</Link>
						</div>
					</div>
				</div>

				{/* Newsletter */}
				<div className="border-t border-gray-200">
					<div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-evenly items-center">
						<div>
							<b>Subscribe to our newsletter</b>
							<p className="text-sm text-[#555]">
								Stay updated with the latest in outdoor
								advertising
							</p>
						</div>
						<form
							className="flex gap-2"
							onSubmit={(e) => e.preventDefault()}
						>
							<input
								type="email"
								placeholder="Enter your email"
								required
								className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954]"
							/>
							<button
								type="submit"
								className="bg-[#22a745] text-white px-4 py-2 rounded-lg hover:bg-[#1a8c3a] transition"
							>
								Subscribe
							</button>
						</form>
					</div>
					<hr />
					<div className="text-center py-4 text-sm text-[#7a848c]">
						© 2025 Vigyapan. All rights reserved.
					</div>
				</div>
			</footer>
		</div>
	);
}
