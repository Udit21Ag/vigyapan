"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const SIDEBAR_LINKS = [
    { href: "/", label: "Home" },
    { href: "/dashboard/vendor/your-billboards", label: "Your Billboards" },
    { href: "/dashboard/vendor/addBillboard", label: "Add Billboard" },
    { href: "/dashboard/vendor/booking-requests", label: "Booking Requests" },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile hamburger button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden fixed top-4 left-4 z-50 bg-green-700 text-white p-2 rounded-lg shadow-lg"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {isOpen ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                </svg>
            </button>

            {/* Mobile overlay */}
            {isOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-40 
                w-64 bg-green-700 text-white flex flex-col py-8 px-6 shadow-lg 
                md:rounded-r-3xl min-h-screen
                transform transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <h2 className="text-xl md:text-2xl font-bold mb-8 text-center mt-8 md:mt-0">Vendor Panel</h2>
                <nav className="flex flex-col gap-4 md:gap-6">
                    {SIDEBAR_LINKS.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setIsOpen(false)}
                            className={`py-3 px-4 rounded-lg font-semibold transition text-sm md:text-base ${
                                pathname === href 
                                    ? "bg-white text-green-700 border border-white shadow-md" 
                                    : "bg-green-600 text-white hover:bg-green-800"
                            }`}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </aside>
        </>
    );
}
