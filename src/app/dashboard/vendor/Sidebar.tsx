"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SIDEBAR_LINKS = [
    { href: "/", label: "Home" },
    { href: "/dashboard/vendor/addBillboard", label: "Add Billboard" },
];

export default function Sidebar() {
    const pathname = usePathname();
        return (
            <aside className="w-64 bg-green-700 text-white flex flex-col py-8 px-6 shadow-lg rounded-r-3xl min-h-screen">
                <h2 className="text-2xl font-bold mb-8 text-center">Vendor Panel</h2>
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
                    <Link href="/dashboard/vendor/booking-requests" className="py-2 px-4 rounded-lg bg-green-600 hover:bg-green-800 font-semibold transition">Booking Requests</Link>
                </nav>
            </aside>
        );
}
