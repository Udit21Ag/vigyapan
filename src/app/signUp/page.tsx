"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

const isLoggedIn =
	typeof window !== "undefined" && !!localStorage.getItem("accessToken");

export default function CreateAccount() {
	const googleBtnRef = useRef<HTMLDivElement | null>(null);
	const [role, setRole] = useState("vendor");
	const [form, setForm] = useState({
		company: "",
		email: "",
		password: "",
		confirm: "",
	});

	const handleLogout = () => {
		localStorage.removeItem("accessToken");
		localStorage.removeItem("refreshToken");
		window.location.reload();
	};

	const handleGoogleLogin = async (response: any) => {
		try {
			const res = await fetch("/api/users/googleLogin", {
				method: "POST",
				body: JSON.stringify({ token: response.credential }),
			});
			const data = await res.json();
			if (res.ok && data.access) {
				localStorage.setItem("accessToken", data.access);
				localStorage.setItem("refreshToken", data.refresh);
				window.location.href = "/";
			} else {
				alert("Google login failed");
			}
		} catch (err) {
			alert("Server error. Please try again later.");
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

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		alert("Account created!");
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
							href="/signIn"
							className="px-5 py-2 rounded-md border border-gray-300 text-white font-medium hover:shadow-md transition bg-green-600 hover:bg-green-700"
						>
							Sign In
						</a>
					)}
				</div>
			</header>

			{/* Main */}
			<main className="flex-grow flex items-center justify-center px-4">
				<form
					onSubmit={handleSubmit}
					className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-lg"
				>
					<h2 className="text-xl font-bold text-gray-900 mb-1">
						Create Your Account
					</h2>
					<p className="text-gray-700 mb-6">
						Join the premier OOH advertising marketplace
					</p>

					{/* Role Select */}
					<div className="flex gap-2 mb-4">
						<button
							type="button"
							onClick={() => setRole("advertiser")}
							className={`flex-1 py-2 rounded-md border font-medium transition ${
								role === "advertiser"
									? "bg-green-100 border-green-500 text-green-600"
									: "bg-[#f8fcfa] border-gray-300 text-gray-900 hover:bg-green-50"
							}`}
						>
							Advertiser
						</button>
						<button
							type="button"
							onClick={() => setRole("vendor")}
							className={`flex-1 py-2 rounded-md border font-medium transition ${
								role === "vendor"
									? "bg-green-100 border-green-500 text-green-600"
									: "bg-[#f8fcfa] border-gray-300 text-gray-900 hover:bg-green-50"
							}`}
						>
							Vendor
						</button>
					</div>

					{/* Inputs */}
					<input
						name="company"
						placeholder="Your company name"
						value={form.company}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>
					<input
						name="email"
						type="email"
						placeholder="you@example.com"
						value={form.email}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>
					<input
						name="password"
						type="password"
						placeholder="Create a password"
						value={form.password}
						onChange={handleChange}
						required
						className="mb-3 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>
					<input
						name="confirm"
						type="password"
						placeholder="Confirm your password"
						value={form.confirm}
						onChange={handleChange}
						required
						className="mb-4 w-full p-3 border border-gray-400 rounded-lg bg-[#f8fcfa] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-700"
					/>

					{/* Submit Button */}
					{!isLoggedIn && (
						<button
							type="submit"
							className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg shadow-md hover:bg-green-700 transition"
						>
							Create Account
						</button>
					)}

					{/* Already have account */}
					{!isLoggedIn && (
						<p className="mt-3 text-center text-sm text-gray-900">
							Already have an account?{" "}
							<a
								href="/signIn"
								className="text-green-600 font-medium"
							>
								Sign In
							</a>
						</p>
					)}

					{/* Google Login */}
					<div className="mt-5 text-center">
						<span className="text-gray-700">Or continue with</span>
						<div
							ref={googleBtnRef}
							className="flex justify-center mt-2"
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
