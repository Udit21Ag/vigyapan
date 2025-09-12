"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-64 bg-gray-900 text-gray-100 flex flex-col py-8 px-6 shadow-xl border-r border-gray-800 min-h-screen">
            <h2 className="text-2xl font-bold mb-8 text-center text-gray-100">Advertiser Panel</h2>
            <nav className="flex flex-col gap-6">
                <Link href="/" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/" ? "bg-gray-800 text-green-400 border border-gray-700 shadow-md" : "bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-gray-100 border border-gray-700/50"}`}>Home</Link>
                <Link href="/dashboard/advertiser" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/dashboard/advertiser" ? "bg-gray-800 text-green-400 border border-gray-700 shadow-md" : "bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-gray-100 border border-gray-700/50"}`}>Billboards</Link>
                <Link href="/dashboard/advertiser/bookings" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/dashboard/advertiser/bookings" ? "bg-gray-800 text-green-400 border border-gray-700 shadow-md" : "bg-gray-800/50 text-gray-300 hover:bg-gray-800 hover:text-gray-100 border border-gray-700/50"}`}>Bookings</Link>
            </nav>
        </aside>
    );
}
