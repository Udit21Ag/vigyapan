"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";


// API utility
const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [userType, setUserType] = useState<string | null>(null);
	const googleBtnRef = useRef<HTMLDivElement | null>(null);

	const isLoggedIn =
		typeof window !== "undefined" && !!localStorage.getItem("accessToken");

	useEffect(() => {
		if (typeof window !== "undefined") {
			setUserType(localStorage.getItem("userType"));
		}
	}, [isLoggedIn]);

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		localStorage.removeItem("userType");
		localStorage.removeItem("completed_profile");
		window.location.reload();
	};

	interface GoogleCredentialResponse {
		credential: string;
	}

	const handleGoogleLogin = useCallback(async (response: GoogleCredentialResponse) => {
		try {
			const res = await fetch(apiUrl("/users/googleLogin/"), {
				method: "POST",
				body: JSON.stringify({ token: response.credential }),
				headers: {
					"Content-Type": "application/json",
				},
			});
			const data = await res.json();
					if (res.ok && data.access) {
						localStorage.setItem("accessToken", data.access);
						localStorage.setItem("refreshToken", data.refresh);
						localStorage.setItem("userType", data.usertype || ""); // Use usertype from API if available
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
			// Check for required env variable
			const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
			if (!clientId) {
				setError("Google Client ID is not set. Contact support.");
				return;
			}

			// Dynamically load Google Identity Services script if not present
			if (typeof window !== "undefined" && googleBtnRef.current) {
				if (!window.google || !window.google.accounts) {
					const script = document.createElement("script");
					script.src = "https://accounts.google.com/gsi/client";
					script.async = true;
					script.onload = () => {
						if (window.google && window.google.accounts && googleBtnRef.current) {
							try {
								window.google.accounts.id.initialize({
									client_id: clientId,
									callback: handleGoogleLogin,
								});
								window.google.accounts.id.renderButton(googleBtnRef.current, {
									theme: "outline",
									size: "large",
									text: "continue_with",
									shape: "pill",
									logo_alignment: "left",
								});
							} catch{
								setError("Google login setup failed.");
							}
						}
					};
					script.onerror = () => {
						setError("Failed to load Google login script.");
					};
					document.body.appendChild(script);
				} else {
					try {
						window.google.accounts.id.initialize({
							client_id: clientId,
							callback: handleGoogleLogin,
						});
						window.google.accounts.id.renderButton(googleBtnRef.current, {
							theme: "outline",
							size: "large",
							text: "continue_with",
							shape: "pill",
							logo_alignment: "left",
						});
					} catch {
						setError("Google login setup failed.");
					}
				}
			}
		}, [handleGoogleLogin]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		try {
			const response = await fetch(apiUrl("/users/vendorLogin/"), {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({ username, password }).toString(),
			});
			const data = await response.json();
					if (response.ok && data.access) {
						localStorage.setItem("accessToken", data.access);
						localStorage.setItem("refreshToken", data.refresh);
						localStorage.setItem("userType", data.usertype); // or set dynamically if available
						localStorage.setItem("completed_profile", data.completed_profile || "false");
						
						// Check if profile is completed
						if (data.completed_profile === "true" || data.completed_profile === true) {
							window.location.href = "/";
						} else {
							window.location.href = "/complete-profile";
						}
					} else {
						setError("Invalid username or password");
					}
		} catch {
			setError("Server error. Please try again later.");
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
			{/* Header */}
			<header className="flex items-center justify-between px-4 md:px-12 py-4 border-b bg-white shadow-sm">
				<Link href="/" className="text-xl md:text-2xl font-bold text-green-600">
					<Image
						src="/vigyapan.png"
						alt="Vigyapan"
						width={160}
						height={60}
						className="h-[30px] md:h-[38px] w-auto"
					/>
				</Link>
				<nav className="hidden md:flex gap-8 text-gray-800 font-medium">
					<Link href="/cities" className="hover:text-green-600">
						Find Ad Spaces
					</Link>
					<Link href="/#how-it-works" className="hover:text-green-600">
						How It Works
					</Link>
					{userType === "vendor" ? (
						<>
							<Link href="/for-vendors" className="text-green-600 font-semibold hover:text-green-700">
								For Vendors
							</Link>
							<Link href="/dashboard/vendor" className="hover:text-green-600">
								Dashboard
							</Link>
						</>
					) : userType === "advertiser" ? (
						<>
							<Link href="/for-advertisers" className="text-green-600 font-semibold hover:text-green-700">
								For Advertisers
							</Link>
							<Link href="/dashboard/advertiser" className="hover:text-green-600">
								Dashboard
							</Link>
						</>
					) : (
						<>
							<Link href="/for-vendors" className="hover:text-green-600">
								For Vendors
							</Link>
							<Link href="/for-advertisers" className="hover:text-green-600">
								For Advertisers
							</Link>
						</>
					)}
				</nav>
				<div className="hidden md:block">
					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
						>
							Log Out
						</button>
					) : (
						<Link
							href="/signUp"
							className="px-5 py-2 rounded-md border border-gray-300 text-white font-medium hover:shadow-md transition bg-green-600 hover:bg-green-700"
						>
							Sign Up
						</Link>
					)}
				</div>
			</header>

			{/* Main */}
			<main className="flex flex-col items-center justify-center flex-1 px-4 py-6 md:py-8">
				<form
					onSubmit={handleSubmit}
					className="bg-white p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-md"
				>
					<h2 className="text-xl md:text-2xl font-bold text-green-600 mb-2 text-center">
						Sign In
					</h2>
					<p className="text-gray-600 mb-6 text-center text-sm md:text-lg">
						Welcome back to Vigyapan Market Connect
					</p>

					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="mb-3 w-full p-3 md:p-4 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700 text-sm md:text-base"
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mb-4 md:mb-6 w-full p-3 md:p-4 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700 text-sm md:text-base"
					/>

					{!isLoggedIn && (
						<button
							type="submit"
							className="w-full bg-green-600 text-white py-3 md:py-4 rounded-lg font-semibold hover:bg-green-700 transition text-sm md:text-base"
						>
							Sign In
						</button>
					)}

					{error && (
						<div className="mt-2 text-red-500 text-sm text-center">
							{error}
						</div>
					)}

					<p className="text-center mt-4 text-gray-600">
						Don’t have an account?{" "}
						<Link
							href="/signUp"
							className="text-green-600 hover:underline"
						>
							Create Account
						</Link>
					</p>

					<div className="mt-6">
						<span className="block text-center text-gray-500 text-sm mb-2">
							Or continue with
						</span>
						<div
							ref={googleBtnRef}
							className="flex justify-center"
						></div>
					</div>
				</form>
			</main>

			{/* Footer */}
			<footer className="text-center py-4 md:py-6 text-gray-600 border-t bg-white text-sm">
				<p>© 2025 Vigyapan. All rights reserved.</p>
			</footer>
		</div>
	);
}
