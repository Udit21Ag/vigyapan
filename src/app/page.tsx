"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function LandingPage() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	// Check localStorage only on client
	useEffect(() => {
		const loggedIn =
			Boolean(localStorage.getItem("token")) ||
			Boolean(localStorage.getItem("accessToken"));
		setIsLoggedIn(loggedIn);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		window.location.reload();
	};

	return (
		<div className="font-inter bg-[#f8fcfa] min-h-screen text-[#111] flex flex-col">
			{/* Header */}
			<header className="w-full border-b-1 pb-5">
				<div className="flex items-center justify-between px-12 pt-5 max-w-6xl mx-auto w-full flex-wrap gap-4">
					<Image
						src="/vigyapan.png"
						alt="Vigyapan"
						width={160}
						height={60}
						className="h-[38px] w-auto"
					/>

					<nav className="flex gap-9 text-[1.08rem] font-medium">
						<Link
							href="#"
							className="text-[#222] hover:text-[#1db954]"
						>
							Find Ad Spaces
						</Link>
						<Link
							href="#"
							className="text-[#222] hover:text-[#1db954]"
						>
							How It Works
						</Link>
						<Link
							href="#"
							className="text-[#222] hover:text-[#1db954]"
						>
							For Vendors
						</Link>
						<Link
							href="#"
							className="text-[#1db954] font-semibold hover:text-[#159c43]"
						>
							For Advertisers
						</Link>
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
						href="#"
						className="bg-[#1db954] text-white rounded-3xl px-8 py-3 text-lg font-semibold shadow-md hover:bg-[#159c43] flex items-center gap-2 transition"
					>
						Find Ad Spaces <span>&rarr;</span>
					</Link>
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
							<Link href="#">How It Works</Link>
							<Link href="#">Pricing</Link>
							<Link href="#">Case Studies</Link>
							<Link href="#">Success Stories</Link>
							<Link href="#">Resources</Link>
						</div>
						<div className="space-y-2 flex flex-col">
							<h4 className="font-semibold mb-2">Vendors</h4>
							<Link href="#">List Your Space</Link>
							<Link href="#">Vendor Guidelines</Link>
							<Link href="#">Vendor Success Stories</Link>
							<Link href="#">Vendor Dashboard</Link>
							<Link href="#">Vendor Support</Link>
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
