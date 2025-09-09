"use client";
import Sidebar from "./Sidebar";

export default function VendorDashboard() {
    return (
        <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
            <Sidebar />
            <main className="flex-1 flex flex-col items-center justify-center p-12">
                <h1 className="text-4xl font-bold text-green-700 mb-4">Welcome, Vendor!</h1>
                <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
                    Manage your billboards, view stats, and add new locations easily. Use the sidebar to navigate your dashboard.
                </p>
                {/* Example stats/cards - you can customize further */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                        <span className="text-green-600 text-2xl font-bold">12</span>
                        <span className="text-gray-600 mt-2">Active Billboards</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                        <span className="text-green-600 text-2xl font-bold">3</span>
                        <span className="text-gray-600 mt-2">Inactive Billboards</span>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center">
                        <span className="text-green-600 text-2xl font-bold">₹2,500</span>
                        <span className="text-gray-600 mt-2">Avg. Daily Revenue</span>
                    </div>
                </div>
            </main>
        </div>
    );
}