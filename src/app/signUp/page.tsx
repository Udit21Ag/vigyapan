"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
const isLoggedIn =
	typeof window !== "undefined" && !!localStorage.getItem("accessToken");

export default function CreateAccount() {
	const googleBtnRef = useRef<HTMLDivElement | null>(null);
	const [role, setRole] = useState("vendor");
	const [userType, setUserType] = useState<string | null>(null);
	const [error, setError] = useState("");
	const [form, setForm] = useState({
		username: "",
		email: "",
		password: "",
		confirm: "",
	});

	useEffect(() => {
		if (typeof window !== "undefined") {
			setUserType(localStorage.getItem("userType"));
		}
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userType");
		localStorage.removeItem("completed_profile");
		window.location.reload();
	};

	type GoogleCredentialResponse = {
		credential: string;
	};



	const handleGoogleLogin = useCallback(async (response: GoogleCredentialResponse) => {
		try {
			const res = await fetch(apiUrl("/users/googleLogin/"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token: response.credential }),
			});
			const data = await res.json();
			if (res.ok && data.access) {
				localStorage.setItem("accessToken", data.access);
				localStorage.setItem("refreshToken", data.refresh);
				localStorage.setItem("userType", data.usertype || "");
				localStorage.setItem("completed_profile", data.completed_profile || "false");
				
				// Check if profile is completed
				if (data.completed_profile === "true" || data.completed_profile === true) {
					window.location.href = "/";
				} else {
					window.location.href = "/complete-profile";
				}
			} else {
				setError("Google login failed");
			}
		} catch {
			setError("Server error. Please try again later.");
		}
	}, []);

	useEffect(() => {
		if (
			typeof window !== "undefined" &&
			window.google &&
			googleBtnRef.current
		) {
			type GoogleId = {
				initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void;
				renderButton: (parent: HTMLElement, options: { theme: string; size: string; text: string; shape: string; logo_alignment: string }) => void;
			};
			const googleAccounts = (window.google as { accounts?: { id: GoogleId } }).accounts;
			if (googleAccounts && googleAccounts.id) {
				googleAccounts.id.initialize({
					client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
					callback: handleGoogleLogin,
				});
				googleAccounts.id.renderButton(googleBtnRef.current, {
					theme: "filled_black",
					size: "large",
					text: "continue_with",
					shape: "pill",
					logo_alignment: "left",
				});
			}
		}
	}, [handleGoogleLogin]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
		setError(""); // Clear error when user starts typing
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(""); // Clear any existing errors
		if (form.password !== form.confirm) {
			setError("Passwords do not match.");
			return;
		}
		try {
			const res = await fetch(apiUrl("/users/create_account/"), {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username: form.username,
					password: form.password,
					usertype: role,
					email: form.email,
				}),
			});
			const data = await res.json();
			if (res.ok && data.access && data.refresh) {
				localStorage.setItem("accessToken", data.access);
				localStorage.setItem("refreshToken", data.refresh);
				localStorage.setItem("userType", role);
				localStorage.setItem("completed_profile", data.completed_profile || "false");
				
				// Check if profile is completed  
				if (data.completed_profile === "true" || data.completed_profile === true) {
					window.location.href = "/";
				} else {
					window.location.href = "/complete-profile";
				}
			} else {
				setError(data.error || "Account creation failed.");
			}
		} catch {
			setError("Server error. Please try again later.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
			{/* Header */}
			<header className="flex items-center justify-between px-4 md:px-12 py-4 border-b border-gray-800 bg-gray-900 shadow-sm">
				<Link href="/" className="text-xl md:text-2xl font-bold text-[#1db954]">
					<Image
						src="/vigyapan.png"
						alt="Vigyapan"
						width={160}
						height={60}
						className="h-[30px] md:h-[38px] w-auto"
					/>
				</Link>
				
				{/* Desktop Navigation */}
				<nav className="hidden lg:flex gap-6 xl:gap-8 text-gray-300 font-medium text-sm xl:text-base">
					<Link href="/cities" className="hover:text-[#1db954] transition-colors">
						Find Ad Spaces
					</Link>
					<Link href="/#how-it-works" className="hover:text-[#1db954] transition-colors">
						How It Works
					</Link>
					{userType === "vendor" ? (
						<>
							<Link href="/for-vendors" className="text-[#1db954] font-semibold hover:text-green-700 transition-colors">
								For Vendors
							</Link>
							<Link href="/dashboard/vendor" className="hover:text-[#1db954] transition-colors">
								Dashboard
							</Link>
						</>
					) : userType === "advertiser" ? (
						<>
							<Link href="/for-advertisers" className="text-[#1db954] font-semibold hover:text-green-700 transition-colors">
								For Advertisers
							</Link>
							<Link href="/dashboard/advertiser" className="hover:text-[#1db954] transition-colors">
								Dashboard
							</Link>
						</>
					) : (
						<>
							<Link href="/for-vendors" className="hover:text-[#1db954] transition-colors">
								For Vendors
							</Link>
							<Link href="/for-advertisers" className="hover:text-[#1db954] transition-colors">
								For Advertisers
							</Link>
						</>
					)}
				</nav>
				
				{/* Mobile & Desktop Auth Button */}
				<div className="flex items-center">
					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="px-3 py-2 md:px-5 md:py-2 rounded-full bg-[#1db954] text-white font-medium hover:bg-[#159c43] transition text-sm md:text-base"
						>
							Log Out
						</button>
					) : (
						<Link
							href="/signIn"
							className="px-3 py-2 md:px-5 md:py-2 rounded-md border border-gray-700 text-white font-medium hover:shadow-md transition bg-[#1db954] hover:bg-[#159c43] text-sm md:text-base"
						>
							Sign In
						</Link>
					)}
				</div>
			</header>

			{/* Mobile Navigation Menu - Only show if needed */}
			<div className="lg:hidden bg-gray-900 border-b border-gray-800 shadow-sm">
				<nav className="px-4 py-3 flex flex-wrap gap-4 text-gray-300 font-medium text-sm">
					<Link href="/cities" className="hover:text-[#1db954] transition-colors">
						Find Spaces
					</Link>
					<Link href="/#how-it-works" className="hover:text-[#1db954] transition-colors">
						How It Works
					</Link>
					{userType === "vendor" ? (
						<>
							<Link href="/for-vendors" className="text-[#1db954] font-semibold hover:text-green-700 transition-colors">
								Vendors
							</Link>
							<Link href="/dashboard/vendor" className="hover:text-[#1db954] transition-colors">
								Dashboard
							</Link>
						</>
					) : userType === "advertiser" ? (
						<>
							<Link href="/for-advertisers" className="text-[#1db954] font-semibold hover:text-green-700 transition-colors">
								Advertisers
							</Link>
							<Link href="/dashboard/advertiser" className="hover:text-[#1db954] transition-colors">
								Dashboard
							</Link>
						</>
					) : (
						<>
							<Link href="/for-vendors" className="hover:text-[#1db954] transition-colors">
								Vendors
							</Link>
							<Link href="/for-advertisers" className="hover:text-[#1db954] transition-colors">
								Advertisers
							</Link>
						</>
					)}
				</nav>
			</div>

			{/* Main */}
			<main className="flex-grow flex items-center justify-center px-4 bg-gray-900">
				<form
					onSubmit={handleSubmit}
					className="bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-lg border border-gray-700"
				>
					<h2 className="text-xl font-bold text-white mb-1">
						Create Your Account
					</h2>
					<p className="text-gray-300 mb-6">
						Join the premier OOH advertising marketplace
					</p>

					{/* Role Select */}
					<div className="flex gap-2 mb-4">
						<button
							type="button"
							onClick={() => setRole("advertiser")}
							className={`flex-1 py-2 rounded-md border font-medium transition ${
								role === "advertiser"
									? "bg-green-900 border-[#1db954] text-[#1db954]"
									: "bg-gray-900 border-gray-700 text-gray-300 hover:bg-green-900"
							}`}
						>
							Advertiser
						</button>
						<button
							type="button"
							onClick={() => setRole("vendor")}
							className={`flex-1 py-2 rounded-md border font-medium transition ${
								role === "vendor"
									? "bg-green-900 border-[#1db954] text-[#1db954]"
									: "bg-gray-900 border-gray-700 text-gray-300 hover:bg-green-900"
							}`}
						>
							Vendor
						</button>
					</div>

					{/* Inputs */}
					<input
						name="username"
						placeholder="Username"
						value={form.username}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#1db954]"
					/>
					<input
						name="email"
						type="email"
						placeholder="you@example.com"
						value={form.email}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#1db954]"
					/>
					<input
						name="password"
						type="password"
						placeholder="Create a password"
						value={form.password}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#1db954]"
					/>
					<input
						name="confirm"
						type="password"
						placeholder="Confirm your password"
						value={form.confirm}
						onChange={handleChange}
						required
						className="mb-4 w-full p-3 border border-gray-700 rounded-lg bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#1db954]"
					/>

					{/* Submit Button */}
					{!isLoggedIn && (
						<button
							type="submit"
							className="w-full bg-[#1db954] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#159c43] transition"
						>
							Create Account
						</button>
					)}

					{/* Error Message */}
					{error && (
						<div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-lg">
							<p className="text-red-300 text-sm text-center">{error}</p>
						</div>
					)}

					{/* Already have account */}
					{!isLoggedIn && (
						<p className="mt-3 text-center text-sm text-gray-300">
							Already have an account?{" "}
							<a
								href="/signIn"
								className="text-[#1db954] font-medium"
							>
								Sign In
							</a>
						</p>
					)}

					{/* Google Login */}
					<div className="mt-5 text-center">
						<span className="text-gray-300">Or continue with</span>
						<div
							ref={googleBtnRef}
							className="flex justify-center mt-2"
						></div>
					</div>
				</form>
			</main>

			{/* Footer */}
			<footer className="text-center py-6 text-gray-400 border-t border-gray-800 bg-gray-900">
				<p>© 2025 Vigyapan. All rights reserved.</p>
			</footer>
		</div>
	);
}
