"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useProfileProtection = () => {
	const router = useRouter();

	useEffect(() => {
		// Check if user is authenticated
		const token = localStorage.getItem("accessToken");
		if (!token) {
			router.push("/signIn");
			return;
		}

		// Check if profile is completed
		const completed = localStorage.getItem("completed_profile");
		if (completed !== "true") {
			router.push("/complete-profile");
			return;
		}
	}, [router]);
};

export const checkProfileCompletion = () => {
	if (typeof window === "undefined") return false;
	
	const token = localStorage.getItem("accessToken");
	const completed = localStorage.getItem("completed_profile");
	
	return token && completed === "true";
};
