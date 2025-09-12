"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ForAdvertisersPage() {
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
    localStorage.removeItem("completed_profile");
    window.location.reload();
  };

  return (
    <div className="font-inter bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-gray-100 flex flex-col">
      {/* Header */}
      <header className="w-full border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 md:px-12 py-4 max-w-6xl mx-auto w-full flex-wrap gap-4">
          <Link href="/">
            <Image
              src="/vigyapan.png"
              alt="Vigyapan"
              width={160}
              height={60}
              className="h-[30px] md:h-[38px] w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex gap-6 xl:gap-9 text-sm xl:text-[1.08rem] font-medium">
            <Link
              href="/cities"
              className="text-gray-300 hover:text-[#1db954] transition-colors"
            >
              Find Ad Spaces
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-300 hover:text-[#1db954] transition-colors"
            >
              How It Works
            </Link>
            {userType === "vendor" ? (
              <>
                <Link
                  href="/for-vendors"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  For Vendors
                </Link>
                <Link
                  href="/dashboard/vendor"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : userType === "advertiser" ? (
              <>
                <Link
                  href="/for-advertisers"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  For Advertisers
                </Link>
                <Link
                  href="/dashboard/advertiser"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/for-vendors"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  For Vendors
                </Link>
                <Link
                  href="/for-advertisers"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  For Advertisers
                </Link>
              </>
            )}
          </nav>

          <div className="flex gap-2 md:gap-4">
            {isLoggedIn ? (
              <button
                className="bg-[#1db954] text-white rounded-full px-3 py-2 md:px-6 md:py-2 font-medium hover:bg-[#159c43] transition text-sm md:text-base"
                onClick={handleLogout}
              >
                Log Out
              </button>
            ) : (
              <>
                <Link
                  href="/signUp"
                  className="bg-[#1db954] text-white rounded-full px-3 py-2 md:px-6 md:py-2 font-medium hover:bg-[#159c43] transition text-sm md:text-base"
                >
                  Create Account
                </Link>
                <Link
                  href="/signIn"
                  className="bg-gray-800 text-gray-100 border border-gray-700 rounded-full px-3 py-2 md:px-6 md:py-2 font-medium hover:bg-gray-700 transition text-sm md:text-base"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="lg:hidden bg-gray-900 border-t border-gray-800">
          <nav className="px-4 py-3 flex flex-wrap gap-4 text-sm font-medium">
            <Link
              href="/cities"
              className="text-gray-300 hover:text-[#1db954] transition-colors"
            >
              Find Spaces
            </Link>
            <Link
              href="/#how-it-works"
              className="text-gray-300 hover:text-[#1db954] transition-colors"
            >
              How It Works
            </Link>
            {userType === "vendor" ? (
              <>
                <Link
                  href="/for-vendors"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  Vendors
                </Link>
                <Link
                  href="/dashboard/vendor"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : userType === "advertiser" ? (
              <>
                <Link
                  href="/for-advertisers"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  Advertisers
                </Link>
                <Link
                  href="/dashboard/advertiser"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/for-vendors"
                  className="text-gray-300 hover:text-[#1db954] transition-colors"
                >
                  Vendors
                </Link>
                <Link
                  href="/for-advertisers"
                  className="text-[#1db954] font-semibold hover:text-[#159c43] transition-colors"
                >
                  Advertisers
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-gray-800 to-gray-900 py-12 md:py-20 overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
              Amplify Your Brand with <br />
              <span className="text-[#1db954]">Impactful</span> Outdoor <br />
              Advertising
            </h1>
            <p className="text-base md:text-lg text-gray-300 mb-6 md:mb-8 leading-relaxed">
              Reach your target audience with premium billboard, digital display, and transit 
              advertising spaces across the country.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link
                href="/cities"
                className="bg-[#1db954] text-white px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-[#159c43] transition text-center"
              >
                Find Ad Spaces
              </Link>
              <button className="border border-gray-600 text-gray-300 px-6 md:px-8 py-3 md:py-4 rounded-lg font-semibold hover:bg-gray-800 transition">
                Create Account
              </button>
            </div>
          </div>
          <div className="flex justify-center mt-8 lg:mt-0">
            <Image
              src="/advertiser-hero-person.png"
              alt="Advertising Professional"
              width={500}
              height={600}
              className="object-contain rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Why Advertisers Choose Vigyapan */}
      <section className="py-12 md:py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-12">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
              Why Advertisers Choose Vigyapan
            </h2>
            <p className="text-base md:text-lg text-gray-300 max-w-3xl mx-auto px-4">
              Our platform offers comprehensive advantages for brands seeking to maximize their 
              outdoor advertising impact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Targeted Reach</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Connect with your ideal customers using our advanced location-based targeting 
                and geographic mapping.
              </p>
            </div>

            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Performance Metrics</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Track campaign effectiveness with detailed analytics including impressions, 
                demographics, and ROI analysis.
              </p>
            </div>

            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Premium Locations</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Access high-traffic prime advertising spots in city centers, malls, and major 
                transit hubs.
              </p>
            </div>

            <div className="text-center p-4 md:p-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-[#1db954]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-bold text-white mb-3 md:mb-4">Flexible Pricing</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Transparent pricing with no hidden fees and adaptable pricing based on 
                campaign duration and scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advertising Solutions */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Advertising Solutions
            </h2>
            <p className="text-lg text-gray-300">
              From traditional billboards to cutting-edge digital displays, find the perfect medium for 
              your message
            </p>
          </div>

          <div className="space-y-16">
            {/* Billboard Advertising */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Billboard Advertising</h3>
                <p className="text-lg text-gray-300 mb-6">
                  Capture attention with large-format outdoor displays that deliver maximum 
                  visibility and consistent brand exposure.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">City Centers</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Rural Highways</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Shopping Malls</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Geographic Targeting</span>
                  </li>
                </ul>
                <Link
                  href="/cities"
                  className="bg-[#1db954] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#159c43] transition inline-block"
                >
                  Explore Billboards
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/billboard-sample.png"
                  alt="Billboard Advertising"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover w-full h-80"
                />
              </div>
            </div>

            {/* Digital Displays */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2">
                <h3 className="text-3xl font-bold text-white mb-6">Digital Displays</h3>
                <p className="text-lg text-gray-300 mb-6">
                  Engage audiences with dynamic digital content and real-time message updates 
                  that capture immediate attention.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Real-time updates</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Interactive Displays</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Weather Integration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Dynamic Content</span>
                  </li>
                </ul>
                <Link
                  href="/cities"
                  className="bg-[#1db954] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#159c43] transition inline-block"
                >
                  View Digital Options
                </Link>
              </div>
              <div className="lg:order-1 relative">
                <Image
                  src="/digital-display-sample.png"
                  alt="Digital Display Advertising"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover w-full h-80"
                />
              </div>
            </div>

            {/* Transit Advertising */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Transit Advertising</h3>
                <p className="text-lg text-gray-300 mb-6">
                  Reach audiences on the move with bus, train, and metro advertising that 
                  delivers targeted reach to commuter audiences.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Bus Shelters</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Metro Stations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Airport Displays</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#1db954] rounded-full"></div>
                    <span className="text-gray-300">Extensive Coverage</span>
                  </li>
                </ul>
                <Link
                  href="/cities"
                  className="bg-[#1db954] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#159c43] transition inline-block"
                >
                  Explore Transit Ads
                </Link>
              </div>
              <div className="relative">
                <Image
                  src="/transit-advertising-sample.png"
                  alt="Transit Advertising"
                  width={600}
                  height={400}
                  className="rounded-xl object-cover w-full h-80"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-300">
              Get your advertising campaign up and running in just four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">1</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Search</h3>
              <p className="text-gray-300 leading-relaxed">
                Browse thousands of advertising locations with our smart search 
                and filtering system based on your criteria.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">2</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Select</h3>
              <p className="text-gray-300 leading-relaxed">
                Choose your advertising destinations, view real-time pricing, and 
                compare multiple options across cities.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">3</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Launch</h3>
              <p className="text-gray-300 leading-relaxed">
                Upload your creative assets and schedule your campaign with our 
                easy-to-use campaign management tools.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-[#1db954] rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white font-bold text-2xl">4</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Track</h3>
              <p className="text-gray-300 leading-relaxed">
                Track the performance and reach of your campaign with real-time 
                analytics and detailed reporting.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-300">
              Learn how top brands have reached new heights using cutting-edge outdoor advertising with 
              Vigyapan
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-700">
              <Image
                src="/success-story-1.png"
                alt="Success Story 1"
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-lg mb-6"
              />
              <h4 className="font-bold text-white mb-3">QuickBite Express</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Increased food delivery orders by 30% with strategic billboard placements in high-traffic 
                residential areas and office districts across 8 major cities.
              </p>
              <Link href="#" className="text-[#1db954] font-semibold text-sm hover:text-[#159c43]">
                Read More →
              </Link>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-700">
              <Image
                src="/success-story-2.png"
                alt="Success Story 2"
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-lg mb-6"
              />
              <h4 className="font-bold text-white mb-3">StyleHub Fashion</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Boosted online sales by 25% through targeted fashion campaigns in premium 
                shopping malls and metro stations during festival and wedding seasons.
              </p>
              <Link href="#" className="text-[#1db954] font-semibold text-sm hover:text-[#159c43]">
                Read More →
              </Link>
            </div>

            <div className="bg-gray-900 p-8 rounded-xl shadow-sm border border-gray-700">
              <Image
                src="/success-story-3.png"
                alt="Success Story 3"
                width={300}
                height={200}
                className="w-full h-40 object-cover rounded-lg mb-6"
              />
              <h4 className="font-bold text-white mb-3">EcoTech Solutions</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Achieved 80% increase in brand awareness for their sustainable energy products 
                through strategic billboard campaigns near corporate offices and tech hubs.
              </p>
              <Link href="#" className="text-[#1db954] font-semibold text-sm hover:text-[#159c43]">
                Read More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#1db954] text-white">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Elevate Your Brand Presence?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of brands who have transformed their reach and engagement with outdoor 
            advertising
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/cities"
              className="bg-white text-[#1db954] px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition"
            >
              Start Campaign
            </Link>
            <button className="border border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1db954] transition">
              Get Quote
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-300">
              Answers to common questions from our valued advertisers
            </p>
          </div>

          <div className="space-y-6">
            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
              <h3 className="font-bold text-white mb-2">What types of ad spaces are available on Vigyapan?</h3>
              <p className="text-gray-300">
                We offer a comprehensive range of outdoor advertising options including digital billboards, traditional 
                billboards, bus shelter displays, metro station advertising, airport advertising, and mobile advertising. 
                Each medium can be filtered by demographics, location, and pricing.
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
              <h3 className="font-bold text-white mb-2">How is pricing determined for ad spaces?</h3>
              <p className="text-gray-300">
                Pricing is based on multiple factors including location, audience reach, demographics, traffic 
                patterns, and seasonal demand. We provide transparent pricing with no hidden fees. Advertisers 
                can see real-time rates and compare options easily.
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
              <h3 className="font-bold text-white mb-2">Can I target specific demographics with my campaigns?</h3>
              <p className="text-gray-300">
                Yes, our platform offers robust targeting capabilities. You can target based on age groups, income levels, 
                interests, location-based demographics, and behavior patterns. We provide detailed audience insights for 
                each advertising location to help you make informed decisions.
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
              <h3 className="font-bold text-white mb-2">How do I track the performance of my campaigns?</h3>
              <p className="text-gray-300">
                Our advanced analytics dashboard provides real-time tracking of impressions, reach, engagement, and ROI. 
                You can monitor campaign performance, demographic breakdowns, peak engagement times, and compare 
                results across different locations and time periods.
              </p>
            </div>

            <div className="border border-gray-700 rounded-lg p-6 bg-gray-800">
              <h3 className="font-bold text-white mb-2">What creative specifications do I need to provide?</h3>
              <p className="text-gray-300">
                Creative requirements vary by advertising medium. We provide detailed specifications for each ad space 
                including dimensions, file formats, resolution requirements, and design guidelines. Our creative support 
                team can also assist with optimizing your materials for maximum impact.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-12 grid grid-cols-1 md:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-2xl font-bold text-white">Vigyapan</h3>
            <p className="text-gray-300">
              The premier marketplace connecting advertisers with
              premium out-of-home and digital advertising spaces
              worldwide.
            </p>
            <div className="space-y-2 text-sm text-gray-400">
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
              <h4 className="font-semibold mb-2 text-white">Company</h4>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">About Us</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Careers</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Press</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Blog</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Contact</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2 text-white">Advertisers</h4>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">How It Works</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Pricing</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Case Studies</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Success Stories</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Resources</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2 text-white">Vendors</h4>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">List Your Space</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Vendor Guidelines</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Vendor Success Stories</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Vendor Dashboard</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Vendor Support</Link>
            </div>
            <div className="space-y-2 flex flex-col">
              <h4 className="font-semibold mb-2 text-white">Support</h4>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Help Center</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">FAQs</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Terms of Service</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Privacy Policy</Link>
              <Link href="#" className="text-gray-300 hover:text-[#1db954] transition-colors">Cookie Policy</Link>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-gray-800">
          <div className="max-w-7xl mx-auto px-6 lg:px-12 py-8 flex flex-col md:flex-row justify-evenly items-center">
            <div>
              <b className="text-white">Subscribe to our newsletter</b>
              <p className="text-sm text-gray-400">
                Stay updated with the latest in outdoor advertising
              </p>
            </div>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                required
                className="px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1db954] bg-gray-800 text-gray-100 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#1db954] text-white px-4 py-2 rounded-lg hover:bg-[#159c43] transition"
              >
                Subscribe
              </button>
            </form>
          </div>
          <hr className="border-gray-800" />
          <div className="text-center py-4 text-sm text-gray-400">
            © 2025 Vigyapan. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
