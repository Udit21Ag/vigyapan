"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

// API utility
const apiUrl = (path: string) => `http://localhost:8000${path}`;

export default function SignIn() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const googleBtnRef = useRef<HTMLDivElement | null>(null);

	const isLoggedIn =
		typeof window !== "undefined" && !!localStorage.getItem("accessToken");

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		window.location.reload();
	};

	const handleGoogleLogin = async (response: any) => {
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
				window.location.href = "/";
			} else {
				setError("Google login failed");
			}
		} catch {
			setError("Server error. Please try again later.");
		}
	};

	useEffect(() => {
		if (window.google && window.google.accounts && googleBtnRef.current) {
			window.google.accounts.id.initialize({
				client_id: process.env.NEXT_PUBLIC_GOOGLE_OAUTH2_CLIENT_ID!,
				callback: handleGoogleLogin,
			});
			window.google.accounts.id.renderButton(googleBtnRef.current, {
				theme: "outline",
				size: "large",
				text: "continue_with",
				shape: "pill",
				logo_alignment: "left",
			});
		}
	}, []);

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
				window.location.href = "/";
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
			<header className="flex items-center justify-between px-12 py-4 border-b bg-white shadow-sm">
				<Link href="/" className="text-2xl font-bold text-green-600">
					<Image
						src="/vigyapan.png"
						alt="Vigyapan"
						width={160}
						height={60}
						className="h-[38px] w-auto"
					/>
				</Link>
				<nav className="flex gap-8 text-gray-800 font-medium">
					<a href="/#features" className="hover:text-green-600">
						Find Ad Spaces
					</a>
					<a href="/#how-it-works" className="hover:text-green-600">
						How It Works
					</a>
					<a href="/#solutions" className="hover:text-green-600">
						For Vendors
					</a>
					<a href="/#solutions" className="hover:text-green-600">
						For Advertisers
					</a>
				</nav>
				<div>
					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
						>
							Log Out
						</button>
					) : (
						<a
							href="/signUp"
							className="px-5 py-2 rounded-md border border-gray-300 text-white font-medium hover:shadow-md transition bg-green-600 hover:bg-green-700"
						>
							Sign Up
						</a>
					)}
				</div>
			</header>

			{/* Main */}
			<main className="flex flex-col items-center justify-center flex-1 px-4">
				<form
					onSubmit={handleSubmit}
					className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
				>
					<h2 className="text-2xl font-bold text-green-600 mb-2 text-center">
						Sign In
					</h2>
					<p className="text-gray-600 mb-6 text-center text-lg">
						Welcome back to Vigyapan Market Connect
					</p>

					<input
						type="text"
						placeholder="Username"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
						className="mb-3 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>

					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
						className="mb-3 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>

					{!isLoggedIn && (
						<button
							type="submit"
							className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
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
			<footer className="text-center py-6 text-gray-600 border-t bg-white">
				<p>© 2025 Vigyapan. All rights reserved.</p>
			</footer>
		</div>
	);
}
