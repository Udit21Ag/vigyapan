"use client";
import { useRouter } from "next/navigation";

export default function AdvertiserDashboard() {
    const router = useRouter();
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        router.push("/");
    };
    return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Advertiser Dashboard</h1>
            <p>Welcome, advertiser! This is your dashboard.</p>
            <button onClick={handleLogout} className="mt-6 px-4 py-2 bg-red-500 text-white rounded-lg">Log Out</button>
        </div>
    );
}