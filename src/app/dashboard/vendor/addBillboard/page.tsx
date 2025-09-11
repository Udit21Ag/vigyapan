"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import Sidebar from "../Sidebar";
// Google Maps types are available globally after loading the Maps JS API
// No need to import types; use window.google.maps.* directly

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function AddBillboard() {
  const [form, setForm] = useState({
    title: "",
    type: "",
    city: "",
    address: "",
    pincode: "",
    length: "",
    width: "",
    price: "",
    status: "active",
    available: "yes",
    longitude: "",
    latitude: ""
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState("");
  const cityInputRef = useRef<HTMLInputElement>(null);
  const addressInputRef = useRef<HTMLInputElement>(null);
  // Places Autocomplete instance
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      
      setSelectedImage(file);
      setError('');
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };


  // Google Maps Places Autocomplete widget for address
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps &&
      addressInputRef.current &&
      !autocompleteRef.current
    ) {
  const googleMaps = window.google.maps;
  autocompleteRef.current = new googleMaps.places.Autocomplete(addressInputRef.current!, {
        types: ["geocode"],
        componentRestrictions: { country: "in" },
      });
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current!.getPlace();
        if (place && place.formatted_address) {
          // Extract city and pincode from address components
          let city = "";
          let pincode = "";
          if (place.address_components) {
            for (const comp of place.address_components) {
              if (comp.types.includes("locality")) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_2") && !city) {
                city = comp.long_name;
              }
              if (comp.types.includes("postal_code")) {
                pincode = comp.long_name;
              }
            }
          }
          setForm((prev) => ({
            ...prev,
            address: place.formatted_address ?? prev.address,
            city: city || prev.city,
            pincode: pincode || prev.pincode,
            latitude: place.geometry?.location?.lat() ? place.geometry.location.lat().toString() : prev.latitude,
            longitude: place.geometry?.location?.lng() ? place.geometry.location.lng().toString() : prev.longitude,
          }));
          // Center map to selected place
          if (map && place.geometry?.location) {
            map.setCenter(place.geometry.location);
            map.setZoom(16);
            if (markerRef.current) markerRef.current.setMap(null);
            const newMarker = new googleMaps.Marker({
              position: place.geometry.location,
              map,
              draggable: true,
            });
            markerRef.current = newMarker;
            newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
              if (!e.latLng) return;
              const lat = e.latLng.lat();
              const lng = e.latLng.lng();
              // Reverse geocode to get address, city, pincode
              const res = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
              );
              const data = await res.json();
              if (data.status === "OK" && data.results.length > 0) {
                let city = "";
                let pincode = "";
                if (data.results[0].address_components) {
                  for (const comp of data.results[0].address_components) {
                    if (comp.types.includes("locality")) {
                      city = comp.long_name;
                    }
                    if (comp.types.includes("administrative_area_level_2") && !city) {
                      city = comp.long_name;
                    }
                    if (comp.types.includes("postal_code")) {
                      pincode = comp.long_name;
                    }
                  }
                }
                setForm((prev) => ({
                  ...prev,
                  address: data.results[0].formatted_address ?? prev.address,
                  city: city || prev.city,
                  pincode: pincode || prev.pincode,
                  latitude: lat.toString(),
                  longitude: lng.toString(),
                }));
              }
            });
          }
        }
      });
    }
  }, [map]);

  // Load Google Map after script loads
  // Robust map initialization: run when script loads, ref is ready, or form changes
  useEffect(() => {
    if (
      mapRef.current &&
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps &&
      !map
    ) {
      const center = {
        lat: form.latitude ? Number(form.latitude) : 28.6139,
        lng: form.longitude ? Number(form.longitude) : 77.209,
      };
  const googleMaps = window.google.maps;
  const m = new googleMaps.Map(mapRef.current!, {
        center,
        zoom: 13,
      });
      setMap(m);
    }
  }, [mapLoaded, mapRef, form.latitude, form.longitude, map]);

  // Update marker when coordinates change
  useEffect(() => {
    if (
      map &&
      form.latitude &&
      form.longitude &&
      typeof window !== "undefined" &&
      window.google &&
      window.google.maps
    ) {
      // Remove previous marker
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      const googleMaps = window.google.maps;
      const newMarker = new googleMaps.Marker({
        position: { lat: Number(form.latitude), lng: Number(form.longitude) },
        map,
        draggable: true,
      });
      markerRef.current = newMarker;
      // Update coordinates when marker is dragged
      newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        // Reverse geocode to get address, city, and pincode
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          let city = "";
          let pincode = "";
          
          if (data.results[0].address_components) {
            for (const comp of data.results[0].address_components) {
              if (comp.types.includes("locality")) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_2") && !city) {
                city = comp.long_name;
              }
              if (comp.types.includes("postal_code")) {
                pincode = comp.long_name;
              }
            }
          }
          
          setForm((prev) => ({ 
            ...prev, 
            latitude: lat.toString(), 
            longitude: lng.toString(),
            address: data.results[0].formatted_address ?? prev.address,
            city: city || prev.city,
            pincode: pincode || prev.pincode
          }));
        } else {
          // Even if reverse geocoding fails, update coordinates
          setForm((prev) => ({ 
            ...prev, 
            latitude: lat.toString(), 
            longitude: lng.toString()
          }));
        }
      });
    }
  }, [map, form.latitude, form.longitude]);

  // Allow user to click on map to set marker
  useEffect(() => {
    if (
      map &&
      typeof window !== "undefined" &&
  window.google &&
  window.google.maps
    ) {
  const googleMaps = window.google.maps;
      googleMaps.event.clearListeners(map, "click");
      map.addListener("click", async (e: google.maps.MapMouseEvent) => {
        if (!e.latLng) return;
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        
        // Reverse geocode to get address, city, and pincode
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
        );
        const data = await res.json();
        if (data.status === "OK" && data.results.length > 0) {
          let city = "";
          let pincode = "";
          let state = "";
          
          // Extract city, state, and pincode from address components
          if (data.results[0].address_components) {
            for (const comp of data.results[0].address_components) {
              if (comp.types.includes("locality")) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_2") && !city) {
                city = comp.long_name;
              }
              if (comp.types.includes("administrative_area_level_1")) {
                state = comp.long_name;
              }
              if (comp.types.includes("postal_code")) {
                pincode = comp.long_name;
              }
            }
          }
          
          setForm((prev) => ({ 
            ...prev, 
            latitude: lat.toString(), 
            longitude: lng.toString(),
            address: data.results[0].formatted_address ?? prev.address,
            city: city || prev.city,
            pincode: pincode || prev.pincode
          }));
        } else {
          // Even if reverse geocoding fails, update coordinates
          setForm((prev) => ({ 
            ...prev, 
            latitude: lat.toString(), 
            longitude: lng.toString()
          }));
        }
      });
    }
  }, [map]);

  const handleAddressSearch = async () => {
    setSearching(true);
    setError("");
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(form.address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await res.json();
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        
        // Extract city and pincode from address components
        let city = "";
        let pincode = "";
        if (data.results[0].address_components) {
          for (const comp of data.results[0].address_components) {
            if (comp.types.includes("locality")) {
              city = comp.long_name;
            }
            if (comp.types.includes("administrative_area_level_2") && !city) {
              city = comp.long_name;
            }
            if (comp.types.includes("postal_code")) {
              pincode = comp.long_name;
            }
          }
        }
        
        setForm((prev) => ({ 
          ...prev, 
          longitude: location.lng.toString(), 
          latitude: location.lat.toString(),
          address: data.results[0].formatted_address ?? prev.address,
          city: city || prev.city,
          pincode: pincode || prev.pincode
        }));
        
        // Center and zoom the map to the found location
        if (map && typeof window !== "undefined" && window.google && window.google.maps) {
          const googleMaps = window.google.maps;
          map.setCenter({ lat: location.lat, lng: location.lng });
          map.setZoom(16);
          // Place marker
          if (markerRef.current) markerRef.current.setMap(null);
          const newMarker = new googleMaps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map,
            draggable: true,
          });
          markerRef.current = newMarker;
          newMarker.addListener("dragend", async (e: google.maps.MapMouseEvent) => {
            if (!e.latLng) return;
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();
            
            // Reverse geocode to get address, city, and pincode when marker is dragged
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`
            );
            const data = await res.json();
            if (data.status === "OK" && data.results.length > 0) {
              let city = "";
              let pincode = "";
              
              if (data.results[0].address_components) {
                for (const comp of data.results[0].address_components) {
                  if (comp.types.includes("locality")) {
                    city = comp.long_name;
                  }
                  if (comp.types.includes("administrative_area_level_2") && !city) {
                    city = comp.long_name;
                  }
                  if (comp.types.includes("postal_code")) {
                    pincode = comp.long_name;
                  }
                }
              }
              
              setForm((prev) => ({ 
                ...prev, 
                latitude: lat.toString(), 
                longitude: lng.toString(),
                address: data.results[0].formatted_address ?? prev.address,
                city: city || prev.city,
                pincode: pincode || prev.pincode
              }));
            } else {
              // Even if reverse geocoding fails, update coordinates
              setForm((prev) => ({ 
                ...prev, 
                latitude: lat.toString(), 
                longitude: lng.toString()
              }));
            }
          });
        }
      } else {
        setError("Address not found. Please enter a valid address.");
      }
    } catch {
      setError("Error fetching location. Try again.");
    }
    setSearching(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const accessToken = typeof window !== "undefined" ? localStorage.getItem("accessToken") : "";
      const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_BASE_URL}${path}`;
      
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('type', form.type);
      formData.append('city', form.city);
      formData.append('address', form.address);
      formData.append('pincode', form.pincode);
      formData.append('dimensionLen', form.length);
      formData.append('dimensionWid', form.width);
      formData.append('price', form.price);
      formData.append('status', form.status);
      formData.append('available', form.available === "yes" ? "true" : "false");
      formData.append('longitude', form.longitude);
      formData.append('latitude', form.latitude);
      
      if (selectedImage) {
        formData.append('photo', selectedImage);
      }
      
      const res = await fetch(apiUrl("/users/vendor/billboard/add/"), {
        method: "POST",
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
          // Don't set Content-Type header for FormData, let browser set it with boundary
        },
        body: formData
      });
      if (res.ok) {
        alert("Billboard added successfully!");
        setForm({
          title: "",
          type: "",
          city: "",
          address: "",
          pincode: "",
          length: "",
          width: "",
          price: "",
          status: "active",
          available: "yes",
          longitude: "",
          latitude: ""
        });
        setSelectedImage(null);
        setImagePreview(null);
      } else {
        setError("Failed to add billboard.");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-b from-[#f8fcfa] to-[#e6f7ee]">
      <Sidebar />
      {/* Main content with responsive padding and margin for mobile */}
      <main className="flex-1 p-3 md:p-6 overflow-auto md:ml-0">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="mb-6 md:mb-8">
            <Link href="/dashboard/vendor" className="text-green-700 hover:underline font-medium flex items-center gap-2 mb-4 text-sm md:text-base">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
              Back to Dashboard
            </Link>
            <div className="text-center">
              <h1 className="text-2xl md:text-4xl font-bold text-green-700 mb-2 md:mb-3">Add New Billboard</h1>
              <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-2">
                Create a new billboard listing with detailed information and precise location mapping
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Basic Information Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-3 md:pb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-xs md:text-sm">1</span>
                    </div>
                    Basic Information
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">Tell us about your billboard</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Billboard Title</label>
                    <input 
                      name="title" 
                      value={form.title} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter descriptive billboard title" 
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm md:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Billboard Type</label>
                    <input 
                      name="type" 
                      value={form.type} 
                      onChange={handleChange} 
                      required 
                      placeholder="e.g., Digital Display, Traditional Hoarding" 
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-sm md:text-base" 
                    />
                  </div>
                </div>

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Billboard Image</label>
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 md:p-6 hover:border-green-400 transition-colors duration-200 bg-gray-50 hover:bg-green-50">
                    {imagePreview ? (
                      <div className="relative">
                        <Image 
                          src={imagePreview} 
                          alt="Billboard Preview" 
                          width={600}
                          height={200}
                          className="w-full h-32 md:h-48 object-cover rounded-lg shadow-md"
                        />
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 md:top-3 right-2 md:right-3 bg-red-500 text-white rounded-full w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-sm md:text-lg hover:bg-red-600 transition shadow-lg"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 md:py-8">
                        <div className="mb-3 md:mb-4">
                          <svg className="mx-auto h-12 w-12 md:h-16 md:w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <label className="cursor-pointer">
                          <span className="text-base md:text-lg font-medium text-gray-700 hover:text-green-600 transition">
                            Click to upload billboard image
                          </span>
                          <span className="block text-xs md:text-sm text-gray-500 mt-2">
                            PNG, JPG, GIF up to 5MB • Recommended: 1200x400px
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Location & Address Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-3 md:pb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-xs md:text-sm">2</span>
                    </div>
                    Location & Address
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">Set the precise location of your billboard</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Search Landmark Address</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="Type landmark address to search"
                        className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm md:text-base"
                        autoComplete="off"
                        ref={addressInputRef}
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={handleAddressSearch} 
                      disabled={searching} 
                      className="px-4 py-3 md:px-6 md:py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all duration-200 disabled:opacity-50 whitespace-nowrap shadow-md hover:shadow-lg text-sm md:text-base"
                    >
                      {searching ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span className="hidden sm:inline">Searching...</span>
                        </span>
                      ) : (
                        "Get Location"
                      )}
                    </button>
                  </div>
                  {form.longitude && form.latitude && (
                    <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700">
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium text-sm md:text-base">Location Found!</span>
                      </div>
                      <div className="text-xs md:text-sm text-green-600 mt-1">
                        📍 Coordinates: {parseFloat(form.latitude).toFixed(6)}, {parseFloat(form.longitude).toFixed(6)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      name="city"
                      value={form.city}
                      required
                      placeholder="Auto-filled from address selection"
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 cursor-not-allowed text-sm md:text-base"
                      autoComplete="off"
                      ref={cityInputRef}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode</label>
                    <input 
                      name="pincode" 
                      value={form.pincode} 
                      required 
                      placeholder="Auto-filled from address selection" 
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 bg-gray-50 cursor-not-allowed text-sm md:text-base" 
                      readOnly 
                    />
                  </div>
                </div>

                {/* Interactive Map */}
                <div className="space-y-3">
                  <h3 className="text-base md:text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    Interactive Location Map
                  </h3>
                  <div className="border border-gray-300 rounded-xl overflow-hidden shadow-md">
                    <div 
                      ref={mapRef} 
                      className="w-full h-64 md:h-96" 
                    />
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    💡 <strong>Tip:</strong> You can drag the marker on the map to fine-tune the exact location of your billboard.
                  </p>
                </div>
              </div>

              {/* Specifications Section */}
              <div className="space-y-4 md:space-y-6">
                <div className="border-b border-gray-200 pb-3 md:pb-4">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2 md:gap-3">
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-bold text-xs md:text-sm">3</span>
                    </div>
                    Billboard Specifications
                  </h2>
                  <p className="text-gray-600 mt-2 text-sm md:text-base">Provide technical details and pricing information</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Length (feet)</label>
                    <input 
                      name="length" 
                      value={form.length} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter length in feet" 
                      type="number"
                      step="0.1"
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm md:text-base" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Width (feet)</label>
                    <input 
                      name="width" 
                      value={form.width} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter width in feet" 
                      type="number"
                      step="0.1"
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm md:text-base" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Rental Price (₹)</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 md:pl-4 flex items-center pointer-events-none">
                      <span className="text-gray-500 text-base md:text-lg">₹</span>
                    </div>
                    <input 
                      name="price" 
                      value={form.price} 
                      onChange={handleChange} 
                      required 
                      placeholder="Enter daily rental price" 
                      type="number"
                      min="0"
                      step="1"
                      className="w-full pl-8 md:pl-10 pr-3 md:pr-4 py-3 md:py-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm md:text-base" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select 
                      name="status" 
                      value={form.status} 
                      onChange={handleChange} 
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm md:text-base"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Availability</label>
                    <select 
                      name="available" 
                      value={form.available} 
                      onChange={handleChange} 
                      className="w-full p-3 md:p-4 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm md:text-base"
                    >
                      <option value="yes">Available for Booking</option>
                      <option value="no">Currently Booked</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 md:gap-3">
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium text-sm md:text-base">{error}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center pt-4 md:pt-6 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm md:text-base"
                >
                  <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Billboard Listing
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Load Google Maps JS API with Places library */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setMapLoaded(true)}
        />
      </main>
    </div>
  );
}
