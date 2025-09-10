"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ForVendorsPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState<string | null>(null);

  useEffect(() => {
    const loggedIn =
      Boolean(localStorage.getItem("token")) ||
      Boolean(localStorage.getItem("accessToken"));
    setIsLoggedIn(loggedIn);
    
    if (typeof window !== "undefined") {
      setUserType(localStorage.getItem("userType"));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userType");
    window.location.reload();
  };

  return (
    <div className="font-inter bg-white min-h-screen text-[#111] flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="flex items-center justify-between px-12 py-4 max-w-6xl mx-auto w-full flex-wrap gap-4">
          <Link href="/">
            <Image
              src="/vigyapan.png"
              alt="Vigyapan"
              width={160}
              height={60}
              className="h-[38px] w-auto"
            />
          </Link>

          <nav className="flex gap-9 text-[1.08rem] font-medium">
            <Link
              href="/cities"
              className="text-[#222] hover:text-[#1db954]"
            >
              Find Ad Spaces
            </Link>
            <Link
              href="/#how-it-works"
              className="text-[#222] hover:text-[#1db954]"
            >
              How It Works
            </Link>
            {userType === "vendor" ? (
              <>
                <Link
                  href="/for-vendors"
                  className="text-[#1db954] font-semibold hover:text-[#159c43]"
                >
                  For Vendors
                </Link>
                <Link
                  href="/dashboard/vendor"
                  className="text-[#222] hover:text-[#1db954]"
                >
                  Dashboard
                </Link>
              </>
            ) : userType === "advertiser" ? (
              <>
                <Link
                  href="/for-advertisers"
                  className="text-[#1db954] font-semibold hover:text-[#159c43]"
                >
                  For Advertisers
                </Link>
                <Link
                  href="/dashboard/advertiser"
                  className="text-[#222] hover:text-[#1db954]"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/for-vendors"
                  className="text-[#1db954] font-semibold hover:text-[#159c43]"
                >
                  For Vendors
                </Link>
                <Link
                  href="/for-advertisers"
                  className="text-[#222] hover:text-[#1db954]"
                >
                  For Advertisers
                </Link>
              </>
            )}
          </nav>

          <div className="flex gap-4">
            {isLoggedIn ? (
              <button
                className="bg-[#1db954] text-white rounded-full px-6 py-2 font-medium hover:bg-[#159c43] transition"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <>
                <Link
                  href="/signUp"
                  className="bg-[#1db954] text-white rounded-full px-6 py-2 font-medium hover:bg-[#159c43] transition"
                >
                  Create Account
                </Link>
                <Link
                  href="/signIn"
                  className="bg-white text-[#222] border border-[#eee] rounded-full px-6 py-2 font-medium hover:shadow-md transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
        <div className="max-w-6xl mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-[#222] mb-6 leading-tight">
              Monetize Your Ad <br />
              <span className="text-[#1db954]">Spaces More</span> <br />
              Effectively
            </h1>
            <p className="text-lg text-[#666] mb-8 leading-relaxed">
              Join thousands of vendors across India who are maximizing their 
              revenue with our state-of-the-art outdoor advertising marketplace.
            </p>
            <div className="flex gap-4">
              <Link
                href="/signUp"
                className="bg-[#1db954] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#159c43] transition"
              >
                Get Started
              </Link>
              <button className="border border-gray-300 text-[#222] px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition">
                Watch Demo
              </button>
            </div>
          </div>
          <div className="flex justify-center">
            <Image
              src="/hero-phones.png"
              alt="Vigyapan Mobile App"
              width={400}
              height={500}
              className="object-contain"
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">
              Benefits for Ad Space Owners
            </h2>
            <p className="text-lg text-[#666] max-w-3xl mx-auto">
              Our platform helps you maximize earnings and simplify the management of your 
              advertising assets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/icon-list.svg"
                  alt="List Spaces"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">List Your Spaces</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Easily list and manage all your advertising spaces directly from our 
                intuitive dashboard.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/icon-advertisers.svg"
                  alt="Find Advertisers"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Find New Advertisers</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Connect with thousands of brands and agencies looking for quality 
                advertising placements.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/icon-occupancy.svg"
                  alt="Maximize Occupancy"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Maximize Occupancy</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Fill rates of over 90% for vendors with our smart matching system and 
                global reach.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image
                  src="/icon-payments.svg"
                  alt="Timely Payments"
                  width={32}
                  height={32}
                />
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Timely Payments</h3>
              <p className="text-[#666] text-sm leading-relaxed">
                Get paid on time, every time with our secure payment processing 
                platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">
              How It Works For Vendors
            </h2>
            <p className="text-lg text-[#666]">
              Get started in just a few simple steps:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Register & List</h3>
              <p className="text-[#666] leading-relaxed">
                Create your vendor account and add your advertising spaces with detailed 
                specifications.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Set Pricing & Availability</h3>
              <p className="text-[#666] leading-relaxed">
                Define your pricing strategy and mark available dates to attract the right 
                advertisers.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-[#222] mb-4">Accept Bookings & Get Paid</h3>
              <p className="text-[#666] leading-relaxed">
                Review booking requests, approve them quickly, and receive timely payments 
                through our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful Tools Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">
              Powerful Tools for Vendors
            </h2>
            <p className="text-lg text-[#666]">
              Our platform offers comprehensive features to manage your ad inventory effectively
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/icon-analytics.svg"
                    alt="Analytics"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222] mb-2">Advanced Analytics Dashboard</h3>
                  <p className="text-[#666]">
                    Get real-time insights on your space performance and booking trends for each of your 
                    ad spaces.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/icon-inventory.svg"
                    alt="Inventory"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222] mb-2">Inventory Management</h3>
                  <p className="text-[#666]">
                    Track availability, manage booking calendars, and upload updated images for each of your 
                    spaces.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/icon-verified.svg"
                    alt="Verified"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222] mb-2">Verified Advertisers</h3>
                  <p className="text-[#666]">
                    Work with pre-verified advertisers for seamless quality 
                    partnerships.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Image
                    src="/icon-settings.svg"
                    alt="Settings"
                    width={24}
                    height={24}
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#222] mb-2">Customizable Settings</h3>
                  <p className="text-[#666]">
                    Set your preferences, pricing models, and approval workflows 
                    according to your needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">
              What Vendors Say
            </h2>
            <p className="text-lg text-[#666]">
              Join thousands of satisfied vendors across India
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/vendor-avatar-1.jpg"
                  alt="Rajesh Sharma"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#222]">Rajesh Sharma</h4>
                  <p className="text-sm text-[#666]">Director, Mumbai Outdoor Media</p>
                </div>
              </div>
              <p className="text-[#666] leading-relaxed">
                &quot;Vigyapan has transformed our business. We&apos;ve increased our occupancy 
                by 45% since we started using their platform. The advertisers keep us prime 
                for offering new campaigns.&quot;
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src="/vendor-avatar-2.jpg"
                  alt="Priya Verma"
                  width={60}
                  height={60}
                  className="rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-[#222]">Priya Verma</h4>
                  <p className="text-sm text-[#666]">CEO, Delhi Digital Displays</p>
                </div>
              </div>
              <p className="text-[#666] leading-relaxed">
                &quot;The platform is intuitive and easy to use. We&apos;ve been able to connect with 
                national brands and have had Increase in Mumbai. Real customer support team is 
                exceptional.&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#222] mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-[#666]">
              Answers to common questions from our listed vendors
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-[#222] mb-2">How much does it cost to list my advertising spaces?</h3>
              <p className="text-[#666]">
                No. Listing your inventory is free completely. You only pay a small commission when you receive 
                a booking. There are no setup costs, monthly fees, or listing fees.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-[#222] mb-2">How are payments processed?</h3>
              <p className="text-[#666]">
                We handle all payments through our secure platform. Advertisers pay upfront when they make a booking. 
                You receive your payment within 48 hours of campaign completion.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-[#222] mb-2">Can I set different prices for different seasons or events?</h3>
              <p className="text-[#666]">
                Yes. Our platform allows dynamic pricing. You can set different rates based on seasons, events, or demand. 
                Plus you can update your rates anytime through your vendor portal.
              </p>
            </div>

            <div className="border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-[#222] mb-2">What types of ad spaces can I list?</h3>
              <p className="text-[#666]">
                We accept all types of outdoor advertising spaces including billboards, digital displays, transit ads, 
                mall kiosks, and more. Contact us to learn about our latest inventory categories.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1db954] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Maximize Your Ad Space Revenue?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join our network of vendors across India and start maximizing your advertising revenue 
            today!
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/signUp"
              className="bg-white text-[#1db954] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Listing
            </Link>
            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1db954] transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold">Vigyapan</h3>
            <p className="text-[#555]">
              The premier marketplace connecting advertisers with
              premium out-of-home and digital advertising spaces
              worldwide.
            </p>
            <div className="space-y-2 text-sm text-[#444]">
              <div>📍 42 MG Road, Bangalore, Karnataka 560001, India</div>
              <div>✉️ info@vigyapan.com</div>
              <div>📞 +91 8317242108</div>
              <div>⏰ Mon-Fri: 10AM-7PM (IST)</div>
            </div>
            <div className="flex gap-4 pt-4">
              <Image
                src="/Download_on_the_App_Store_Badge.svg"
                alt="App Store"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
              <Image
                src="/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                width={140}
                height={40}
                className="h-10 w-auto"
              />
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 col-span-3 text-sm">
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2">Company</h4>
              <Link href="#">About Us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Press</Link>
              <Link href="#">Blog</Link>
              <Link href="#">Contact</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2">Advertisers</h4>
              <Link href="#">How It Works</Link>
              <Link href="#">Pricing</Link>
              <Link href="#">Case Studies</Link>
              <Link href="#">Success Stories</Link>
              <Link href="#">Resources</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2">Vendors</h4>
              <Link href="#">List Your Space</Link>
              <Link href="#">Vendor Guidelines</Link>
              <Link href="#">Vendor Success Stories</Link>
              <Link href="#">Vendor Dashboard</Link>
              <Link href="#">Vendor Support</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2">Support</h4>
              <Link href="#">Help Center</Link>
              <Link href="#">FAQs</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Cookie Policy</Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-evenly items-center">
            <div>
              <b>Subscribe to our newsletter</b>
              <p className="text-sm text-[#555]">
                Stay updated with the latest in outdoor advertising
              </p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954]"
              />
              <button
                type="submit"
                className="bg-[#22a745] text-white px-4 py-2 rounded-lg hover:bg-[#1a8c3a] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
          <hr />
          <div className="text-center py-4 text-sm text-[#7a848c]">
            © 2025 Vigyapan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
