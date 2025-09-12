"use client";
import Sidebar from "./Sidebar";
import { useProfileProtection } from "../../../hooks/useProfileProtection";

export default function VendorDashboard() {
    useProfileProtection();
    
    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-900 to-gray-800">
            <Sidebar />
            <main className="flex-1 flex flex-col items-center justify-center p-12">
                <h1 className="text-4xl font-bold text-green-400 mb-4">Welcome, Vendor!</h1>
                <p className="text-lg text-gray-300 mb-8 text-center max-w-xl">
                    Manage your billboards, view stats, and add new locations easily. Use the sidebar to navigate your dashboard.
                </p>
                {/* Example stats/cards - you can customize further */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6 flex flex-col items-center">
                        <span className="text-green-400 text-2xl font-bold">12</span>
                        <span className="text-gray-300 mt-2">Active Billboards</span>
                    </div>
                    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6 flex flex-col items-center">
                        <span className="text-green-400 text-2xl font-bold">3</span>
                        <span className="text-gray-300 mt-2">Inactive Billboards</span>
                    </div>
                    <div className="bg-gray-800 rounded-xl shadow-md border border-gray-700 p-6 flex flex-col items-center">
                        <span className="text-green-400 text-2xl font-bold">₹2,500</span>
                        <span className="text-gray-300 mt-2">Avg. Daily Revenue</span>
                    </div>
                </div>
            </main>
        </div>
    );
}