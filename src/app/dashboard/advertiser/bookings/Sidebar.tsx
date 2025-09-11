"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-64 bg-green-700 text-white flex flex-col py-8 px-6 shadow-lg rounded-r-3xl min-h-screen">
            <h2 className="text-2xl font-bold mb-8 text-center">Advertiser Panel</h2>
            <nav className="flex flex-col gap-6">
                <Link href="/" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/" ? "bg-white text-green-700 border border-white shadow-md" : "bg-green-600 text-white hover:bg-green-800"}`}>Home</Link>
                <Link href="/dashboard/advertiser" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/dashboard/advertiser" ? "bg-white text-green-700 border border-white shadow-md" : "bg-green-600 text-white hover:bg-green-800"}`}>Billboards</Link>
                <Link href="/dashboard/advertiser/bookings" className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === "/dashboard/advertiser/bookings" ? "bg-white text-green-700 border border-white shadow-md" : "bg-green-600 text-white hover:bg-green-800"}`}>Bookings</Link>
            </nav>
        </aside>
    );
}
