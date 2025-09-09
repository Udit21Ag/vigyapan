"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
    { href: "/", label: "Home" },
    { href: "/dashboard/advertiser", label: "Billboards" },
    { href: "/dashboard/advertiser/bookings", label: "Bookings" },
    { href: "/dashboard/advertiser/advertisements", label: "Campaigns" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const handleLogout = () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userType");
        window.location.href = "/";
    };
    return (
        <aside className="w-64 bg-green-700 text-white flex flex-col py-8 px-6 shadow-lg rounded-r-3xl min-h-screen">
            <h2 className="text-2xl font-bold mb-8 text-center">Advertiser Panel</h2>
            <nav className="flex flex-col gap-6">
                {SIDEBAR_LINKS.map(({ href, label }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`py-2 px-4 rounded-lg font-semibold transition ${pathname === href ? "bg-green-100 text-green-700 border border-green-600" : href === "/" ? "bg-green-600 hover:bg-green-800" : "bg-white text-green-700 hover:bg-green-50"}`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
            <div className="mt-auto pt-8">
                <button onClick={handleLogout} className="w-full py-2 px-4 rounded-lg bg-red-500 hover:bg-red-700 font-semibold transition">Log Out</button>
            </div>
        </aside>
    );
}
