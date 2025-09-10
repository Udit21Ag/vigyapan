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
				window.location.href = "/";
			} else {
				alert("Google login failed");
			}
		} catch {
			alert("Server error. Please try again later.");
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
					theme: "outline",
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
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (form.password !== form.confirm) {
			alert("Passwords do not match.");
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
				alert("Account created successfully!");
				window.location.href = "/";
			} else {
				alert(data.error || "Account creation failed.");
			}
		} catch {
			alert("Server error. Please try again later.");
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
				<div>
					{isLoggedIn ? (
						<button
							onClick={handleLogout}
							className="px-5 py-2 rounded-full bg-green-600 text-white font-medium hover:bg-green-700 transition"
						>
							Log Out
						</button>
					) : (
						<Link
							href="/signIn"
							className="px-5 py-2 rounded-md border border-gray-300 text-white font-medium hover:shadow-md transition bg-green-600 hover:bg-green-700"
						>
							Sign In
						</Link>
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
						name="username"
						placeholder="Username"
						value={form.username}
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
